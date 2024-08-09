import { useState, useMemo, useEffect } from 'react';
import { Autocomplete, Popper, FormControl, Button, TextField } from '@mui/material';
import { useNotificationContext } from '../../../../../contexts/NotificationContexts';
import { useUserContext } from '../../../../../contexts/UserContext';
import './GroupModalPopper.css';

const GroupModalPopper = ({ anchorEl, open, onClose, userList, mode, group }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const { inviteToGroup } = useNotificationContext();
    const { loggedInUser } = useUserContext();
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [error, setError] = useState('');
    const [fadeOut, setFadeOut] = useState(false);

    const initialFilteredUsers = useMemo(() => {

        return userList.filter(user => {
            const isLoggedInUser = user._id === loggedInUser._id;
            const isAlreadyInGroup = group.members.some(member => member.member_id === user._id);
            return !isLoggedInUser && !isAlreadyInGroup;
        });
    }, [userList, loggedInUser, group]);


    const handleSearchChange = (event, value) => {
        if (value) {
            const filtered = initialFilteredUsers.filter(user =>
                user.username.toLowerCase().includes(value.toLowerCase()) ||
                user.email.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers([]);
        }
    };

    const handleSelectUsers = (event, value) => {
        event.preventDefault();
        setSelectedUsers(value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (selectedUsers.length === 0) {
            setError('Please select at least one user');
            setFadeOut(false); // Reset fade-out state
            setTimeout(() => setFadeOut(true), 4500); // Apply fade-out class after a short delay
            setTimeout(() => setError(''), 5100);
            return;
        } else {
            setError('');
            // Handle form submission logic here
            console.log('DEBUG -- Selected Users:', selectedUsers);
            console.log("DEBUG -- Group:", group);
            setSelectedUsers([]);
            onClose();
        }
    };

    return (
        <Popper open={open} anchorEl={anchorEl} onClose={onClose} placement="bottom" style={{ zIndex: 1000 }}>
            <div style={{ padding: '10px', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '10px', width: '200px' }}>
                <form onSubmit={handleSubmit}>
                    {mode === 'create-user' && (
                        <>
                            <Autocomplete
                                freeSolo
                                multiple
                                value={selectedUsers}
                                onChange={handleSelectUsers}
                                options={filteredUsers}
                                getOptionLabel={(option) => option.username}
                                filterOptions={(options) => options} // Disable default filtering
                                onInputChange={handleSearchChange}
                                renderInput={(params) => <TextField {...params} label="Select user(s)" variant="outlined" />}
                            />
                            {error && <div className={`error-message ${fadeOut ? 'fade-out' : ''}`}>{error}</div>}
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    style={{ backgroundColor: 'var(--success-color)', color: 'white', marginTop: '10px' }}
                                >
                                    Send Invite(s)
                                </Button>
                            </div>
                        </>
                    )}
                    {mode === 'edit-group' && (
                        <div>
                            {/* Add your edit group form fields here */}
                            <TextField label="Group Name" variant="outlined" fullWidth />
                            {/* Add other fields as needed */}
                        </div>
                    )}
                </form>
            </div>
        </Popper>
    );
};

export default GroupModalPopper;