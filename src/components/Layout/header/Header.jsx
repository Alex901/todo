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
import NotificationsButton from "./HeaderButtons/NotificationButton/NotificationsButton";
import SelectLanguageButton from "./HeaderButtons/SelectLanguageButton/SelectLanguageButton";


const Header = () => {
  const [time, setTime] = useState(new Date());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { isLoggedIn, loggedInUser, logout } = useUserContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const { userNotifications } = useNotificationContext();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

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
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative', justifyContent: 'space-between', gap: isLoggedIn ? '12px' : '25px' }}>
          <SelectLanguageButton isLoggedIn={isLoggedIn} />
            {isLoggedIn ? (
              <>
                <NotificationsButton
                  isLoggedIn={isLoggedIn}
                  userNotifications={userNotifications}
                />
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
