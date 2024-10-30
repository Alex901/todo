import React, { useState, useEffect } from 'react';
import { useTodoContext } from '../../../contexts/todoContexts';
import Icon from '@mdi/react';
import { mdiCheck, mdiClose } from '@mdi/js';
import Tooltip from '@mui/material/Tooltip';
import './RepeatableDisplay.css';


const RepeatableDisplay = () => {
    const { listToday, todoList } = useTodoContext();
    const [openTooltip, setOpenTooltip] = useState(null);


    useEffect(() => {
        //  console.log('DEBUG -- listToday -- repeatableDisplay', listToday);
    }, [listToday]);

    const handleTooltipOpen = (id) => {
        setOpenTooltip(id);
        setTimeout(() => {
            setOpenTooltip(null); // Close tooltip after a short delay
        }, 2000); // Adjust the delay as needed
    };

    const handleTooltipClose = () => {
        setOpenTooltip(null);
    };

    const repeatableTasks = listToday.filter(task => task.repeatable);
    const repeatableCount = repeatableTasks.filter(task => !task.isDone).length;

    const totalTasks = listToday.length;
    const completedTasks = listToday.filter(task => task.completed !== null).length;
    const ongoingTasks = listToday.filter(task => task.isStarted && !task.completed).length;

    return (
        <>
            {listToday.length > 0 && (
                <div className="repeatable-display-content">
                    <div className="top-section">
                        <div className="progress-bar-repeatable-display">
                            <div className="progress-repeatable-display" style={{ width: `${(completedTasks / totalTasks) * 100}%` }}></div>
                            <div className="progress-text-repeatable-display">
                                {completedTasks}/{totalTasks}
                            </div>
                        </div>
                    </div>
                    <div className="bottom-section">
                        {repeatableTasks.map(task => (
                            <div key={task.id} className="task-item">
                                <Tooltip
                                    title={task.task}
                                    arrow
                                    open={openTooltip === task.id}
                                    onClose={handleTooltipClose}

                                >
                                    <span
                                        className="task-emoji"
                                        onClick={() => handleTooltipOpen(task.id)}
                                    >
                                        {task.repeatableEmoji}
                                    </span>
                                </Tooltip>
                                <div className="task-info">
                                    <span className="task-completed">
                                        {task.completed ? (
                                            <Icon path={mdiCheck} size={1} color="green" />
                                        ) : (
                                            <Icon path={mdiClose} size={1} color="red" />
                                        )}
                                    </span>
                                    <span className="task-streak"> {task.repeatStreak}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );

};

export default RepeatableDisplay;