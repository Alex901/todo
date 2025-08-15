import React, { useState } from 'react';
import './Contact.css';
import {
    mdiChatPlusOutline,
    mdiChatPlus,
    mdiChat,
    mdiChatProcessingOutline,
    mdiAccountPlus,
    mdiEmailFastOutline,
} from '@mdi/js';
import Icon from '@mdi/react';
import { useNotificationContext } from '../../../../contexts/NotificationContexts';
import { useCommunicationContext } from '../../../../contexts/CommunicationContext';

const Contact = ({ user, isContact, isRequestSent, hasChat }) => {
    const { contactRequest } = useNotificationContext();
    const { createNewChat } = useCommunicationContext();
    const [isHovered, setIsHovered] = useState(false); // Track hover state

    // Function placeholders for actions
    const handleAddContact = () => {
        contactRequest(user._id);
    };

    const handleShowProfile = () => {
        console.log(`Show user profile: ${user.username}`);
    };

    const handleOpenChat = () => {
        console.log(`Open chat with: ${user.username}`);
    };

    // Determine the icon based on hover state and chat existence
    const getIconPath = () => {
        if (hasChat) {
            return isHovered ? mdiChatProcessingOutline : mdiChat;
        } else {
            return isHovered ? mdiChatPlusOutline : mdiChatPlus;
        }
    };

    return (
        <div
            className="contact hoverable"
            onClick={handleShowProfile} // Default action when clicking the contact
            onMouseEnter={() => setIsHovered(true)} // Set hover state to true
            onMouseLeave={() => setIsHovered(false)} // Set hover state to false
        >
            <div className="contact-avatar">
                <img
                    src={user.profilePicture || '/default-avatar.png'}
                    alt={`${user.username}'s avatar`}
                />
            </div>
            <div className="contact-info">
                <p className="contact-username">{user.username}</p>
            </div>
            <div className="contact-actions">
                {isContact ? (
                    <div
                        className="contact-icon-button"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the parent click
                            handleOpenChat();
                        }}
                    >
                        <Icon path={getIconPath()} size={1} title="Open Chat" />
                    </div>
                ) : isRequestSent ? (
                    <div className="sent-request">
                        <Icon path={mdiEmailFastOutline} size={1} title="Request Sent" />
                    </div>
                ) : (
                    <div
                        className="contact-icon-button"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the parent click
                            handleAddContact();
                        }}
                    >
                        <Icon path={mdiAccountPlus} size={1} title="Add Contact" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Contact;