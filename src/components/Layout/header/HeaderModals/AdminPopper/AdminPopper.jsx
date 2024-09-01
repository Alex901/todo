import { useState, useEffect } from 'react';
import { Popper, TextField, Button } from '@mui/material';
import { useUserContext } from '../../../../../contexts/UserContext';
import { toast } from "react-toastify";
import './AdminPopper.css';

const AdminPopper = ({ anchorEl, open, onClose, mode }) => {
    const { registerNewUser } = useUserContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        if (mode === 'invite-user') {
            setEmail(''); // Reset email for invite mode
        }
    }, [mode]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (username === '' || password === '') {
            setError('Username and password are required');
            setFadeOut(false);
            setTimeout(() => setFadeOut(true), 4500);
            setTimeout(() => setError(''), 5100);
            return;
        }

        const userData = { username, email: email || `${username}@example.com`, password, isInvite: mode === 'invite-user', verified: true };

        try {
            await registerNewUser(userData);
            toast.success(mode === 'invite-user' ? 'Invitation sent successfully' : 'User added successfully');
            setUsername('');
            setPassword('');
            setEmail('');
            onClose();
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    return (
        <Popper open={open} anchorEl={anchorEl} onClose={onClose} placement="bottom" style={{ zIndex: 1000 }}>
            <div style={{ padding: '10px', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '10px', width: '200px' }}>
                <form onSubmit={handleSubmit}>
                {mode === 'invite-user' && (
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ marginBottom: '10px' }}
                        />
                    )}
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ marginBottom: '10px' }}
                    />
                 
                    {error && <div className={`error-message ${fadeOut ? 'fade-out' : ''}`}>{error}</div>}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            style={{ backgroundColor: 'var(--success-color)', color: 'white', marginTop: '10px' }}
                        >
                            {mode === 'add-user' ? 'Add User' : 'Send Invite'}
                        </Button>
                    </div>
                </form>
            </div>
        </Popper>
    );
};

export default AdminPopper;