import React, { useState } from 'react';
import './UserAvatar.css'; // Import the CSS file for styling
import { useUserContext } from '../../../../contexts/UserContext';
import { toast } from "react-toastify";
import SettingsModal from '../HeaderModals/SettingsModal';

const UserAvatar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { loggedInUser, logout, isLoggedIn } = useUserContext();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  const handleLogout = () => {
    logout();
    toast.success("Bye, see you soon!");
  }

  const openSettingsModal = (event) => {
    event.preventDefault();
    setIsSettingsModalOpen(true);
  }

  const onRequestClose = () => {
    setIsSettingsModalOpen(false);
  }

  return (
    <div className="user-avatar-container">
      <nav className="navigation">
        {/* Add your navigation links/icons here */}
      </nav>

      <div className="user-info">
        <button className="avatar-button" onClick={toggleDropdown} id="dropdownAvatarNameButton">
          <img src={loggedInUser.profilePicture} className="avatar" style={{borderRadius: '50%'}} />
          {loggedInUser && <span className="username">{loggedInUser.username}</span>}
          <svg className={`arrow-icon ${isDropdownOpen ? 'rotate' : ''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
          </svg>
        </button>

        <div className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`} id="dropdownAvatarName">
          <div className="user-details">
            <div className="user-type"> {loggedInUser.role} </div>
            <div className="user-somethingcool"> something cool </div>
          </div>
          <hr></hr>

            <a onClick={openSettingsModal} className="menu-link">Settings</a>
            <a href="#" className="menu-link">Feedback</a>
            <a href="#" className="menu-link">Help</a>
          <hr></hr>
          <div className="logout">
          <a href="#" className="menu-link" onClick={handleLogout}>Logout</a>
          </div>
        </div>
      </div>
      {loggedInUser && <SettingsModal open={isSettingsModalOpen} onClose={onRequestClose} />}
    </div>
  );
};

export default UserAvatar;