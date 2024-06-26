import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import './EditModal.css'
import { useTodoContext } from '../../../../contexts/todoContexts';
import { useUserContext } from '../../../../contexts/UserContext';
import { mdiDelete, mdiDeleteEmpty } from '@mdi/js';
import { TextField, Button, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Chip } from '@mui/material';
import Icon from '@mdi/react';
import { toast } from 'react-toastify';

ReactModal.setAppElement('#root');

const EditModal = ({ isOpen, onRequestClose, editData }) => {
    const { editTodo } = useTodoContext();
    const [errorMessage, setErrorMessage] = useState('');
    const { loggedInUser, isLoggedIn } = useUserContext();
    const [selectedOption, setSelectedOption] = useState(null);
    const [hoveredStepId, setHoveredStepId] = useState(null);
    const [loading, setLoading] = useState(true);

    const options = [
        { value: 'VERY HIGH', label: 'VERY HIGH' },
        { value: 'HIGH', label: 'HIGH' },
        { value: 'NORMAL', label: 'NORMAL' },
        { value: 'LOW', label: 'LOW' },
        { value: 'VERY LOW', label: 'VERY LOW' }
    ];

    const optionsDiff = [
        { value: 'VERY EASY', label: 'VERY EASY' },
        { value: 'EASY', label: 'EASY' },
        { value: 'NORMAL', label: 'NORMAL' },
        { value: 'HARD', label: 'HARD' },
        { value: 'VERY HARD', label: 'VERY HARD' },
    ];

    const [taskData, setTaskData] = useState({
        id: editData.id,
        task: editData.task,
        description: editData.description,
        priority: editData?.priority || '',
        isUrgent: editData.isUrgent,
        dueDate: editData.dueDate,
        steps: editData.steps,
        difficulty: editData.difficulty,
        estimatedTime: editData.estimatedTime,
        inList: editData.inList,
        tags: editData.tags,
    });

    const selectedListValues = editData?.inList;
    const optionsListNames = isLoggedIn && loggedInUser.listNames
        ? loggedInUser.listNames
            .filter(item => !taskData.inList.includes(item.name))
            .map(item => ({ value: item.name, label: item.name }))
        : [];

    const includedListNames = isLoggedIn && loggedInUser.listNames
        ? loggedInUser.listNames
            .filter(item => taskData.inList.includes(item.name))
            .map(item => ({ value: item.name, label: item.name }))
        : [];

    const activeList = isLoggedIn && loggedInUser.listNames
        ? loggedInUser.listNames.find(list => list.name === loggedInUser.activeList)
        : null;

    const optionsTagNames = activeList && activeList.tags
        ? activeList.tags
            .filter(item => !taskData.tags.map(tag => tag.label).includes(item.label))
            .map(item => item)
        : [];

    const handleInputChange = (event) => {
        let value = event.target.value;
        console.log("Value", value);

        if (event.target.name === 'dueDate') {
            value = new Date(value);
        }

        setErrorMessage('');
        setTaskData({
            ...taskData,
            [event.target.name]: value
        });
        console.log("Task data", taskData);
    };

    const handleSubmit = () => {
        event.preventDefault();
        console.log("TodoModal -> newTaskData", taskData);
        if (!taskData.task.trim()) {
            setErrorMessage('You need to enter a task name');
            return;
        }

        const allStepsHaveName = taskData.steps.length === 0 || taskData.steps.every(step => step.taskName.trim() !== '');

        if (!allStepsHaveName) {
            setErrorMessage('You need to enter all step names');
            return;
        }
        editTodo(taskData);
        toast.success('Changes saved');

        onRequestClose();
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    }

    const handleSelectChange = (selectedOption) => {
        console.log("Selected option", selectedOption.target.value); //correct
        setTaskData({
            ...taskData,
            priority: selectedOption.target.value
        });
        console.log("Task data", taskData); //undefined
    }

    const handleCheckboxChange = (event) => {
        setTaskData({
            ...taskData,
            isUrgent: event.target.checked
        });
    }

    const handleDiffChange = (selectedOption) => {
        console.log("Selected option", selectedOption.target.value);
        setTaskData({
            ...taskData,
            difficulty: selectedOption.target.value
        });
    }

    const handleInputChangeStep = (id, event) => {
        setTaskData(prevData => ({
            ...prevData,
            steps: prevData.steps.map(step =>
                step._id === id ? { ...step, taskName: event.target.value } : step
            )
        }));
    };

    const handleAddStep = () => {
        if (taskData.steps.length < 10) {
            setTaskData(prevData => ({
                ...prevData,
                steps: [...prevData.steps, { taskName: '', isDone: false, _id: generateNewId() }]
            }));
        } else {
            setErrorMessage('You can only add 10 steps');
            setTimeout(() => { setErrorMessage('') }, 5000);
            return;
        }
    };

    const handleAddToList = (event) => {
        event.preventDefault();
        if (selectedOption === null) {
            setErrorMessage('You need to select a list');
            setTimeout(() => { setErrorMessage('') }, 5000);
            return;
        }
        setTaskData(prevData => ({
            ...prevData,
            inList: [...prevData.inList, selectedOption.value]
        }));
        setSelectedOption(null);
    }

    const handleListChange = (event) => {
        console.log("Selected option", event.target.value);
        const newList = event.target.value;
        setTaskData(prevEditData => ({
            ...prevEditData,
            inList: [...prevEditData.inList, newList[event.target.value.length - 1]]
        }));
        console.log("Task data", taskData);
    };

    const handleRemoveFromList = (listName) => {
        if (listName === "all") {
            setErrorMessage('You cannot remove this list');
            setTimeout(() => { setErrorMessage('') }, 5000);
            return;
        }
        setTaskData(prevData => ({
            ...prevData,
            inList: prevData.inList.filter(name => name !== listName)
        }));
    }

    const handleDeleteStep = (stepId) => {
        console.log("Delete step", stepId);
        setTaskData(prevState => ({
            ...prevState,
            steps: prevState.steps.filter(step => step._id !== stepId)
        }));
    };
    //lol
    const generateNewId = () => {
        return [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    };

    const handleRemoveTag = (tagId) => {
        console.log("Remove tag", tagId);
        setTaskData(prevData => ({
            ...prevData,
            tags: prevData.tags.filter(tag => tag._id !== tagId._id)
        }));
    }


    const handleTagChange = (tag) => {
        console.log("Selected tag", tag);

        setTaskData(prevData => ({
            ...prevData,
            tags: [...prevData.tags, tag]
        }));
        console.log("Task data", taskData);
    }

    const handleAddChip = (tag) => {
        console.log("Add chip", tag);
        setTaskData(prevData => ({
            ...prevData,
            tags: [...prevData.tags, tag]
        }));
        console.log("Task data", taskData);
    }

    //I steal the ccs classes from my create modal -- don't judge me, haha
    return (

        <ReactModal
            isOpen={isOpen}
            contentLabel="Edit todo task"
            className="modal-content"
            onRequestClose={() => {
                toast.warn('Edit canceled -- changes not saved');
                onRequestClose();
            }}
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
        >
            <div className="modal-title" style={{ textAlign: 'center' }}>
                <h3 className='title' style={{ marginTop: '0', marginBottom: '15px' }}> Edit task</h3>
            </div>

            {isLoggedIn ? (
                <form className='edit-entry-form' onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '5px' }}>


                    <TextField
                        label='Task name'
                        name='task'
                        type='text'
                        placeholder='Enter task name'
                        value={taskData.task}
                        onChange={handleInputChange}
                        onKeyDownCapture={handleKeyPress}
                        autoFocus
                        variant="outlined"
                        fullWidth
                        sx={{ '.MuiOutlinedInput-root': { marginTop: '0px', marginBottom: '15px' } }}
                    />

                    <TextField
                        label='Description'
                        placeholder='Enter task description(optional)'
                        maxLength={500}
                        rows={4}
                        onChange={handleInputChange}
                        name="description"
                        value={taskData.description}
                        multiline
                        variant="outlined"
                        fullWidth
                        sx={{ '.MuiOutlinedInput-root': { marginTop: '0px', marginBottom: '15px' } }}
                    />
                    <hr style={{ width: '80%', margin: '10px auto' }} />

                    <div className="input-container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: '20px' }}>
                        <FormControl style={{ width: '200px' }}>
                            <TextField
                                id="dueDate"
                                type="datetime-local"
                                label="Deadline"
                                className='modal-input-date'
                                onChange={handleInputChange}
                                name='dueDate'
                                value={taskData.dueDate ? new Date(taskData.dueDate).toISOString().substring(0, 16) : ""}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>

                        <FormControl variant="outlined" size="small" style={{ width: '140px', marginRight: '20px' }}>
                            <InputLabel id="priority-label">Priority</InputLabel>
                            <Select
                                labelId="priority-label"
                                id="priority"
                                value={taskData.priority || ''}
                                onChange={handleSelectChange}
                                label="Priority"
                            >
                                {taskData.priority !== null && options.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>


                    <div className="input-container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: '20px', marginTop: '14px' }}>
                        <TextField
                            type="number"
                            className="modal-input-date"
                            onChange={handleInputChange}
                            name="estimatedTime"
                            label="Est. Time"
                            size="small"
                            style={{ width: '100px', textAlign: 'center' }}
                            placeholder="Time"
                            inputProps={{ min: '0' }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">h</InputAdornment>,
                            }}
                            value={taskData.estimatedTime}
                        />

                        <FormControl variant="outlined" size="small" style={{ width: '140px' }}>
                            <InputLabel id="difficulty-label">Difficulty</InputLabel>
                            <Select
                                labelId="difficulty-label"
                                id="difficulty"
                                defaultValue={taskData.difficulty || ''}
                                onChange={handleDiffChange}
                                label="Difficulty"
                                value={taskData.difficulty}
                            >
                                {optionsDiff.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    id="isUrgent"
                                    name="isUrgent"
                                    onChange={handleCheckboxChange}
                                    checked={taskData.isUrgent}
                                />
                            }
                            label="Urgent?"
                        />
                    </div>
                    <hr style={{ width: '80%', margin: '10px auto' }} />
                    <div className="tags-lists-container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: '20px', marginTop: '10px' }}>
                        <FormControl variant="outlined" style={{ minWidth: '100px', width: 'auto', height: 'auto' }} size='small'>
                            <InputLabel id="list-label">Add to list</InputLabel>
                            <Select
                                labelId="list-label"
                                id="list"
                                multiple
                                value={[]}
                                onChange={handleListChange}
                                label="Add to list"
                            >
                                {optionsListNames.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div className="included-lists-chips" style={{ width: '80%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>

                            {includedListNames.map((value) => (
                                <Chip key={value.value} label={value.label} onDelete={() => handleRemoveFromList(value.value)} />
                            ))}
                        </div>
                    </div>

                    <div className="tags-lists-container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: '20px', marginTop: '10px' }}>
                        <FormControl variant="outlined" style={{ minWidth: '100px', width: 'auto', height: 'auto' }} size='small'>
                            <InputLabel id="tag-label">Add tag</InputLabel>
                            <Select
                                labelId="tag-label"
                                id="tag"
                                multiple
                                value={[]} // assuming editData.tags is an array of selected tag objects
                                onChange={event => {
                                    const selectedTagLabel = event.target.value;
                                    if (!selectedTagLabel) {
                                        // handle the case where no tags are selected
                                        handleTagChange([]);
                                    } else {
                                        const selectedTagObject = optionsTagNames.find(tag => selectedTagLabel.includes(tag.label));
                                        console.log("Selected tag objects", selectedTagObject);
                                        handleTagChange(selectedTagObject);
                                    }
                                }}
                                label="Add to tag"
                                style={{ cursor: 'pointer' }}
                            >
                                {optionsTagNames.map((tag) => (
                                    <MenuItem key={tag.label} value={tag.label}>
                                        <Chip
                                            key={tag.label}
                                            label={tag.label}
                                            clickable
                                            style={{ backgroundColor: tag.color, color: tag.textColor, cursor: 'pointer' }}
                                        />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div className="included-tags-chips" style={{ width: '80%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                            {taskData.tags.map((tag) => (
                                <Chip key={tag.label} label={tag.label} onDelete={() => handleRemoveTag(tag)} style={{ backgroundColor: tag.color, color: tag.textColor }} />
                            ))}
                        </div>
                    </div>

                    <hr style={{ width: '80%', margin: '10px auto' }} />
                    <div className='steps' style={{ width: '100%', justifyContent: 'left' }}>
                        {taskData.steps.map((step, index) => (
                            <div key={step.id} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <label style={{ display: 'flex', alignItems: 'center' }}>{`Step${index + 1}`}</label>
                                <input className='create-modal-input' type='text' placeholder={`Enter subTask`}
                                    onChange={event => handleInputChangeStep(step._id, event)}
                                    defaultValue={taskData.steps.find(s => s._id === step._id).taskName || ''} maxLength='50' />
                                <div onMouseEnter={() => setHoveredStepId(step._id)} onMouseLeave={() => setHoveredStepId(null)}>
                                    <Icon
                                        path={hoveredStepId === step._id ? mdiDeleteEmpty : mdiDelete}
                                        size={1.2}
                                        color={hoveredStepId === step._id ? "initial" : "gray"}
                                        onClick={() => handleDeleteStep(step._id)}
                                    />
                                </div>
                            </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <p className='add-step' onClick={handleAddStep} style={{}}> <strong> add step </strong> </p> </div>
                    </div>
                    <hr style={{ width: '80%', margin: '10px auto' }} />


                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <div className='save-button-div'>
                        <button className='modal-button'> Save </button>
                    </div>
                </form>
            ) : (
                <form className='edit-entry-form' onSubmit={handleSubmit}>
                       <TextField
                        label='Task name'
                        name='task'
                        type='text'
                        placeholder='Enter task name'
                        value={taskData.task}
                        onChange={handleInputChange}
                        onKeyDownCapture={handleKeyPress}
                        autoFocus
                        variant="outlined"
                        fullWidth
                        sx={{ '.MuiOutlinedInput-root': { marginTop: '0px', marginBottom: '15px' } }}
                    />

                    <TextField
                        label='Description'
                        placeholder='Enter task description(optional)'
                        maxLength={500}
                        rows={4}
                        onChange={handleInputChange}
                        name="description"
                        value={taskData.description}
                        multiline
                        variant="outlined"
                        fullWidth
                        sx={{ '.MuiOutlinedInput-root': { marginTop: '0px', marginBottom: '15px' } }}
                    />
                    <hr style={{ width: '80%', margin: '10px auto' }} />
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <button className='modal-button'> Save </button>
                </form>
            )}
        </ReactModal>

    )
}

export default EditModal;