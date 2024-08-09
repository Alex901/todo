import React, { useState, useEffect, useRef } from "react";
import "./Header.css";
import LoginModal from "./HeaderModals/LoginModal";
import RegisterModal from "./HeaderModals/RegisterModal";
import { useUserContext } from "../../../contexts/UserContext";
import logo from "../../../assets/Anvil_logo_v1.png";
import { toast } from "react-toastify";
import UserAvatar from "./UserAvatar/UserAvatar";
import { useTheme } from '@mui/material/styles';
import { mdiBellOutline, mdiTranslateVariant } from '@mdi/js';
import Icon from '@mdi/react';
import { useNotificationContext } from "../../../contexts/NotificationContexts";
import Notification from "./Notification/Notification";
import { useTranslation } from "react-i18next";
import { Menu, MenuItem, IconButton, Badge, Popper, ClickAwayListener } from '@mui/material';
import ukFlag from "../../../assets/language_icons/uk-flag.png";
import sweFlag from "../../../assets/language_icons/flag-sweden.png";


const Header = () => {
  const [time, setTime] = useState(new Date());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { isLoggedIn, loggedInUser, logout } = useUserContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const { userNotifications } = useNotificationContext();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const notificationContainerRef = useRef(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickAway);
    return () => {
      document.removeEventListener('mousedown', handleClickAway);
    };
  }, [open]);

  const handleClickNotification = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  const handleClickAway = (event) => {
    if (!event.target.closest('.notification-container') && !event.target.closest('.notification-badge')) {
      setOpen(false);
    }
  };

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

  const handleLanguageMenuClick = (event) => {
    setLanguageAnchorEl(event.currentTarget);
  };


  const handleLanguageMenuClose = () => {
    setLanguageAnchorEl(null);
  };

  const handleLanguageChange = (language) => {
    console.log(`Changing language to: ${language}`);
    i18n.changeLanguage(language);
    handleLanguageMenuClose();
  };

  const languageMenuOpen = Boolean(languageAnchorEl);
  return (
    <div className="mdl-layout header" style={{ overflow: "visible" }}>
      <header className="mdl-layout__header header_layout" style={{ backgroundColor: theme.palette.primary.main }}>
        <div className="mdl-layout__header-row nav-row" style={{ justifyContent: 'space-between' }}>
          {/* Left section */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Logo" style={{ marginRight: '20px', width: '5%', position: 'relative', top: '-3px' }} />
            <span className="mdl-layout-title" style={{ fontSize: '32px', color: "white" }}>HabitForge</span>

          </div>

          {/* Middle section */}
          <nav className="mdl-navigation">

          </nav>

          {/* Right section */}
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative', justifyContent: 'space-between', gap: isLoggedIn ? '12px' : '15px' }}>
            <IconButton onClick={handleLanguageMenuClick} color="inherit" style={{ top: '1px', marginRight: !isLoggedIn ? '15px' : '0' }}>
              <Icon className="language-icon" path={mdiTranslateVariant} size={1.2} />
            </IconButton>
            <Menu
              anchorEl={languageAnchorEl}
              open={languageMenuOpen}
              onClose={handleLanguageMenuClose}
              disableScrollLock={true}
            >
              <MenuItem onClick={() => handleLanguageChange('en')}>
                <img src={ukFlag} alt="English" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                {t('english')}
              </MenuItem>
              <MenuItem onClick={() => handleLanguageChange('sv')}>
                <img src={sweFlag} alt="Swedish" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                {t('swedish')}
              </MenuItem>
            </Menu>
            {isLoggedIn ? (
              <>
                <Badge badgeContent={userNotifications.length} className="notification-badge" color="secondary" style={{ top: '1px', marginRight: '20px' }}>
                  <Icon className='notification-icon' path={mdiBellOutline} size={1.2} onClick={handleClickNotification} />
                </Badge>
                <ClickAwayListener onClickAway={handleClickAway}>
                <Popper open={open} anchorEl={anchorEl} placement='bottom-end' style={{ zIndex: 10000 }}>
                  <div className={`notification-container ${open ? 'active' : ''}`}>
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

                      <p style={{ padding: '0', margin: '0' }}>{t('no-notifications')}</p>

                    )}
                  </div>
                </Popper>
                </ClickAwayListener>
                <UserAvatar />
              </>
            ) : null}

            {!isLoggedIn && <a href="#" className="mdl-navigation__link login-link" style={{ padding: '0' }} onClick={openLoginModal}>{t('login')}</a>}
            {!isLoggedIn && <button className="header-button" onClick={openRegisterModal}>{t('register')}</button>}

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
