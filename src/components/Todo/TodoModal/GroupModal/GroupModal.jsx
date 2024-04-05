import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box, Typography, TextField, Autocomplete, FormControl } from '@mui/material';
import ReactModal from 'react-modal';
import './GroupModal.css';
import { useUserContext } from '../../../../contexts/UserContext';
import { useGroupContext } from '../../../../contexts/GroupContexts';
import { useNotificationContext } from '../../../../contexts/NotificationContexts';

const TabPanel = (props) => {
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
    const [ createGroupError, setCreateGroupError ] = useState('');
    const { inviteToGroup } = useNotificationContext();
    

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
        if(users.length > 0) {
            users.forEach(user => {
                inviteToGroup(loggedInUser, user, groupId); //invite the user to the group
            });
        }
        setGroupData(initialGroupData); //reset the form
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
                    <Typography component="div">
                        It looks like you don't have any groups yet. <br />
                        Why not create one?
                    </Typography>
                    <button className='modal-button' onClick={() => setValue(1)} style={{ textAlign: 'center' }}> CreateGroup </button>
                </div>
            </TabPanel>
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
                                options={userList.filter(user => user.username !== loggedInUser.email)} // filter out the logged in user
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
        </ReactModal>
    );
};

export default GroupModal;