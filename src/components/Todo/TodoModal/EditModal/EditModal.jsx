import React, { useState, useEffect } from 'react';
import BaseModal from '../BaseModal/BaseModal';
import './EditModal.css'
import { useTodoContext } from '../../../../contexts/todoContexts';
import { useUserContext } from '../../../../contexts/UserContext';
import { mdiDelete, mdiDeleteEmpty } from '@mdi/js';
import { TextField, Button, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Chip, Switch } from '@mui/material';
import Icon from '@mdi/react';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import EmojiSelector from '../../../UtilityComponents/EmojiSelector/EmojiSelector';
import useDynamicStep from '../../../../CustomHooks/UseDynamicStep';
import { formatTime } from '../../../../utils/timeUtils';


const EditModal = ({ isOpen, onRequestClose, editData }) => {
    const { editTodo } = useTodoContext();
    const [errorMessage, setErrorMessage] = useState('');
    const { loggedInUser, isLoggedIn, emojiSettings } = useUserContext();
    const [selectedOption, setSelectedOption] = useState(null);
    const [hoveredStepId, setHoveredStepId] = useState(null);
    const [loading, setLoading] = useState(true);
    //console.log("DEBUG -- EditModal -> editData", editData);


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
        inListNew: editData.inListNew,
        tags: editData.tags,
        repeatable: editData.repeatable || false,
        ...(editData.repeatable ? {
            repeatNotify: editData.repeatNotify || false,
            repeatInterval: editData.repeatInterval || 'daily',
            ...(editData.repeatInterval === 'weekly' ? { repeatDays: editData.repeatDays || [] } : {}),
            ...(editData.repeatInterval === 'monthly' ? { repeatMonthlyOption: editData.repeatMonthlyOption || 'start' } : {}),
            ...(editData.repeatInterval === 'yearly' ? { repeatYearlyOption: editData.repeatYearlyOption || 'start' } : {}),
            repeatUntil: editData.repeatUntil || '',
            repeatableEmoji: editData.repeatableEmoji || '',
        } : {})
    });

    const step = useDynamicStep(taskData.estimatedTime);

    const optionsListNames = isLoggedIn && loggedInUser.myLists
        ? loggedInUser.myLists
            .filter(item => {
                if (item.ownerModel === 'User') {
                    const inListNewNames = taskData.inListNew.map(listItem => listItem.listName);
                    return !inListNewNames.includes(item.listName);
                }
            })
            .map(item => ({ value: item.listName, label: item.listName }))
        : [];

    const includedListNames = isLoggedIn && loggedInUser.myLists
        ? loggedInUser.myLists
            .filter(item => {
                const inListNames = taskData.inListNew.map(listItem => listItem.listName);
                return inListNames.includes(item.listName);
            })
            .map(item => ({ value: item.listName, label: item.listName }))
        : [];

    const activeList = isLoggedIn && loggedInUser.myLists
        ? loggedInUser.myLists.find(list => list.listName === loggedInUser.activeList)
        : null;

    const optionsTagNames = activeList && activeList.tags
        ? activeList.tags
            .filter(item => !taskData.tags.map(tag => tag.label).includes(item.label))
            .map(item => item)
        : [];

    const handleInputChange = (event) => {
        let value = event.target.value;
        //console.log("Value", value);

        if (event.target.name === 'dueDate') {
            value = new Date(value);
        }

        if (event.target.name === 'estimatedTime') {
            value = parseInt(value, 10);
        }

        setErrorMessage('');
        setTaskData({
            ...taskData,
            [event.target.name]: value
        });
        console.log("Task data", taskData);
    };

    //Helper methods for handleSubmit
    const cleanRepeatableAttributes = (taskData) => {
        let cleanedTaskData = { ...taskData };

        if (!taskData.repeatable) {
            delete cleanedTaskData.repeatNotify;
            delete cleanedTaskData.repeatInterval;
            delete cleanedTaskData.repeatDays;
            delete cleanedTaskData.repeatMonthlyOption;
            delete cleanedTaskData.repeatYearlyOption;
            delete cleanedTaskData.repeatUntil;
            delete cleanedTaskData.repeatableEmoji;
        } else {
            switch (taskData.repeatInterval) {
                case 'weekly':
                    delete cleanedTaskData.repeatMonthlyOption;
                    delete cleanedTaskData.repeatYearlyOption;
                    break;
                case 'monthly':
                    delete cleanedTaskData.repeatDays;
                    delete cleanedTaskData.repeatYearlyOption;
                    break;
                case 'yearly':
                    delete cleanedTaskData.repeatDays;
                    delete cleanedTaskData.repeatMonthlyOption;
                    break;
                default:
                    delete cleanedTaskData.repeatDays;
                    delete cleanedTaskData.repeatMonthlyOption;
                    delete cleanedTaskData.repeatYearlyOption;
                    break;
            }
        }

        return cleanedTaskData;
    };

    const updateTodayList = (taskData) => {
        let updatedTaskData = { ...taskData };

        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const endOfToday = new Date(now.setHours(23, 59, 59, 999));
        const dueDate = new Date(taskData.dueDate);

        const todayListId = loggedInUser.myLists.find(list => list.listName === 'today')?._id;

        // console.log("DEBUG - todayListId", todayListId);
        // console.log("DEBUG - inListNew before update", updatedTaskData.inListNew);

        if (todayListId) {
            if (dueDate >= startOfToday && dueDate <= endOfToday) {
                console.log("DueDate changed to today, adding to today");
                if (!updatedTaskData.inListNew.includes(todayListId)) {
                    updatedTaskData.inListNew.push(todayListId);
                }
            } else {
                console.log("DueDate changed from today, removing from today list");
                updatedTaskData.inListNew = updatedTaskData.inListNew.filter(list => list._id !== todayListId);
            }
        }

        // console.log("DEBUG - inListNew after update", updatedTaskData.inListNew);

        return updatedTaskData;
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

        // Clean up repeatable attributes
        let cleanedTaskData = cleanRepeatableAttributes(taskData);
        cleanedTaskData = updateTodayList(cleanedTaskData);

        // Remove or set dueDate to empty if the task is repeatable
        if (cleanedTaskData.repeatable) {
            cleanedTaskData.dueDate = null;
        }

        editTodo(cleanedTaskData);
        toast.success('Changes saved');

        onRequestClose();
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    }

    const handleEmojiSelect = (emoji) => {
        console.log("DEBUG - SelectedEmoji: ", emoji);
        setTaskData(prevData => ({
            ...prevData,
            repeatableEmoji: emoji
        }));
    };

    const handleSelectChange = (selectedOption) => {
        setTaskData({
            ...taskData,
            priority: selectedOption.target.value
        });
    }

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setTaskData(prevState => ({
            ...prevState,
            [name]: checked
        }));
    };

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
        if (taskData.steps.length < 20) {
            setTaskData(prevData => ({
                ...prevData,
                steps: [...prevData.steps, { taskName: '', isDone: false, _id: generateNewId() }]
            }));
        } else {
            setErrorMessage('You can only have 20 steps');
            setTimeout(() => { setErrorMessage('') }, 5000);
            return;
        }
    };


    const handleListChange = (event) => {
        const selectedListName = event.target.value[0];
        const selectedList = loggedInUser.myLists.find(list => list.listName === selectedListName);

        if (selectedList) {
            setTaskData(prevEditData => {
                const updatedInListNew = [...prevEditData.inListNew, selectedList];
                return {
                    ...prevEditData,
                    inListNew: updatedInListNew
                };
            });
        } else {
            console.error("List not found:", selectedListName);
        }

        console.log("Updated task data:", taskData);
    };

    const handleRemoveFromList = (listNameToRemove) => {

        if (listNameToRemove === "all") {
            console.error('You cannot remove entry from "all" lists this way');
            setErrorMessage('You cannot remove entry from "all" lists this way');
            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
            return;
        }

        setTaskData(prevData => {
            const updatedInListNew = prevData.inListNew.filter(listName => listName.listName !== listNameToRemove);
            return {
                ...prevData,
                inListNew: updatedInListNew
            };
        });
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

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(taskData.steps);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update your state with the new order
        setTaskData({ ...taskData, steps: items });
    };

    const handleRepeatDaysChange = (event) => {
        const { name, checked } = event.target;
        setTaskData((prevData) => ({
            ...prevData,
            repeatDays: checked
                ? [...(prevData.repeatDays || []), name]
                : (prevData.repeatDays || []).filter((day) => day !== name),
        }));
    };

    //I steal the ccs classes from my create modal -- don't judge me, haha
    return (

        <BaseModal
            isOpen={isOpen}
            contentLabel="Edit todo task"
            onRequestClose={() => {
                toast.warn('Edit canceled -- changes not saved');
                onRequestClose();
            }}
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
            title="Edit task"
        >

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

                    <div className="edit-repeatable-container">
                        <div className="edit-repeatable-header">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={taskData.repeatable}
                                        onChange={handleCheckboxChange}
                                        name="repeatable"
                                        color="primary"
                                    />
                                }
                                label="Repeatable"
                            />
                        </div>

                        <CSSTransition
                            in={taskData.repeatable}
                            timeout={300}
                            classNames="fade"
                            unmountOnExit
                        >
                            <div className="edit-repeatable-main-options">
                                <EmojiSelector
                                    selectedEmoji={taskData.repeatableEmoji}
                                    onEmojiSelect={handleEmojiSelect}
                                    userEmojiList={emojiSettings}
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={taskData.repeatNotify || false}
                                            onChange={handleCheckboxChange}
                                            name="repeatNotify"
                                            color="primary"
                                        />
                                    }
                                    label="Enable Notifications"
                                    style={{ display: 'flex', alignItems: 'center' }}
                                />

                                <FormControl variant="outlined" style={{ minWidth: '146px', justifyContent: 'center', marginBottom: '10px' }} size='small'>
                                    <InputLabel id="repeat-interval-label">Repeat Interval</InputLabel>
                                    <Select
                                        name="repeatInterval"
                                        labelId="repeat-interval-label"
                                        id="repeat-interval"
                                        value={taskData.repeatInterval || ''}
                                        onChange={handleInputChange}
                                        label="Repeat Interval"
                                    >
                                        <MenuItem value="daily">Daily</MenuItem>
                                        <MenuItem value="weekly">Weekly</MenuItem>
                                        <MenuItem value="monthly">Monthly</MenuItem>
                                        <MenuItem value="yearly">Yearly</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </CSSTransition>

                        <CSSTransition
                            in={taskData.repeatInterval !== ''}
                            timeout={300}
                            classNames="fade"
                            unmountOnExit
                        >
                            <div className="edit-repeatable-interval-options">
                                {taskData.repeatable && taskData.repeatInterval === 'daily' && (
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

                                {taskData.repeatable && taskData.repeatInterval === 'weekly' && (
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                            <div key={day} style={{ textAlign: 'center', margin: '0 0x' }}>
                                                <div style={{ marginBottom: '-5px' }}>{day.charAt(0)}</div>
                                                <Checkbox
                                                    checked={(taskData.repeatDays || []).includes(day)}
                                                    onChange={handleRepeatDaysChange}
                                                    name={day}
                                                    color="primary"
                                                    style={{ padding: '0 0px' }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {taskData.repeatable && taskData.repeatInterval === 'monthly' && (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span>Start</span>
                                        <Switch
                                            checked={taskData.repeatMonthlyOption === 'end'}
                                            onChange={(event) => setTaskData((prevData) => ({
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

                                {taskData.repeatable && taskData.repeatInterval === 'yearly' && (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span>Start</span>
                                        <Switch
                                            checked={taskData.repeatYearlyOption === 'end'}
                                            onChange={(event) => setTaskData((prevData) => ({
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

                                {taskData.repeatable && ['weekly', 'monthly', 'yearly'].includes(taskData.repeatInterval) && (
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
                    </div>

                    <hr style={{ width: '80%', margin: '10px auto' }} />


                    <div className="input-container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: '10px' }}>
                        {!taskData.repeatable && (
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
                            </div>
                        )}

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
                            label="Est. Time(min)"
                            size="small"
                            style={{ width: '100px', textAlign: 'center' }}
                            placeholder="Time"
                            inputProps={{ min: '0', step: step }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"></InputAdornment>,
                            }}
                            value={taskData.estimatedTime}
                        />

                        {taskData.estimatedTime >= 60 && (
                            <div style={{ width: '80px', textAlign: 'center' }}>
                                <strong>{formatTime(taskData.estimatedTime)}</strong>
                            </div>
                        )}

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


                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '14px' }}>
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
                    {activeList.ownerModel !== 'Group' && (
                        <>
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
                        </>
                    )}


                    <hr style={{ width: '80%', margin: '10px auto' }} />

                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="taskSteps">
                            {(provided) => (
                                <div className='steps' style={{ width: '100%', justifyContent: 'flex-start' }} {...provided.droppableProps} ref={provided.innerRef}>
                                    <TransitionGroup>
                                        {taskData.steps.map((step, index) => (
                                            <CSSTransition
                                                key={step.id}
                                                timeout={500}
                                                classNames="step"
                                            >
                                                <Draggable key={step.id} draggableId={String(step.id)} index={index}>
                                                    {(provided) => (
                                                        <div className="drag" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{ transform: 'none', display: 'flex', flexDirection: 'row', alignItems: 'center', ...provided.draggableProps.style }}>
                                                            <label style={{ display: 'flex', alignItems: 'center' }}>{`#${index + 1}`}</label>
                                                            <input className='create-modal-input' type='text' placeholder={`Enter subTask title`}
                                                                onChange={event => handleInputChangeStep(step._id, event)}
                                                                defaultValue={taskData.steps.find(s => s._id === step._id).taskName || ''} maxLength='50' />
                                                            <div onMouseEnter={() => setHoveredStepId(step._id)} onMouseLeave={() => setHoveredStepId(null)}>
                                                                <Icon
                                                                    path={hoveredStepId === step._id ? mdiDeleteEmpty : mdiDelete}
                                                                    size={1.2}
                                                                    color={hoveredStepId === step._id ? "red" : "gray"}
                                                                    onClick={() => handleDeleteStep(step._id)}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            </CSSTransition>
                                        ))}
                                    </TransitionGroup>
                                    {provided.placeholder}
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <p className='add-step' onClick={handleAddStep} style={{}}> <strong> add step </strong> </p>
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>


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
                        placeholder='Enter task description'
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



                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <button className='modal-button'> Save </button>
                </form>
            )}
        </BaseModal>

    )
}

export default EditModal;