import React, { useEffect, useState } from 'react';
import { Tab, Tabs, Box, TextField, Button, Avatar, Grid, Typography } from '@mui/material';
import { useUserContext } from '../../../../contexts/UserContext';
import './HeaderModal.css';
import ReactModal from 'react-modal';
import ChangePassword from '../../ChangePassword/ChangePassword';

const SettingsModal = ({ isOpen, onClose }) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const { loggedInUser, updateProfilePicture, editUser } = useUserContext();
    const [hasChanges, setHasChanges] = useState(false);
    const [formData, setFormData] = useState({ ...loggedInUser });
    const [imageSizeError, setImageSizeError] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');

    const MAX_SIZE = 1 * 1024 * 1024; // 1MB

    useEffect(() => {
        const handleOverlayClick = (event) => {
            if (event.target.className === 'modal-overlay') {
                onClose();
            }
        };
    
        if (open) {
            document.addEventListener('click', handleOverlayClick);
            document.addEventListener('touchend', handleOverlayClick);
        }
    
        return () => {
            document.removeEventListener('click', handleOverlayClick);
            document.removeEventListener('touchend', handleOverlayClick);
        };
    }, [open, onClose]);

    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
        setHasChanges(true);
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file.size > MAX_SIZE) {
            setImageSizeError('File size is too large. Please upload an image less than 1MB');
            return;
        } else {
            setImageSizeError('');
        }
        updateProfilePicture(file);
    }

    const handleInputChange = (event) => {
        // console.log("DEBUG: loggedInUser before: ",formData);
        const newValue = event.target.value;
        const initialValue = loggedInUser[event.target.name];

        if (initialValue === newValue) {
            setHasChanges(false);
        } else {
            setHasChanges(true);
        }

        setFormData({
            ...loggedInUser,
            [event.target.name]: event.target.value
        })

        //  console.log("DEBUG: loggedInUser after: ",loggedInUser);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        editUser(formData, oldPassword, newPassword);
        setHasChanges(false);
        onClose();
    }

    const handlePasswordChange = (newPaswsword, oldPassword) => {
        setNewPassword(newPaswsword);
        setOldPassword(oldPassword);
    }

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="register-modal-content"
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
        >

            {loggedInUser?.role === 'admin' && (
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
                        <TextField label="Email" name="email" value={formData.email} className="modal-input" disabled={true} onChange={handleInputChange} />
                        <TextField label="Username" name="username" value={formData.username} className="modal-input" onChange={handleInputChange} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
                        <ChangePassword hasChanges={hasChanges} setHasChanges={setHasChanges} onPasswordChange={handlePasswordChange} />
                    </div>
                    <button type="submit" className="modal-button" disabled={!hasChanges}>Save</button>
                </form>
            )}
            {selectedTab === 1 && loggedInUser?.role === 'admin' && (
                <Box className="modal-form">
                    <button className="modal-button">Add User</button>
                    {/* Add admin tools here */}
                </Box>
            )}
        </ReactModal>
    );
}

export default SettingsModal;