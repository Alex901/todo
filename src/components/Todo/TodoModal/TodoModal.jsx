import React, { useState, useEffect, useMemo } from 'react';
import ReactModal from 'react-modal';
import './TodoModal.css'
import { useTodoContext } from '../../../contexts/todoContexts';
import { useUserContext } from '../../../contexts/UserContext';
//import Select from 'react-select';
import { toast } from 'react-toastify';
import { Switch, TextField, Button, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Chip, Collapse } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Icon from '@mdi/react';
import { mdiDelete, mdiDeleteEmpty } from '@mdi/js';
import { useTranslation } from "react-i18next";
import BaseModal from './BaseModal/BaseModal';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import EmojiSelector from '../../UtilityComponents/EmojiSelector/EmojiSelector';
import useDynamicStep from '../../../CustomHooks/UseDynamicStep';
import { formatTime, getDateConstraints } from '../../../utils/timeUtils';


ReactModal.setAppElement('#root');

// When modal opens
document.body.classList.add('no-scroll');

// When modal closes
document.body.classList.remove('no-scroll');

const TodoModal = ({ isOpen, onRequestClose, initialData }) => {
    const { addTodo, todoList } = useTodoContext();
    const { isLoggedIn, loggedInUser, emojiSettings } = useUserContext();
    const [errorMessage, setErrorMessage] = useState('');
    const [hoveredStepId, setHoveredStepId] = useState(null);
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const [repeatable, setRepeatability] = useState(false);
    const [filteredList, setFilteredList] = useState(todoList);
    const [newTaskData, setNewTaskData] = useState({
        taskName: '',
        description: '',
        priority: '',
        isUrgent: false,
        dueDate: null,
        steps: [],
        difficulty: "",
        estimatedTime: 0,
        tags: [],
        tasksBefore: [],
        tasksAfter: [],
    });
    const [selectedTasksBefore, setSelectedTasksBefore] = useState([]);
    const [selectedTasksAfter, setSelectedTasksAfter] = useState([]);
    const [constraints, setConstraints] = useState({ min: null, max: null });


    useEffect(() => {
        if (initialData) {
            setNewTaskData((prevData) => ({
                ...prevData,
                tasksBefore: initialData.tasksBefore || [],
                tasksAfter: initialData.tasksAfter || [],
            }));
        }
    }, [initialData]);

    const step = useDynamicStep(newTaskData.estimatedTime || 0);

    useEffect(() => {
        setNewTaskData(prevData => ({
            ...prevData,
            ...(repeatable ? {
                repeatable: true,
                repeatInterval: '',
                repeatDays: [],
                repeatMonthlyOption: '',
                repeatYearlyOption: '',
                repeatUntill: null,
                repeatTimes: null,
                repeatableEmoji: '😊',
                repeatNotify: false,
                tasksAfter: [],
                tasksBefore: [],
            } : {
                repeatable: undefined,
                repeatInterval: undefined,
                repeatDays: undefined,
                repeatMonthlyOption: undefined,
                repeatYearlyOption: undefined,
                repeatUntill: undefined,
                repeatTimes: undefined,
                repeatableEmoji: undefined,
                repeatNotify: undefined,
                repeatableLongestStreak: undefined,
            })
        }));
    }, [repeatable]);

    useEffect(() => {
        const filteredTasks = todoList.filter(task => {
            if (repeatable) {
                return task.repeatable;
            }
            return task.inListNew.some(list => list.listName === loggedInUser.activeList) && !task.repeatable && !task.completed && !task.started;
        });
        setFilteredList(filteredTasks);
    }, [repeatable, todoList, loggedInUser.activeList]);

    useEffect(() => {
        if (newTaskData.repeatInterval === 'monthly' && newTaskData.repeatMonthlyOption === '') {
            setNewTaskData((prevData) => ({
                ...prevData,
                repeatMonthlyOption: 'start',
            }));
        } else if (newTaskData.repeatInterval === 'yearly' && newTaskData.repeatYearlyOption === '') {
            setNewTaskData((prevData) => ({
                ...prevData,
                repeatYearlyOption: 'start',
            }));
        }
    }, [newTaskData.repeatInterval]);

    const { t, i18n } = useTranslation();

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


    const handleToggleAdvancedOptions = () => {
        setShowAdvancedOptions(!showAdvancedOptions);
    };

    const handleEmojiSelect = (emoji) => {
        // console.log("DEBUG - SelectedEmoji: ", emoji);
        setNewTaskData(prevData => ({
            ...prevData,
            repeatableEmoji: emoji
        }));
    };

    const handleInputChange = (event) => {
        let value = event.target.value;
        const name = event.target.name;
        // console.log("DEBUG - Name: ", name, " Value: ", value);

        // Special case for estimatedTime input
        if (name === 'estimatedTime') {
            value = parseInt(value, 10);
        }

        // Handle array fields like tasksBefore and tasksAfter
        if (name === 'tasksBefore' || name === 'tasksAfter') {
            console.log("DEBUG -- It is a linked task")
            console.log("DEBUG - Name: ", name, " Value: ", value);
            setNewTaskData((prevData) => ({
                ...prevData,
                [name]: Array.isArray(value) ? value : [value],
            }));
            if (name === 'tasksBefore') {
                setSelectedTasksBefore(Array.isArray(value) ? value : [value]);
            } else if (name === 'tasksAfter') {
                setSelectedTasksAfter(Array.isArray(value) ? value : [value]);
            }
        } else {
            setNewTaskData({
                ...newTaskData,
                [name]: value,
            });
        }

        setErrorMessage('');
    };

    const handleToggleChange = (event) => {
        const { name, checked } = event.target;
        setNewTaskData((prevData) => ({
            ...prevData,
            [name]: checked,
        }));
    };

    const handleRepeatDaysChange = (event) => {
        const { name, checked } = event.target;
        setNewTaskData((prevData) => ({
            ...prevData,
            repeatDays: checked
                ? [...prevData.repeatDays, name]
                : prevData.repeatDays.filter((day) => day !== name),
        }));
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

    const handleRepeatableChange = (event) => {
        setRepeatability(event.target.checked);
    };

    const handleSelectChange = (event) => {
        const { name, value } = event.target;

        setNewTaskData({
            ...newTaskData,
            [name]: value,
        });

        console.log(newTaskData);
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

        if (repeatable && !newTaskData.repeatInterval) {
            setErrorMessage('Please select a repeat interval');
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
            tags: [],
            tasksBefore: [],
            tasksAfter: [],
        });
        setRepeatability(false);
        setShowAdvancedOptions(false);
        setSelectedTasksBefore([]);
        setSelectedTasksAfter([]);
        setConstraints({ min: null, max: null });
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
            onrejectionhandled();
            setErrorMessage('');
        }
    }

    const handleAddStep = () => {
        if (newTaskData.steps.length < 20) {
            setNewTaskData(prevData => ({
                ...prevData,
                steps: [...prevData.steps, { id: prevData.steps.length + 1, taskName: '', isDone: false }]
            }));
        } else {
            setErrorMessage('You can max have 20 steps');
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

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(newTaskData.steps);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update your state with the new order
        setNewTaskData({ ...newTaskData, steps: items });
    };

    const handleDeleteStep = (stepId) => {
        setNewTaskData(prevState => {
            const updatedSteps = prevState.steps.filter(step => step.id !== stepId).map((step, index) => ({
                ...step,
                id: index + 1
            }));
            return {
                ...prevState,
                steps: updatedSteps
            };
        });
    };

    const handleRequestClose = () => {
        setNewTaskData({
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
        setRepeatability(false);
        setErrorMessage('');
        setShowAdvancedOptions(false);
        onRequestClose();
        setSelectedTasksBefore([]);
        setSelectedTasksAfter([]);
        setConstraints({ min: null, max: null });
    }

    const tasksBeforeOptions = filteredList.filter(task => !(newTaskData.tasksAfter || []).includes(task._id));
    const tasksAfterOptions = filteredList.filter(task => !(newTaskData.tasksBefore || []).includes(task._id));

    useMemo(() => {
        // Map selected task IDs to their corresponding task objects
        const beforeTasks = selectedTasksBefore.map((id) => todoList.find((task) => task._id === id)).filter(Boolean);
        const afterTasks = selectedTasksAfter.map((id) => todoList.find((task) => task._id === id)).filter(Boolean);

        // console.log("DEBUG - Tasks Options selected Before: ", beforeTasks);
        // console.log("DEBUG - Tasks Options selected After: ", afterTasks);

        // Calculate constraints based on the selected tasks
        const { min, max } = getDateConstraints(beforeTasks, afterTasks);

        // console.log("DEBUG - Calculated Constraints: ", { min, max });

        // Update the state with the new constraints
        setConstraints({ min, max });
    }, [selectedTasksBefore, selectedTasksAfter, todoList]);


    return (

        <BaseModal
            isOpen={isOpen}
            onRequestClose={handleRequestClose}
            contentLabel="Add new todo task"
            className="modal-content"
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
            title="Create task"
        >

            {isLoggedIn ? (

                <form className="create-entry-form" onSubmit={handleSubmit} style={{}}>
                    <TextField
                        id="taskName"
                        label="Enter task name*"
                        variant="outlined"
                        onChange={handleInputChange}
                        className='create-modal-input create-modal-name-input'
                        onKeyDownCapture={handleKeyPress}
                        autoFocus
                        inputProps={{ maxLength: 70 }}
                        name='taskName'
                    />
                    <div className="repeatable-coutaniner">
                        <div className="repeatable-header">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={repeatable}
                                        onChange={handleRepeatableChange}
                                        name="repeatable"
                                        color="primary"
                                    />
                                }
                                label="Repeatable"
                            />
                        </div>

                        <CSSTransition
                            in={repeatable}
                            timeout={300}
                            classNames="fade"
                            unmountOnExit
                        >


                            <div className="repeatable-main-options">
                                {repeatable && (
                                    <>
                                        <EmojiSelector
                                            selectedEmoji={newTaskData.repeatableEmoji}
                                            onEmojiSelect={handleEmojiSelect}
                                            userEmojiList={emojiSettings}
                                        />

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={newTaskData.repeatNotify || false}
                                                    onChange={handleToggleChange}
                                                    name="repeatNotify"
                                                    color="primary"
                                                />
                                            }
                                            label="Enable Notifications"
                                            style={{ display: 'flex', alignItems: 'center' }}
                                        />

                                        <FormControl variant="outlined" style={{ minWidth: '146px', justifyContent: 'center' }} size='small'>
                                            <InputLabel id="repeat-interval-label">Repeat Interval</InputLabel>
                                            <Select
                                                name="repeatInterval"
                                                labelId="repeat-interval-label"
                                                id="repeat-interval"
                                                value={newTaskData.repeatInterval || ''}
                                                onChange={handleSelectChange}
                                                label="Repeat Interval"
                                            >
                                                <MenuItem value="daily">Daily</MenuItem>
                                                <MenuItem value="weekly">Weekly</MenuItem>
                                                <MenuItem value="monthly">Monthly</MenuItem>
                                                <MenuItem value="yearly">Yearly</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </>
                                )}
                            </div>
                        </CSSTransition>

                        <>
                            <CSSTransition
                                in={newTaskData.repeatInterval !== ''}
                                timeout={300}
                                classNames="fade"
                                unmountOnExit
                            >

                                <div className="repeatable-interval-options">
                                    {newTaskData.repeatInterval === 'daily' && (
                                        <FormControl variant="outlined" style={{ minWidth: '150px' }} size='small'>
                                            <TextField
                                                label="Repeat Until"
                                                type="date"
                                                name="repeatUntil"
                                                onChange={handleInputChange}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </FormControl>
                                    )}

                                    {newTaskData.repeatInterval === 'weekly' && (
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                                <div key={day} style={{ textAlign: 'center', margin: '0 0x' }}>
                                                    <div style={{ marginBottom: '-5px' }}>{day.charAt(0)}</div>
                                                    <Checkbox
                                                        checked={newTaskData.repeatDays.includes(day)}
                                                        onChange={handleRepeatDaysChange}
                                                        name={day}
                                                        color="primary"
                                                        style={{ padding: '0 0px' }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {newTaskData.repeatInterval === 'monthly' && (


                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span>Start</span>
                                            <Switch
                                                checked={newTaskData.repeatMonthlyOption === 'end'}
                                                onChange={(event) => setNewTaskData((prevData) => ({
                                                    ...prevData,
                                                    repeatMonthlyOption: event.target.checked ? 'end' : 'start',
                                                }))}
                                                color="primary"
                                                name="repeatMonthlyOption"
                                                inputProps={{ 'aria-label': 'Monthly Option' }}
                                            />
                                            <span>End</span>
                                        </div>

                                    )}

                                    {newTaskData.repeatInterval === 'yearly' && (
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span>Start</span>
                                            <Switch
                                                checked={newTaskData.repeatYearlyOption === 'end'}
                                                onChange={(event) => setNewTaskData((prevData) => ({
                                                    ...prevData,
                                                    repeatYearlyOption: event.target.checked ? 'end' : 'start',
                                                }))}
                                                color="primary"
                                                name="repeatYearlyOption"
                                                inputProps={{ 'aria-label': 'Yearly Option' }}
                                            />
                                            <span>End</span>
                                        </div>
                                    )}




                                    {['weekly', 'monthly', 'yearly'].includes(newTaskData.repeatInterval) && (
                                        <FormControl variant="outlined" style={{ minWidth: '150px' }} size='small'>
                                            <TextField
                                                label="Repeat Until"
                                                type="date"
                                                name="repeatUntil"
                                                onChange={handleInputChange}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </FormControl>
                                    )}
                                </div>
                            </CSSTransition>
                        </>
                    </div>



                    <Button onClick={handleToggleAdvancedOptions} style={{ margin: `10px 0 ${showAdvancedOptions ? '10px' : '0'} 0` }}>
                        {showAdvancedOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}
                    </Button>
                    <div className={`advanced-options ${showAdvancedOptions ? 'show' : 'hide'}`}>
                        <TextField
                            id="description"
                            label="Enter task description"
                            variant="outlined"
                            multiline
                            rows={4}
                            onChange={handleInputChange}
                            className='create-modal-input-description'
                            inputProps={{ maxLength: 500 }}
                            name="description"
                        />




                        <div className="input-container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: '20px' }}>
                            {!repeatable && (
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
                                            inputProps={{
                                                min: constraints.min, // Set the minimum date to current date
                                                max: constraints.max, // Set the maximum date based on tasksBeforeOptions
                                            }}
                                        />
                                    </FormControl>
                                </div>
                            )}

                            <FormControl variant="outlined" size="small" style={{ width: '140px', marginRight: '20px' }}>
                                <InputLabel id="priority-label">Priority</InputLabel>
                                <Select
                                    labelId="priority-label"
                                    name="priority"
                                    defaultValue="NORMAL"
                                    onChange={handleSelectChange}
                                    label="Priority"
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
                                    step: step,
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
                        <div className="tags-container-create" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: '20px', flexWrap: 'wrap' }}>
                            <FormControl variant="outlined" style={{ minWidth: '100px', width: 'auto', height: 'auto' }} size='small'>
                                <InputLabel id="tags-label">Tags</InputLabel>
                                <Select

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
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
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
                        </div>
                        {!repeatable && (
                            <div className="linked-tasks-container">
                                <FormControl className="linked-tasks-form-control" style={{ minWidth: '100px', width: 'auto', height: 'auto' }} size='small'>
                                    <InputLabel id="tasks-before-label">Tasks Before</InputLabel>
                                    <Select
                                        name="tasksBefore"
                                        size='small'
                                        label="Tasks Before"
                                        multiple
                                        value={newTaskData.tasksBefore || []}
                                        onChange={handleInputChange}
                                        renderValue={(selected) => selected.map(id => tasksBeforeOptions.find(task => task._id === id)?.task).join(', ')}
                                    >
                                        {tasksBeforeOptions.map((task) => (
                                            <MenuItem key={task._id} value={task._id}>
                                                {task.task}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl className="linked-tasks-form-control" style={{ minWidth: '100px', width: 'auto', height: 'auto' }} size='small'>
                                    <InputLabel id="tasks-after-label">Tasks After</InputLabel>
                                    <Select
                                        name="tasksAfter"
                                        size='small'
                                        label="Tasks After"
                                        multiple
                                        value={newTaskData.tasksAfter || []}
                                        onChange={handleInputChange}
                                        renderValue={(selected) => selected.map(id => tasksAfterOptions.find(task => task._id === id)?.task).join(', ')}
                                    >
                                        {tasksAfterOptions.map((task) => (
                                            <MenuItem key={task._id} value={task._id}>
                                                {task.task}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        )}

                        <hr style={{ width: '80%', margin: '10px auto' }} />

                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Droppable droppableId="newTaskSteps">
                                {(provided) => (
                                    <div
                                        className="steps"
                                        style={{ width: '100%', justifyContent: 'left' }}
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        <TransitionGroup>
                                            {newTaskData.steps.map((step, index) => (
                                                <Draggable key={step.id} draggableId={String(step.id)} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            className="drag"
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{
                                                                transform: 'none',
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                                ...provided.draggableProps.style,
                                                            }}
                                                        >
                                                            <label style={{ display: 'flex', alignItems: 'center' }}>{`#${index + 1}`}</label>
                                                            <input
                                                                className="create-modal-input"
                                                                type="text"
                                                                placeholder={`Enter step title`}
                                                                onChange={(event) => handleInputChangeStep(step.id, event)}
                                                                value={step.taskName}
                                                                maxLength="50"
                                                            />
                                                            <div
                                                                onMouseEnter={() => setHoveredStepId(step.id)}
                                                                onMouseLeave={() => setHoveredStepId(null)}
                                                            >
                                                                <Icon
                                                                    path={hoveredStepId === step.id ? mdiDeleteEmpty : mdiDelete}
                                                                    size={1.2}
                                                                    color={hoveredStepId === step.id ? 'red' : 'gray'}
                                                                    onClick={() => handleDeleteStep(step.id)}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        </TransitionGroup>
                                        {provided.placeholder}
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <p className="add-step" onClick={handleAddStep}>
                                                <strong>add step</strong>
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>

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
        </BaseModal>

    )
}

export default TodoModal;