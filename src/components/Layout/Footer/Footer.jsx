import React, { useState } from 'react';
import './Footer.css';
import { TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import Icon from '@mdi/react';
import { mdiFacebook, mdiGit, mdiTwitter, mdiLinkedin } from '@mdi/js';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import { toast } from "react-toastify";
import { useFeedbackContext } from '../../../contexts/FeedbackContext';

const CustomTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'white',
        },
        '&:hover fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white',
        },
    },
});

const Footer = ({openAboutModal, openStoryModal, openInspirationModal, openLoginModal, openRegisterModal}) => {
    const theme = useTheme();
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [checkbox, setCheckbox] = useState(false);
    const { submitFeedback } = useFeedbackContext();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (email && !validateEmail(email)) {
            toast.error('Please enter a valid email address.');
            return;
        }

        const submitData = {
            message,
            from: email,
            mailingList: checkbox,
            subType: 'other',
            type: 'feedback'
        };

        submitFeedback(submitData);

        toast.success('Feedback submitted successfully!');

        setMessage('');
        setEmail('');
        setCheckbox(false);
    };

    const handleComingSoon = () => {
        alert('Coming soon');
    };

    return (
        <footer className="footer-main">
            <div className="social-icons">
                <Icon className="social-icon" path={mdiFacebook} size={1.7} />
                <Icon className="social-icon" path={mdiGit} size={1.7} />
                <Icon className="social-icon" path={mdiTwitter} size={1.7} />
                <Icon className="social-icon" path={mdiLinkedin} size={1.7} />
            </div>
            <hr className="footer-divider" />
            <div className="footer-content">
                <div className="footer-section">
                    <h5 className="category">Contact</h5>
                    <p>Email: info@habitforge.se</p>
                </div>
                <div className="footer-section">
                    <h5 className="category">Navigation</h5>
                    <p onClick={openAboutModal} style={{ cursor: 'pointer' }}>About</p>
                    <p onClick={openStoryModal} style={{ cursor: 'pointer' }}>Our story</p>
                    <p onClick={openLoginModal} style={{ cursor: 'pointer' }}>Login</p>
                    <p onClick={openRegisterModal} style={{ cursor: 'pointer' }}>Register</p>
                </div>
                <div className="footer-section">
                    <h5 className="category">Resources</h5>
                    <p onClick={handleComingSoon} style={{ cursor: 'pointer' }}>Downloads</p>
                    <p onClick={openInspirationModal} style={{ cursor: 'pointer' }}>Inspiration</p>
                    <p onClick={handleComingSoon} style={{ cursor: 'pointer' }}>Pre-made guides</p>
                </div>
                <div className="footer-form-container">
                    <h4>Get in touch!</h4>
                    <form className='footer-form' onSubmit={handleSubmit}>
                        <CustomTextField
                            label="Need support? Have a question or maybe you just want to say 'hi'"
                            value={message}
                            variant="outlined"
                            size="small"
                            multiline
                            rows={3}
                            fullWidth
                            style={{ marginBottom: '10px' }}
                            inputProps={{ style: { color: theme.palette.white.main } }}
                            InputLabelProps={{ style: { color: theme.palette.secondary.main } }}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <CustomTextField
                            label="Email*"
                            value={email}
                            variant="outlined"
                            size="small"
                            fullWidth
                            style={{ marginBottom: '10px' }}
                            inputProps={{ style: { color: theme.palette.white.main } }}
                            InputLabelProps={{ style: { color: theme.palette.secondary.main } }}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="footer">
                            {/* Other footer content */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color="secondary"
                                        onChange={(e) => setCheckbox(e.target.checked)}
                                        className="footer-checkbox"
                                        sx={{
                                            padding: '0',
                                            marginRight: '8px',
                                            '& .MuiSvgIcon-root': {
                                                width: '24px',
                                                height: '24px',
                                                color: 'white',
                                            },
                                            '& .MuiButtonBase-root': {
                                                padding: '0',
                                                margin: '0',
                                                width: 'auto'
                                            },
                                        }}
                                    />
                                }
                                label="Be the first one to know about our new features and updates."
                                className="footer-form-control-label"
                            />
                            {/* Other footer content */}
                        </div>
                        <button className='footer-button' color="primary" disabled={message === ''}>
                            Submit
                        </button>
                    </form>
                </div>
            </div>
            <hr className="footer-divider divider-bottom" />
            <div className='copyright-disc'>
                <p>© 2025 HabitForge. All Rights Reserved</p>
            </div>
        </footer>
    );
};

export default Footer;