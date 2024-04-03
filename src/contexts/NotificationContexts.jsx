import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserContext } from "./UserContext";
import BASE_URL from "../../config";

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
    const { loggedInUser } = useUserContext();
    
};

const useNotificationContext = () => useContext(NotificationContext);

export { NotificationProvider, useNotificationContext };