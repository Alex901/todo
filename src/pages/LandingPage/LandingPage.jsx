import React, { useState } from 'react';
import {
    AppBar, Tabs, Tab, Box, Typography, TextField, Autocomplete, FormControl, Accordion,
    AccordionSummary, AccordionDetails, Avatar
} from '@mui/material';
import Header from '../../components/Layout/header/Header';
import './LandingPage.css';
import Icon from '@mdi/react';
import RegisterModal from '../../components/Layout/header/HeaderModals/RegisterModal';
import LoginModal from '../../components/Layout/header/HeaderModals/LoginModal';



window.addEventListener('scroll', function () {
    const heroHeight = document.querySelector('.hero').offsetHeight;
    const header = document.querySelector('.header');

    if (window.pageYOffset > heroHeight) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
});

const LandingPage = () => { //Could break this out into a header component ofc
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const openRegisterModal = (event) => {
        event.preventDefault();
        setShowRegisterModal(true)
    };
    const closeRegisterModal = () => setShowRegisterModal(false);

    const openLoginModal = () => setShowLoginModal(true);
    const closeLoginModal = () => setShowLoginModal(false);


    return (
        <div className='landing-page'>
            <div className="hero">
                <div className='hero-left'>
                    <div className="hero-content-left">
                        <h1>You know that project you have been putting off for for a couple of years?</h1>
                        <p className='hero-sub-text'> Yeah, that one... How about getting started today? We will make sure that you stick to it this time. With the assistance of our
                            AI driven daily planner, we will make sure that you are not owerwhelmed this time around. Only you can make it happen, but we will help! </p>
                        <div className='hero-get-started'>
                            (Some social proof here)
                            <div className='hero-get-started-actions'>
                                <button className="hero-button" onClick={openRegisterModal}> Get Started NOW its free </button>
                                <RegisterModal isOpen={showRegisterModal} onClose={closeRegisterModal} />
                            </div>
                            <p>Already have an account? <a className="hero-login-link" onClick={openLoginModal}>Login</a></p>
                            <LoginModal isOpen={showLoginModal} onClose={closeLoginModal} />
                        </div>
                    </div>
                    <p style={{ fontSize: '0.8em', margin: '10px' }}>
                        (PSST! Your data is safe, the database is fully encrypted and we will not share it with any third parties)
                    </p>
                </div>


                <div className='hero-right'>
                    <div className="hero-content-right">
                    </div>
                </div>

            </div>
        </div>
    );
}


export default LandingPage;