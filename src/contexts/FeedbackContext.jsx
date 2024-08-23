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

    //Method to fetch all feedbacks
    const fetchFeedback = async () => {
    console.log('Fetching feedback...');
    };

    const submitFeedback = (feedbackData) =>  {
        console.log('Submitting feedback...', feedbackData);
        try {
            axios.post(`${BASE_URL}/feedback/post-feedback`, feedbackData, { withCredentials: true });
           
        } catch (error) {
            console.error('Error submitting feedback:', error);
            if (error.response) {
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
            } else if (error.request) {
                console.error(error.request);
            } else {
                console.error('Error', error.message);
            }
        }
    };


    return (
        <FeedbackContext.Provider value={{ feedbackList, setFeedbackList, submitFeedback }}>
            {children}
        </FeedbackContext.Provider>
    );
}

const useFeedbackContext = () => useContext(FeedbackContext);

export { FeedbackProvider, useFeedbackContext };
