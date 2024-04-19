import React, { useState, useEffect } from 'react';
import {
    AppBar, Tabs, Tab, Box, Typography, TextField, Autocomplete, FormControl, Accordion,
    AccordionSummary, AccordionDetails, Avatar
} from '@mui/material';
import './LandingPage.css';
import Icon from '@mdi/react';
import RegisterModal from '../../components/Layout/header/HeaderModals/RegisterModal';
import LoginModal from '../../components/Layout/header/HeaderModals/LoginModal';
import Feature from './Feature/Feature';
import testingImage from '../../assets/Features_icons/testing.jpg';
import cooperateImage from '../../assets/Features_icons/cooperate.png';
import ideaImage from '../../assets/Features_icons/idea.png';
import stepsImage from '../../assets/Features_icons/steps.jpg';
import trackImage from '../../assets/Features_icons/trackProg.jpg';
import Header from '../../components/Layout/header/Header';
import Footer from '../../components/Layout/Footer/Footer';



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

    const features = [

        { image: ideaImage, title: 'Define your goal', description: 'Do you finally want to learn how to code? Maybe get rid of a bad habbit or why not learn how to get a girlfriend? Spoiler alert mister: it start with talking to another human being.. Now sign-up you virgin FUCK! ' },
        { image: stepsImage, title: 'Daily steps', description: 'Our algorithm breaks your goal into small bite sized tasks. Based on your preferances you will be assigned simple tasks each day that will take you to your goal' },
        { image: cooperateImage, title: 'Cooperate', description: 'You can go on an entierly solo learning journey. Or you can do so as a group. Where you can simply keep eachother accountable. Or you can work together towards a common goal.' },
        { image: trackImage, title: 'Track your progress', description: 'All progress is being recorded so our algorithm can decide if things are too easy/hard and adjust the difficulty of your daily tasks based on that. Also, you get some shiny graphs!!' },
        { image: testingImage, title: 'Discover the power of AI', description: 'Along this journey, you can laverage the power of AI in each step of the way. And if you are not happy with the results, you can always modify your plans accordingly. We all know that this technology is not perfect(yet). ' },
    ];


    return (
        <div className='landing-page'>
            <Header className="sticky" /> 
            <div className="hero">
                <div className='hero-left'>
                    <div className="hero-content-left">
                        <h1>You know that project you have been putting off indefinetly?</h1>
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
                        (PSST! Your data is safe, the database is fully encrypted and we will not share any data with any third parties)
                    </p>
                </div>


                <div className='hero-right'>
                    <div className="hero-content-right">
                    </div>
                </div>

            </div>
            <div className='features'>
                {features.map((feature, index) => (
                    <Feature key={index} image={feature.image} title={feature.title} description={feature.description} />
                ))}
            </div>

            <div className='qoute-div'>
                <h1 className='ins-quote first-quote'>
                    <span className='quote-mark'>"</span>Forge a strong enough habit, and you are half way there already.<span className='quote-mark'>"</span>
                </h1>
            </div>

            <div className="success-case">
                <div className="success-case-section">
                    <div className="success-case-image">
                        <img className="image1" src="src\assets\solo-success-r.jpg" alt="Success Case" />
                    </div>
                    <div className="success-case-text">
                        <h2>Success Story</h2>
                        <p>Maybe something like this? Continue telling the story.</p>
                    </div>
                </div>
                <div className="success-case-section">
                    <div className="success-case-text">
                        <h2>FAQ</h2>
                        <p>Here is some FAQ text...</p>
                        <p>More steps?</p>
                    </div>
                    <div className="success-case-image">
                        <img className="image2" src="src\assets\team-success-r.jpg" alt="Success Case" />
                    </div>
                </div>
            </div>
            <div className='qoute-div'>
                <h1 className='ins-quote second-quote'>
                    <span className='quote-mark'>"</span>One step at a time.<span className='quote-mark'>"</span>
                </h1>
            </div>
            <div className="testimonials" style={{ width: '100%' }}>
                <div className="carousel" style={{ width: '100%', height: '300px', backgroundColor: 'white', borderRadius:'20px' }}>
                    <h1> !!!Placeholder -- testamonials!!! </h1> 
                </div>
            </div>
            <div className='qoute-div'>
                <h1 className='ins-quote'>
                    <span className='quote-mark'>"</span>To success.<span className='quote-mark'>"</span>
                </h1>
            </div>

            <div className="data-presentation-CTA"></div>
            <Footer />
        </div>


    );
}


export default LandingPage;