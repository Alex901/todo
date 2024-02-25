import React, { useState } from 'react';
import ReactModal from 'react-modal';
import './TodoModal.css'
import { useTodoContext } from '../../../contexts/todoContexts';

ReactModal.setAppElement('#root');

const TodoModal = ({ isOpen, onRequestClose }) => {
    const [taskName, setTaskName] = useState('');
    const { addTodo } = useTodoContext();

    const handleInputChange = (event) => {
        setTaskName(event.target.value);
    };

    const handleSubmit = () => {
        console.log("Task name: ", taskName);
        addTodo(taskName);
        setTaskName('');
        onRequestClose();
    }

    const handleKeyPress = (e) => {
        if(e.key === 'Enter'){
            handleSubmit();
        }
    }

    return (

        <ReactModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add new todo task"
            className="modal-content"
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
        >
            <input
                type='text'
                placeholder='Enter task name'
                value={taskName}
                onChange={handleInputChange}
                className='modal-input'
                onKeyDownCapture={handleKeyPress}
            />
            <button onClick={handleSubmit} className='modal-button'> Submit </button>
        </ReactModal>

    )
}

export default TodoModal;