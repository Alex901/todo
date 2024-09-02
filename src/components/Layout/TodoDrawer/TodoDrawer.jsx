import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import './TodoDrawer.css';
import logo from "../../../assets/Anvil_logo_v1.png";
import LoginModal from '../header/HeaderModals/LoginModal';
import RegisterModal from '../header/HeaderModals/RegisterModal';
import SettingsModal from '../header/HeaderModals/SettingsModal';
import FeedbackModal from '../header/HeaderModals/FeedbackModal';
import { useUserContext } from "../../../contexts/UserContext";
import { toast } from 'react-toastify';

const TodoDrawer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [opacity, setOpacity] = useState(1);
    const [click, setClicked] = useState(false);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
    const { loggedInUser, logout } = useUserContext();
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

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

    const handleLogout = () => {
        logout();
        toast.success("Bye, see you soon!");
    };


    return (
        <div>
            <React.Fragment>
                <button className="mobile-nav-button" onClick={handleClick} style={{ opacity: opacity, transition: 'opacity 10s' }}>
                    <img src={logo} alt="Logo" />
                </button>
                <Drawer anchor='bottom' open={isOpen} onClose={toggleDrawer(false)}>
                    <div className="drawer" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <div className="drawer-header">
                            <div className="logo-title">
                                <div>
                                    <img src={logo} alt="Logo" />
                                </div>
                                <div>
                                    <Typography variant="h5" component="div">
                                        HabitForge
                                    </Typography>
                                </div>
                            </div>
                        </div>
                        <div className="drawer-content">
                            {loggedInUser ? (
                                <div style={{ textAlign: 'center' }}>
                                    <div className="user-details">
                                        <div className="user-type" style={{ color: 'white', textAlign: 'center' }}> {loggedInUser.role} </div>
                                        <div className="user-somethingcool" style={{ color: 'white', textAlign: 'center' }}> {loggedInUser.email} </div>
                                    </div>
                                    <hr></hr>
                                    <Typography variant="body1" component="p" className="menu-link" onClick={handleSettingsClick}>Settings</Typography>
                                    <Typography variant="body1" component="p" className="menu-link" onClick={handleFeedbackClick}>Feedback</Typography>
                                    <Typography variant="body1" component="p" className="menu-link">Help</Typography>
                                    <hr></hr>
                                    <div className="logout">
                                        <Typography variant="body1" component="p" className="menu-link" style={{ color: 'white' }} onClick={handleLogout}>Logout</Typography>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Typography variant="body1" component="p" className="menu-link" onClick={handleRegisterClick}>
                                        Register
                                    </Typography>
                                    <Typography variant="body1" component="p" className="menu-link" onClick={handleLoginClick}>
                                        Login
                                    </Typography>
                                    <hr />
                                    <Typography variant="body1" component="p" style={{ color: 'white' }}>
                                        Something very important
                                    </Typography>
                                </>
                            )}
                        </div>
                    </div>

                </Drawer>
                <RegisterModal isOpen={isRegisterModalOpen} onRequestClose={handleCloseModal} />
                <LoginModal isOpen={isLoginModalOpen} onRequestClose={handleCloseModal} />
                <SettingsModal isOpen={isSettingsModalOpen} onClose={handleCloseModal} />
                <FeedbackModal isOpen={isFeedbackModalOpen} onClose={handleCloseModal} />
            </React.Fragment>

        </div>
    );
}

export default TodoDrawer;