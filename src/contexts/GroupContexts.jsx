//At least i got the naming right this time!!!
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserContext } from "./UserContext";

import BASE_URL from "../../config";

const GroupContext = createContext();

const GroupProvider = ({ children }) => {
    const { loggedInUser } = useUserContext();
    const [groupList, setGroupList] = useState([]);

    const createGroup = async (groupData) => {
        console.log("DEBUG: groupData: ", groupData);
        try {
            const response = await axios.post(`${BASE_URL}/groups/create`, groupData, 
            { withCredentials: true   });
            setGroupList([...groupList, response.data]);
            toast.success("Group created successfully");
        } catch (error) {
            toast.error("Error creating group");
        }
    }

    return (
        <GroupContext.Provider value={{ groupList, setGroupList, createGroup }}>
            {children}
        </GroupContext.Provider>
    );

};

const useGroupContext = () => useContext(GroupContext);

export { GroupProvider, useGroupContext };