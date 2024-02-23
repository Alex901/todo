import React, { useState } from 'react';
import ReactModal from 'react-modal';
import './TodoModal.css'

ReactModal.setAppElement('#root');

const TodoModal = ({ isOpen, onRequestClose }) => {
    const [taskName, setTaskName] = useState('');

    const handleInputChange = (event) => {
        setTaskName(event.target.value);
    };

    const handleSubmit = () => {
        console.log("Task name: ", taskName);
        onRequestClose();
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
            />
            <button onClick={handleSubmit} className='modal-button'> Submit </button>
        </ReactModal>
        
    )
}

export default TodoModal;