//At least i got the naming right this time!!!
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserContext } from "./UserContext";

import BASE_URL from "../../config";

const GroupContext = createContext();

const GroupProvider = ({ children }) => {
    const { loggedInUser } = useUserContext(); //Might not need this
    const [userGroupList, setUserGroupList] = useState([]); // Where i will store groups for the logged in user
    const [allGroupList, setAllGroupList] = useState([]); // Where i will store all groups for all users so they can be listed

    useEffect(() => {
        if (loggedInUser) {
            getLoggedInUserUserGroups();
        }
    }, [loggedInUser]);

    useEffect(() => {
        console.log("DEBUG: userGroupList: ", userGroupList);
    }, [userGroupList]);

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
            return response.data._id;
        } catch (error) {
            toast.error("Error creating group");
        }
    }

    const getLoggedInUserUserGroups = async () => {
        if (!loggedInUser) return;

        const userId = loggedInUser._id;

        try {
            const response = await axios.get(`${BASE_URL}/groups/getGroups/${userId}`, { withCredentials: true });
            setUserGroupList(response.data);
        } catch (error) {
            toast.error("Error fetching groups");
        }
    }

    const addUserToGroup = async (groupId, user) => {
        try {
            const response = await axios.put(`${BASE_URL}/groups/addUser/${groupId}`, { user }, { withCredentials: true });
            console.log("DEBUG: response: ", response);
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