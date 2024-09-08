import React, { useRef, useState, useEffect } from 'react';
import { Drawer, IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import logo from "../../../assets/Anvil_logo_v1.png";
import LoginModal from '../header/HeaderModals/LoginModal';
import RegisterModal from '../header/HeaderModals/RegisterModal';
import SettingsModal from '../header/HeaderModals/SettingsModal';
import FeedbackModal from '../header/HeaderModals/FeedbackModal';
import { useUserContext } from "../../../contexts/UserContext";
import { useNotificationContext } from '../../../contexts/NotificationContexts';
import { toast } from 'react-toastify';
import NotificationsButton from '../header/HeaderButtons/NotificationButton/NotificationsButton';
import SelectLanguageButton from '../header/HeaderButtons/SelectLanguageButton/SelectLanguageButton';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import Icon from '@mdi/react';
import { mdiLogout, mdiLogin, mdiAbTesting, mdiAccountPlus, mdiHelpCircle, mdiCommentQuote, mdiCog, mdiServerPlus } from '@mdi/js';
import TodoButton from '../../Todo/TodoButton/TodoButton';
import TodoModal from '../../Todo/TodoModal/TodoModal';

import './TodoDrawer.css';
const TodoDrawer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [opacity, setOpacity] = useState(1);
    const [click, setClicked] = useState(false);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
    const { loggedInUser, logout } = useUserContext();
    const { userNotifications } = useNotificationContext();
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
    const iconContainerRef = useRef(null);
    const drawerRef = useRef(null);
    const buttonRef = useRef(null);
    const hasNotifications = userNotifications.length > 0;

    useEffect(() => {
        const iconContainer = iconContainerRef.current;
        if (iconContainer) {
            const iconCount = iconContainer.children.length;
            const columns = Math.ceil(iconCount / 4);
            iconContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        }
    }, [loggedInUser]);

    useEffect(() => {
        if (drawerRef.current && buttonRef.current) {
          const drawerHeight = drawerRef.current.getBoundingClientRect().height;
          console.log(drawerHeight);   
          buttonRef.current.style.height = `${drawerHeight}px`;
        }
      }, [loggedInUser, isOpen]);

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            right: -3,
            top: 13,
            border: `2px solid ${theme.palette.background.paper}`,
            padding: '0 4px',
        },
    }));

    const handleClick = () => {
        setClicked(true);
        toggleDrawer(true)();
        setTimeout(() => setOpacity(0.2), 10);

        setClicked(!click);
    };

    const toggleDrawer = (open) => () => {
        setIsOpen(open);
    };

    const handleRegisterClick = () => {
        setRegisterModalOpen(true);
        toggleDrawer(false)();
    };

    const handleLoginClick = () => {
        setLoginModalOpen(true);
        toggleDrawer(false)();
    };

    const handleCloseModal = () => {
        setLoginModalOpen(false);
        setRegisterModalOpen(false);
        setIsSettingsModalOpen(false);
        setIsFeedbackModalOpen(false);
        setIsTodoModalOpen(false);
    };

    const handleSettingsClick = (event) => {
        event.preventDefault();
        setIsSettingsModalOpen(true);
        toggleDrawer(false)();
    };

    const handleFeedbackClick = (event) => {
        event.preventDefault();
        setIsFeedbackModalOpen(true);
        toggleDrawer(false)();
    }

    const handleTodoClick = (event) => {
        event.preventDefault();
        setIsTodoModalOpen(true);
        toggleDrawer(false)();
    }

    const handleLogout = () => {
        logout();
        toast.success("Bye, see you soon!");
    };


    return (
        <div>
            <React.Fragment>

                {/* <StyledBadge className='badge' badgeContent={userNotifications.length} color="secondary"> */}
                <button 
                ref={buttonRef} 
                className={`mobile-nav-button ${hasNotifications ? 'has-notifications' : ''} ${open ? 'drawer-open' : ''}`}
                onClick={handleClick}>

                </button>
                {/* </StyledBadge> */}

                <Drawer anchor='right' 
                open={isOpen} 
                onClose={toggleDrawer(false)} 
                className="custom-drawer">
                    <div ref={drawerRef} className="drawer-content">
                        
                        <div className="icon-container" ref={iconContainerRef}>

                            {loggedInUser ? (
                                <>
                                    <IconButton onClick={handleTodoClick} className="drawer-icon add-entry">
                                        <Icon path={mdiServerPlus} size={1.2} color="black" />
                                    </IconButton>
                                    

                                    <NotificationsButton
                                        isLoggedIn={true}
                                        userNotifications={userNotifications}
                                        isMobile={true}
                                        className={`drawer-icon ${hasNotifications ? 'has-notifications' : ''}`}
                                    />
                                    <IconButton onClick={handleFeedbackClick} className="drawer-icon">
                                        <Icon path={mdiCommentQuote} size={1.2} color="black" />
                                    </IconButton>

                                    <IconButton onClick={handleSettingsClick} className="drawer-icon">
                                        <Icon path={mdiCog} size={1.2} color="black" />
                                    </IconButton>
                                    
                                </>
                            ) : (
                                <>
                                    <IconButton onClick={handleRegisterClick} className="drawer-icon">
                                        <Icon path={mdiAccountPlus} size={1.2} color="black" />
                                    </IconButton>
                                    <IconButton onClick={() => alert("coming soon")} className="drawer-icon">
                                        <Icon path={mdiHelpCircle} size={1.2} color="black" />
                                    </IconButton>
                                </>
                            )}
                            <SelectLanguageButton
                            className="drawer-icon" />
                        </div>
                        <hr className='separator-drawer' />
                        <div className="login-logout-container">

                            <IconButton onClick={loggedInUser ? handleLogout : handleLoginClick} className="drawer-icon">
                                <Icon path={loggedInUser ? mdiLogout : mdiLogin} size={1.2} color="black" />
                            </IconButton>
                        </div>
                    </div>

                </Drawer>
                <RegisterModal isOpen={isRegisterModalOpen} onRequestClose={handleCloseModal} />
                <LoginModal isOpen={isLoginModalOpen} onRequestClose={handleCloseModal} />
                <SettingsModal isOpen={isSettingsModalOpen} onClose={handleCloseModal} />
                <FeedbackModal isOpen={isFeedbackModalOpen} onClose={handleCloseModal} />
                <TodoModal isOpen={isTodoModalOpen} onRequestClose={handleCloseModal} />
            </React.Fragment>

        </div>
    );
}

export default TodoDrawer;