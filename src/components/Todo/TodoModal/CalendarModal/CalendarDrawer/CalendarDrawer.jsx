import React, { useState } from 'react';
import { TextField, FormControlLabel, SwipeableDrawer, Typography, FormControl, InputLabel, Select, MenuItem, Button, Checkbox, Tooltip, IconButton, InputAdornment, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Icon from '@mdi/react';
import { mdiInformation, mdiSortAscending, mdiSortDescending } from '@mdi/js';
import { useUserContext } from '../../../../../contexts/UserContext';
import './CalendarDrawer.css';

const CalendarDrawer = ({ tasksNoDueDate, tasksPastDueDate, optimizeOption, handleOptimizeOptionChange, handleOptimizeTasks, drawerWidth, isDrawerOpen, toggleDrawer, isMobile, interval, draggedItem }) => {
    const pricePerTask = 0.2;

    const { loggedInUser } = useUserContext();
    const [isDraggingOutside, setIsDraggingOutside] = React.useState(false);
    const [includePastDeadline, setIncludePastDeadline] = React.useState(false);
    const [maxTasks, setMaxTasks] = useState(3);
    const [sortOptions, setSortOptions] = useState("descending");
    const [additionalSettings, setAdditionalSettings] = useState([{}]);

    // console.log("DEBUG --- tasksPastDueDate:", tasksPastDueDate);

    const mergedTasks = includePastDeadline
        ? tasksNoDueDate.concat(tasksPastDueDate).reduce((uniqueTasks, currentTask) => {
            // Check if the task is already in the uniqueTasks array
            if (!uniqueTasks.some(task => task._id === currentTask._id)) {
                uniqueTasks.push(currentTask);
            }
            return uniqueTasks;
        }, [])
        : tasksNoDueDate;

    const totalPrice = (mergedTasks.length * pricePerTask).toFixed(1);

    // console.log("DEBUG --- mergedTasks:", mergedTasks);

    const getTaskStyle = (task) => {
        if (task.owner !== loggedInUser._id) {
            return {
                backgroundColor: '#944545',
                color: '#ffffff',
                borderColor: '#ffffff'
            };
        }
        return {};
    };

    const normalizeTime = (minutes) => {
        if (minutes >= 1440) {
            const days = Math.round(minutes / 1440);
            return `${days} d`;
        } else if (minutes >= 60) {
            const hours = Math.round(minutes / 60);
            return `${hours} h`;
        } else {
            return `${Math.round(minutes)} m`;
        }
    };

    const getTimeClass = (estimatedTime, totalTimeSpent) => {
        const estimatedMinutes = estimatedTime; // Convert hours to minutes if needed
        const totalMinutes = totalTimeSpent / 60000; // Convert milliseconds to minutes
        const difference = totalMinutes - estimatedMinutes;
        const percentageDifference = (difference / estimatedMinutes) * 100;

        if (percentageDifference <= 0) {
            return 'green';
        } else if (percentageDifference <= 50) {
            return 'yellow';
        } else {
            return 'red';
        }
    };

    return (
        <div className="drawer-container-calendar-drawer">
            <div className="drawer-header-calendar-drawer" onClick={() => toggleDrawer(!isDrawerOpen)}>
                <Typography variant="h6">Tasks without Deadline ({mergedTasks.length})</Typography>
            </div>
            <SwipeableDrawer
                anchor="bottom"
                open={isDrawerOpen}
                onClose={() => toggleDrawer(false)}
                onOpen={() => toggleDrawer(true)}
                className="bottom-drawer-calendar-drawer"
                PaperProps={{ style: { width: drawerWidth, margin: '0 auto', borderRadius: isMobile ? '12px 12px 0px 0px' : '10px', overflow: 'hidden' } }}
            >
                <div className="drawer-header-calendar-drawer-open" onClick={() => toggleDrawer(!isDrawerOpen)}>
                    <Typography variant="h6">Tasks without Deadline ({mergedTasks.length})</Typography>
                </div>
                <div className={`drawer-content-calendar-drawer ${isMobile ? 'drawer-content-vertical' : ''}`}>

                    <Droppable droppableId="noDeadlineTasks">
                        {(provided) => (
                            <div className="no-deadline-tasks-calendar-drawer" {...provided.droppableProps} ref={provided.innerRef}>
                                {mergedTasks.map((task, index) => (
                                    <Draggable key={task.id} draggableId={JSON.stringify(task)} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="task-item-calendar-drawer">
                                                <div className="task-block-time">
                                                    <span>{task.estimatedTime !== null ? `${normalizeTime(task.estimatedTime)} ` : "-"}</span>
                                                </div>

                                                <div className="task-block-content">
                                                    <span>{task.task}</span>
                                                </div>
                                                <div className="task-checkbox">
                                                    <Checkbox checked={!!task.completed}
                                                        color={task.owner !== loggedInUser._id ? 'secondary' : 'primary'}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    <div className="drawer-right-calendar-drawer">
                        {/* Row 1: Title */}
                        <div className="drawer-right-title-container" style={{ textAlign: 'center', marginBottom: '16px' }}>
                            <Typography variant="h4" className="drawer-right-title-calendar-drawer">Optimize Tasks</Typography>
                        </div>

                        {/* Row 2: Checkbox and Selector */}
                        <div className="drawer-right-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <Tooltip title="Include tasks that are past deadline" arrow>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={includePastDeadline}
                                            onChange={(e) => setIncludePastDeadline(e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Past Deadline?"
                                />
                            </Tooltip>
                            <FormControl variant="outlined" size="small" style={{ minWidth: '150px' }}>
                                <InputLabel id="optimize-select-label">Optimize By</InputLabel>
                                <Select
                                    labelId="optimize-select-label"
                                    value={optimizeOption}
                                    onChange={handleOptimizeOptionChange}
                                    label="Optimize By"
                                >
                                    <MenuItem value=""> </MenuItem>
                                    <MenuItem value="priority">Priority</MenuItem>
                                    <MenuItem value="time">Duration</MenuItem>
                                    <MenuItem value="difficulty">Difficulty</MenuItem>
                                    <MenuItem value="tags">Tags</MenuItem>
                                    <MenuItem value="Urgency">Urgency</MenuItem>
                                    <MenuItem value="random">Randomly</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        {/* Row 3: Special Options Based on Selection */}
                        <div className="drawer-right-special-options" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '30px' }}>
                            <Tooltip title="Select the maximum number of tasks allowed per day" arrow>
                                <FormControl variant="outlined" size="small" style={{ width: '60px' }}>
                                    <TextField
                                        id="max-tasks-per-day"
                                        type="number"
                                        label="Tasks/day"
                                        placeholder="Enter max tasks"
                                        variant="outlined"
                                        size="small"
                                        value={maxTasks}
                                        onChange={(e) => {
                                            const value = Math.min(10, Math.max(0, e.target.value)); // Ensure value is between 0 and 10
                                            setMaxTasks(value);
                                        }}
                                        InputProps={{
                                            style: { textAlign: 'center' }, // Smaller padding and font size
                                        }}

                                    />
                                </FormControl>
                            </Tooltip>
                            {['priority', 'time', 'difficulty'].includes(optimizeOption) && (
                                <ToggleButtonGroup
                                    value={sortOptions || 'descending'} // Default to 'ascending'
                                    exclusive
                                    onChange={(e, newOrder) => {
                                        if (newOrder !== null) {
                                            setSortOptions(newOrder); // Update the sortOptions state directly
                                        }
                                    }}
                                    aria-label="Order"
                                >
                                    <Tooltip
                                        title={
                                            optimizeOption === 'priority'
                                                ? 'Lowest priority first' // Corrected for priority
                                                : optimizeOption === 'time'
                                                    ? 'Shortest tasks first'
                                                    : 'Easiest tasks first'
                                        }
                                        arrow
                                    >
                                        <ToggleButton value="ascending" aria-label="Ascending">
                                            <Icon path={mdiSortAscending} size={1} /> {/* Ascending Icon */}
                                        </ToggleButton>
                                    </Tooltip>
                                    <Tooltip
                                        title={
                                            optimizeOption === 'priority'
                                                ? 'Highest priority first' // Corrected for priority
                                                : optimizeOption === 'time'
                                                    ? 'Longest tasks first'
                                                    : 'Hardest tasks first'
                                        }
                                        arrow
                                    >
                                        <ToggleButton value="descending" aria-label="Descending">
                                            <Icon path={mdiSortDescending} size={1} /> {/* Descending Icon */}
                                        </ToggleButton>
                                    </Tooltip>
                                </ToggleButtonGroup>
                            )}
                            {optimizeOption === 'tags' && <Typography>Coming soon</Typography>}
                            {optimizeOption === 'Urgency' && <Typography>Urgent tasks are prioritized</Typography>}
                            {optimizeOption === 'random' && <Typography>Tasks are added randomly </Typography>}
                        </div>

                        {/* Row 4: Button */}
                        <div className="drawer-right-button-container" style={{ textAlign: 'center' }}>
                            <button className="modal-button button-calendar-drawer" disabled={optimizeOption === '' || optimizeOption === 'tags'} onClick={() => handleOptimizeTasks(totalPrice, sortOptions, mergedTasks, maxTasks)}>
                                Go ({totalPrice}<img src="/currency-beta.png" alt="currency" className="currency-icon" />)
                            </button>
                        </div>
                    </div>
                </div>
            </SwipeableDrawer>
        </div>
    );
};

export default CalendarDrawer;