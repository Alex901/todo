import React, { useEffect, useRef } from 'react';
import Icon from '@mdi/react';
import { mdiArrowUpBold, mdiArrowDownBold } from '@mdi/js';
import './FeedbackVoteEntry.css';
import { useFeedbackContext } from '../../contexts/FeedbackContext';
import { useUserContext } from '../../contexts/UserContext';
import currencyBeta from '/currency-beta.png'; 
import placeholderImage from '../../assets/placeholder_vote.png'; // Placeholder for "I voted" mark

const FeedbackVoteEntry = ({ feedback }) => {
    const messageRef = useRef(null);
    const { upvoteFeature, downvoteFeature } = useFeedbackContext();
    const { loggedInUser } = useUserContext();

    const hasVoted = loggedInUser ? feedback.hasVoted.includes(loggedInUser._id) : false;

    useEffect(() => {
        const entries = document.querySelectorAll('.feedback-message');
        let maxHeight = 0;
    
        // Calculate the maximum height
        entries.forEach(entry => {
            const height = entry.scrollHeight;
            if (height > maxHeight) {
                maxHeight = height;
            }
        });
    
        // Apply the maximum height to all entries
        entries.forEach(entry => {
            entry.style.height = `${maxHeight-20}px`;
        });
    }, []);

    const onUpVote = (feedbackId) => {
        if (!loggedInUser) {
            alert('Please log in to cast a vote...');
        } else {
            upvoteFeature(feedbackId);
        }
    }

    const onDownVote = (feedbackId) => {
        if(!loggedInUser) {
        alert('Please log in to cast a vote...');
        } else {
            downvoteFeature(feedbackId);
        }
                
    }

    return (
        <div className="feedback-entry">
        <div className="feedback-from">Submitted by: {feedback.from}</div>
        <div className="feedback-message" ref={messageRef}>{feedback.message}</div>
        <div className="feedback-date-reward">
            <div className="feedback-date">Posted: {new Date(feedback.createdAt).toLocaleDateString()}</div>
            {loggedInUser && feedback.reward && (
                <div className="feedback-reward">
                    Reward: {feedback.reward} <img src={currencyBeta} alt="Reward" className="reward-icon" />
                </div>
            )}
        </div>
        <div className="feedback-votes">
            <button className="upvote-button" onClick={() => onUpVote(feedback._id)} disabled={hasVoted}>
                <Icon path={mdiArrowUpBold} size={1} color="green" />
                {feedback.upvotes}
            </button>
            {hasVoted && <img src={placeholderImage} alt="I voted" className="voted-icon" />}
            <button className="downvote-button" onClick={() => onDownVote(feedback._id)} disabled={hasVoted}>
                <Icon path={mdiArrowDownBold} size={1} color="red" />
                {feedback.downvotes}
            </button>
        </div>
    </div>
    );
};

export default FeedbackVoteEntry;