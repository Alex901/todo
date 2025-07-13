import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import './HeaderModal.css';
import { useUserContext } from '../../../../contexts/UserContext';
import { toast } from 'react-toastify';
import { TextField, Button, InputAdornment, IconButton } from '@mui/material';
import Icon from '@mdi/react';
import { mdiEye, mdiEyeOff, mdiGoogle, mdiFacebook, mdiGit } from '@mdi/js';
import BaseModal from '../../../Todo/TodoModal/BaseModal/BaseModal';
import TermsModal from '../../../Todo/TodoModal/OfflineModals/TermsModal/TermsModal';
import PrivacyModal from '../../../Todo/TodoModal/OfflineModals/PrivacyModal/PrivacyModal';


ReactModal.setAppElement('#root');

const LoginModal = ({ isOpen, onRequestClose, openLoginModal }) => {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [repeatPassword, setRepeatPassword] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [emailError, setEmailError] = React.useState("");
    const [passwordError, setPasswordError] = React.useState("");
    const { registerNewUser } = useUserContext();
    const [usernameError, setUserNameError] = React.useState("");
    const [isTermsModalOpen, setIsTermsModalOpen] = React.useState(false);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = React.useState(false);

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

    const handleConfirmPasswordChange = (e) => {
        setRepeatPassword(e.target.value);
        if (e.target.value !== password) {
            setPasswordError("Passwords do not match");
        } else {
            setPasswordError("");
        }
    }

    const handleRegister = (event) => {
        event.preventDefault();

        if (username === "" || email === "" || password === "" || repeatPassword === "") {
            toast.error("All fields needs to be filled out");
            return;
        }

        if (emailError === "" && passwordError === "") {
            const userData = { username: username, email: email, password: password };
            console.log("RegisterModal> handleregister: ", userData);
            registerNewUser(userData);
            toast.success(`Registration successfull!`);
            setEmail("");
            setUsername("");
            setPassword("");
            setRepeatPassword("");
            onRequestClose();
        } else {
            return;
        }
    };

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (!validateEmail(e.target.value)) {
            setEmailError("Invalid email address");
        } else {
            setEmailError("");
        }
    }

    return (
        <BaseModal
            isOpen={isOpen}
            onRequestClose={() => { toast.warn("registration canceled"); onRequestClose(); }}
            contentLabel="Register Modal"
            className="register-modal-content"
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
            title={'Register'}
        >

            <form className='modal-form' onSubmit={handleRegister}>
                <TextField
                    id="email"
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={handleEmailChange}
                    className="modal-input"
                    placeholder="Your email address(not used currently)"
                    autoFocus
                />
                {emailError && <p className="error">{emailError}</p>}
                <TextField
                    id="username"
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="modal-input"
                />

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
                                    sx={{
                                        right: 0,
                                        backgroundColor: 'transparent',
                                    }}
                                >
                                    {showPassword ? <Icon path={mdiEye} size={1} /> : <Icon path={mdiEyeOff} size={1} />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />

                <TextField
                    id="repeatPassword"
                    label="Repeat Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    value={repeatPassword}
                    onChange={handleConfirmPasswordChange}
                    className="modal-input"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                    sx={{
                                        right: 0,
                                        backgroundColor: 'transparent',
                                    }}
                                >
                                    {showPassword ? <Icon path={mdiEye} size={1} /> : <Icon path={mdiEyeOff} size={1} />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                {passwordError && <p className="error">{passwordError}</p>}
                <button className='modal-button register-button'>Continue</button>
            </form>
            <div className="terms-and-privacy">
                <p style={{ fontSize: '0.9em', color: 'gray', marginTop: '10px' }}>
                    By registering, you agree to our
                    <span
                        onClick={() => setIsTermsModalOpen(true)}
                        style={{ color: 'blue', textDecoration: 'underline', marginLeft: '5px', cursor: 'pointer' }}
                    >
                    Terms of Service 
                    </span>
                     {' '}and
                    <span
                        onClick={() => setIsPrivacyModalOpen(true)}
                        style={{ color: 'blue', textDecoration: 'underline', marginLeft: '5px', cursor: 'pointer' }}
                    >
                        Privacy Policy
                    </span>.
                </p>
            </div>
            <div className="already-account-area">
                <p className="already-account-message">
                    Already have an account? Login <span onClick={openLoginModal} className="login-link-highlight"> here</span>
                </p>
            </div>
            <TermsModal
                isOpen={isTermsModalOpen}
                onRequestClose={() => setIsTermsModalOpen(false)}
            />
            <PrivacyModal
                isOpen={isPrivacyModalOpen}
                onRequestClose={() => setIsPrivacyModalOpen(false)}
            />
        </BaseModal>
    );
}

export default LoginModal;