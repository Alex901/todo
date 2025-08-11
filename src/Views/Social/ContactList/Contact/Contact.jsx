import React from 'react';
import './Contact.css';
import { mdiChatPlusOutline, mdiAccountPlus, mdiEmailFastOutline } from '@mdi/js'; // mdiEmailFastOutline for sent requests
import Icon from '@mdi/react';
import { useNotificationContext } from '../../../../contexts/NotificationContexts';

const Contact = ({ user, isContact, isRequestSent }) => {
    const { contactRequest } = useNotificationContext();

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

    return (
        <div
            className="contact hoverable"
            onClick={handleShowProfile} // Default action when clicking the contact
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
                        <Icon path={mdiChatPlusOutline} size={1} title="Open Chat" />
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