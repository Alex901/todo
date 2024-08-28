import React from 'react';
import BaseModal from '../BaseModal/BaseModal';
import { useFeedbackContext } from '../../../../contexts/FeedbackContext';
import { useUserContext } from '../../../../contexts/UserContext';
import FeedbackVoteEntry from '../../../../pages/FeedbackVoteEntry/FeedbackVoteEntry';
import './VoteModal.css';

const VoteModal = ({ isOpen, onClose }) => {
    const { approvedFeedbackList } = useFeedbackContext();
    const { loggedInUser } = useUserContext();

    return (
        <BaseModal 
        isOpen={isOpen} 
        onRequestClose={onClose} 
        title="Tell us what features you like"
        className="vote-modal-content"
        >
            {/* You can add additional content for the VoteModal here */}
            <div className="vote-grid">
            {Array.isArray(approvedFeedbackList) && approvedFeedbackList.map((feature, index) => (
                <FeedbackVoteEntry
                    key={index}
                    feedback={feature}
                />
            ))}
            </div>
        </BaseModal>
    );
};

export default VoteModal;