import React, { useState } from 'react';
import './UserAvatar.css'; // Import the CSS file for styling
import { useUserContext } from '../../../../contexts/UserContext';
import { toast } from "react-toastify";

const UserAvatar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { loggedInUser, logout, isLoggedIn } = useUserContext();

  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  const handleLogout = () => {
    logout();
    toast.success("Bye, see you soon!");
  }

  return (
    <div className="user-avatar-container">
      <nav className="navigation">
        {/* Add your navigation links/icons here */}
      </nav>

      <div className="user-info">
        <button className="avatar-button" onClick={toggleDropdown} id="dropdownAvatarNameButton">
          <img src="https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png" className="avatar" style={{borderRadius: '50%'}} />
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

            <a href="#" className="menu-link">Settings</a>
            <a href="#" className="menu-link">Feedback</a>
            <a href="#" className="menu-link">Help</a>
          <hr></hr>
          <div className="logout">
          <a href="#" className="menu-link" onClick={handleLogout}>Logout</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAvatar;