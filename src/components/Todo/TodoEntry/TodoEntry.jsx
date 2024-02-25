import React from "react";
import './TodoEntry.css'
import PropTypes from 'prop-types';
import { useTodoContext } from "../../../contexts/todoContexts";

const TodoEntry = ({ type, todoData }) => {
    const { id, isDone, task, created, completed } = todoData;
    const { removeTodo, toggleTodoComplete } = useTodoContext();

    const handleDelete = () => {
        removeTodo(id);
    };

    const handleClick = () => {
        toggleTodoComplete(id);
    }


  
    

    if (type === 'todo' && !isDone) {
        return (
            <div className="todo-entry">
                <div className="todo-item" onClick={handleClick}>
                    <div className="time">
                        <p className="time-stamp"> <strong>created:</strong> {created.toLocaleDateString()} - {created.toLocaleTimeString()} </p>
                    </div>
                    <p className="todo-text"> {task}</p>
                </div>
                <div className="delete-entry">
                    <button className="deleteButton" onClick={handleDelete}>
                        <i className="material-icons plus">delete</i>
                    </button>
                </div>
            </div>
        )
    } else if (type === 'done' && isDone) {

        const durationMS = completed.getTime() - created.getTime();
        const durationSeconds = Math.floor(durationMS/1000);
        const durationMinutes =  Math.floor(durationSeconds/60);
        const durationHours = Math.floor(durationMinutes/60);
        const remainingSeconds = Math.floor( durationSeconds % 60);

        return (
            <div className="todo-entry">
                <div className="done-item">
                    <div className="time">
                        <p className="time-stamp"> <strong>Completed:</strong> 
                        {completed.toLocaleDateString()} - {completed.toLocaleTimeString()}   
                        </p>
                        <div className="separator"> </div>
                        <p className="time-stamp"> <strong> Duration: </strong> {durationHours}H:{durationMinutes}M:{remainingSeconds}S: </p>
                    </div>
                    <p className="done-text"> {task} </p>
                </div>
                <div className="delete-entry">
                    <button className="deleteButton" onClick={handleDelete}>
                        <i className="material-icons plus">delete</i>
                    </button>
                </div>
            </div>
        )

    } else {
        return null
    }

}


TodoEntry.propTypes = {
    todoData: PropTypes.shape({
        id: PropTypes.number.isRequired,
        task: PropTypes.string.isRequired,
        isDone: PropTypes.bool.isRequired,
        created: PropTypes.instanceOf(Date).isRequired,
        completed: PropTypes.instanceOf(Date),
    }).isRequired,
    type: PropTypes.string.isRequired,
};

export default TodoEntry;