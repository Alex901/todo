import React from 'react';
import Icon from '@mdi/react';
import { mdiArrowExpandLeft, mdiArrowExpandRight, mdiContentCut } from '@mdi/js';
import Tooltip from '@mui/material/Tooltip';
import './DetailsButtonArea.css';

const DetailsButtonArea = ({ onAddTaskBefore, onSimplifyTask, onAddTaskAfter }) => {
    return (
        <div className="details-button-area">
            <hr className="details-button-area-hr" />
            <div className="details-button-container">
                <Tooltip title="Add a task before this task">
                    <button className="entryButton" onClick={onAddTaskBefore}>
                        <Icon path={mdiArrowExpandLeft} size={1} />
                    </button>
                </Tooltip>
                <Tooltip title="Coming soon">
                    <button className="entryButton" onClick={onSimplifyTask}>
                        <Icon path={mdiContentCut} size={1} />
                    </button>
                </Tooltip>
                <Tooltip title="Add a task after this task">
                    <button className="entryButton" onClick={onAddTaskAfter}>
                        <Icon path={mdiArrowExpandRight} size={1} />
                    </button>
                </Tooltip>
            </div>
        </div>
    );
};

export default DetailsButtonArea;