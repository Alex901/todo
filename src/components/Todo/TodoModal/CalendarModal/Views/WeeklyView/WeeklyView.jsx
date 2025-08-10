import React, { useEffect, useState, useRef } from 'react';
import { Tooltip, Checkbox } from '@mui/material';
import Icon from '@mdi/react';
import { mdiAccountGroup } from '@mdi/js';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import './WeeklyView.css';

const WeeklyView = ({ tasks, today, thisWeek, onDayClick, loggedInUser, draggedItem }) => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [maxHeight, setMaxHeight] = useState("80px");
    const emojiAreaRefs = useRef([]);

    // console.log("DEBUG -- WeeklyView -- thisWeeks tasks: ", tasks);

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

    const isSameDate = (date1, date2) => {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    };

    const isTodayInThisWeek = (today, thisWeek) => {
        const todayTime = today.getTime();
        const startTime = thisWeek.start.getTime();
        const endTime = thisWeek.end.getTime();
        // console.log("DEBUG -- WeeklyView -- todayTime: ", todayTime);
        // console.log("DEBUG -- WeeklyView -- startTime: ", startTime);
        // console.log("DEBUG -- WeeklyView -- endTime: ", endTime);
        return todayTime >= startTime && todayTime <= endTime;
    };

    const getDayOfWeek = (today, startOfWeek) => {
        const diffTime = today.getTime() - startOfWeek.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const startOfWeek = new Date(thisWeek.value.start);
    const endOfWeek = new Date(thisWeek.value.end);
    const todayDate = new Date(today);

    const isTodayInWeek = isTodayInThisWeek(todayDate, { start: startOfWeek, end: endOfWeek });
    const todayDayOfWeek = isTodayInWeek ? getDayOfWeek(todayDate, startOfWeek) : -1;

    // console.log("DEBUG -- WeeklyView -- todayDayOfWeek: ", isTodayInWeek);

    const getTaskStyle = (task) => {
        if (task.owner !== loggedInUser._id) {
            return {
                backgroundColor: '#944545',
                color: '#ffffff',
                borderColor: '#ffffff'
            };
        }
        return {};
    };

    return (
        <div className="weekly-view">
            {daysOfWeek.map((day, index) => {
                const dayTasks = getTasksForDay(index); // Adjusted to match Monday = 0, Sunday = 6
                const repeatableTasks = dayTasks.filter(task => task.repeatable);
                const nonRepeatableTasks = dayTasks.filter(task => !task.repeatable);

                const dayDate = new Date(startOfWeek);
                dayDate.setDate(startOfWeek.getDate() + index);
                const isToday = index === todayDayOfWeek;

                return (
                    <div
                        key={day}
                        className="weekly-day"
                        onClick={() => onDayClick(dayDate)}
                        style={{ border: isToday ? '2px solid red' : '1px solid #e0e0e0' }}
                    >
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
                                                {task.repeatable && task.owner !== loggedInUser._id && (
                                                    <Icon path={mdiAccountGroup} size={0.8} className="group-icon" />
                                                )}
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
                                            <div key={task._id} className="task-block" style={getTaskStyle(task)}>
                                                <div className="task-block-time">
                                                    <span>{estimatedTime}</span>
                                                    {task.completed && <span className={`bold ${timeClass}`}>{totalTimeSpent}</span>}
                                                </div>
                                                <div className="task-block-content">
                                                    <span>{task.task}</span>
                                                </div>
                                                <div className="task-block-checkbox">
                                                    <Checkbox checked={!!task.completed}
                                                        color={task.owner !== loggedInUser._id ? 'secondary' : 'primary'}
                                                    />
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