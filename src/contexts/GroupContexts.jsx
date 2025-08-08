//At least i got the naming right this time!!!
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserContext } from "./UserContext";

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

const GroupContext = createContext();

const GroupProvider = ({ children }) => {
    const { loggedInUser, checkLogin } = useUserContext(); //Might not need this
    const [userGroupList, setUserGroupList] = useState([]); // Where i will store groups for the logged in user
    const [allGroupList, setAllGroupList] = useState([]); // Where i will store all groups for all users so they can be listed

    useEffect(() => {
        if (loggedInUser) {
            getLoggedInUserGroups();
            fetchAllGroups();
        }
    }, [loggedInUser]);

    /**
 * Creates a new group with the provided group data.
 * 
 * @param {Object} groupData - The data for the group to be created.
 * @param {string} groupData.name - The name of the group.
 * @param {string} [groupData.listName] - The name of the list associated with the group. If not provided, it defaults to the group's name followed by "'s list".
 * @returns {Promise<string|undefined>} - The ID of the created group if successful, otherwise undefined.
 */
    const fetchAllGroups = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/groups/fetchAllGroups`, { withCredentials: true });
            // console.log("DEBUG: response.data: ", response.data);
            if (response.status === 200) {
                setAllGroupList(response.data);
            }
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("Error fetching all groups: ", error.response.data);
                console.error("Status code: ", error.response.status);
                console.error("Headers: ", error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error("Error fetching all groups: No response received");
                console.error("Request: ", error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error fetching all groups: ", error.message);
            }
            console.error("Config: ", error.config);
        }
    };

    const createGroup = async (groupData) => { //TODO: Error handling
        console.log("DEBUG: groupData: ", groupData);
        if (groupData.listName === '') {
            groupData.listName = groupData.name + "'s list";
        }

        try {
            const response = await axios.post(`${BASE_URL}/groups/create`, groupData,
                { withCredentials: true });
            setUserGroupList([...userGroupList, response.data]);
            toast.success("Group created successfully");
            checkLogin();
            return response.data._id;
        } catch (error) {
            toast.error("Error creating group");
        }
    }

    const getLoggedInUserGroups = async () => {
        if (!loggedInUser) return;

        const userId = loggedInUser._id;

        try {
            const response = await axios.get(`${BASE_URL}/groups/getGroups/${userId}`, { withCredentials: true });
            setUserGroupList(response.data);
        } catch (error) {
            toast.error("Error fetching groups");
        }
    }
    //Todo: when lazy-mode strikes :'D
    const addUserToGroup = async (groupId, user) => {
        try {
            const response = await axios.put(`${BASE_URL}/groups/addUser/${groupId}`, { user }, { withCredentials: true });
            if (response.status === 200) {
                checkLogin();
            }
            toast.success("User added to group");
        } catch (error) {
            toast.error("Error adding user to group");
        }
    }

    const updateGroupInfo = async (groupData) => {
        const { _id, name, description, visibility } = groupData;
        const updatedData = { name, description, visibility };
        console.log("DEBUG: _id: ", _id);
        console.log("DEBUG: updatedData: ", updatedData);

        try {
            const response = await axios.put(`${BASE_URL}/groups/updateGroupInfo/${_id}`, updatedData, { withCredentials: true });
            if (response.status === 200) {
                checkLogin();
            }
            toast.success("Group updated successfully");
        } catch (error) {
            toast.error("Error updating group");
        }

    }

    const leaveGroup = async (group) => {
        console.log(`DEBUG: leaveGroup ${group.name}`);

        try {
            const response = await axios.put(
                `${BASE_URL}/groups/removeMember/${group._id}`,
                { userId: loggedInUser._id },
                { withCredentials: true }
            );
            if (response.status === 200) {
                checkLogin();
                toast.success("Left group successfully");
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    toast.error("Group or user not found");
                } else if (error.response.status === 500) {
                    toast.error("Internal server error");
                } else {
                    toast.error("Error leaving group");
                }
            } else if (error.request) {
                toast.error("No response from server");
            } else {
                toast.error("Error leaving group");
            }
        }
    };

    const updateRole = async (groupId, memberId, role) => {
        try {
            const response = await axios.put(
                `${BASE_URL}/groups/updateRole/${groupId}`,
                { memberId, role },
                { withCredentials: true }
            );
            if (response.status === 200) {
                checkLogin();
                toast.success("Role updated successfully");
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    toast.error("Group or user not found");
                } else if (error.response.status === 500) {
                    toast.error("Internal server error");
                } else {
                    toast.error("Error updating role");
                }
            } else if (error.request) {
                toast.error("No response from server");
            } else {
                toast.error("Error updating role");
            }
        }
    };

    const deleteGroup = async (group) => {
        console.log(`DEBUG: deleteGroup for group ${group.name}`);
        try {
            const response = await axios.delete(`${BASE_URL}/groups/deleteGroup/${group._id}`, { withCredentials: true });
            if (response.status === 200) {
                checkLogin();
                toast.success("Group deleted successfully");
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    toast.error("Group not found");
                } else if (error.response.status === 500) {
                    toast.error("Internal server error");
                } else {
                    toast.error("Error deleting group");
                }
            } else if (error.request) {
                toast.error("No response from server");
            } else {
                toast.error("Error deleting group");
            }
        }
    };



    const removeUserFromGroup = async (groupId, userId) => {
        console.log(`DEBUG: removeUserFromGroup ${userId} from group ${groupId}`);

        try {
            const response = await axios.put(
                `${BASE_URL}/groups/removeMember/${groupId}`,
                { userId: userId },
                { withCredentials: true }
            );
            if (response.status === 200) {
                checkLogin();
                toast.success("Removed user from group successfully");
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    toast.error("Group or user not found");
                } else if (error.response.status === 500) {
                    toast.error("Internal server error");
                } else {
                    toast.error("Error removing user from group");
                }
            } else if (error.request) {
                toast.error("No response from server");
            } else {
                toast.error("Error removing user from group");
            }
        }
    };

    const createGroupList = async (groupId, listData) => {
        console.log(`DEBUG: createGroupList for group ${groupId}`);
        console.log(`DEBUG: listData: `, listData);
        try {
            const response = await axios.post(`${BASE_URL}/groups/createGroupList/${groupId}`, listData, { withCredentials: true });
            if (response.status === 200) {
                checkLogin();
                toast.success("List created successfully");
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    toast.error("Group already has a list with that name");
                } else if (error.response.status === 404) {
                    toast.error("Group not found");
                } else if (error.response.status === 500) {
                    toast.error("Internal server error");
                } else {
                    toast.error("Error creating list");
                }
            } else if (error.request) {
                toast.error("No response from server");
            } else {
                toast.error("Error creating list");
            }
        }
    };

    const editGroupList = async (listToEdit_id, listData) => {
        console.log("DEBUG: editGroupList for list ", listToEdit_id);
        console.log("DEBUG: listData: ", listData);

        try {
            const response = await axios.patch(
                `${BASE_URL}/groups/editGroupList`,
                {
                    listId: listToEdit_id, // ID of the list to edit
                    ...listData,          // Data to update the list
                    userId: loggedInUser._id, // Include the logged-in user's ID for authentication
                },
                { withCredentials: true }
            );

            if (response.status === 200) {
                toast.success("Group list updated successfully");
                checkLogin(); // Refresh user data
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 403) {
                    toast.error("You do not have permission to edit this list");
                } else if (error.response.status === 404) {
                    toast.error("Group or list not found");
                } else if (error.response.status === 500) {
                    toast.error("Internal server error");
                } else {
                    toast.error("Error updating group list");
                }
            } else if (error.request) {
                toast.error("No response from server");
            } else {
                toast.error("Error updating group list");
            }
        }
    };



    const deleteGroupList = async (listToDelete) => {
        //console.log("DEBUG -- List to delete ", listToDelete);
        //console.log(`DEBUG: deleteGroupList for group ${listToDelete.owner._id} and list ${listToDelete._id}`);
        try {
            const response = await axios.delete(`${BASE_URL}/groups/deleteGroupList/${listToDelete._id}/${listToDelete.owner._id}`, { withCredentials: true });
            if (response.status === 200) {
                checkLogin();
                toast.success("List deleted successfully");
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    toast.error("Group or list not found");
                } else if (error.response.status === 500) {
                    toast.error("Internal server error");
                } else {
                    toast.error("Error deleting list");
                }
            } else if (error.request) {
                toast.error("No response from server");
            } else {
                toast.error("Error deleting list");
            }
        }
    }

    // Utility functions related to group

    /**
 * Checks if a user is a moderator for a specific list within a group.
 *
 * @param {Object} user - The user object containing user details.
 * @param {string} user.username - The username of the user.
 * @param {string} user._id - The unique identifier of the user.
 * @param {string} listName - The name of the list to check.
 * @param {string} groupId - The unique identifier of the group.
 * @returns {boolean} - Returns true if the user is a moderator for the specified list within the group, otherwise false.
 */
    const isModerator = (user, listName, groupId) => {

        const group = userGroupList.find(group => group._id === groupId);
        if (!group) {
            console.log("DEBUG: group not found");
            return false;
        }

        const isMod = group.members.some(member => member.member_id === user._id && member.role === 'moderator');
        return isMod;
    };

    /**
 * Checks if a given list is part of any group in the userGroupList.
 *
 * @param {Object|string} listToCheck - The list to check, which can be an object or a string.
 * @param {string} [listToCheck._id] - The unique identifier of the list (if listToCheck is an object).
 * @param {string} [listToCheck.listName] - The name of the list (if listToCheck is a string).
 * @returns {boolean} - Returns true if the list is found in any group, otherwise false.
 */
    const isGroupList = (listToCheck) => {
        if (typeof (listToCheck) === 'object' && listToCheck != null) {
            const found = userGroupList.some(group => {
                if (group.groupListsModel.some(list => list._id === listToCheck._id)) {
                    return true;
                }
                return false;
            });
            return found;
        } else if (typeof (listToCheck) === 'string' && listToCheck != null) {
            const found = userGroupList.some(group => {
                return group.groupListsModel.some(list => list.listName === listToCheck);
            });
            return found;
        } else {
            console.error("Error: listToCheck is not a valid list");
            return false;
        }
    }



    return (
        <GroupContext.Provider value={{
            userGroupList, allGroupList, setUserGroupList, setAllGroupList, createGroup,
            addUserToGroup, updateGroupInfo, updateRole, deleteGroup, leaveGroup, removeUserFromGroup,
            createGroupList, editGroupList, isModerator, deleteGroupList, isGroupList
        }}>
            {children}
        </GroupContext.Provider>
    );

};

const useGroupContext = () => useContext(GroupContext);

export { GroupProvider, useGroupContext };