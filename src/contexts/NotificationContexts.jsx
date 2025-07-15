import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserContext } from "./UserContext";
import { useGroupContext } from "./GroupContexts";
let BASE_URL;

if (process.env.NODE_ENV === 'test') {
    import('../../config').then((config) => {
        BASE_URL = config.default;
    });
} else {
    import('../../config.vite').then((config) => {
        BASE_URL = config.default;
    });
}

/* Handle notifications sent to users */
const NotificationContexts = createContext();

const NotificationProvider = ({ children }) => {
    const { loggedInUser, checkLogin } = useUserContext();
    const [userNotifications, setUserNotifications] = useState([]);
    const { addUserToGroup } = useGroupContext();

    // console.log("DEBUG: loggedInUser in NotifiationProvider cotnext", loggedInUser);

    useEffect(() => {
        if (loggedInUser) {
            // Call the function immediately on component mount
            getNotifications();

            // Then set up the interval to call it every 60 seconds
            const intervalId = setInterval(() => {
                getNotifications();
            }, 60000); // 60000 milliseconds = 60 seconds

            // Don't forget to clear the interval when the component unmounts

            return () => clearInterval(intervalId);
        }
    }, [loggedInUser]);
    

    /**
 * Fetches all notifications that are directed at loggedInUser if there are any.
 */
    const getNotifications = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/notifications/`, { withCredentials: true });
            // console.log("DEBUG: response: ", response);
            setUserNotifications(response.data);
        } catch (error) {
            console.error("Error fetching notifications: ", error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error(error.request);
                toast.error("Error fetching notifications: No response from the server");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error', error.message);
            }
        }
    }

    /**
     * Invites a user to a group.
     * 
     * @param {string} from - The ID of the user sending the invitation.
     * @param {string} to - The ID of the user being invited.
     * @param {string} groupId - The ID of the group to which the user is being invited.
     */
    const inviteToGroup = async (from, to, groupId) => {
        console.log("DEBUG: inviteToGroup: ", from, to, groupId);

        const sendInvite = async (recipient) => {
            try {
                const response = await axios.post(`${BASE_URL}/notifications/groupinvite`, { from, to: recipient, groupId }, { withCredentials: true });
                // console.log("DEBUG: response: ", response);
                toast.success("Invite sent successfully");
            } catch (error) {
                console.error("Error sending invite: ", error);
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error(error.response.data);
                    console.error(error.response.status);
                    console.error(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error(error.request);
                    toast.error("Error sending invite: No response from the server");
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Error', error.message);
                }
            }
        };

        if (Array.isArray(to)) {
            for (const recipient of to) {
                await sendInvite(recipient);
            }
        } else {
            await sendInvite(to);
        }
    };

    /**
     * Accepts a group invitation.
     * As groupId is included in the notification -> Add user to group
     * 
     * @param {string} notificationId - The ID of the invitation notification.
     */
    //TODO: notify user about the outcome
    const acceptGroupInvite = async (notificationId, groupId) => {
        console.log("DEBUG: acceptGroupInvite, notification id and group to add too: ", notificationId, groupId);
        //Add the user to the group and set up the lists 
        //Delete the notification
        addUserToGroup(groupId, loggedInUser._id);

        try {
            const response = await axios.delete(`${BASE_URL}/notifications/delete/${notificationId}`, { withCredentials: true });
            //  console.log("DEBUG: response: ", response);
            if (response.status === 200) {
                getNotifications();
                toast.success("Invite accepted");
            }
        } catch (error) {
            console.error("Error accepting invite: ", error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error(error.request);
                toast.error("Error accepting invite: No response from the server");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error', error.message);
            }
        }
        checkLogin();
    }

    /**
     * Declines a group invitation.
     * -> Delete notification and notifty sender?(:TODO)
     * @param {string} notificationId - The ID of the invitation notification.
     */
    //TODO: notify user about the outcome
    const declineGroupInvite = async (notificationId) => {
        console.log("DEBUG: declineGroupInvite: ", notificationId);
        //delete the notification and notify the sender at some point
        try {
            const response = await axios.delete(`${BASE_URL}/notifications/delete/${notificationId}`, { withCredentials: true });
            // console.log("DEBUG: response: ", response);
            checkLogin();
            toast.success("Invite declined");
        } catch (error) {
            console.error("Error declining invite: ", error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error(error.request);
                toast.error("Error declining invite: No response from the server");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error', error.message);
            }
        }
    }

    const requestToJoinGroup = (userToJoin, group) => {
        console.log("DEBUG: requestToJoinGroup - userToJoin: ", userToJoin);
        console.log("DEBUG: requestToJoinGroup - group: ", group);

        const groupId = group._id;

        const moderatorIds = group.members
            .filter(member => member.role === 'moderator')
            .map(moderator => moderator.member_id._id);
        console.log("DEBUG: moderators: ", moderatorIds);


        try {
            const request = axios.post(`${BASE_URL}/notifications/request-to-join-group`, { from: userToJoin, to: moderatorIds, group: groupId, }, { withCredentials: true });

            toast.success("Request to join group sent");

        } catch (error) {
            console.error("Error requesting to join group: ", error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
                toast.error("Error requesting to join group: unknown error");
            } else if (error.request) {
                // The request was made but no response was received
                console.error(error.request);
                toast.error("Error requesting to join group: No response from the server");
            } else {
                // Something happened in setting up the request that triggered an Error
                toast.error("Error requesting to join group: unknown error");
                console.error('Error', error.message);
            }
        }



    }

    //TODO: notify user about the outcome
    const declineRequestToJoinGroup = (notificationToDelete, userToNotify) => {
        console.log("DEBUG: notify user: ", userToNotify);

        try {
            const response = axios.delete(`${BASE_URL}/notifications/delete/${notificationToDelete}`, { withCredentials: true });
            toast.success("Request declined");
            checkLogin();
        } catch (error) {
            console.error("Error declining request to join group: ", error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
                toast.error("Error declining request to join group: unknown error");
            } else if (error.request) {
                // The request was made but no response was received
                console.error(error.request);
                toast.error("Error declining request to join group: No response from the server");
            } else {
                // Something happened in setting up the request that triggered an Error
                toast.error("Error declining request to join group: unknown error");
                console.error('Error', error.message);
            }
        }
    }

    //TODO: notify user about the outcome
    const acceptRequestToJoinGroup = (notificationToDelete, groupToAddUserTo, userToAddToGroup) => {

        addUserToGroup(groupToAddUserTo, userToAddToGroup);

        try {
            const response = axios.delete(`${BASE_URL}/notifications/delete/${notificationToDelete}`, { withCredentials: true });
            toast.success("Request accepted");
            checkLogin();
        } catch (error) {
            console.error("Error accepting request to join group: ", error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
                toast.error("Error accepting request to join group: unknown error");
            } else if (error.request) {
                // The request was made but no response was received
                console.error(error.request);
                toast.error("Error accepting request to join group: No response from the server");
            } else {
                // Something happened in setting up the request that triggered an Error
                toast.error("Error accepting request to join group: unknown error");
                console.error('Error', error.message);
            }
        }
    }

    const resolveNotification = async (notificationId) => {
        console.log("DEBUG: resolveNotification: ", notificationId);
        try {
            const response = await axios.delete(`${BASE_URL}/notifications/delete/${notificationId}`, { withCredentials: true });
            // console.log("DEBUG: response: ", response);
            checkLogin();
        } catch (error) {
            console.error("Error resolving notification: ", error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error(error.request);
                toast.error("Error resolving notification: No response from the server");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error', error.message);
            }
        }

    };


    return (
        <NotificationContexts.Provider value={{
            inviteToGroup, userNotifications, acceptGroupInvite, declineGroupInvite, getNotifications,
            requestToJoinGroup, declineRequestToJoinGroup, acceptRequestToJoinGroup, resolveNotification
        }}>
            {children}
        </NotificationContexts.Provider>
    );

};

const useNotificationContext = () => useContext(NotificationContexts);

export { NotificationProvider, useNotificationContext };