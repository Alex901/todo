import React, { useEffect, useState } from 'react';
import { Tab, Tabs, Box, TextField, Button, Avatar, Grid, Typography, MenuItem, Select } from '@mui/material';
import { useUserContext } from '../../../../contexts/UserContext';
import { useFeedbackContext } from '../../../../contexts/FeedbackContext';
import './HeaderModal.css';
import ReactModal from 'react-modal';
import ChangePassword from '../../ChangePassword/ChangePassword';
import SettingsList from '../SettingsList/SettingsList';
import UserListEntry from '../UserListEntry/UserListEntry';
import FeedbackListEntry from './FeedbackListEntry/FeedbackListEntry';
import AdminPopper from './AdminPopper/AdminPopper';

const SettingsModal = ({ isOpen, onClose }) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const { loggedInUser, updateProfilePicture, editUser, userList, deleteUser } = useUserContext();
    const [hasChanges, setHasChanges] = useState(false);
    const [formData, setFormData] = useState({ });
    const { feedbackList } = useFeedbackContext();
    const [imageSizeError, setImageSizeError] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [popperOpen, setPopperOpen] = useState(false);
    const [popperMode, setPopperMode] = useState('');

    useEffect(() => {
        if (loggedInUser) {
          setFormData({ ...loggedInUser });
        }
      }, [loggedInUser]);

    const types = [...new Set(feedbackList.map(feedback => feedback.type))];

    const unresolvedFeedbackList = feedbackList ? feedbackList.filter(feedback => feedback.resolved === null) : [];

    const filteredFeedbackList = selectedType
        ? unresolvedFeedbackList.filter(feedback => feedback.type === selectedType)
        : unresolvedFeedbackList;

    const MAX_SIZE = 10 * 1024 * 1024; // 1MB

    const handleOpenPopper = (event, mode) => {
        setAnchorEl(event.currentTarget);
        setPopperMode(mode);
        setPopperOpen(true);
    };

    const handleClosePopper = () => {
        setPopperOpen(false);
        setAnchorEl(null);
    };

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
                <Tabs value={selectedTab} onChange={handleChange}>
                    <Tab label={"Profile"} />
                    <Tab label="Users(A)" />
                    <Tab label="Feedback(A)" />
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
                    <div
                        className="admin-user-buttons"
                        style={{
                            display: 'flex',
                            gap: '10px',
                            flexWrap: 'wrap',
                            flexDirection: window.innerWidth <= 600 ? 'column' : 'row',
                        }}
                    >
                        <button className="modal-button" onClick={(e) => handleOpenPopper(e, 'add-user')}>Add User</button>
                        <button className="modal-button" onClick={(e) => handleOpenPopper(e, 'invite-user')}>Invite User</button>
                    </div>
                    <SettingsList
                        items={userList}
                        renderItem={(user) => <UserListEntry user={user} />}
                    />

                </Box>
            )}
            <AdminPopper anchorEl={anchorEl} open={popperOpen} onClose={handleClosePopper} mode={popperMode} />

            {selectedTab === 2 && loggedInUser?.role === 'admin' && (
                <Box className={`modal-form ${selectedTab === 2 ? 'admin-modal' : ''}`}>
                    <Box className="settings-bar" >
                        <Select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            displayEmpty
                            sx={{ width: 140, margin: '10px' }}
                            size="small"
                        >
                            <MenuItem value="">
                                <em>All</em>
                            </MenuItem>
                            {types.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                    <SettingsList
                        items={unresolvedFeedbackList ? unresolvedFeedbackList : []}
                        renderItem={(feedback) => <FeedbackListEntry feedback={feedback} />}
                    />
                </Box>
            )}
        </ReactModal>
    );
}

export default SettingsModal;