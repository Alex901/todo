import React, { useState, useEffect, useRef } from 'react';
import {
    AppBar, Tabs, Tab, Box, Typography, TextField, Autocomplete, FormControl, Accordion,
    AccordionSummary, AccordionDetails, Avatar
} from '@mui/material';
import './LandingPage.css';
import Icon from '@mdi/react';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { Tooltip, IconButton, SvgIcon } from '@mui/material';
import { mdiInformation } from '@mdi/js';
import RegisterModal from '../../components/Layout/header/HeaderModals/RegisterModal';
import LoginModal from '../../components/Layout/header/HeaderModals/LoginModal';
import Feature from './Feature/Feature';
import testingImage from '../../assets/Features_icons/Technology-icon2_trans.png';
import cooperateImage from '../../assets/Features_icons/Cooperation-icon2_trans.png';
import ideaImage from '../../assets/Features_icons/Idea-icon2_trans.png';
import stepsImage from '../../assets/Features_icons/Progress-icon2_trans.png';
import trackImage from '../../assets/Features_icons/Examine-details2_trans.png';
import motivatedImage from '../../assets/Features_icons/Motivated-icon2_trans.png';
import Header from '../../components/Layout/header/Header';
import Footer from '../../components/Layout/Footer/Footer';
import { useTranslation } from "react-i18next";
import { useFeedbackContext } from '../../contexts/FeedbackContext';
import { useUserContext } from '../../contexts/UserContext';
import FeedbackVoteEntry from '../FeedbackVoteEntry/FeedbackVoteEntry';
import AboutModal from '../../components/Todo/TodoModal/OfflineModals/AboutModal/AboutModal';
import InspirationModal from '../../components/Todo/TodoModal/OfflineModals/InspirationModal/InspirationModal';
import StoryModal from '../../components/Todo/TodoModal/OfflineModals/StoryModal/StoryModal';
import InformationModal from '../../components/Todo/TodoModal/OfflineModals/InformationModal/InformationModal';


