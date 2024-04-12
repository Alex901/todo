import React, { useState } from 'react';
import {
    AppBar, Tabs, Tab, Box, Typography, TextField, Autocomplete, FormControl, Accordion,
    AccordionSummary, AccordionDetails, Avatar
} from '@mui/material';
import ReactModal from 'react-modal';
import './GroupModal.css';
import { useUserContext } from '../../../../contexts/UserContext';
import { useGroupContext } from '../../../../contexts/GroupContexts';
import { useNotificationContext } from '../../../../contexts/NotificationContexts';
import Icon from '@mdi/react';
import { mdiAccountGroupOutline } from '@mdi/js';
import { mdiFolderMultipleOutline } from '@mdi/js';

import { mdiPlusCircle } from '@mdi/js';
import { mdiPencilCircle } from '@mdi/js';
import { mdiDeleteCircle } from '@mdi/js';

import { mdiMinusCircle } from '@mdi/js';
import { mdiArrowLeftBoldCircle } from '@mdi/js';

const TabPanel = (props) => { //TODO: Move this at some point
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    <Typography component="div">{children}</Typography>
                </Box>
            )}
        </div>
    );
};



const GroupModal = ({ isOpen, onClose }) => {
    const [value, setValue] = useState(0);
    const { loggedInUser, userList } = useUserContext();
    const initialGroupData = { name: '', description: '', listName: '', users: [] };
    const [groupData, setGroupData] = useState(initialGroupData);
    const { createGroup, userGroupList } = useGroupContext();
    const [createGroupError, setCreateGroupError] = useState('');
    const { inviteToGroup } = useNotificationContext();
    const roles = ['edit', 'observer', 'moderator'];


    const handleChange = (event, newValue) => { //Some bad naming going on here
        setValue(newValue);
    };

    const createHandleInputChange = (event) => {
        if (event.target.name === 'name' && createGroupError) {
            setCreateGroupError('');
        }
        setGroupData({
            ...groupData,
            [event.target.name]: event.target.value,
        });
    };

    const createHandleUsersChange = (event, value) => {
        setGroupData({
            ...groupData,
            users: value,
        });
    };


    const createHandleSubmit = async (event) => {
        event.preventDefault();

        if (groupData.name === '') {
            setCreateGroupError("Group name is required");
            console.log("DEBUG: groupData.name: ", groupData.name);
            return;
        }
        const users = groupData.users; //separate the users from the groupData
        console.log("DEBUG: users: ", users);

        groupData.users = []; //this is a dumb wat of doing it, but it works

        groupData.owner = loggedInUser;
        const groupId = await createGroup(groupData);
        if (users.length > 0) {
            users.forEach(user => {
                inviteToGroup(loggedInUser, user, groupId); //invite the user to the group
            });
        }
        setGroupData(initialGroupData); //reset the form
    };
    //TODO: I'm not happy about this one. Change it so i fetch moderator lists in the furure
    const isUserModerator = (loggedInUser, group) => { 
        // Assuming group.members is an array of objects with properties 'member_id' and 'role'
        const member = group.members.find(member => member.member_id === loggedInUser._id);
        return member && member.role === 'moderator';
    };

    const handleAddMember = () => {
        console.log('Add member');
    };

    const handleEditEntry = () => {
        console.log('Edit entry');
    };

    const handleDeleteEntry = () => {
        console.log('Delete entry');
    };

    const handleLeaveGroup = () => {
        console.log('Leave group');
    };

    const handleRemoveMember = (member) => {
        console.log('Remove member', member);
        if (member.role === 'moderator') {
            alert("A moderator can't remove themselves or other moderators");
            return;
        }
    };

    const handleRoleChange = (member, newRole) => {
        console.log('Role change', member, newRole);
    };

    if (!loggedInUser) {
        return null; // 
    }

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="modal-content modal-with-tabs"
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
        >

            <AppBar position="static">
                <Tabs value={value}
                    onChange={handleChange}
                    variant="fullWidth"
                    indicatorColor="secondary"
                    textColor="inherit"
                >
                    <Tab label="My Groups" />
                    <Tab label="Create" />
                    <Tab label="Find" />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <div className='tab-modal-content'>
                    {loggedInUser && userGroupList.length > 0 ? (
                        <div className='group'>
                            {userGroupList.map((group, index) => (
                                <Accordion key={index}>
                                    <AccordionSummary>
                                        <div className='group-summary-columns' style={{ width: '350px' }}>
                                            <div className='group-summary-info' style={{ width: 'auto' }}>
                                                <div style={{ display: 'flex', alignItems: 'left', width: '33%' }}>
                                                    <Typography><strong>{group.name}</strong></Typography>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Icon path={mdiAccountGroupOutline} size={.8} style={{ marginRight: '8px' }} /> {/* Adjust size and margin as needed */}
                                                    <Typography>{group.members.length}</Typography>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Icon path={mdiFolderMultipleOutline} size={.8} style={{ marginRight: '8px' }} /> {/* Adjust size and margin as needed */}
                                                    <Typography>{group.groupLists.length}</Typography>
                                                </div>

                                                <div className='group-summary-actions' style={{ width: '33%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                                    {loggedInUser._id === group.owner ? (
                                                        <>
                                                            <Icon className="group-icon-button add-member" path={mdiPlusCircle} size={1.2} onClick={handleAddMember} style={{ cursor: 'pointer' }} />
                                                            <Icon className="group-icon-button edit-group" path={mdiPencilCircle} size={1.2} onClick={handleEditEntry} style={{ cursor: 'pointer' }} />
                                                            <Icon className="group-icon-button delete-group" path={mdiDeleteCircle} size={1.2} onClick={handleDeleteEntry} style={{ cursor: 'pointer' }} />
                                                        </>
                                                    ) : (
                                                        <Icon className="group-icon-button leave-group" path={mdiArrowLeftBoldCircle} size={1.2} onClick={handleLeaveGroup} style={{ cursor: 'pointer' }} />
                                                    )}
                                                </div>

                                            </div>
                                            <div className='group-summary-description'>
                                                {group.description.match(/.{1,60}/g).map((text, index) => (
                                                    <Typography key={index}>{text}</Typography>
                                                ))}
                                            </div>
                                        </div>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div className='group-members' style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            {group.members && userList && group.members.map((member, index) => {
                                                const user = userList.find(user => user._id === member.member_id);
                                                //Make into a component at some point
                                                return (
                                                    <div className='group-member' key={index} style={{ display: 'flex', flexDirection: 'row', gap: '15px', borderRadius: '20px', backgroundColor: '#F2F2F2', padding: '5px' }}>
                                                        <Avatar src={user ? user.profilePicture : ''} alt={user ? user.username : 'User not found'} />
                                                        <div className='member-information'>
                                                            <Typography><strong>name:</strong> {user ? user.username : 'User not found'}</Typography>
                                                            <Typography>{member.role}</Typography>
                                                        </div>
                                                        <div className='member-actions' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', minWidth: '50%', width: 'auto', gap: '10px' }}>
                                                            {isUserModerator(loggedInUser, group) && member.role !== 'moderator' && (
                                                                <Icon className="group-icon-button remove-member" path={mdiMinusCircle} size={1.2} onClick={() => handleRemoveMember(member)} style={{ cursor: 'pointer' }} />
                                                            )}
                                                            {isUserModerator(loggedInUser, group) && member.role !== 'moderator' && (
                                                                <Autocomplete
                                                                    options={roles}
                                                                    getOptionLabel={(option) => option}
                                                                    style={{ width: 100, marginRight: 10 }}
                                                                    renderInput={(params) => <TextField {...params} label="Set Role" variant="outlined" />}
                                                                    onChange={(event, newValue) => handleRoleChange(member, newValue)}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </div>
                    ) : (
                        <>
                            <Typography component="div">
                                It looks like you don't have any groups yet. <br />
                                Why not create one?
                            </Typography>
                            <button className='modal-button' onClick={() => setValue(1)} style={{ textAlign: 'center' }}> CreateGroup </button>
                        </>
                    )}
                </div>
            </TabPanel >
            <TabPanel value={value} index={1}>
                <div className='tab-modal-content'>
                    <form className='create-group-form' onSubmit={createHandleSubmit}>
                        <TextField
                            name="name"
                            label="Group Name"
                            variant="outlined"
                            value={groupData.name}
                            style={{ width: '100%' }}
                            onChange={createHandleInputChange}
                        />
                        <TextField
                            name="description"
                            label="Group Description"
                            variant="outlined"
                            value={groupData.description}
                            multiline
                            rows={3}
                            style={{ width: '100%' }}
                            onChange={createHandleInputChange}
                        />
                        <TextField
                            name="listName"
                            label="Default list name"
                            value={groupData.listName}
                            variant="outlined"
                            style={{ width: '100%' }}
                            onChange={createHandleInputChange}
                        />
                        {userList && loggedInUser ? (
                            <Autocomplete
                                multiple
                                options={userList.filter(user => user.email !== loggedInUser.email)} // filter out the logged in user
                                getOptionLabel={(option) => option.email}
                                style={{ width: '100%' }}
                                value={groupData.users}
                                onChange={createHandleUsersChange}
                                renderInput={(params) => (
                                    <TextField {...params} component="div" variant="outlined" label="Invite Users" />
                                )}
                            />
                        ) : (
                            <div>Loading...</div>
                        )}
                        {createGroupError && <div className='error'>{createGroupError}</div>}
                        <button className='modal-button' type='submit'>Create Group</button>
                    </form>
                </div>
            </TabPanel>
            <TabPanel value={value} index={2}>
                Find Content
            </TabPanel>
        </ReactModal >
    );
};

export default GroupModal;