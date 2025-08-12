import React, { useState } from "react";
import './Notification.css';
import { useNotificationContext } from '../../../../contexts/NotificationContexts';
import Icon from '@mdi/react';
import { mdiCheckCircle, mdiCloseCircle } from '@mdi/js';
import Feedback from "react-bootstrap/esm/Feedback";

const Notification = ({ notificationData, type, message, timestamp }) => {
  const [isVisible, setIsVisible] = useState(true);
  const { acceptGroupInvite, declineGroupInvite, declineRequestToJoinGroup, acceptRequestToJoinGroup, resolveNotification } = useNotificationContext();
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

  const handleAcceptUser = () => {
    console.log(notificationData);
    acceptRequestToJoinGroup(notificationData._id, notificationData.group, notificationData.from)
  }

  const handleDeclineUser = () => {
    declineRequestToJoinGroup(notificationData._id, notificationData.from);
  }

  const handleResolveNotification = () => {
    setIsVisible(false);
    setTimeout(() => resolveNotification(notificationData._id), 300);
  }

  const handleAcceptContact = () => {
    console.log(notificationData);
  }

  const handleDeclineContact = () => {
    console.log(notificationData);
  }

  if (type === 'group') {
    return (
      <div className={`notification-item ${isVisible ? '' : 'fade-out'}`}>
        <p className='date'>{new Date(timestamp).toLocaleString()}</p>

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
  } else if (type === 'request-to-join-group') {
    return (
      <div className={`notification-item ${isVisible ? '' : 'fade-out'}`}>
        <p className='date'>{new Date(timestamp).toLocaleString()}</p>

        <p className="message">
          <span className="highlight">{firstWord}</span>
          {" " + words.join(' ') + " "}
          <span className="highlight">{lastWord}</span>
        </p>

        <div className="button-container">
          <button className="notification-button accept-notify" onClick={handleAcceptUser}>
            <Icon path={mdiCheckCircle} size={1.2} />
          </button>
          <button className="notification-button decline-notify" onClick={handleDeclineUser}>
            <Icon path={mdiCloseCircle} size={1.2} />
          </button>
        </div>
      </div>
    );
  } else if (type === 'feedback') {
    return (
      <div className={`notification-item ${isVisible ? '' : 'fade-out'}`}>
        <p className='date'> {new Date(timestamp).toLocaleString()}</p>
        <p className="message">{message}</p>
      </div>
    );
  } else if (type === 'info') {
    return (
      <div className={`notification-item ${isVisible ? '' : 'fade-out'}`}>
        <p className='date'>{new Date(timestamp).toLocaleString()}</p>
        <div className="message">
          <p className="info-title"><strong>Information</strong></p>
          <p className="info-message">
            {message}
          </p>
        </div>
        <div className="button-container">
          <button className="resolve-button" onClick={() => handleResolveNotification()}>
            OK
          </button>
        </div>
      </div>
    );
  } else if (type === 'award') {
    return (
      <div className={`notification-item ${isVisible ? '' : 'fade-out'}`}>
        <p className='date'>{new Date(timestamp).toLocaleString()}</p>
        <div className="message">
          <p className="congratulations"><strong>Congratulations</strong></p>
          <p className="reward-message">
            {message}
          </p>
        </div>
        <div className="button-container">
          <button className="resolve-button" onClick={() => handleResolveNotification()}>
            Yey
          </button>
        </div>
      </div>
    );
  } else if (type === 'contact') {
    return (
      <div className={`notification-item ${isVisible ? '' : 'fade-out'}`}>
        <p className='date'>{new Date(timestamp).toLocaleString()}</p>
        <div className="message">
          <p className="contact-title"><strong>Contact Request</strong></p>
          <p className="contact-message">
            {message}
          </p>
        </div>
        <div className="button-container">
          <button className="notification-button accept-notify" onClick={handleAcceptContact}>
            <Icon path={mdiCheckCircle} size={1.2} />
          </button>
          <button className="notification-button decline-notify" onClick={handleDeclineContact}>
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