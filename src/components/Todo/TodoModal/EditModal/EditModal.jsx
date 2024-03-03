import React, { useState } from 'react';
import ReactModal from 'react-modal';
import './EditModal.css'
import { useTodoContext } from '../../../../contexts/todoContexts';

ReactModal.setAppElement('#root');

const EditModal = ({ isOpen, onRequestClose, editData }) => {
    const [taskName, setTaskName] = useState(editData.task);
    const { editTodo } = useTodoContext();

    const handleInputChange = (event) => {
        setTaskName(event.target.value);

    };

    const handleSubmit = () => {
        
        const updatedTaskData = {
            id: editData.id,
            task: taskName
        }
        editTodo(updatedTaskData);
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
            contentLabel="Edit todo task"
            className="modal-content"
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
        >
            <div className='modalTitle'> <h3 className="title"> Edit task </h3></div>
            <input
                type='text'
                placeholder='Enter task name'
                value={taskName}
                onChange={handleInputChange}
                className='modal-input'
                onKeyDownCapture={handleKeyPress}
            />
            <button onClick={handleSubmit} className='modal-button'> Save </button>
        </ReactModal>

    )
}

export default EditModal;