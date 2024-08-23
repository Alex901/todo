import React, { useState } from 'react';
import './Footer.css';
import { TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import Icon from '@mdi/react';
import { mdiFacebook } from '@mdi/js';
import { mdiGit } from '@mdi/js';
import { mdiTwitter } from '@mdi/js';
import { mdiLinkedin } from '@mdi/js';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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
        console.log('Submitting feedback...');
        console.log('Message:', message);
        console.log('Email:', email);
        console.log('Checkbox:', checkbox);
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
        <footer className="footer-main" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', gap: '25px' }}>
                <Icon className="social-icon" path={mdiFacebook} size={1.7} />
                <Icon className="social-icon" path={mdiGit} size={1.7} />
                <Icon className="social-icon" path={mdiTwitter} size={1.7} />
                <Icon className="social-icon" path={mdiLinkedin} size={1.7} />
            </div>
            <hr style={{ width: '80%', margin: '0 auto' }}></hr>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '280px' }}>
                    <h5 className="category">Contact</h5>
                    <p>123 Street</p>
                    <p>City, State, Zip</p>
                    <p>Email: info@website.com</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '280px' }}>
                    <h5 className="category">Navigation</h5>
                    <p>About</p>
                    <p>Our story</p>
                    <p>Blogg </p>
                    <p>Login</p>
                    <p>Register</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '280px' }}>
                    <h5 className="category">Resources</h5>
                    <p>Downloads</p>
                    <p> pre-made guides</p>
                    <p>Support</p>
                </div>
                <div>
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

            <div className='copyright-disc'>
                <p style={{ textAlign: 'center' }}>© 2024 HabitForge. All Rights Reserved</p>
            </div>
        </footer>
    );
};

export default Footer;