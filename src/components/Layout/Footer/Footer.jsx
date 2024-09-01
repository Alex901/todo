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

const Footer = () => {
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
                    <p>123 Street</p>
                    <p>City, State, Zip</p>
                    <p>Email: info@website.com</p>
                </div>
                <div className="footer-section">
                    <h5 className="category">Navigation</h5>
                    <p>About</p>
                    <p>Our story</p>
                    <p>Blog</p>
                    <p>Login</p>
                    <p>Register</p>
                </div>
                <div className="footer-section">
                    <h5 className="category">Resources</h5>
                    <p>Downloads</p>
                    <p>Pre-made guides</p>
                    <p>Support</p>
                </div>
                <div className="footer-form-container">
                    <h4>Get in touch!</h4>
                    <form className='footer-form' onSubmit={handleSubmit}>
                        <CustomTextField
                            label="Anything missing? Let us know"
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
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="secondary"
                                    onChange={(e) => setCheckbox(e.target.checked)}
                                />
                            }
                            label="Be the first one to know about our new features and updates."
                            style={{ marginBottom: '10px' }}
                        />
                        <button className='footer-button' color="primary" disabled={message === ''}>
                            Submit
                        </button>
                    </form>
                </div>
            </div>
            <hr className="footer-divider divider-bottom" />
            <div className='copyright-disc'>
                <p>© 2024 HabitForge. All Rights Reserved</p>
            </div>
        </footer>
    );
};

export default Footer;