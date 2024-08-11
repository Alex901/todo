import React, { useState, useEffect } from 'react';
import {
    AppBar, Tabs, Tab, Box, Typography, TextField, Autocomplete, FormControl, Accordion,
    AccordionSummary, AccordionDetails, Avatar, Checkbox, FormControlLabel
} from '@mui/material';
import ReactModal from 'react-modal';
import './GroupModal.css';
import { useUserContext } from '../../../../contexts/UserContext';
import { useGroupContext } from '../../../../contexts/GroupContexts';
import { useNotificationContext } from '../../../../contexts/NotificationContexts';
import Icon from '@mdi/react';
import {
    mdiAccountGroupOutline, mdiFolderMultipleOutline, mdiPlusCircle, mdiPencilCircle, mdiDeleteCircle,
    mdiMinusCircle, mdiArrowLeftBoldCircle, mdiHumanGreetingProximity, mdiLockOutline, mdiLockOpenVariantOutline
} from '@mdi/js';
import GroupModalPopper from './GroupModalPopper/GroupModalPopper';
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

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
    const initialGroupData = { name: '', description: '', listName: '', users: [], visibility: 'private' };
    const [groupData, setGroupData] = useState(initialGroupData);
    const { createGroup, userGroupList, allGroupList, leaveGroup } = useGroupContext();
    const [createGroupError, setCreateGroupError] = useState('');
    const { inviteToGroup } = useNotificationContext();
    const roles = ['edit', 'observer', 'moderator']; // huh ? 
    const [searchInput, setSearchInput] = useState('');
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [anchorElPopper, setAnchorElPopper] = useState(null);
    const [popperOpen, setPopperOpen] = useState(false);
    const [popperMode, setPopperMode] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [confirmationAction, setConfirmationAction] = useState(null);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        setFilteredGroups(allGroupList.slice(0, 10));
    }, [allGroupList]);

    const openConfirmation = (event, member = null, group, action) => {
        event.stopPropagation();
        console.log("DEBUG: member, group, action: ", group, action);
        setIsConfirmationModalOpen(true);
    };

    const cancelConfirmation = () => {
        setIsConfirmationModalOpen(false);
        setConfirmationMessage('');
        setConfirmationAction(null);
    };

    const handleConfirmationAction = () => {
        if (confirmationAction) {
            confirmationAction();
        }
        cancelConfirmation();
    }

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


    const handleCreateGroup = async (event) => {
        event.preventDefault();

        if (groupData.name === '') {
            setCreateGroupError("Group name is required");
            console.log("DEBUG: groupData.name: ", groupData.name);
            return;
        }
        const users = groupData.users; //separate the users from the groupData
        console.log("DEBUG: users: ", users);

        groupData.users = []; //this is a dumb way of doing it, but it works

        groupData.owner = loggedInUser._id;
        const groupId = await createGroup(groupData); //Move to group context or nah? 
        if (users.length > 0) {
            console.log("DEBUG: users GroupModal: createGroup: ", users);
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

    const handleAddMember = (event, group) => {
        event.stopPropagation();
        setSelectedGroup(group);
        setPopperMode('add-user');
        setPopperOpen(!popperOpen);
        setAnchorElPopper(event.currentTarget);
    };

    const handleEditGroup = (event, group) => {
        event.stopPropagation();
        setSelectedGroup(group);
        setPopperMode('edit-group');
        setPopperOpen(!popperOpen);
        setAnchorElPopper(event.currentTarget);
    };

    const handleDeleteGroup = (event, group) => {
        event.stopPropagation();
        if (group.members.length > 1) {
            toast.error("You can't delete a group with members in it");
            return;
        } else if (loggedInUser._id !== group.owner) {
            toast.error("Congrats, you've found a easter egg, you still cannot do this though.");
            return;
        } else {
            console.log("DEBUG: group to delete: ", group);
            //deleteGroup(group);
        }


    };

    const handleLeaveGroup = (event) => {
        event.stopPropagation();
        console.log('Leave group');
    };

    const handleRemoveMember = (member, group) => {
        console.log(`Remove member ${member.member_id} from ${group.name}`);
        if (member.role === 'moderator') {
            alert("A moderator can't remove themselves or other moderators");
            return;
        }
    };

    const handleRoleChange = (member, newRole) => {
        console.log(`Change role for ${member._id} to ${newRole}`);
    };

    const handleSearchChange = (event, value) => {
        setSearchInput(value);
        if (value) {
            const filtered = allGroupList.filter(group => group.name.toLowerCase().includes(value.toLowerCase()));
            setFilteredGroups(filtered);
        } else {
            setFilteredGroups(allGroupList.slice(0, 10)); // Reset to initial 10 groups if search is cleared
        }
    };

    const handleRequestJoin = (event) => {
        event.stopPropagation();
        console.log('Request join group', event.target);
    };

    const handlePopperClose = () => {
        setPopperOpen(!popperOpen);
        setAnchorElPopper(null);
        setPopperMode('');
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={() => {
                onClose();
                handlePopperClose();
            }}
            className="modal-content modal-with-tabs"
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
        >
            <div className="modal-container">
                <AppBar position="static" className='modal-appbar'>
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
                                {userGroupList.map((group) => (
                                    <Accordion key={group._id}>
                                        <AccordionSummary>
                                            <div className='group-summary-columns'>
                                                <div className='group-summary-info'>
                                                    <div className='group-summary-section'>
                                                        <Typography className='group-summary-name'><strong>{group.name}</strong></Typography>
                                                    </div>
                                                    <div className='group-summary-icons'>
                                                        <div className='group-summary-icon'>
                                                            <Icon path={mdiAccountGroupOutline} size={.8} className='icon' />
                                                            <Typography>{group.members.length}</Typography>
                                                        </div>
                                                        <div className='group-summary-icon'>
                                                            <Icon path={mdiFolderMultipleOutline} size={.8} className='icon' />
                                                            <Typography>{group.groupListsModel.length}</Typography>
                                                        </div>
                                                        <div className='group-summary-icon'>
                                                            <Icon
                                                                path={group.visibility === 'public' ? mdiLockOpenVariantOutline : mdiLockOutline}
                                                                size={.8}
                                                                className='icon'
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='group-summary-actions'>
                                                        {loggedInUser._id === group.owner ? (
                                                            <>
                                                                <Icon className="group-icon-button add-member" path={mdiPlusCircle} size={1.2} onClick={(event) => handleAddMember(event, group)} />
                                                                <Icon className="group-icon-button edit-group" path={mdiPencilCircle} size={1.2} onClick={(event) => handleEditGroup(event, group)} />
                                                                <Icon className="group-icon-button delete-group" path={mdiDeleteCircle} size={1.2} onClick={(event) => handleDeleteGroup(event, group)} />
                                                            </>
                                                        ) : (
                                                            <Icon className="group-icon-button leave-group" path={mdiArrowLeftBoldCircle} size={1.2} onClick={(event) => openConfirmation(event, null, group, "leave-group")} />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className='group-summary-description'>
                                                    {group.description && group.description.match(/.{1,60}/g).map((text, index) => (
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
                                                                <Typography><strong>User:</strong> {user ? user.username : 'User not found'}</Typography>
                                                                <Typography><strong>Role: </strong>{member.role}</Typography>
                                                            </div>
                                                            <div className='member-actions' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginLeft: 'auto', gap: '10px' }}>
                                                                {isUserModerator(loggedInUser, group) && member.role !== 'moderator' && (
                                                                    <Icon className="group-icon-button remove-member" path={mdiMinusCircle} size={1.2} onClick={() => handleRemoveMember(member, group)} style={{ cursor: 'pointer' }} />
                                                                )}
                                                                {isUserModerator(loggedInUser, group) && member.role !== 'moderator' && (
                                                                    <Autocomplete
                                                                        disableClearable
                                                                        options={roles}
                                                                        getOptionLabel={(option) => option}
                                                                        style={{ width: 130, marginRight: 10 }}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="Set Role"
                                                                                variant="outlined"
                                                                                InputProps={{ ...params.InputProps, readOnly: true }}
                                                                            />
                                                                        )}
                                                                        onChange={(event, newValue) => handleRoleChange(member, newValue)}
                                                                        value={member.role}
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </AccordionDetails>
                                        <ConfirmationModal
                                            onRequestClose={cancelConfirmation}
                                            isOpen={isConfirmationModalOpen}
                                            onConfirm={handleConfirmationAction}
                                            onClose={cancelConfirmation}
                                            message={<span>{confirmationMessage}</span>}
                                        />

                                        <GroupModalPopper
                                            anchorEl={anchorElPopper}
                                            open={popperOpen}
                                            onClose={handlePopperClose}
                                            userList={userList}
                                            mode={popperMode}
                                            group={selectedGroup ? selectedGroup : null}
                                        />
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
                        <form className='create-group-form' onSubmit={handleCreateGroup}>
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
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={groupData.visibility === 'public'}
                                        onChange={(e) => createHandleInputChange({
                                            target: {
                                                name: 'visibility',
                                                value: e.target.checked ? 'public' : 'private'
                                            }
                                        })}
                                        name="visibility"
                                        color="primary"
                                    />
                                }
                                label="Public"
                            />
                            {createGroupError && <div className='error'>{createGroupError}</div>}
                            <button className='modal-button' type='submit'>Create Group</button>
                        </form>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <div className='tab-modal-content'>
                        <Autocomplete
                            freeSolo
                            options={[]}
                            inputValue={searchInput}
                            onInputChange={handleSearchChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search Groups"
                                    variant="outlined"
                                    style={{ width: '250px' }}
                                />
                            )}
                        />

                        <div className="group find-group">
                            {filteredGroups
                                .filter(group => group.owner !== null && !group.members.some(member => member.member_id._id === loggedInUser._id))
                                .map((group) => (
                                    <Accordion key={group._id}>
                                        <AccordionSummary>
                                            <div className='group-summary-columns'>
                                                <div className='group-summary-info'>
                                                    <div className='group-summary-section'>
                                                        <Typography className='group-summary-name find-groups'><strong>{group.name}</strong></Typography>
                                                    </div>
                                                    <div className='group-summary-icons'>
                                                        <div className='group-summary-icon'>
                                                            <Icon path={mdiAccountGroupOutline} size={.8} className='icon' />
                                                            <Typography>{group.members.length}</Typography>
                                                        </div>
                                                        <div className='group-summary-icon'>
                                                            <Icon path={mdiFolderMultipleOutline} size={.8} className='icon' />
                                                            <Typography>{group.groupListsModel.length}</Typography>
                                                        </div>
                                                    </div>
                                                    <div className='group-summary-actions'>
                                                        <Icon className="group-icon-button request-join" path={mdiHumanGreetingProximity} size={1.2} onClick={(event) => handleRequestJoin(event)} />
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <div className='group-details-description'>
                                                <Typography><strong>Description:</strong> {group.description ? group.description : "no description"}</Typography>
                                            </div>
                                            <div className='group-details-owner'>
                                                <Typography><strong>Group Owner:</strong> {group.owner.email}</Typography>
                                            </div>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                        </div>
                    </div>
                </TabPanel>
            </div>
        </ReactModal >
    );
};

export default GroupModal;