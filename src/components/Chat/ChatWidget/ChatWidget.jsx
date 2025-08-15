import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import './ChatWidget.css';
import { mdiChatPlus, mdiChatPlusOutline, mdiChat, mdiChatProcessingOutline } from '@mdi/js';
import Icon from '@mdi/react';
import Badge from '@mui/material/Badge';
import { useUserContext } from '../../../contexts/UserContext';

const ChatWidget = () => {
    const { loggedInUser, updateChatWidgetPosition } = useUserContext();
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false); // Track hover state

    // Placeholder for new message count
    const newMessageCount = 15; // Replace this with dynamic data later

    // Load the initial position from user settings
    useEffect(() => {
        if (loggedInUser?.settings?.chatWidgetPosition) {
            setPosition(loggedInUser.settings.chatWidgetPosition);
        }
    }, [loggedInUser]);

    // Handle drag stop to save the new position
    const handleDragStop = (e, data) => {
        const newPosition = { x: data.x, y: data.y };
        setPosition(newPosition);

        // Save the new position to user settings
        updateChatWidgetPosition(newPosition);
    };

    // Determine the icon based on hover state and new message count
    const getIconPath = () => {
        if (newMessageCount > 0) {
            return isHovered ? mdiChatProcessingOutline : mdiChat;
        } else {
            return isHovered ? mdiChatPlusOutline : mdiChatPlus;
        }
    };

    return (
        <Draggable
            position={position}
            onStop={handleDragStop}
            bounds="parent"
        >
            <div
                className="chat-widget"
                onMouseEnter={() => setIsHovered(true)} // Set hover state to true
                onMouseLeave={() => setIsHovered(false)} // Set hover state to false
            >
                <Badge
                    badgeContent={newMessageCount}
                    color="secondary"
                    overlap="circular"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                >
                    <div className="chat-icon">
                        <Icon path={getIconPath()} size={1.5} />
                    </div>
                </Badge>
            </div>
        </Draggable>
    );
};

export default ChatWidget;