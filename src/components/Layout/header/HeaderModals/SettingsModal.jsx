import React, { useState } from 'react';
import { Tab, Tabs, Box, TextField, Button, Avatar, Grid, Typography } from '@mui/material';
import { useUserContext } from '../../../../contexts/UserContext';
import './HeaderModal.css';
import ReactModal from 'react-modal';

const SettingsModal = ({ open, onClose }) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const { loggedInUser, setLoggedInUser, updateProfilePicture } = useUserContext();
    const [hasChanges, setHasChanges] = useState(false);
    const [formData, setFormData] = useState({...loggedInUser});
    const [imageSizeError, setImageSizeError] = useState('');

    const MAX_SIZE = 1 * 1024 * 1024; // 1MB

    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
        setHasChanges(true);
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if(file.size > MAX_SIZE) {
            setImageSizeError('File size is too large. Please upload an image less than 1MB');
            return;
        } else {
            setImageSizeError('');
        }
        updateProfilePicture(file);
    }

    const handleInputChange = (event) => {
        setHasChanges(true);
       // console.log("DEBUG: loggedInUser before: ",formData);
       console.log("DEBUG: event.target.name: ",event.target.name);
       console.log("DEBUG: event.target.value: ",event.target.value);
       console.log("DEBUG: loggedInUser: ",loggedInUser);
        setFormData({
            ...loggedInUser,
            [event.target.name]: event.target.value
        })

      //  console.log("DEBUG: loggedInUser after: ",loggedInUser);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setHasChanges(false);

        // TODO: Remember to reset the form data after saving
    }

    return (
        <ReactModal isOpen={open} onRequestClose={onClose} className="register-modal-content" overlayClassName="modal-overlay">
            {loggedInUser.role === 'admin' && (
                <Tabs value={selectedTab} onChange={handleChange} className="modal-form">
                    <Tab label={"Profile"} />
                    <Tab label="Admin" />
                </Tabs>
            )}
            {selectedTab === 0 && (

                <form className="modal-form" onSubmit={handleSubmit}>
                    <h3 style={{ margin: 0 }}>User Profile</h3>
                    <label htmlFor="avatar-upload">
                        <input
                            type="file"
                            id="avatar-upload"
                            style={{ display: 'none' }}
                            onChange={handleAvatarChange} 
                        />
                        <Avatar src={loggedInUser?.profilePicture || ''} name="profilePicture" className="modal-input" style={{ width: '100px', height: '100px', cursor: 'pointer' }} />
                    </label>
                    <p className='error'>{imageSizeError}</p>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '10px' }}>
                        <TextField label="Email" name="email" value={formData.email} className="modal-input" disabled={true} onChange={handleInputChange}/>
                        <TextField label="Username" name="username" value={formData.username} className="modal-input" onChange={handleInputChange}/>
                    </div>
                    <button type="submit" className="modal-button" disabled={!hasChanges}>Save</button>
                </form>
            )}
            {selectedTab === 1 && loggedInUser.role === 'admin' && (
                <Box className="modal-form">
                    <button className="modal-button">Add User</button>
                    {/* Add admin tools here */}
                </Box>
            )}
        </ReactModal>
    );
}

export default SettingsModal;