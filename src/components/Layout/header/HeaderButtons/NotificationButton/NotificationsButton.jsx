import React, { useState, useEffect } from 'react';
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
  const [notifications, setNotifications] = useState(userNotifications);

  const handleNotificationMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setNotifications(userNotifications);
  }, [userNotifications]);


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
                badgeContent={notifications.length}
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
              vertical: isMobile ? 'bottom' : 'top',
              horizontal: isMobile ? 'right' : 'center',
            }}
            PaperProps={{
              style: {
                padding: '5px',
                paddingRight: isMobile ? '0px' : '10px',
                paddingLeft: isMobile ? '0px' : '5px',
                marginTop: isMobile ? '0px' : '5px',
                marginLeft: isMobile ? '-15px' : '0px',
                backgroundColor: '#f0eded',
                maxHeight: isMobile ? 'calc(100vh - 100px)' : '400px',
              },
            }}
          >
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
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
                {t('no-notifications')}
              </MenuItem>
            )}
          </Menu>
        </>
      ) : null}
    </>
  );
};

export default NotificationsButton;