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
    };

    const handleTooltipClose = () => {
        setOpenTooltip(null);
    };

    const repeatableTasks = listToday.filter(task => task.repeatable);
    const totalTasks = listToday.filter(task => !task.isDone).length;
    const repeatableCount = repeatableTasks.filter(task => !task.isDone).length;

    return (
        <>
            {listToday.length > 0 && (
                <div className="repeatable-display-content">
                    <div className="left-section">
                        <h5>
                            <span className="error-color">#</span>Todo today: {totalTasks}(
                            <span className="secondary-color">{repeatableCount}</span>)
                        </h5>
                    </div>
                    <div className="right-section">
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