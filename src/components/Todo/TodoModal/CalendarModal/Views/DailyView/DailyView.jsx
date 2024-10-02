import React from 'react';
import { Tooltip, Checkbox } from '@mui/material';
import './DailyView.css';

const DailyView = ({ tasks, today }) => {
    const repeatableTasks = tasks.filter(task => task.repeatable);
    const nonRepeatableTasks = tasks.filter(task => !task.repeatable);

    const normalizeTime = (minutes) => {
        if (minutes >= 1440) {
            const days = Math.round(minutes / 1440);
            return `${days}d`;
        } else if (minutes >= 60) {
            const hours = Math.round(minutes / 60);
            return `${hours}h`;
        } else {
            return `${Math.round(minutes)}m`;
        }
    };

    return (
        <div className="daily-view">
            <div className="daily-view-emoji-area">
                {repeatableTasks.map(task => (
                    <Tooltip key={task._id} title={task.task} arrow>
                        <div className="repeatable-task-item">
                            <span className={`emoji ${!task.completed ? 'faded' : ''}`}>
                                {task.repeatableEmoji}
                            </span>
                        </div>
                    </Tooltip>
                ))}
            </div>
            <div className="daily-view-calendar">
                <div className="calendar-tasks">
                    {nonRepeatableTasks.map(task => {
                        const estimatedTime = normalizeTime(task.estimatedTime || 0);
                        const totalTimeSpent = task.completed ? `(${normalizeTime(task.totalTimeSpent / 60000 || 0)})` : '';

                        return (
                            <div key={task._id} className="task-block">
                                    <div className="task-block-time">
                                    <span>{estimatedTime}</span>
                                    {task.completed && <span className="bold">{totalTimeSpent}</span>}
                                </div>
                                <div className="task-block-content">
                                    <span>{task.task}</span>
                                </div>
                                <div className="task-block-checkbox">
                                    <Checkbox checked={task.completed} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DailyView;