import React, {  useState } from "react";
import './Notification.css';
import { useNotificationContext } from '../../../../contexts/NotificationContexts'; 
import Icon from '@mdi/react';
import { mdiCheckCircle, mdiCloseCircle } from '@mdi/js';

const Notification = ({ notificationData, type, message, timestamp }) => {
    const [isVisible, setIsVisible] = useState(true);
    const { acceptGroupInvite, declineGroupInvite } = useNotificationContext();
    const words = message.split(' ');
    const firstWord = words.shift();
    const lastWord = words.pop();
   
    const handleAcceptGroupInvite = () => {
        console.log(notificationData);
        acceptGroupInvite(notificationData._id, notificationData.group);
    }

    const handleDeclineGroupInvite = () => {
        setIsVisible(false);
        setTimeout(() => declineGroupInvite(notificationData._id), 300);
    }

    if (type === 'group') {
        return (
            <div className={`notification-item ${isVisible ? '' : 'fade-out'}`}>
                <p className='date'> {new Date(timestamp).toLocaleString()}</p>
                
                <p className="message">
                    <span className="highlight">{firstWord}</span> 
                    {" " + words.join(' ') + " "}
                    <span className="highlight">{lastWord}</span>
                </p>
                
                <div className="button-container">
                <button className="notification-button accept-notify" onClick={handleAcceptGroupInvite}>
                        <Icon path={mdiCheckCircle} size={1.2} />
                    </button>
                    <button className="notification-button decline-notify" onClick={handleDeclineGroupInvite}>
                        <Icon path={mdiCloseCircle} size={1.2} />
                    </button>
                </div>
            </div>
        );
    }

    // Handle other types of notifications in the future

    return null;
};

export default Notification;