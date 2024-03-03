import React, { useEffect} from 'react';
import ReactModal from 'react-modal';
import './ConfirmationModal.css';

ReactModal.setAppElement('#root');

const ConfirmationModal = ({ isOpen, onRequestClose, message, onConfirm, onClose }) => {


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
            contentLabel="Confirmation Modal"
            className="modal-content"
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
        >
            <div className='modalTitle'> <h3 className="title"> Notification </h3></div>
            <p className="message">{message}</p>
            <div className="modal-buttons">
                <button onClick={onConfirm} className='modal-button confirm-button'> Confirm </button>
                <button onClick={onClose} className='modal-button cancel-button'> Cancel </button>
            </div>
        </ReactModal>
    );
}

export default ConfirmationModal;