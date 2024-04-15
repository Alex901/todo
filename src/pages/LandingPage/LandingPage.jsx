import React from 'react';
import Header from '../../components/Layout/header/Header';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className='landing-page'>
            <div className="hero">
                <div className='hero-left'>
                    <div className="hero-content-left">
                        <h2>Hero Title</h2>
                        <p>Hero description...</p>
                        <button className="hero-button"> Get Started </button>
                    </div>
                </div>

                <div className='hero-right'>
                    <p> Winner team image </p>
                    <p> Hero - form </p>
                    <p> form title </p>
                    <p> input mail </p>
                    <p> imput textArea </p>
                    <p> button </p>
                </div>

            </div>
        </div>
    );
}


export default LandingPage;