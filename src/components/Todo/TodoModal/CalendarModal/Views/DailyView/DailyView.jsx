import React, { useEffect } from 'react';
import { Tooltip, Checkbox, Badge } from '@mui/material';
import Icon from '@mdi/react';
import { mdiAccountGroup } from '@mdi/js';
import { extractTimeFromDateString } from '../../../../../../utils/timeUtils';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import './DailyView.css';

const DailyView = ({ tasks, today, loggedInUser, draggedItem, date, placeholderIndex }) => {
    date = new Date(date).toISOString().split('T')[0];
    const repeatableTasks = tasks.filter(task => task.repeatable);
    const nonRepeatableTasks = tasks.filter(task => !task.repeatable);

    useEffect(() => {
        console.log("DEBUG -- Placeholder index - dailyView: ", placeholderIndex);
    }, [placeholderIndex]);

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

    const getPlaceholderStyle = () => {
        return {
            backgroundColor: '#e0e0e0', // Different color for the placeholder
            border: '2px dashed #b0b0b0',
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px'
        };
    };

    let draggedTask = null;
    try {
        draggedTask = JSON.parse(draggedItem);
    } catch (error) {
        draggedTask = null;
        console.error("Failed to parse dragged item", error);
    }

    console.log("DEBUG -- DailyView; draggedTask: ", draggedTask);

    return (
        <div className="daily-view">
            <div className="daily-view-emoji-area">
                {repeatableTasks.length === 0 ? (
                    <div className="no-repeatable-tasks">No repeatable tasks today</div>
                ) : (
                    repeatableTasks.map(task => (
                        <Tooltip key={task._id} title={task.task} arrow>
                            <div className="repeatable-task-item">
                                <span className={`emoji ${!task.completed ? 'faded' : ''}`}>
                                    {task.repeatableEmoji}
                                    {task.owner !== loggedInUser._id && (
                                        <Icon path={mdiAccountGroup} size={0.75} className="group-icon-emoji" />
                                    )}
                                    <span className={`status-icon ${task.completed ? 'completed' : 'not-completed'}`}>
                                        {task.completed ? '✔️' : '❌'}
                                    </span>
                                </span>
                            </div>
                        </Tooltip>
                    ))
                )}
            </div>
            <Droppable droppableId={`calendar-day:${date}:${JSON.stringify(nonRepeatableTasks.map(task => ({ dueDate: task.dueDate, estimatedTime: task.estimatedTime })))}`}>
                {(provided, snapshot) => (
                    <div className="calendar-tasks" ref={provided.innerRef} {...provided.droppableProps}>
                        {nonRepeatableTasks.length === 0 && !snapshot.isDraggingOver ? (
                            <div className="no-tasks-message">
                                No tasks on record.
                            </div>
                        ) : (
                            <>
                                {nonRepeatableTasks.map((task, index) => {
                                  
                                    const estimatedTime = normalizeTime(task.estimatedTime || 0);
                                    const totalTimeSpent = task.completed ? `(${normalizeTime(task.totalTimeSpent / 60000 || 0)})` : '';
                                    const timeClass = task.completed ? getTimeClass(task.estimatedTime, task.totalTimeSpent) : '';

                                    return (
                                        <React.Fragment key={task._id}>
                                            {index === placeholderIndex && (
                                                <div className="task-block" style={getPlaceholderStyle()}>
                                                    <div className="task-block-time">
                                                        <span>{normalizeTime(draggedTask.estimatedTime || 0)}</span>
                                                        {draggedTask.completed && <span className={`bold ${getTimeClass(draggedTask.estimatedTime, draggedTask.totalTimeSpent)}`}>{`(${normalizeTime(draggedTask.totalTimeSpent / 60000 || 0)})`}</span>}
                                                    </div>
                                                    <div className="task-block-content">
                                                        <span>{draggedTask.task}</span>
                                                    </div>
                                                    <div className="task-block-checkbox">
                                                        <Checkbox checked={!!draggedTask.completed}
                                                            color={draggedTask.owner !== loggedInUser._id ? 'secondary' : 'primary'}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <Draggable draggableId={JSON.stringify(task)} index={index} isDragDisabled={task.isDone}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="task-block"
                                                        style={getTaskStyle(task)}
                                                    >
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
                                                )}
                                            </Draggable>
                                        </React.Fragment>
                                    );
                                })}
                                {snapshot.isDraggingOver && placeholderIndex === nonRepeatableTasks.length && (
                                    <div className="task-block" style={getPlaceholderStyle()}>
                                        <div className="task-block-time">
                                            <span>{normalizeTime(draggedTask.estimatedTime || 0)}</span>
                                            {draggedTask.completed && <span className={`bold ${getTimeClass(draggedTask.estimatedTime, draggedTask.totalTimeSpent)}`}>{`(${normalizeTime(draggedTask.totalTimeSpent / 60000 || 0)})`}</span>}
                                        </div>
                                        <div className="task-block-content">
                                            <span>{draggedTask.task}</span>
                                        </div>
                                        <div className="task-block-checkbox">
                                            <Checkbox checked={!!draggedTask.completed}
                                                color={draggedTask.owner !== loggedInUser._id ? 'secondary' : 'primary'}
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}

export default DailyView;