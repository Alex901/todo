import React, { useState, useRef, useEffect } from 'react';
import './UserAvatar.css'; // Import the CSS file for styling
import { useUserContext } from '../../../../contexts/UserContext';
import { toast } from "react-toastify";
import SettingsModal from '../HeaderModals/SettingsModal';
import FeedbackModal from '../HeaderModals/FeedbackModal';

const UserAvatar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { loggedInUser, logout, isLoggedIn } = useUserContext();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  const handleDocumentClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('click', handleDocumentClick);
    } else {
      document.removeEventListener('click', handleDocumentClick);
    }

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    logout();
    toast.success("Bye, see you soon!");
  }

  const openSettingsModal = (event) => {
    event.preventDefault();
    setIsSettingsModalOpen(true);
    setIsDropdownOpen(false);
  }

  const openFeedbackModal = (event) => {
    event.preventDefault();
    setIsFeedbackModalOpen(true);
    setIsDropdownOpen(false);
  }

  const onRequestClose = () => {
    console.log('DEBUG -- onRequestClose called');
    setIsFeedbackModalOpen(false);
    setIsSettingsModalOpen(false);
   
  }

  return (
    <div className="user-avatar-container">
      <nav className="navigation">
        {/* Add your navigation links/icons here */}
      </nav>

      <div className="user-info" ref={dropdownRef}>
        <button className="avatar-button" onClick={toggleDropdown} id="dropdownAvatarNameButton">
          <img src={loggedInUser.profilePicture} className="avatar" style={{borderRadius: '50%'}} />
          {loggedInUser && <span className="username">{loggedInUser.username}</span>}
          <svg className={`arrow-icon ${isDropdownOpen ? 'rotate' : ''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
          </svg>
        </button>

        <div className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`} id="dropdownAvatarName">
          <div className="user-details">
            <div className="user-role"> {loggedInUser.role} </div>
            <div className="user-somethingcool"> something cool </div>
          </div>
          <hr></hr>

            <a onClick={openSettingsModal} className="menu-link">Settings</a>
            <a onClick={openFeedbackModal} className="menu-link">Feedback</a>
            <a href="#" className="menu-link">Help</a>
          <hr></hr>
          <div className="logout">
          <a href="#" className="menu-link" onClick={handleLogout}>Logout</a>
          </div>
        </div>
      </div>
      {loggedInUser && <SettingsModal isOpen={isSettingsModalOpen} onClose={onRequestClose} />}
      {loggedInUser && <FeedbackModal isOpen={isFeedbackModalOpen} onClose={onRequestClose} />}
    </div>
  );
};

export default UserAvatar;