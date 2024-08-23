import React, { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useUserContext } from "./UserContext";
import { useNotificationContext } from "./NotificationContexts";

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

const FeedbackContext = createContext();

const FeedbackProvider = ({ children }) => {
    const { loggedInUser } = useUserContext();
    const { setNotification } = useNotificationContext();
    const [feedbackList, setFeedbackList] = useState([]);

    useEffect(() => {
        if (loggedInUser?.role === 'admin') {
            fetchFeedback();
        }
    }, [loggedInUser]);

    const fetchFeedback = async () => {
    console.log('Fetching feedback...');
    };

    return (
        <FeedbackContext.Provider value={{ feedbackList, setFeedbackList }}>
            {children}
        </FeedbackContext.Provider>
    );
}

const useFeedbackContext = () => useContext(FeedbackContext);

export { FeedbackProvider, useFeedbackContext };
