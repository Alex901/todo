import { useEffect } from 'react';
import { useUserContext } from '../../../../contexts/UserContext';
import Tooltip from '@mui/material/Tooltip';
import Icon from '@mdi/react';
import { mdiProgressStarFourPoints } from '@mdi/js';
import './ScoreArea.css';

const ScoreArea = () => {
    const { loggedInUser } = useUserContext();

    useEffect(() => {
        // console.log('DEBUG -- user -- scoreArea', loggedInUser);
    }, [loggedInUser]);

    return (
        <div className="score-area">
            <Tooltip title="Productivity score" arrow>
                <Icon path={mdiProgressStarFourPoints} size={1} className="score-icon" />
            </Tooltip>
            <span className="score">{loggedInUser?.settings.score}</span>
        </div>
    );
};

export default ScoreArea;