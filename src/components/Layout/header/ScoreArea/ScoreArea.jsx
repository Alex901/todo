import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../../contexts/UserContext';
import Tooltip from '@mui/material/Tooltip';
import Icon from '@mdi/react';
import { mdiProgressStarFourPoints } from '@mdi/js';
import './ScoreArea.css';

const ScoreArea = () => {
    const { loggedInUser } = useUserContext();
    const [displayedScore, setDisplayedScore] = useState(0);
    const score = loggedInUser?.settings.score;

    useEffect(() => {
        if (score) {
            const targetScore = parseFloat(score).toFixed(1);
            const currentScore = parseFloat(displayedScore).toFixed(1);


            if (targetScore > currentScore) {
                const increment = (targetScore - currentScore) / 50; // Adjust the increment value for smoother animation
                console.log('DEBUG -- increment:', increment);
                const interval = setInterval(() => {
                    setDisplayedScore(prevScore => {
                        const newScore = parseFloat(prevScore) + increment;
                        if (newScore >= targetScore) {
                            clearInterval(interval);
                            return parseFloat(targetScore);
                        }
                        return parseFloat(newScore.toFixed(1));
                    });
                }, 100); // Adjust the interval duration for smoother animation
            } else {
                setDisplayedScore(parseFloat(targetScore));
            }
        }
    }, [score]);

    return (
        <div className="score-area">
            <Tooltip title="Productivity score" arrow>
                <Icon path={mdiProgressStarFourPoints} size={1} className="score-icon" />
            </Tooltip>
            <span className="score">{displayedScore.toFixed(1)}</span>
        </div>
    );
};

export default ScoreArea;