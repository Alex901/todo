import React, { useState } from 'react';
import ReactModal from 'react-modal';
import './CreateListModal.css';
import { useUserContext } from '../../../../contexts/UserContext';

ReactModal.setAppElement('#root');

const CreateListModal = ({ isOpen, onRequestClose }) => {
  const [listName, setListName] = useState('');
  const { addList } = useUserContext();
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    setListName(event.target.value);
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("List name: ", listName);
    if(!listName.trim()) {
      setError('List name cannot be empty');
      return;
    }
    setError('');
    addList(listName);
    setListName('');
    onRequestClose();
  }

  const handleKeyPress = (e) => {
    if(e.key === 'Enter'){
      handleSubmit(e);
      onRequestClose();
    }
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add new list"
      className="modal-content"
      overlayClassName="modal-overlay"
      shouldCloseOnOverlayClick={true}
      onChange={handleInputChange}
    >
      <div className='modalTitle'> <h3 className="title"> Create list </h3></div>

      <form className="create-list-form" onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Enter list name'
          value={listName}
          onChange={handleInputChange}
          className='modal-input'
          onKeyDownCapture={handleKeyPress}
          autoFocus
        />
        {error && <p className='error'>{error}</p>}
        <button type="submit" className='modal-button'> Submit </button>
      </form>
    </ReactModal>
  )
}

export default CreateListModal;