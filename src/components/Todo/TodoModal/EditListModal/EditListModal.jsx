import React, { useState, useEffect } from 'react'
import BaseModal from "../BaseModal/BaseModal";
import { useUserContext } from "../../../../contexts/UserContext";
import { useGroupContext } from "../../../../contexts/GroupContexts";
//import Select from 'react-select';
import { toast } from 'react-toastify';
import { TextField, Button, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem, Tooltip } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Icon from '@mdi/react';
import { mdiInformation } from '@mdi/js';
import { useTranslation } from "react-i18next";
import './EditListModal.css';


const EditListModal = ({ isOpen, onRequestClose, listData }) => {
    const { editUserList } = useUserContext();
    const { editGroupList } = useGroupContext();
    //console.log("DEBUG -- list data to edit, ", listData);
    const [errorMessage, setErrorMessage] = useState('');
    const [editedListData, setEditedListData] = useState({
        listName: listData.listName,
        description: listData.description,
        visibility: listData.visibility,
    });

    useEffect(() => {
        if (!isOpen) {
            setEditedListData({
                listName: listData.listName,
                description: listData.description,
                visibility: listData.visibility,
            });
        }
    }, [isOpen, listData]);


    const handleSubmit = () => {
        console.log('submit');
        if (editedListData.listName === '') {
            setErrorMessage('List name cannot be empty');
            return;
        }

        if (listData.type === "groupList") {
            editGroupList(listData._id, editedListData);
        } else {
            editUserList(listData._id, editedListData);
        }
        //editList(listData);
        onRequestClose();
        //clear data
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedListData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setErrorMessage('');
    };

    return (
        <BaseModal isOpen={isOpen} onRequestClose={onRequestClose} title="Edit List">
            <>
                <TextField
                    name="listName"
                    value={editedListData.listName}
                    onChange={handleInputChange}
                    label="Project Name"
                    variant="outlined"
                    fullWidth
                    required
                    error={errorMessage !== ''}
                    helperText={errorMessage}
                />
                <TextField
                    name="description"
                    value={editedListData.description}
                    onChange={handleInputChange}
                    label="Description"
                    variant="outlined"
                    fullWidth
                />
                {listData.type === "groupList" && (
                    <div className="form-control-with-adornment">
                        <FormControl fullWidth variant="outlined" size="small">
                            <InputLabel id="visibility-label">Visibility</InputLabel>
                            <Select
                                labelId="visibility-label"
                                id="visibility"
                                name="visibility"
                                value={editedListData.visibility}
                                onChange={handleInputChange}
                                label="Visibility"
                            >
                                <MenuItem value="private">Private</MenuItem>
                                <MenuItem value="public">Public</MenuItem>
                            </Select>
                        </FormControl>
                        <InputAdornment position="end">
                            <Tooltip title="Private lists can only be seen by you and your group members">
                                <IconButton>
                                    <Icon className="information-icon" path={mdiInformation} size={1.2} />
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    </div>
                )}
                <button className="modal-button" onClick={handleSubmit} variant="contained" color="primary">Save</button>
            </>
        </BaseModal>
    );
}

export default EditListModal;
