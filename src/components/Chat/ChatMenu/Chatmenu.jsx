import React from 'react';
import './ChatMenu.css';

//This is the menu that clicking the widget opens.
const ChatMenu = ({ newMessages, onCreateChat, onClose }) => {
    return (
        <div className="chat-menu">
            <button className="close-menu" onClick={onClose}>
                Close
            </button>
            {newMessages.length > 0 ? (
                <ul className="new-messages-list">
                    {newMessages.map((chat) => (
                        <li key={chat.id} onClick={() => console.log(`Open chat with ${chat.name}`)}>
                            {chat.name} - {chat.message}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="no-new-messages">No new messages</div>
            )}
            <button className="create-chat-button" onClick={onCreateChat}>
                Start a New Chat
            </button>
        </div>
    );
};

export default ChatMenu;