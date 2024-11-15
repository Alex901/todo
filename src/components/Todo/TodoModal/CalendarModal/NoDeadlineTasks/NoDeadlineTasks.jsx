import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import './NoDeadlineTasks.css';

const NoDeadlineTasks = ({ tasksNoDueDate }) => {
    return (
        <Droppable droppableId="noDeadlineTasks">
            {(provided) => (
                <div className="no-deadline-tasks" {...provided.droppableProps} ref={provided.innerRef}>
                    {tasksNoDueDate.map((task, index) => (
                        <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="task-item">
                                    {task.task}
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

export default NoDeadlineTasks;