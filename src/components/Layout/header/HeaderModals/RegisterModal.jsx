import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import './HeaderModal.css';
import { useUserContext } from '../../../../contexts/UserContext';
import { toast } from 'react-toastify';

ReactModal.setAppElement('#root');

const LoginModal = ({ isOpen, onRequestClose }) => {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [repeatPassword, setRepeatPassword] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [emailError, setEmailError] = React.useState("");
    const [passwordError, setPasswordError] = React.useState("");
    const { registerNewUser } = useUserContext();
    const [usernameError, setUserNameError] = React.useState("");

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

        if(emailError === "" && passwordError === "") {
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
        <ReactModal
            isOpen={isOpen}
            onRequestClose={() => { toast.warn("registration canceled"); onRequestClose(); }}
            contentLabel="Register Modal"
            className="modal-content"
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
        >
            <h3 className="title">Register</h3>
            <form className='modal-form' onSubmit={handleRegister}>
                <input
                    type="text"
                    value={email}
                    onChange={handleEmailChange}
                    className="modal-input"
                    placeholder="Your email adress(not used currently)"
                    autoFocus
                />
                {emailError && <p className="error">{emailError}</p>}
                <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="modal-input"
                    placeholder="Username"
                />
                <div className='password-container'>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="modal-input"
                        placeholder="Select password"
                    />
                    <button className='show-password-button' type="button" onClick={() => setShowPassword(!showPassword)}>
                        <i className="material-icons show-password-icon">
                            {showPassword ? "visibility_off" : "visibility"}
                        </i>
                    </button>
                </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={repeatPassword}
                        onChange={handleConfirmPasswordChange}
                        className="modal-input"
                        placeholder="repeat password"
                    />
                     {passwordError && <p className="error">{passwordError}</p>}
                <button className='modal-button register-button'>Continue</button>
            </form>
        </ReactModal>
    );
}

export default LoginModal;