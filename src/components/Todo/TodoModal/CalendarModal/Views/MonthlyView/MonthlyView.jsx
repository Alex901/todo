import React from 'react';
import './MonthlyView.css';

const MonthlyView = ({ tasks, today, thisMonth, onDayClick, loggedInUser }) => {
    const startOfMonth = new Date(thisMonth.value.start);
    const endOfMonth = new Date(thisMonth.value.end);

    const getDaysInMonth = (start, end) => {
        const days = [];
        let currentDate = new Date(start);
        while (currentDate <= end) {
            days.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return days;
    };

    const daysInMonth = getDaysInMonth(startOfMonth, endOfMonth);

    const getTasksForDay = (day) => {
        const dayTasks = tasks.filter(task => {
            const taskDate = new Date(task.dueDate || task.repeatDay);
            return taskDate.getDate() === day.getDate() && taskDate.getMonth() === startOfMonth.getMonth();
        });
        return dayTasks;
    };

    const getRepeatableTasks = (dayTasks) => dayTasks.filter(task => task.repeatable);
    const getNonRepeatableTasks = (dayTasks) => dayTasks.filter(task => !task.repeatable);

    const renderDay = (day) => {
        const dayTasks = getTasksForDay(day);
        const repeatableTasks = getRepeatableTasks(dayTasks);
        const nonRepeatableTasks = getNonRepeatableTasks(dayTasks);
        const completedTasks = nonRepeatableTasks.filter(task => task.completed).length;
        const isToday = day.toDateString() === today.toDateString();

        return (
            <div key={day} className={`day-square ${isToday ? 'today' : ''}`} onClick={() => onDayClick(day)}>
                <div className="day-header">
                    <div className="day-number">{day.getDate()}</div>
                    <div className="repeatable-tasks">
                        {repeatableTasks.map(task => (
                            <div key={task._id} className={`task-circle ${task.completed ? 'completed' : ''} ${task.owner !== loggedInUser._id ? 'task-circle-group' : ''}`}></div>
                        ))}
                    </div>
                </div>
                <div className="non-repeatable-tasks">
                    {nonRepeatableTasks.length > 0 ? (
                        <div className="progress-bar-monthly-view">
                            <div className="progress-monthly-view" style={{ width: `${(completedTasks / nonRepeatableTasks.length) * 100}%` }}></div>
                            <div className="progress-text-monthly-view">{completedTasks}/{nonRepeatableTasks.length}</div>
                        </div>
                    ) : (
                        <div className="no-tasks">No tasks on record</div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="monthly-view">
            {daysInMonth.map(day => renderDay(day))}
        </div>
    );
};

export default MonthlyView;