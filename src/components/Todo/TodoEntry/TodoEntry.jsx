import React, { useState } from "react";
import './TodoEntry.css'
import PropTypes from 'prop-types';
import { useTodoContext } from "../../../contexts/todoContexts";
import TodoModal from "../TodoModal/TodoModal";
import { prototype } from "react-modal";

const TodoEntry = ({ type, todoData, onEdit }) => {
    const { id, isDone, task, created, completed, started } = todoData;
    const { removeTodo, toggleTodoComplete } = useTodoContext();
    const [isMoreChecked, setIsMoreChecked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);


    const handleDelete = () => {
        removeTodo(id);
    };

    const handleEdit = () => {
        onEdit(todoData);
    }

    const handleMoreInfromationClick = () => {
        setIsMoreChecked(!isMoreChecked);
        console.log(isMoreChecked);
    }

    const handleClicktoComplete = () => {
        toggleTodoComplete(id);
    }

    const handleClickToStart = () => {
        toggleTodoStart(id);
    }

    const handleCancel = () => {
        console.log('Canel task with', id)
        //cancelDoingTask(id);
    }



    //TODO: this is not pretty, make separate components at some point

    if (type === 'todo' && !isDone) {
        return (
            <div className="todo-entry">
                <div className="todo-item" onClick={handleClickToStart}>
                    <div className="time">
                        <p className="time-stamp"> <strong>created:</strong> {created.toLocaleDateString()} - {created.toLocaleTimeString()} </p>
                    </div>
                    <p className="todo-text"> {task}</p>
                </div>
                <div className="buttons">
                    <button className="edit-button entryButton" onClick={handleEdit}>
                        <i className="material-icons todo-entry-icon">edit</i>
                    </button>
                    <button className="deleteButton entryButton" onClick={handleDelete}>
                        <i className="material-icons todo-entry-icon">delete</i>
                    </button>
                    <button className="moreButton entryButton" onClick={handleMoreInfromationClick}>
                        <i className="material-icons todo-entry-icon"> {isMoreChecked ? "keyboard_arrow_up" : "keyboard_arrow_down"} </i>
                    </button>
                </div>

            </div>


        )
    } else if (type === 'done' && isDone) {

        const durationMS = completed.getTime() - created.getTime();
        const durationSeconds = Math.floor(durationMS / 1000);
        const durationMinutes = Math.floor(durationSeconds / 60);
        const durationHours = Math.floor(durationMinutes / 60);
        const remainingSeconds = Math.floor(durationSeconds % 60);

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
                    <div className="checkbox-and-task">
                        <input className="checkbox-c" type="checkbox" defaultChecked={isDone} />
                        <p className="done-text"> {task} </p>
                    </div>
                </div>
                <div className="buttons">
                    <div className="moreDoneButton" >
                        <button className="entryButton" onClick={handleMoreInfromationClick}>
                            <i className="material-icons todo-entry-icon"> {isMoreChecked ? "keyboard_arrow_up" : "keyboard_arrow_down"} </i>
                        </button>
                    </div>
                </div>
            </div>
        )

    } else if (type === 'doing' && !isDone) {
        return (
            <div className="todo-entry">
                <div className="doing-item" onClick={handleClicktoComplete}>
                    <div className="time">
                    <p className="time-stamp"> <strong>created:</strong> {created.toLocaleDateString()} - {created.toLocaleTimeString()} </p>                 
                    </div>
                    <p className="doing-text"> {task} </p>
                </div>
                <div className="buttons">
                    <button className="entryButton" onClick={handleCancel}>
                        <i className="material-icons todo-entry-icon">close_small</i> 
                    </button>
                    <button className="entryButton" onClick={handleMoreInfromationClick}>
                        <i className="material-icons todo-entry-icon"> {isMoreChecked ? "keyboard_arrow_up" : "keyboard_arrow_down"} </i>
                    </button>

                </div>
            </div>
        );
    } else {
        return null;
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