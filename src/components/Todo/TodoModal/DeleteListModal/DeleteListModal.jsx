import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import './DeleteListModal.css';

ReactModal.setAppElement('#root');

const DeleteListModal = ({ isOpen, onRequestClose, listName, onDelete, onCancel, errorMessage }) => {


    //This is an experiment by the way. I'm not sure if it's going to work
    useEffect(() => {
        const handleOverlayClick = (event) => {
            if (event.target.className === 'modal-overlay') {
                onRequestClose();
            }
        };

        if (isOpen) {
            document.addEventListener('click', handleOverlayClick);
        }

        return () => {
            document.removeEventListener('click', handleOverlayClick);
        };
    }, [isOpen, onRequestClose]);

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Delete List Modal"
            className="modal-content"
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
        >
            <div className='modalTitle'> <h3 className="title"> Delete List </h3></div>
            <p className="message">Are you sure you want to delete <strong> {listName} </strong>?</p>
            <p className='error'>{errorMessage}</p>
            <div className="modal-buttons">
                <button onClick={onDelete} className='modal-button delete-button'> Delete </button>
                <button onClick={onCancel} className='modal-button cancel-button'> Cancel </button>
            </div>
        </ReactModal>
    );
}

export default DeleteListModal;