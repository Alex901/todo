import React from "react";
import './TodoEntry.css'
import PropTypes from 'prop-types';

const TodoEntry = ({ type }) => {

    return (
        <div className="todo-entry">
            {type === 'todo' ? (
                // Render todo entry
                <div className="todo-item">
                    <div className="time">
                    <p className="time-stamp"> time stamp: </p>
                    </div>
                    <p className="todo-text"> todo item</p>
                </div>
            ) : type === 'done' ? (
                // Render done entry
                <div className="done-item">
                    <div className="time">
                        <p className="completed"> Completed: </p>
                        <p className="time-to-complete"> Duration </p>
                    </div>
                    <p className="done-text"> done item</p>
                </div>
            ) : (
                // Render default entry if type is neither 'todo' nor 'done'
                <div className="default-item">
                    You fucked up mister!
                </div>
            )}
        </div>
    );
}


TodoEntry.prototype = {
    type: PropTypes.string.isRequired,
    contentList: PropTypes.array.isRequired,
    children: PropTypes.node
}

export default TodoEntry;