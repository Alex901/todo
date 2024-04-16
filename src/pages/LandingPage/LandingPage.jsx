import React from 'react';
import Header from '../../components/Layout/header/Header';
import './LandingPage.css';

window.addEventListener('scroll', function() {
    const heroHeight = document.querySelector('.hero').offsetHeight;
    const header = document.querySelector('.header');
  
    if (window.pageYOffset > heroHeight) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  });

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

                </div>

            </div>
        </div>
    );
}


export default LandingPage;