import React from 'react';
import './ChatArea.css';
import ChatWindow from '../ChatWindow/ChatWindow';

const ChatArea = ({ activeChats, onCloseChat }) => {
    return (
        <div className="chat-area">
            {activeChats.length > 0 ? (
                <div className="chat-windows">
                    {activeChats.map((chat) => (
                        <ChatWindow key={chat.id} chat={chat} onClose={onCloseChat} />
                    ))}
                </div>
            ) : (
                <div className="no-active-chats">No active chats</div>
            )}
        </div>
    );
};

export default ChatArea;