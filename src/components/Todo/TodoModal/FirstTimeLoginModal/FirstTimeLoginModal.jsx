import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, IconButton, InputAdornment, Typography } from '@mui/material';
import Icon from '@mdi/react';
import { mdiEye, mdiEyeOff, mdiCheckCircle } from '@mdi/js';
import { useUserContext } from '../../../../contexts/UserContext';
import './FirstTimeLoginModal.css';

const FirstTimeLoginModal = ({ open, onClose }) => {
    const { editUser, loggedInUser, userList, logout } = useUserContext();
    const [username, setUsername] = useState(loggedInUser?.username || ' ');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    console.log("LoggedInUser:", loggedInUser);
    

    const handleUsernameChange = (event) => {
        const value = event.target.value;
        setUsername(value);

        // Filter out the logged-in user from the user list
        const filteredUserList = userList.filter(user => user.username.toLowerCase() !== loggedInUser?.username.toLowerCase());

        // Check if the username is already taken in the filtered list
        if (filteredUserList.some(user => user.username.toLowerCase() === value.toLowerCase())) {
            setUsernameError('Username is already taken');
        } else {
            setUsernameError('');
        }
    };

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;

        if (name === 'newPassword') {
            setNewPassword(value);
        } else if (name === 'confirmPassword') {
            setConfirmPassword(value);
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match');
        } else {
            setPasswordError('');
        }
    };

    useEffect(() => {
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match');
        } else {
            setPasswordError('');
        }
    }, [newPassword, confirmPassword]);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (username === ''  || newPassword === '' || confirmPassword === '') {
            setError('All fields are required');
            return;
        }
        if (usernameError || passwordError) {
            setError('Please fix the errors before submitting');
            return;
        }

        try {
            const response = await editUser({ username }, oldPassword, newPassword);
            if (response.status === 200) {
                onClose();
            }
        } catch (error) {
            setError('Wrong password, please try again');
        }
    };

    return (
        <Modal open={open} onClose={onClose} BackdropProps={{ onClick: (e) => e.stopPropagation() }}>
            <Box className="modal-box">
                <Box display="flex" justifyContent="center" padding="8px">
                    <Typography variant="h5" component="h2" gutterBottom>
                        Welcome, let's get you started
                    </Typography>
                </Box>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Select Desired Username"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={handleUsernameChange}
                        error={!!usernameError}
                        helperText={usernameError}
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        label="Old Password"
                        variant="outlined"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        value={loggedInUser?.googleRegistration ? loggedInUser.password : oldPassword} 
                        onChange={(e) => setOldPassword(e.target.value)}
                        style={{
                            marginBottom: '10px',
                            display: loggedInUser?.googleRegistration ? 'none' : 'block', // Conditionally hide the field
                        }}

                    />
                    <TextField
                        label="New Password"
                        variant="outlined"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        name="newPassword"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        style={{ marginBottom: '10px' }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {showPassword ? <Icon path={mdiEye} size={1} /> : <Icon path={mdiEyeOff} size={1} />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Repeat New Password"
                        variant="outlined"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handlePasswordChange}
                        style={{ marginBottom: '10px' }}
                    />
                    {passwordError && <div className="error-message">{passwordError}</div>}
                    {error && <div className="error-message">{error}</div>}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            style={{ backgroundColor: 'var(--success-color)', color: 'white', marginTop: '10px' }}
                            disabled={!!error || !!usernameError || !!passwordError}
                        >
                            Let's go
                        </Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
};

export default FirstTimeLoginModal;