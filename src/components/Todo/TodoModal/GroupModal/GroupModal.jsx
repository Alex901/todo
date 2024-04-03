import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box, Typography, TextField, Autocomplete, FormControl } from '@mui/material';
import ReactModal from 'react-modal';
import './GroupModal.css';
import { useUserContext } from '../../../../contexts/UserContext';

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
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};



const GroupModal = ({ isOpen, onClose }) => {
    const [value, setValue] = useState(0);
    const { loggedInUser, userList } = useUserContext();
    const [groupData, setGroupData] = useState({ name: '', description: '', listName: '', users: [] });

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const createHandleInputChange = (event) => {
        console.log("event target name: ", event.target.name)
        setGroupData({
          ...groupData,
          [event.target.name]: event.target.value,
        });
        console.log(groupData)
      };

      const createHandleUsersChange = (event, value) => {
        setGroupData({
          ...groupData,
          users: value,
        });
        console.log(groupData)
      };


    const createHandleSumbit = () => (event) => {
        event.preventDefault();
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
                    <Typography>
                        It looks like you don't have any groups yet. <br />
                        Why not create one?
                    </Typography>   ¨
                    <button className='modal-button' onClick={() => setValue(1)} style={{ textAlign: 'center' }}> CreateGroup </button>
                </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <div className='tab-modal-content'>
                    <form className='create-group-form' onSubmit={createHandleSumbit}>
                        <TextField
                            name="groupName"
                            label="Group Name"
                            variant="outlined"
                            style={{ width: '100%' }}
                            onChange={createHandleInputChange}
                        />
                        <TextField
                            name="description"
                            label="Group Description"
                            variant="outlined"
                            multiline
                            rows={3}
                            style={{ width: '100%' }}
                            onChange={createHandleInputChange}
                        />
                        <TextField
                            name="listName"
                            label="Default list name"
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
                                onChange={createHandleUsersChange}
                                renderInput={(params) => (
                                    <TextField {...params} variant="outlined" label="Invite Users" />
                                )}
                            />
                        ) : (
                            <div>Loading...</div>
                        )}
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