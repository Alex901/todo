import React from 'react';
import Icon from '@mdi/react';
import { mdiThumbUpOutline, mdiCheckboxMarkedCircle, mdiThumbDownOutline } from '@mdi/js';
import IconButton from '@mui/material/IconButton';
import './FeedbackListEntry.css'; // Import the CSS file
import { useFeedbackContext } from '../../../../../contexts/FeedbackContext';

const FeedbackListEntry = ({ feedback }) => {
    const { changeResolvedStatus } = useFeedbackContext();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = String(date.getFullYear()).slice(-2);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}:${month}:${year} -- ${hours}:${minutes}`;
    };

    
    const onResolve = (feedbackId) => {
        changeResolvedStatus(feedbackId, true);
    };

    const onAccept = (feedbackId) => {
        console.log('Accepting feedback:', feedbackId);
        changeResolvedStatus(feedbackId, "accepted");
    };

    const onDecline = (feedbackId) => {
        console.log('Declining feedback:', feedbackId);
        changeResolvedStatus(feedbackId, "declined");
    };

    return (
        <div className="feedback-list-entry">
            {/* First Row */}
            <div className="feedback-row spaced">
                <div className="pair">
                    <span className="label">Submitted by: </span>
                    <span className="value">{feedback.from}</span>
                </div>
                <div className="pair">
                    <span className="label">Type: </span>
                    <span className="value">{feedback.type}</span>
                </div>
            </div>


            <div className="feedback-row message-area">
                <span>{feedback.message}</span>
            </div>


            <div className="feedback-row">
                <span className="label">Submitted at: </span>
                <span className="value">{formatDate(feedback.createdAt)}</span>
            </div>


            <div className="feedback-row button-area">
                {feedback.type === 'feature' || feedback.type === 'review' ? (
                    <>
                        <IconButton className="feedback-button feedback-button-large feedback-approve" onClick={() => onAccept(feedback._id)}>
                            <Icon path={mdiThumbUpOutline} size={1} />
                        </IconButton>
                        <IconButton className="feedback-button feedback-button-large feedback-decline" onClick={() => onDecline(feedback._id)}>
                            <Icon path={mdiThumbDownOutline} size={1} />
                        </IconButton>
                    </>
                ) : (
                    <IconButton className="feedback-button feedback-ok-button" onClick={() => onResolve(feedback._id)}>
                        <Icon path={mdiCheckboxMarkedCircle} size={1} />
                    </IconButton>
                )}
            </div>
        </div>
    );
};

export default FeedbackListEntry;