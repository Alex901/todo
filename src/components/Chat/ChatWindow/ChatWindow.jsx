import React from 'react';
import './ChatWindow.css';
import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react';

const ChatWindow = ({ chat, onClose }) => {
    return (
        <div className="chat-window">
            <div className="chat-header">
                <span>{chat.name}</span>
                <button className="close-button" onClick={() => onClose(chat.id)}>
                    <Icon path={mdiClose} size={1} />
                </button>
            </div>
            <div className="chat-messages">
                {chat.messages.map((message, index) => (
                    <div key={index} className="chat-message">
                        <strong>{message.sender}:</strong> {message.text}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input type="text" placeholder="Type a message..." />
                <button>Send</button>
            </div>
        </div>
    );
};

export default ChatWindow;