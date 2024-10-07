import React, { useEffect, useState, useRef } from 'react';
import { Tooltip, Checkbox } from '@mui/material';
import './WeeklyView.css';

const WeeklyView = ({ tasks, today }) => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [maxHeight, setMaxHeight] = useState("80px");
    const emojiAreaRefs = useRef([]);

    useEffect(() => {
        // Clear the refs array
        emojiAreaRefs.current = [];

        // Calculate the heights after the refs have been set
        setTimeout(() => {
            const heights = emojiAreaRefs.current.map(ref => ref ? ref.clientHeight : 0);
            const max = Math.max(...heights);
            if (isFinite(max)) {
                setMaxHeight(max);
            }
        }, 0);
    }, [tasks]);

    // console.log("DEBUG -- WeeklyView -- tasks: ", tasks);

    const getTasksForDay = (day) => {
        const dayTasks = tasks.filter(task => {
            if (task.dueDate && !task.repeatable) {
                const taskDate = new Date(task.dueDate);
                const taskDay = (taskDate.getDay() + 6) % 7; // Adjust to make Monday = 0, Sunday = 6
                return taskDay === day;
            } else if (task.repeatDay && task.repeatable) {
                const taskDate = new Date(task.repeatDay);
                const taskDay = (taskDate.getDay() + 6) % 7; // Adjust to make Monday = 0, Sunday = 6
                return taskDay === day;
            }
            return false;
        });
        return dayTasks;
    };

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

    const getTimeClass = (estimatedTime, totalTimeSpent) => {
        const estimatedMinutes = estimatedTime; // Convert hours to minutes if needed
        const totalMinutes = totalTimeSpent / 60000; // Convert milliseconds to minutes
        const difference = totalMinutes - estimatedMinutes;
        const percentageDifference = (difference / estimatedMinutes) * 100;

        if (percentageDifference <= 0) {
            return 'green';
        } else if (percentageDifference <= 50) {
            return 'yellow';
        } else {
            return 'red';
        }
    };

    return (
        <div className="weekly-view">
            {daysOfWeek.map((day, index) => {
                const dayTasks = getTasksForDay(index); // Adjusted to match Monday = 0, Sunday = 6
                const repeatableTasks = dayTasks.filter(task => task.repeatable);
                const nonRepeatableTasks = dayTasks.filter(task => !task.repeatable);

                return (
                    <div key={day} className="weekly-day">
                        <h4>{day}</h4>
                        <div className="weekly-view-emoji-area"
                            ref={el => emojiAreaRefs.current[index] = el}
                            style={{ height: maxHeight }}
                        >
                            {repeatableTasks.length === 0 ? (
                                <div className="no-repeatable-tasks">No repeatable tasks today</div>
                            ) : (
                                repeatableTasks.map(task => (
                                    <Tooltip key={task._id} title={task.task} arrow>
                                        <div className="repeatable-task-item">
                                            <span className={`emoji ${!task.completed ? 'faded' : ''}`}>
                                                {task.repeatableEmoji}
                                                <span className={`status-icon ${task.completed ? 'completed' : 'not-completed'}`}>
                                                    {task.completed ? '✔️' : '❌'}
                                                </span>
                                            </span>
                                        </div>
                                    </Tooltip>
                                ))
                            )}
                        </div>
                        <div className="weekly-view-calendar">
                            {nonRepeatableTasks.length === 0 ? (
                                <div className="no-tasks-message-week">
                                    No tasks on record.
                                </div>
                            ) : (
                                <div className="calendar-tasks">
                                    {nonRepeatableTasks.map(task => {
                                        const estimatedTime = normalizeTime(task.estimatedTime || 0);
                                        const totalTimeSpent = task.completed ? `(${normalizeTime(task.totalTimeSpent / 60000 || 0)})` : '';
                                        const timeClass = task.completed ? getTimeClass(task.estimatedTime, task.totalTimeSpent) : '';

                                        return (
                                            <div key={task._id} className="task-block">
                                                <div className="task-block-time">
                                                    <span>{estimatedTime}</span>
                                                    {task.completed && <span className={`bold ${timeClass}`}>{totalTimeSpent}</span>}
                                                </div>
                                                <div className="task-block-content">
                                                    <span>{task.task}</span>
                                                </div>
                                                <div className="task-block-checkbox">
                                                    <Checkbox checked={!!task.completed} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default WeeklyView;