const LandingPage = () => { //Could break this out into a header component ofc
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { fetchOfflineFeedback } = useFeedbackContext();
    const { loggedInUser } = useUserContext();
    const { t } = useTranslation();
    const [reviews, setReviews] = useState([]);
    const [featureRecommendations, setFeatureRecommendations] = useState([]);
    const carouselRef = useRef(null);
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showStoryModal, setShowStoryModal] = useState(false);
    const [showInspirationModal, setShowInspirationModal] = useState(false);
    const [showInformationModal, setShowInformationModal] = useState(false);

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchOfflineFeedback();
            const reviews = data.filter(item => item.type === 'review');
            const featureRecommendations = data
                .filter(item => item.type === 'feature')
                .sort((a, b) => b.upvotes - a.upvotes);

            setReviews(reviews);
            setFeatureRecommendations(featureRecommendations);
        };


        fetchData();


    }, [loggedInUser]);

    const openRegisterModal = (event) => {
        event.preventDefault();
        setShowRegisterModal(true)
    };
    const closeRegisterModal = () => setShowRegisterModal(false);

    const openLoginModal = () => setShowLoginModal(true);
    const closeLoginModal = () => setShowLoginModal(false);

    const openAboutModal = () => setShowAboutModal(true);
    const closeAboutModal = () => setShowAboutModal(false);

    const openStoryModal = () => setShowStoryModal(true);
    const closeStoryModal = () => setShowStoryModal(false);

    const openInspirationModal = () => setShowInspirationModal(true);
    const closeInspirationModal = () => setShowInspirationModal(false);

    const openInformationModal = () => setShowInformationModal(true);
    const closeInformationModal = () => setShowInformationModal(false);

    const features = [
        { image: ideaImage, title: 'Plan your actions', description: 'Every journey begins with a plan. Whether you want to learn something new, kick a bad habit, or replace it with a better one, map out your steps—and we’ll help you stay on track.' },
        { image: stepsImage, title: 'Daily steps and reminders', description: 'Stay engaged with daily nudges and actionable steps that keep your momentum going.' },
        { image: trackImage, title: 'Track your progress', description: 'We record your progress so our algorithm can adjust task difficulty to perfectly match your needs. Plus, enjoy detailed graphs that showcase your achievements.' },
        { image: motivatedImage, title: 'Eliminate stress', description: 'Enjoy peace of mind by always knowing what’s next. No more endless hours spent planning your day.' },
        { image: cooperateImage, title: 'Colaborate', description: 'Embark on a solo journey, or join a dynamic group where everyone cheers each other on, stays motivated, and works together toward shared goals.' },
        { image: testingImage, title: 'Discover new ways of doing things', description: 'Experiment with our suite of tools designed to boost productivity and streamline your workflow!' },
    ];


    return (
        <div className="landing-page">
            <Header className="sticky" 
                openAboutModal={openAboutModal}
                openStoryModal={openStoryModal}
                openInspirationModal={openInspirationModal}
                openInformationModal={openInformationModal}

            />
            <div className="hero">
                <div className='hero-left'>
                    <div className="hero-content-left">
                        <h1>{t("hero-title")}</h1>
                        <p className='hero-sub-text'> {t("hero-subtitle")}</p>
                        <div className='hero-get-started'>
                            <a href="#feedback-section-id" className="hero-development-link" style={{ fontSize: 'smaller', textDecoration: 'underline', color: 'var(--primary-color)' }}>
                                Be part of the development!
                            </a>
                            <div className='hero-get-started-actions'>
                                <button className="hero-button" onClick={openRegisterModal}> {t("hero-button")} </button>
                                <RegisterModal isOpen={showRegisterModal} onRequestClose={closeRegisterModal} />
                            </div>
                            <p>{t("already-account")} <a className="hero-login-link" onClick={openLoginModal}>{t("login")}</a></p>
                            <LoginModal isOpen={showLoginModal} onRequestClose={closeLoginModal} />
                        </div>
                    </div>
                    <p style={{ fontSize: '0.8em', margin: '10px' }}>
                        (This is a service in development, read more <a className="read-more-link" href="#" onClick={openInformationModal} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>here</a>)
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
            {/* <div className='qoute-div'>
                <h1 className='ins-quote first-quote'>
                    <span className='quote-mark'>"</span>Forge a strong enough habit, and you are halfway there already.<span className='quote-mark'>"</span>
                </h1>
            </div> */}


            {/* <div className="success-case">
                <div className="success-case-section">
                    <div className="success-case-image">
                        <img className="image1" src="src\assets\Overwhelmed_2.jpg" alt="Success Case" />
                    </div>
                    <div className="success-case-text">
                        <h2>Success Story</h2>
                        <p>Maybe something like this? Continue telling the story.</p>
                    </div>
                </div>
                <div className="success-case-section">
                    <div className="success-case-text">
                        <h2>FAQ</h2>
                        <p>Questions here</p>
                        <p>More steps?</p>
                    </div>
                    <div className="success-case-image">
                        <img className="image2" src="src\assets\team-success-r.jpg" alt="Success Case" />
                    </div>
                </div>
                <div className="success-case-section">
                    <div className="success-case-image">
                        <img className="image1" src="src\assets\solo-success-r.jpg" alt="Success Case" />
                    </div>
                    <div className="success-case-text">
                        <h2>New Level</h2>
                        <p>More text here</p>
                    </div>
                </div>
            </div> */}
            {/* <div id='1' className='qoute-div'>
                <h1 className='ins-quote second-quote'>
                    <span className='quote-mark'>"</span>Test quote2<span className='quote-mark'>"</span>
                </h1>
            </div> */}


            {featureRecommendations.length > 0 && (
                <div id="feedback-section-id" className="feedback-section">
                    <h2>
                        Best suggestions right now
                        <Tooltip title="Submit suggestions when logged in: Settings>Feedback, if the suggestion is approved, it will be posted here">
                            <IconButton>
                                <SvgIcon style={{ color: 'var(--secondary-color)' }}>
                                    <path d={mdiInformation} />
                                </SvgIcon>
                            </IconButton>
                        </Tooltip>
                    </h2>
                    <div className="feedback-carousel">
                        <div className='carusel-arrow-div'>
                            <IconButton onClick={scrollLeft} className="carousel-arrow left-arrow">
                                <SvgIcon>
                                    <path d={mdiChevronLeft} />
                                </SvgIcon>
                            </IconButton>
                        </div>
                        <div className="feedback-list" ref={carouselRef}>
                            {featureRecommendations.map((feature, index) => (
                                <FeedbackVoteEntry
                                    key={index}
                                    feedback={feature}
                                />
                            ))}

                        </div>
                        <div className='carusel-arrow-div'>
                        <IconButton onClick={scrollRight} className="carousel-arrow right-arrow">
                            <SvgIcon>
                                <path d={mdiChevronRight} />
                            </SvgIcon>
                        </IconButton>
                        </div>
                    </div>
                </div>
            )}

            <div className='qoute-div'>
                <h1 className='ins-quote'>
                    <span className='quote-mark'>"</span>Best thing since sliced bread! Now I know what to do with my life!.<span className='quote-mark'>"</span>
                </h1>
            </div>

            <div className="data-presentation-CTA"></div>
            <Footer
                openAboutModal={openAboutModal}
                openStoryModal={openStoryModal}
                openInspirationModal={openInspirationModal}
                openLoginModal={openLoginModal}
                openRegisterModal={openRegisterModal}
            />
       
            <AboutModal isOpen={showAboutModal} onRequestClose={closeAboutModal} />
            <StoryModal isOpen={showStoryModal} onRequestClose={closeStoryModal} />
            <InspirationModal  isOpen={showInspirationModal} onRequestClose={closeInspirationModal} />
            <InformationModal isOpen={showInformationModal} onRequestClose={closeInformationModal} />
        </div>
    );
}


export default LandingPage;