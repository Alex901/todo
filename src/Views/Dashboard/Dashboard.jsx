import React, { useState, useEffect } from 'react';
import Card from '../../components/Layout/card/Card';
import { useTodoContext } from '../../contexts/todoContexts';
import './Dashboard.css';


const Dashboard = () => {

    return (
        <>
            <Card>
                <div className="feature-placeholder">
                    <p className="placeholder-message">
                        Earn <strong> 500 points</strong> to unlock this feature!
                    </p>
                </div>
            </Card>
        </>
    );
}

export default Dashboard;