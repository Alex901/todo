//At least i got the naming right this time!!!
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserContext } from "./UserContext";

import BASE_URL from "../../config";

const GroupContext = createContext();

const GroupProvider = ({ children }) => {
    const { loggedInUser } = useUserContext(); //Might not need this
    const [ userGroupList, setUserGroupList ] = useState([]); // Where i will store groups for the logged in user
    const [ allGroupList, setAllGroupList] = useState([]); // Where i will store all groups for all users so they can be listed

    const createGroup = async (groupData) => { //TODO: Error handling
        console.log("DEBUG: groupData: ", groupData);
        if (groupData.listName === '') {
            groupData.listName = groupData.name + "'s list";
        }

        try {
            const response = await axios.post(`${BASE_URL}/groups/create`, groupData, 
            { withCredentials: true   });
            setUserGroupList([...userGroupList, response.data]);
            toast.success("Group created successfully");
            return response.data._id;
        } catch (error) {
            toast.error("Error creating group");
        }
    }

    const addUserToGroup = async (groupId, user) => {
    
    }

    return (
        <GroupContext.Provider value={{ userGroupList, allGroupList, setUserGroupList, setAllGroupList, createGroup,
        addUserToGroup }}>
            {children}
        </GroupContext.Provider>
    );

};

const useGroupContext = () => useContext(GroupContext);

export { GroupProvider, useGroupContext };