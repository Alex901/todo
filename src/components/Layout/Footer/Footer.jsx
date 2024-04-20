import React from 'react';
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




    return (
        <footer className="footer-main" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: '30px' }}>
                <Icon path={mdiFacebook} size={1.7} />
                <Icon path={mdiGit} size={1.7} />
                <Icon path={mdiTwitter} size={1.7} />
                <Icon path={mdiLinkedin} size={1.7} />
            </div>
            <hr style={{ width: '80%', margin: '0 auto' }}></hr>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <h3>Contact</h3>
                    <p>123 Street</p>
                    <p>City, State, Zip</p>
                    <p>Email: info@website.com</p>
                </div>
                <div>
                    <h3>Site</h3>
                    <p>About</p>
                    <p>Our story</p>
                    <p>Login</p>
                    <p>Register</p>
                </div>
                <div>
                    <h3>Resources</h3>
                    <p>Blog</p>
                    <p>Downloads</p>
                    <p>Tutorials</p>
                </div>
                <div>
                    <h3>Tell us about your goal</h3>
                    <form className='footer-form' >
                        <CustomTextField
                            label="Tell us about your goal, and we will tell you if we can help you achieve it."
                            variant="outlined"
                            size="small"
                            multiline
                            rows={3}
                            fullWidth
                            style={{ marginBottom: '10px' }}
                            inputProps={{ style: { color: theme.palette.white.main } }}
                            InputLabelProps={{ style: { color: theme.palette.secondary.main } }}
                        />
                        <CustomTextField
                            label="Email"
                            variant="outlined"
                            size="small"
                            fullWidth
                            style={{ marginBottom: '10px' }}
                            inputProps={{ style: { color: theme.palette.white.main } }}
                            InputLabelProps={{ style: { color: theme.palette.secondary.main } }}
                        />
                        <FormControlLabel
                            control={<Checkbox color="secondary" />}
                            label="Be the first one to know about our new features and updates."
                            style={{ marginBottom: '10px' }}
                        />
                        <button className='footer-button' color="primary">
                            Submit
                        </button>
                    </form>
                </div>
            </div>

            <div className='copyright-disc'>
                <p style={{ textAlign: 'center' }}>© 2024 Taskforge. All Rights Reserved</p>
            </div>
        </footer>
    );
};

export default Footer;