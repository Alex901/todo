import React, { useState, useEffect } from 'react';
import './CookieConsent.css'; // Import the CSS

function CookieConsent() {
    const [showConsent, setShowConsent] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        console.log("consent: ", consent)
        if (consent !== 'true') {
            document.body.classList.add('modal-open');
            setShowConsent(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'true');
        document.body.classList.remove('modal-open');
        setShowConsent(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'false');
        document.body.classList.remove('modal-open');
        setShowConsent(false);
    };

    if (!showConsent) {
        return null;
    }

    return (
        <div className="cookie-consent">
            <p> Welcome stranger!<br></br><br></br> We use cookies to improve your browsing experience. By continuing to use this site, you consent to our use of cookies. For more information, please read our Cookie Policy.</p>
            <div className="button-container">
            <button className="consent-button accept" onClick={handleAccept}>Accept</button>
            <button className="consent-button decline" onClick={handleDecline}>Decline</button>
        </div>
        </div>
    );
}

export default CookieConsent;