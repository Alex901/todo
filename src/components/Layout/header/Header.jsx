import React, { useState, useEffect } from "react";
import "./Header.css";
import LoginModal from "./HeaderModals/LoginModal";
import RegisterModal from "./HeaderModals/RegisterModal";
import { useUserContext } from "../../../contexts/UserContext";
import logo from "../../../assets/Anvil_logo_v1.png";
import { toast } from "react-toastify";
import UserAvatar from "./UserAvatar/UserAvatar";
import { useTheme } from '@mui/material/styles';
import { mdiBellOutline } from '@mdi/js';
import Badge from '@mui/material/Badge';
import Popper from '@mui/material/Popper';
import Icon from '@mdi/react';
import { useNotificationContext } from "../../../contexts/NotificationContexts";
import Notification from "./Notification/Notification";


const Header = () => {
  const [time, setTime] = useState(new Date());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { isLoggedIn, loggedInUser, logout } = useUserContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const { userNotifications } = useNotificationContext();

  const theme = useTheme();


  const handleClickNotification = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000); // update time every second

    // cleanup function
    return () => {
      clearInterval(timer);
    };
  }, []);



  const openLoginModal = (event) => {
    event.preventDefault();
    setIsLoginModalOpen(true);
  }

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  }

  const openRegisterModal = (event) => {
    event.preventDefault();
    setIsRegisterModalOpen(true);
  }

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  }

  const handleLogout = () => {
    logout();
    toast.success("Bye, see you soon!");
  }

  return (
    <div className="mdl-layout header" style={{ overflow: "visible" }}>
      <header className="mdl-layout__header header_layout" style={{ backgroundColor: theme.palette.primary.main }}>
        <div className="mdl-layout__header-row nav-row" style={{ justifyContent: 'space-between' }}>
          {/* Left section */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Logo" style={{ marginRight: '12px', width: '5%', position: 'relative', top: '-3px' }} />
            <span className="mdl-layout-title" style={{ fontSize: '32px', color: "white" }}>HabitForge</span>

          </div>

          {/* Middle section */}
          <nav className="mdl-navigation">
            {/* Add navigation links/icons here */}
          </nav>

          {/* Right section */}
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative', gap: '5px' }}>
            {isLoggedIn ? (
              <>
                <Badge badgeContent={userNotifications.length} color="secondary" style={{ margin: '15px', top: '1px' }}>
                  <Icon className='notification-icon' path={mdiBellOutline} size={1.2} onClick={handleClickNotification} />
                </Badge>
                <Popper open={open} anchorEl={anchorEl} placement='bottom-end' style={{ zIndex: 10000 }}>
                  <div className="notification-container">
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
                      
                        <p style={{padding: '0', margin: '0'}}>No new notifications</p>
                     
                    )}
                  </div>
                </Popper>
                <UserAvatar />
              </>
            ) : null}
            {!isLoggedIn && <a href="#" className="mdl-navigation__link login-link" onClick={openLoginModal}>Login</a>}
            {!isLoggedIn && <button className="todoButton" onClick={openRegisterModal}>Register</button>}
          </div>
        </div>
      </header>
      <LoginModal isOpen={isLoginModalOpen} onRequestClose={closeLoginModal} />
      <RegisterModal isOpen={isRegisterModalOpen} onRequestClose={closeRegisterModal} />

      <div className="mdl-layout" style={{}}>

      </div>
    </div>
  );
};

export default Header;
