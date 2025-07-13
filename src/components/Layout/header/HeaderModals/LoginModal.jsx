import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import './HeaderModal.css';
import { useUserContext } from '../../../../contexts/UserContext';
import { toast } from 'react-toastify';
import { TextField, Button, InputAdornment, IconButton } from '@mui/material';
import Icon from '@mdi/react';
import { mdiEye, mdiEyeOff, mdiGoogle, mdiFacebook, mdiGit } from '@mdi/js';
import BaseModal from '../../../Todo/TodoModal/BaseModal/BaseModal';

ReactModal.setAppElement('#root');

const LoginModal = ({ isOpen, onRequestClose, openRegisterModal }) => {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [userNameError, setUserNameError] = React.useState("");
    const [passwordError, setPasswordError] = React.useState("");
    const { login, loginWithGoogle, loginWithFacebook, loginWithGithub } = useUserContext();


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

        setUsername("");
        setPassword("");
        onRequestClose();
    };

    const handleForgotPassword = (event) => {
        event.preventDefault();
        toast.info("This feature is not implemented yet. Please contact support for assistance.");
    }

    const handleLoginWithGoogle = async () => {
        loginWithGoogle();
    }

    const handleLoginWithFacebook = () => {
        loginwithFacebook();
    };

    const handleLoginWithGithub = () => {
        loginWithGithub();
    }

    return (
        <BaseModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Login Modal"
            className="register-modal-content"
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
            title={'Login'}
        >
            <form className='modal-form' onSubmit={handleLogin}>
                <TextField
                    id="username"
                    label="Mail or Username"
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
                                    {showPassword ? <Icon path={mdiEye} size={1} /> : <Icon path={mdiEyeOff} size={1} />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}

                />
                {passwordError && <p className='error'>{passwordError}</p>}
                <div className="forgot-password-link">
                    <a href="#" onClick={handleForgotPassword}>Forgot your password?</a>
                </div>
                <button className='modal-button login-button'>Login</button>
            </form>

            <div className="social-login-area">
                <p className="social-login-message">
                    Don't have an account yet? Get started with one <span onClick={openRegisterModal} className="register-link-highlight"> here</span>, or log in <strong> using one of your social medial accounts: </strong>
                </p>
                <p style={{ fontSize: '0.9em', color: 'gray', marginTop: '-5px' }}>
                    (If you don't already have an Habitforge account, this action will create one for you.)
                </p>
                <div className="social-icons-login">
                    <IconButton className="social-icon-login google">
                        <Icon path={mdiGoogle} size={1.5} onClick={handleLoginWithGoogle} />
                    </IconButton>
                    <IconButton className="social-icon-login facebook">
                        <Icon path={mdiFacebook} size={1.5} onClick={handleLoginWithFacebook} />
                    </IconButton>
                    <IconButton className="social-icon-login github">
                        <Icon path={mdiGit} size={1.5} onClick={handleLoginWithGithub} />
                    </IconButton>
                </div>
            </div>
        </BaseModal>
    );
}

export default LoginModal;