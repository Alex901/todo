import React, { useState, useEffect } from 'react';
import Card from '../../components/Layout/card/Card';
import './Social.css';
import { useUserContext } from '../../contexts/UserContext';

const Social = () => {
    const { loggedInUser } = useUserContext();
    const [score, setScore] = useState(loggedInUser?.settings?.score || 0); // Correctly initialize useState
    console.log("Current Score:", score);

    return (
        <>
            {score < 50 ? (
                <Card maxWidth="40em" padding="20px">
                    <div className="feature-placeholder">
                    <p className="placeholder-message">
                        Earn <strong> 50 points</strong> to unlock this feature!
                    </p>
                </div>
                </Card>
            ) : (
                <div className="social-grid">
                    <Card maxWidth={'40em'} padding={'0px'}>
                        <h2>User Profile</h2>
                    </Card>
                    <Card maxWidth={'40em'} padding={'0px'}>
                        <h2>Groups</h2>
                    </Card>
                    <Card maxWidth={'80em'} padding={'0px'}>
                        <h2>Wall</h2>
                    </Card>
                    <Card maxWidth={'20em'} padding={'0px'}>
                        <h2>Contacts</h2>
                    </Card>
                </div>
            )}
        </>
    );
}

export default Social;