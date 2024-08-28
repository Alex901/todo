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
    const { setNotification, getNotifications } = useNotificationContext();
    const [feedbackList, setFeedbackList] = useState([]);
    const [approvedFeedbackList, setApprovedFeedbackList] = useState([]);

    useEffect(() => {
        if (loggedInUser?.role === 'admin') {
            fetchFeedback();
            fetchOfflineFeedback();
        } else {
            fetchOfflineFeedback();
        }
    }, [loggedInUser]);


    const fetchFeedback = async () => {
        console.log('Fetching feedback...');
        try {
            const response = await axios.get(`${BASE_URL}/feedback/getAll`, { withCredentials: true });
            console.log('Feedback fetched:', response.data);
            setFeedbackList(response.data);
        } catch (error) {
            console.error('Error fetching feedback:', error);
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

    const submitFeedback = (feedbackData) =>  {
        console.log('Submitting feedback...', feedbackData);
        try {
            axios.post(`${BASE_URL}/feedback/post-feedback`, feedbackData, { withCredentials: true });
            getNotifications(); //To update the notification list
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

    const changeResolvedStatus = async (feedbackId, resolved) => {
        console.log('Changing resolved status...', feedbackId, resolved);
        try {
            const response = await axios.put(`${BASE_URL}/feedback/resolveFeedback/${feedbackId}`, { resolved }, { withCredentials: true });
            if(response.status === 200){
                fetchFeedback(); //To update the feedback list
                getNotifications(); //To update the notification list
            } else if(response.status === 404) {
                console.error('Feedback not found:', response);
            } else {
                console.error('Error changing resolved status:', response);
            }       
        } catch (error) {
            console.error('Error changing resolved status:', error);
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

    const fetchOfflineFeedback = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/feedback/fetchOfflineFeedback`);
            setApprovedFeedbackList(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching offline feedback:', error);
        }
    };

    const upvoteFeature = async (feedbackId) => {
        console.log('Upvoting feature...', feedbackId);
        try {
            const response = await axios.put(
                `${BASE_URL}/feedback/upvote/${feedbackId}`,
                { userId: loggedInUser._id }, // Include loggedInUser._id in the request body
                { withCredentials: true }
            );
            console.log('Feature upvoted:', response.data);
            fetchOfflineFeedback();
        } catch (error) {
            console.error('Error upvoting feature:', error);
        }
    };

    const downvoteFeature = async (feedbackId) => {
        console.log('Downvoting feature...', feedbackId);
        try {
            const response = await axios.put(
                `${BASE_URL}/feedback/downvote/${feedbackId}`,
                { userId: loggedInUser._id }, // Include loggedInUser._id in the request body
                { withCredentials: true }
            );
            console.log('Feature downvoted:', response.data);
            fetchOfflineFeedback();
        } catch (error) {
            console.error('Error downvoting feature:', error);
        }
    }


    return (
        <FeedbackContext.Provider value={{ feedbackList, setFeedbackList, submitFeedback, changeResolvedStatus, fetchOfflineFeedback,
            upvoteFeature, downvoteFeature, approvedFeedbackList
         }}>
            {children}
        </FeedbackContext.Provider>
    );
}

const useFeedbackContext = () => useContext(FeedbackContext);

export { FeedbackProvider, useFeedbackContext };
