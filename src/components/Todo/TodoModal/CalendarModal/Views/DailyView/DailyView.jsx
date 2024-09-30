import React from 'react';

const DailyView = ({ tasks, today, selectedDate }) => {
    const repeatableTasks = tasks.filter(task => task.repeatable);
    const nonRepeatableTasks = tasks.filter(task => !task.repeatable);

    console.log('DEBUG -- DailyView -- selectedDate:', selectedDate);
    console.log('DEBUG -- DailyView -- today:', today);

    return (
        <div>
            <h4>Non-Repeatable Tasks</h4>
            {nonRepeatableTasks.map(task => (
                <div key={task._id}>
                    {task.task} {task.completed && <span>(completed)</span>}
                </div>
            ))}

            <h4>Repeatable Tasks</h4>
            {repeatableTasks.map(task => (
                   <div key={task._id}>
                    {task.task} {task.completed && <span>(completed)</span>}
                </div>
            ))}
        </div>
    );
};

export default DailyView;