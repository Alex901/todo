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
import CurrencyArea from "./CurrencyArea/CurrencyArea";
import ScoreArea from "./ScoreArea/ScoreArea";
const Header = ({ openAboutModal, openStoryModal, openInspirationModal, openInformationModal }) => {
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
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  }

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  }

  const openRegisterModal = (event) => {
    event.preventDefault();
    setIsLoginModalOpen(false);
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
          <div style={{ display: 'flex', alignItems: 'flex-start', width: 'auto' }}>
            <img src={logo} alt="Logo" style={{ marginRight: '20px', width: '32px', position: 'relative' }} />
            <span className="mdl-layout-title" style={{ fontSize: '32px', color: "white" }}>HabitForge - α</span>

          </div>

          {/* Middle section */}
          <div className="center-nav-container">
            <nav className="mdl-navigation">
              {isLoggedIn ? (
                <>
                  <ScoreArea />
                  <CurrencyArea />

                </>
              ) : null}
            </nav>
          </div>

          {/* Right section */}
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative', justifyContent: 'space-between', gap: isLoggedIn ? '12px' : '25px' }}>
            
            {isLoggedIn ? (
              <>
               <SelectLanguageButton isLoggedIn={isLoggedIn} />
                <NotificationsButton
                  isLoggedIn={isLoggedIn}
                  userNotifications={userNotifications}
                />
                <UserAvatar />
              </>
            ) : (
              <>
              <div className="offline-links">
                <div className="filler"></div>
                <a href="#" className="mdl-navigation__link" onClick={openInformationModal}>Information</a>
                <a href="#" className="mdl-navigation__link" onClick={openStoryModal}>Story</a>
                <a href="#" className="mdl-navigation__link" onClick={openInspirationModal}>Inspiration</a>
                <a href="#" className="mdl-navigation__link" onClick={openAboutModal}>About</a>
                <div className="filler"></div>
              </div>
              
              <SelectLanguageButton isLoggedIn={isLoggedIn} />
              </>
            )}
           

            {!isLoggedIn && <a href="#" className="mdl-navigation__link login-link" style={{ padding: '0' }} onClick={openLoginModal}>{t('login')}</a>}
            {!isLoggedIn && <button className="header-button" onClick={openRegisterModal}>{t('register')}</button>}

          </div>
        </div>
      </header>
      <LoginModal isOpen={isLoginModalOpen} onRequestClose={closeLoginModal} openRegisterModal={openRegisterModal} />
      <RegisterModal isOpen={isRegisterModalOpen} onRequestClose={closeRegisterModal} />

      <div className="mdl-layout" style={{}}>

      </div>
    </div>
  );
};

export default Header;
