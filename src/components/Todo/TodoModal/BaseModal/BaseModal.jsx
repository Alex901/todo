import React, { useEffect, useRef } from "react";
import ReactModal from 'react-modal';
import { TextField, Button, InputAdornment, IconButton } from '@mui/material';
import "./BaseModal.css";

ReactModal.setAppElement('#root');

const BaseModal = ({ isTabs, isOpen, onRequestClose, title, children, ...props }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOverlayClick = (event) => {
      if (event.target === overlayElement) {
        onRequestClose();
      }
    };


    const overlayElement = document.querySelector('.modal-overlay');

    if (isOpen && overlayElement) {
      overlayElement.addEventListener('click', handleOverlayClick);
    }

    return () => {
      if (overlayElement) {
        overlayElement.removeEventListener('click', handleOverlayClick);
      }
    };
  }, [isOpen, onRequestClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Set focus to the modal when it opens
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={title}
      className="modal-content"
      overlayClassName="modal-overlay"
      shouldCloseOnOverlayClick={true}
    >
        <div className={` ${isTabs ? 'modal-header-tabs' : 'modal-header'}`}>
        <h2 className="modal-title">{title}</h2>
        <button className="modal-close-button" onClick={onRequestClose}>&times;</button>
      </div>
      <div className="modal-body">
        {children}
      </div>
    </ReactModal>
  );
};

export default BaseModal;