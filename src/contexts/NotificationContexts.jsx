import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserContext } from "./UserContext";
import BASE_URL from "../../config";
import { useGroupContext } from "./GroupContexts";

/* Handle notifications sent to users */
const NotificationContexts = createContext();

const NotificationProvider = ({ children }) => {
    const { loggedInUser } = useUserContext();
    const [userNotifications, setUserNotifications] = useState([]);
    const { addUserToGroup } = useGroupContext();

    useEffect(() => {
        if(loggedInUser) {
        // Call the function immediately on component mount
        getNotifications();
       
        // Then set up the interval to call it every 60 seconds
        const intervalId = setInterval(() => {
            getNotifications();
        }, 60000000); // 60000 milliseconds = 60 seconds
    
        // Don't forget to clear the interval when the component unmounts
    
        return () => clearInterval(intervalId);
    }
    }, [loggedInUser]);

    useEffect(() => {
        console.log("DEBUG: userNotifications: ", userNotifications);
    }
    , [userNotifications]);

        /**
     * Fetches all notifications that are directed at loggedInUser if there are any.
     */
        const getNotifications = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/notifications/`, { withCredentials: true });
                console.log("DEBUG: response: ", response);
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
        try {
            const response = await axios.post(`${BASE_URL}/notifications/groupinvite`, { from, to, groupId }, { withCredentials: true });
            console.log("DEBUG: response: ", response);
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
    }

    /**
     * Accepts a group invitation.
     * As groupId is included in the notification -> Add user to group
     * 
     * @param {string} notificationId - The ID of the invitation notification.
     */
    const acceptGroupInvite = async (notificationId, groupId) => {
        console.log("DEBUG: acceptGroupInvite, notification id and group to add too: ", notificationId, groupId);
        //Add the user to the group and set up the lists 
        //Delete the notification
        addUserToGroup(groupId, loggedInUser._id);

        try {
            const response = await axios.delete(`${BASE_URL}/notifications/delete/${notificationId}`, { withCredentials: true });
            console.log("DEBUG: response: ", response);
            getNotifications();
            toast.success("Invite accepted");
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
    }

    /**
     * Declines a group invitation.
     * -> Delete notification and notifty sender?(:TODO)
     * @param {string} notificationId - The ID of the invitation notification.
     */
    const declineGroupInvite = async (notificationId) => {
        console.log("DEBUG: declineGroupInvite: ", notificationId);
        //delete the notification and notify the sender at some point
        try {
            const response = await axios.delete(`${BASE_URL}/notifications/delete/${notificationId}`, { withCredentials: true });
            console.log("DEBUG: response: ", response);
            getNotifications();
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



    return (
        <NotificationContexts.Provider value={{inviteToGroup, userNotifications, acceptGroupInvite, declineGroupInvite}}>
            {children}
        </NotificationContexts.Provider>
    );

};

const useNotificationContext = () => useContext(NotificationContexts);

export { NotificationProvider, useNotificationContext };