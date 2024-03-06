import React, { useState } from "react";
import './TodoEntry.css'
import PropTypes from 'prop-types';
import { useTodoContext } from "../../../contexts/todoContexts";
import TodoModal from "../TodoModal/TodoModal";
import ConfirmationModal from "../TodoModal/ConfirmationModal/ConfirmationModal";

const TodoEntry = ({ type, todoData, onEdit }) => {
    const { id, isDone, task, created, completed, started, isStarted } = todoData;
    const { removeTodo, toggleTodoComplete, toggleTodoStart, getDoingCount, cancelTodo } = useTodoContext();
    const [isMoreChecked, setIsMoreChecked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    //console.log(todoData);

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
        console.log("doing count: ", getDoingCount())
        if (getDoingCount() > 2) {
            setIsModalOpen(true);
        } else {
            toggleTodoStart(id);
        }

    }

    const handleCancel = () => {
        cancelTodo(id);
    }

    //Confirmation modal functions

    const cancelConfirm = () => {
        setIsModalOpen(false);
    }

    const confirmStart = () => {
        toggleTodoStart(id);
    }

    const addLineBreak = (str) =>
        str.split('\n').map((subStr) => {
            return (
                <>
                    {subStr}
                    <br />
                </>
            );
        });



    //TODO: this is not pretty, make commonTodoEntry component and use it on all cases. 
    //Making changes on three places is not good practice and confusing in the long run.

    if (type === 'todo' && !isDone && !isStarted) {
        // console.log(todoData);
        return (
            <div className="todo-entry">

                <div className="todo-item" onClick={handleClickToStart}>
                    <div className="time">
                        <p className="time-stamp"> <strong>Created:</strong> {created.toLocaleDateString()} - {created.toLocaleTimeString()} </p>
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

                <ConfirmationModal
                    onRequestClose={cancelConfirm}
                    isOpen={isModalOpen}
                    onConfirm={confirmStart}
                    onClose={cancelConfirm}
                    message={addLineBreak(`You are already working on ${getDoingCount()} tasks already,
                    and "${task}" is estemated to be a difficult task.\n\nAre you sure you wish to proceed?
                    `)}
                />
            </div>


        )
    } else if (type === 'done' && isDone && isStarted) {

        const durationMS = completed.getTime() - started.getTime();
        const remainingMS = durationMS > 0 ? durationMS : 0;
        const seconds = Math.floor(remainingMS / 1000);
        const remainingSeconds = seconds % 60;
        const remainingMinutes = Math.floor(seconds / 60) % 60;
        const remainingHours = Math.floor((seconds / 3600) % 24);
        const remainingDays = Math.floor((seconds / 3600 / 24));

        return (
            <div className="todo-entry">
                <div className="done-item">
                    <div className="time">
                        <p className="time-stamp"> <strong>Completed:</strong>
                            {completed.toLocaleDateString()} - {completed.toLocaleTimeString()}
                        </p>
                        <div className="separator"> </div>
                        <p className="time-stamp">
                            <strong> Duration: </strong>
                            {remainingDays > 0 && `${remainingDays}D:`}
                            {remainingHours > 0 && `${remainingHours}H:`}
                            {remainingMinutes > 0 && `${remainingMinutes}M:`}
                            {remainingSeconds}S:
                        </p>
                    </div>
                    <div className="checkbox-and-task">
                        <input className="checkbox-c" type="checkbox" defaultChecked={isDone} />
                        <p className="done-text"> {task} </p>
                    </div>
                </div>
                <div className="buttons">
                    <button className="deleteButton entryButton" onClick={handleDelete}>
                        <i className="material-icons todo-entry-icon">delete</i>
                    </button>
                    <button className="entryButton" onClick={handleMoreInfromationClick}>
                        <i className="material-icons todo-entry-icon"> {isMoreChecked ? "keyboard_arrow_up" : "keyboard_arrow_down"} </i>
                    </button>
                </div>
            </div>
        )

    } else if (type === 'doing' && isStarted && !isDone) {
        return (
            <div className="todo-entry">
                <div className="todo-item doing-item" onClick={handleClicktoComplete}>
                    <div className="time">
                        <p className="time-stamp"> <strong>Started:</strong> {started.toLocaleDateString()} - {started.toLocaleTimeString()} </p>
                    </div>
                    <p className="doing-text"> {task} </p>
                </div>
                <div className="buttons">
                    <button className="deleteButton entryButton" onClick={handleDelete}>
                        <i className="material-icons todo-entry-icon">delete</i>
                    </button>
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
        sterted: PropTypes.instanceOf(Date),
        IsStarted: PropTypes.bool
    }).isRequired,
    type: PropTypes.string.isRequired,
};

export default TodoEntry;