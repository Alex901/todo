import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Icon from '@mdi/react';
import { mdiBellOutline } from '@mdi/js';
import { useTranslation } from "react-i18next";
import Notification from '../../Notification/Notification';
import './NotificationsButton.css';

const NotificationsButton = ({ isLoggedIn, userNotifications, isMobile, className }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleNotificationMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <IconButton
            onClick={handleNotificationMenuClick}
            color="inherit"
            className={`notification-button ${className}`}
          >
            <div className="icon-badge-container">
              <Icon path={mdiBellOutline} size={1.2} />
              <Badge
                badgeContent={userNotifications.length}
                color="secondary"
                className="notification-badge"
              />
            </div>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleNotificationMenuClose}
            disableScrollLock={true}
            anchorOrigin={{
              vertical: isMobile ? 'top' : 'bottom',
              horizontal: isMobile ? 'left' : 'center',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: isMobile ? 'right' : 'center',
            }}
            PaperProps={{
              style: {
                padding: '5px', // Add padding to create a gap
              },
            }}
          >
            {userNotifications.length > 0 ? (
              userNotifications.map((notification, index) => (
                <Notification
                  key={index}
                  notificationData={notification}
                  type={notification.type}
                  message={notification.message}
                  timestamp={notification.createdAt}
                />
              ))
            ) : (
              <MenuItem onClick={handleNotificationMenuClose}>
                {t('noNotifications')}
              </MenuItem>
            )}
          </Menu>
        </>
      ) : null}
    </>
  );
};

export default NotificationsButton;