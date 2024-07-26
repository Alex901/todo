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
            if (response.status === 200){
                checkLogin();
            }
            toast.success("User added to group");
        } catch (error) {
            toast.error("Error adding user to group");
        }
    }

    return (
        <GroupContext.Provider value={{
            userGroupList, allGroupList, setUserGroupList, setAllGroupList, createGroup,
            addUserToGroup
        }}>
            {children}
        </GroupContext.Provider>
    );

};

const useGroupContext = () => useContext(GroupContext);

export { GroupProvider, useGroupContext };