import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import './TodoModal.css'
import { useTodoContext } from '../../../contexts/todoContexts';
import { useUserContext } from '../../../contexts/UserContext';
//import Select from 'react-select';
import { toast } from 'react-toastify';
import { TextField, Button, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Chip } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

ReactModal.setAppElement('#root');

// When modal opens
document.body.classList.add('no-scroll');

// When modal closes
document.body.classList.remove('no-scroll');

const TodoModal = ({ isOpen, onRequestClose }) => {
    const { addTodo } = useTodoContext();
    const [errorMessage, setErrorMessage] = useState('');
    const { isLoggedIn, loggedInUser } = useUserContext();

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


    const [newTaskData, setNewTaskData] = useState({
        taskName: '',
        description: '',
        priority: '',
        isUrgent: false,
        dueDate: null,
        steps: [],
        difficulty: "",
        estimatedTime: 0,
        tags: []
    });

    const handleInputChange = (event) => {
        let value = event.target.value;

        // Special case for estimatedTime input
        if (event.target.name === 'estimatedTime') {
            value = parseInt(value, 10);
        }

        setNewTaskData({
            ...newTaskData,
            [event.target.name]: value,
        });
        setErrorMessage('');
    };

    const handleTagChange = (event) => {
        setNewTaskData({
            ...newTaskData,
            tags: event.target.value,
        })
    }

    const handleCheckboxChange = (event) => {
        setNewTaskData({
            ...newTaskData,
            [event.target.name]: event.target.checked,
        });
    };

    const handleSelectChange = (event) => {
        const selectedOption = event.target.value;

        if (options.some(option => option.value === selectedOption)) {
            setNewTaskData({
                ...newTaskData,
                priority: selectedOption,
            });
        }
    };


    const handleSubmit = () => {
        event.preventDefault();
        if (!newTaskData.taskName.trim()) {
            setErrorMessage('You need to enter a task name');
            return;
        }

        const allStepsHaveName = newTaskData.steps.length === 0 || newTaskData.steps.every(step => step.taskName.trim() !== '');

        if (!allStepsHaveName) {
            setErrorMessage('You need to enter all step names');
            return;
        }

        addTodo(newTaskData);
        toast.success('Task successfully created');
        onRequestClose();
        setErrorMessage('');
        setNewTaskData({ //Reset the form
            taskName: '',
            description: '',
            priority: '',
            isUrgent: false,
            dueDate: null,
            steps: [],
            difficulty: "",
            estimatedTime: null,
            tags: []
        });
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
            onrejectionhandled();
            setErrorMessage('');
        }
    }

    const handleAddStep = () => {
        if (newTaskData.steps.length < 10) {
            setNewTaskData(prevData => ({
                ...prevData,
                steps: [...prevData.steps, { id: prevData.steps.length + 1, taskName: '', isDone: false }]
            }));
        } else {
            setErrorMessage('You can only add 10 steps');
            setTimeout(() => { setErrorMessage('') }, 5000);
            return;
        }
    };

    const handleInputChangeStep = (id, event) => {
        setNewTaskData(prevData => ({
            ...prevData,
            steps: prevData.steps.map(step =>
                step.id === id ? { ...step, taskName: event.target.value } : step
            ),
        }));
    };

    const handleDiffChange = (selectedOption) => {
        setNewTaskData({
            ...newTaskData,
            difficulty: selectedOption.target.value,
        });
    };

    function handleAddChip(chipToAdd) {
        setNewTaskData((prevData) => ({
            ...prevData,
            tags: [...prevData.tags, chipToAdd],
        }));
    }

    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}min`;
    };

    return (

        <ReactModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add new todo task"
            className="modal-content"
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
        >


            <div className='modalTitle' style={{ textAlign: 'center' }}> <h3 className="title"> Create task </h3></div>

            {isLoggedIn ? (

                <form className="create-entry-form" onSubmit={handleSubmit} style={{ gap: '15px' }}>
                    <TextField
                        id="taskName"
                        label="Enter task name"
                        variant="outlined"
                        onChange={handleInputChange}
                        className='create-modal-input create-modal-name-input'
                        onKeyDownCapture={handleKeyPress}
                        autoFocus
                        inputProps={{ maxLength: 70 }}
                        name='taskName'
                    />
                    <TextField
                        id="description"
                        label="Enter task description(optional)"
                        variant="outlined"
                        multiline
                        rows={4}
                        onChange={handleInputChange}
                        className='create-modal-input-description'
                        inputProps={{ maxLength: 500 }}
                        name="description"
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
                                defaultValue=""
                                onChange={handleSelectChange}
                                label="Priority" // Add this line
                            >
                                {options.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    <div className="input-container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: '20px' }}>
                        <TextField
                            type='number'
                            className='modal-input-date'
                            onChange={handleInputChange}
                            name='estimatedTime'
                            label="Est. Time(min)"
                            size="small" // Set size to small
                            style={{ width: '100px', textAlign: 'center' }} // Set width to 60px
                            placeholder='Minutes'
                            inputProps={{
                                min: '0', // Set the minimum value
                                step: '5' // 5 min increments
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end"></InputAdornment>,
                            }}
                        />

                        {newTaskData.estimatedTime >= 60 && (
                            <div style={{ width: '80px', textAlign: 'center' }}>
                                <strong>{formatTime(newTaskData.estimatedTime)}</strong>
                            </div>
                        )}


                        <FormControl variant="outlined" size="small" style={{ width: '140px' }}>
                            <InputLabel id="difficulty-label">Difficulty</InputLabel>
                            <Select
                                labelId="difficulty-label"
                                id="difficulty"
                                defaultValue=""
                                onChange={handleDiffChange}
                                label="Difficulty"
                            >
                                {optionsDiff.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>



                    </div>
                    <div className="tags-container-create" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
                        <FormControl variant="outlined" style={{ minWidth: '100px', width: 'auto', height: 'auto' }} size='small'>
                            <InputLabel id="tags-label">Tags</InputLabel>
                            <Select

                                label="Tags"
                                multiple
                                size="small"
                                value={newTaskData.tags}
                                onChange={handleTagChange}
                                name='tags'
                                renderValue={(selected) => (

                                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {selected.map((tag) => (
                                            <Chip
                                                key={tag.label}
                                                label={tag.label}
                                                style={{ backgroundColor: tag.color, color: tag.textColor, margin: '2px', flexBasis: '20%' }}
                                            />
                                        ))}
                                    </div>
                                )}
                            >
                                {loggedInUser && loggedInUser.myLists && loggedInUser.myLists.filter(list => list.listName === loggedInUser.activeList).map((list) => (
                                    list.tags.map((tag) => (
                                        <MenuItem key={tag.label} value={tag}>
                                            <Chip
                                                key={tag.label}
                                                label={tag.label}
                                                clickable
                                                onClick={() => handleAddChip(tag)}
                                                style={{ backgroundColor: tag.color, color: tag.textColor }}
                                            />
                                        </MenuItem>
                                    ))
                                ))}
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id='isUrgent'
                                    name='isUrgent'
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label="Urgent?"
                        />

                    </div>




                    <hr style={{ width: '80%', margin: '10px auto' }} />

                    <div className='steps' style={{ width: '100%', justifyContent: 'left' }}>
                        {newTaskData.steps.map(step => (
                            <div key={step.id} style={{ display: 'flex', flexDirection: 'row' }}>
                                <label style={{ display: 'flex', alignItems: 'center' }}>{`Step${step.id}`}</label>
                                <input className='create-modal-input' type='text' placeholder={`Enter step title`}
                                    onChange={event => handleInputChangeStep(step.id, event)} value={newTaskData.steps[step.id - 1].value} maxLength='50' />
                            </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <p className='add-step' onClick={handleAddStep} style={{}}> <strong> add step </strong> </p> </div>
                    </div>
                    <hr style={{ width: '80%', margin: '10px auto' }} />


                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <button className='modal-button' type="submit" style={{ textAlign: 'center' }}>
                        Submit
                    </button>
                </form>
            ) : (
                <form className="create-entry-form" onSubmit={handleSubmit}>
                    <TextField
                        id="taskName"
                        label="Enter task name"
                        variant="outlined"
                        onChange={handleInputChange}
                        className='create-modal-input create-modal-name-input'
                        onKeyDownCapture={handleKeyPress}
                        autoFocus
                        inputProps={{ maxLength: 70 }}
                        name='taskName'
                    />
                    <TextField
                        id="description"
                        label="Enter task description(optional)"
                        variant="outlined"
                        multiline
                        rows={4}
                        onChange={handleInputChange}
                        className='create-modal-input-description'
                        inputProps={{ maxLength: 500 }}
                        name="description"
                    />
                    <hr style={{ width: '80%', margin: '10px auto' }} />
                    <h4 style={{ color: 'red' }}> Log in for more features </h4>
                    <hr style={{ width: '80%', margin: '10px auto' }} />

                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <button className='modal-button' type='button'> Submit </button>
                </form>
            )}
        </ReactModal>

    )
}

export default TodoModal;