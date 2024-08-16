import React, { useState, useMemo, useEffect } from 'react';
import ReactModal from 'react-modal';
import './CreateListModal.css';
import { useUserContext } from '../../../../contexts/UserContext';
import { useGroupContext } from '../../../../contexts/GroupContexts';
import { FormControl, TextField, InputLabel, InputAdornment, Checkbox, Select, MenuItem, FormControlLabel, Tooltip, IconButton } from '@mui/material';
import { use } from 'i18next';
import Icon from '@mdi/react';
import { mdiInformation } from '@mdi/js';

ReactModal.setAppElement('#root');

const CreateListModal = ({ isOpen, onRequestClose }) => {
  const { addList, loggedInUser } = useUserContext();
  const { userGroupList } = useGroupContext();
  const [selectedGroup, setSelectedGroup] = useState(null); // Default to the first group in the list if available, otherwise empty object
  const [groupsWhereModerator, setGroupsWhereModerator] = useState([]); // List of groups where the logged in user is a moderator
  const [error, setError] = useState('');
  const [isListPublic, setIsListPublic] = useState(false);

  const [newGroupData, setNewGroupData] = useState({
    visibility: 'private',
    listName: '',
    description: ''
  });

  useEffect(() => {
    if (loggedInUser) {
      const moderatorGroups = new Set();

      if (userGroupList.length > 0) {
        userGroupList.forEach(group => {
          group.members.forEach(member => {
            if (member.member_id === loggedInUser._id && member.role === 'moderator') {
              moderatorGroups.add(group);
            }
          });
        });
      }

      setGroupsWhereModerator(Array.from(moderatorGroups));
    }

  }, [userGroupList, loggedInUser]);

  useEffect(() => {
    console.log("DEBUG -- Groups where moderator: ", groupsWhereModerator);
  }, [groupsWhereModerator]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log("DEBUG -- Name: ", name);
    console.log("DEBUG -- Value: ", value);
    if (name === 'isPublic') {
      setNewGroupData(prevState => ({
        ...prevState,
        visibility: isListPublic ? 'private' : 'public'
      }));
      setIsListPublic(!isListPublic);
      return;
    } else {
      setNewGroupData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }

    console.log("New group data: ", newGroupData);
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { listName, description, visibility } = newGroupData;
    console.log("List name: ", listName);
    console.log("Description: ", description);
    console.log("visibility: ", visibility);
    console.log("Selected group: ", selectedGroup);
    if (!listName.trim()) {
      setError('List name cannot be empty');
      return;
    }
    setError('');
    // addList(newGroupData);
    setNewGroupData({
      isPrivate: "private",
      listName: '',
      description: ''
    });
    onRequestClose();
  }

  const resetFormData = () => {
    setSelectedGroup(null);
    setNewGroupData({
      visibility: 'private',
      listName: '',
      description: ''
    });
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
      onRequestClose();
    }
  }

  const handleModalClose = () => {
    resetFormData();
    onRequestClose();
  }

  const generateOptions = () => {
    if (groupsWhereModerator.length === 0) {
      return <MenuItem key="personal-list" value="Personal list">Personal list</MenuItem>;
    } else {
      const options = [
        <MenuItem key="personal-list" value="Personal list">
          Personal list
        </MenuItem>,
        ...groupsWhereModerator.map(group => (
          <MenuItem key={group._id} value={group._id}>
            {group.name}
          </MenuItem>
        ))
      ];
      return options;
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={handleModalClose}
      contentLabel="Add new list"
      className="modal-content"
      overlayClassName="modal-overlay"
      shouldCloseOnOverlayClick={true}
      onChange={handleInputChange}
    >
      <div className='modalTitle'> <h3 className="title"> Create list </h3></div>

      <form className="create-list-form" onSubmit={handleSubmit}>
        {groupsWhereModerator.length > 0 && (
          <>
            <FormControl variant="outlined" size="small" style={{ width: 'auto' }}>
              <InputLabel id="select-group-label">Select Group</InputLabel>
              <Select
                labelId='select-group-label'
                value={selectedGroup !== null ? selectedGroup : ''}
                onChange={(e) => setSelectedGroup(e.target.value)}
                label="Select Group"
                style={{ width: '150px' }}
              >
                {generateOptions()}
              </Select>
            </FormControl>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isPublic"
                    value={isListPublic}
                    onChange={handleInputChange}
                    checked={!isListPublic}
                  />
                }
                label="Private"
              />
              <InputAdornment position="end">
                <Tooltip title="Private lists can only be seen by you and your group members">
                  <IconButton>
                    <Icon className="information-icon" path={mdiInformation} size={1.2} />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            </div>
          </>
        )}

        <TextField
          label="Enter list Name"
          type='text'
          name='listName'
          value={newGroupData.listName}
          onChange={handleInputChange}
          className='modal-input'
          onKeyDownCapture={handleKeyPress}
          autoFocus
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Description"
          type='text'
          name='description'
          value={newGroupData.description}
          onChange={handleInputChange}
          className='modal-input'
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          maxLength={500}
        />


        <div className="save-button-div">
          {error && <p className='error'>{error}</p>}
          <button type="submit" className='modal-button'> Create </button>
        </div>
      </form>
    </ReactModal>
  )
}

export default CreateListModal;