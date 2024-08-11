import { useState, useMemo, useEffect } from 'react';
import { Autocomplete, Popper, FormControl, Button, TextField, InputAdornment, Tooltip, IconButton, Checkbox } from '@mui/material';
import Icon from '@mdi/react';
import { mdiInformation } from '@mdi/js';
import { useNotificationContext } from '../../../../../contexts/NotificationContexts';
import { useUserContext } from '../../../../../contexts/UserContext';
import { useGroupContext } from '../../../../../contexts/GroupContexts';
import './GroupModalPopper.css';
import { useTranslation } from "react-i18next";

const GroupModalPopper = ({ anchorEl, open, onClose, userList, mode, group }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const { inviteToGroup } = useNotificationContext();
    const { loggedInUser } = useUserContext();
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [error, setError] = useState('');
    const [fadeOut, setFadeOut] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(group);
    const { updateGroupInfo } = useGroupContext();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        setSelectedGroup(group);
    }, [group]);

    const initialFilteredUsers = useMemo(() => {

        return userList.filter(user => {
            const isLoggedInUser = user._id === loggedInUser._id;
            const isAlreadyInGroup = group && group.members && group.members.some(member => member.member_id === user._id);
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
        if (mode === 'add-user') {
            event.preventDefault();
            if (selectedUsers.length === 0) {
                setError('Please select at least one user');
                setFadeOut(false); // Reset fade-out state
                setTimeout(() => setFadeOut(true), 4500); // Apply fade-out class after a short delay
                setTimeout(() => setError(''), 5100);
                return;
            } else {
                setError('');
                inviteToGroup(loggedInUser, selectedUsers, group._id);
                setSelectedUsers([]);
                onClose();
            }
        } else if (mode === 'edit-group') {
            event.preventDefault();
            if (selectedGroup.name === '') {
                setError('Group name cannot be empty');
                setFadeOut(false);
                setTimeout(() => setFadeOut(true), 4500);
                setTimeout(() => setError(''), 5100);
                return;
            } else if (selectedGroup.name === group.name && selectedGroup.description === group.description && selectedGroup.visibility === group.visibility) {
                setError('No changes detected');
                setFadeOut(false);
                setTimeout(() => setFadeOut(true), 4500);
                setTimeout(() => setError(''), 5100);
                return;
            } else {
                setError('');
                updateGroupInfo(selectedGroup);
                onClose();
            }
        }
    };

    return (
        <Popper open={open} anchorEl={anchorEl} onClose={onClose} placement="bottom" style={{ zIndex: 1000 }}>
            <div style={{ padding: '10px', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '10px', width: '200px' }}>
                <form onSubmit={handleSubmit}>
                    {mode === 'add-user' && (
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
                        <>
                            <TextField
                                label="Group Name"
                                variant="outlined"
                                fullWidth
                                value={selectedGroup?.name || ''}
                                onChange={(event) => setSelectedGroup({ ...selectedGroup, name: event.target.value })}
                            />
                            <TextField
                                label="Description"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={2}
                                value={selectedGroup?.description || ''}
                                style={{ marginTop: '10px' }}
                                onChange={(event) => setSelectedGroup({ ...selectedGroup, description: event.target.value })}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
                                <Checkbox
                                    checked={selectedGroup?.visibility === 'public'}
                                    onChange={(event) => setSelectedGroup({ ...selectedGroup, visibility: event.target.checked ? 'public' : 'private' })}
                                />
                                <span>Public</span>
                                <InputAdornment position="end">
                                    <Tooltip title="Private groups are invite only, while public groups anyone can request to join">
                                        <IconButton>
                                            <Icon className="information-icon" path={mdiInformation} size={1.2} />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            </div>
                            {error && <div className={`error-message ${fadeOut ? 'fade-out' : ''}`}>{error}</div>}
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    style={{ backgroundColor: 'var(--success-color)', color: 'white', marginTop: '10px' }}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </Popper>
    );
};

export default GroupModalPopper;