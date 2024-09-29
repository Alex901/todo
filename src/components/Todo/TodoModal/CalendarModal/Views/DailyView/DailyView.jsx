import React from 'react';

const DailyView = ({ tasks }) => {
    const repeatableTasks = tasks.filter(task => task.isRepeatable);
    const nonRepeatableTasks = tasks.filter(task => !task.isRepeatable);

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