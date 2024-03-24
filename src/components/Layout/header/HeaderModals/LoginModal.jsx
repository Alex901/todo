import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import './HeaderModal.css';
import { useUserContext } from '../../../../contexts/UserContext';
import { toast } from 'react-toastify';
import { TextField, Button, InputAdornment, IconButton } from '@mui/material';
import Icon from '@mdi/react';
import { mdiEye, mdiEyeOff } from '@mdi/js';

ReactModal.setAppElement('#root');

const LoginModal = ({ isOpen, onRequestClose }) => {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [userNameError, setUserNameError] = React.useState("");
    const [passwordError, setPasswordError] = React.useState("");
    const { login } = useUserContext();
    

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

    const handleLogin = (event) => {
        let isError = false;
        event.preventDefault();
        const userData = { username: username, password: password };
        if (!username.trim()) {
            setUserNameError("Username cannot be empty");
            isError = true;
        } 
        
        if (!password.trim()) {
            setPasswordError("Password cannot be empty");
            isError = true;
        }

        if (isError) {
            return;
        }

        login(userData);
        toast.success("Login successful");
        setUsername("");
        setPassword("");
        onRequestClose();
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Login Modal"
            className="register-modal-content"
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
        >
            <h3 className="title">Login</h3>
            <form className='modal-form' onSubmit={handleLogin}>
                <TextField
                    id="username"
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={e => { setUsername(e.target.value); setPasswordError(""); setUserNameError(""); }}
                    className="modal-input"
                    autoFocus
                />
                    {userNameError && <p className='error'>{userNameError}</p>}
                <TextField
                    id="password"
                    label="Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="modal-input"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <Icon path={mdiEyeOff} size={1} /> : <Icon path={mdiEye} size={1} />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    
                />
                {passwordError && <p className='error'>{passwordError}</p>}
                <button className='modal-button'>Login</button>
            </form>
        </ReactModal>
    );
}

export default LoginModal;