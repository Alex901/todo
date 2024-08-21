import React, { useState, useMemo } from 'react';
import './ProgressArea.css';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 30,
    borderRadius: 15,
    border: '1px solid', // Add border
    borderColor: theme.palette.grey[300],
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 'var(--secondary-color)' : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? 'var(--primary-color)' : '#308fe8',
    },
}));
const ProgressArea = ({ tasksInActiveList }) => {
    const [view, setView] = useState('tasks'); // 'tasks' or 'time'
    const { tasksCompleted, totalTasks, timeSpent, totalTime } = useMemo(() => {
        const completedTasks = tasksInActiveList.filter(task => task.completed).length;
        const totalTasks = tasksInActiveList.length;
        const timeSpent = Math.round(tasksInActiveList.reduce((acc, task) => acc + task.totalTimeSpent, 0) / (1000 * 60 * 60)); // Convert milliseconds to hours and round
        const estimatedTime = Math.round(tasksInActiveList.reduce((acc, task) => acc + task.estimatedTime, 0) / 60); // Convert minutes to hours and round
        const totalTime = timeSpent + estimatedTime; // Total time is the sum of timeSpent and estimatedTime
        return { tasksCompleted: completedTasks, totalTasks, timeSpent, totalTime };
    }, [tasksInActiveList]);

    const progress = view === 'tasks'
        ? (tasksCompleted / totalTasks) * 100
        : (timeSpent / totalTime) * 100;


    const handleViewChange = (event, newView) => {
        if (newView !== null) {
            setView(newView);
        }
    };

    return (
        <div className="progress-container">
            <div className="progress-title">Progress</div>
            <div className="progress-bar">
                <BorderLinearProgress
                    variant={progress > 0 ? 'determinate' : 'indeterminate'}
                    value={progress > 0 ? progress : undefined}
                />
            </div>
            <div className="progress-label">
            {view === 'tasks' ? `${tasksCompleted}/${totalTasks}` : `${progress.toFixed(0)}%`}
            </div>
            <div className="toggle-container">
                <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={handleViewChange}
                    aria-label="view toggle"
                >
                    <ToggleButton value="tasks" aria-label="tasks view">
                        Tasks
                    </ToggleButton>
                    <ToggleButton value="time" aria-label="time view">
                        Time
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
        </div>
    );
};

export default ProgressArea;