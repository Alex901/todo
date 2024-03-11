import React, { useState, useRef, useEffect } from 'react';
import ReactModal from 'react-modal';
import './TodoModal.css'
import { useTodoContext } from '../../../contexts/todoContexts';

ReactModal.setAppElement('#root');

const TodoModal = ({ isOpen, onRequestClose }) => {
    const [taskName, setTaskName] = useState('');
    const { addTodo } = useTodoContext();
    const inputRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState('');
/*     useEffect(() => {
        console.log("isOpen: ", isOpen);
        console.log("inputRef: ", inputRef);
        if(isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    },[isOpen]); */

    const handleInputChange = (event) => {
        setTaskName(event.target.value);
        setErrorMessage('');
    };

    const handleSubmit = () => {
        console.log("Task name: ", taskName);
        if(!taskName.trim()) {
            setErrorMessage('Task name cannot be empty');
            return;
        }

        addTodo(taskName);
        setTaskName('');
        onRequestClose();
        setErrorMessage('');
    }

    const handleKeyPress = (e) => {
        if(e.key === 'Enter'){
            handleSubmit();
            onrejectionhandled();
            setErrorMessage('');
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
            <div className='modalTitle'> <h3 className="title"> Create task </h3></div>

            <input
                type='text'
                placeholder='Enter task name'
                value={taskName}
                onChange={handleInputChange}
                className='modal-input'
                onKeyDownCapture={handleKeyPress}
                autoFocus
            />
             {errorMessage && <p className="error">{errorMessage}</p>}
            <button onClick={handleSubmit} className='modal-button'> Submit </button>
        </ReactModal>

    )
}

export default TodoModal;