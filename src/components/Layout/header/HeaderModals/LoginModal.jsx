import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import './HeaderModal.css';
import { useUserContext } from '../../../../contexts/UserContext';
import { toast } from 'react-toastify';

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
        // console.log("LoginModal> handleLogin: ", userData);
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
        toast.success(`welcome back ${username}!`); 
        setUsername("");
        setPassword("");
        onRequestClose();
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Login Modal"
            className="modal-content"
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
        >
            <h3 className="title">Login</h3>
            <form className='modal-form' onSubmit={handleLogin}>
                <input
                    type="text"
                    value={username}
                    onChange={e => { setUsername(e.target.value); setPasswordError(""); setUserNameError(""); }}
                    className="modal-input"
                    placeholder="Username"
                    autoFocus
                />
                {userNameError && <p className='error'>{userNameError}</p>}
                <div className='password-container'>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="modal-input"
                        placeholder="Password"
                    />
                   
                    <button className='show-password-button' type="button" onClick={() => setShowPassword(!showPassword)}>
                        <i className="material-icons show-password-icon">
                            {showPassword ? "visibility_off" : "visibility"}
                        </i>
                    </button> 
                </div>
                {passwordError && <p className='error'>{passwordError}</p>}
                <button className='modal-button'>Login</button>
            </form>
        </ReactModal>
    );
}

export default LoginModal;