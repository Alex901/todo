import React from 'react';
import { SwipeableDrawer, Typography, FormControl, InputLabel, Select, MenuItem, Button, Checkbox, Tooltip, IconButton, InputAdornment } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Icon from '@mdi/react';
import { mdiInformation } from '@mdi/js';
import { useUserContext } from '../../../../../contexts/UserContext';
import './CalendarDrawer.css';

const CalendarDrawer = ({ tasksNoDueDate, optimizeOption, handleOptimizeOptionChange, handleOptimizeTasks, drawerWidth, isDrawerOpen, toggleDrawer, isMobile, interval, draggedItem }) => {
    const pricePerTask = 0.2;
    const totalPrice = (tasksNoDueDate.length * pricePerTask).toFixed(1);
    const { loggedInUser } = useUserContext();
    const [isDraggingOutside, setIsDraggingOutside] = React.useState(false);


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
                <Typography variant="h6">Tasks without Deadline ({tasksNoDueDate.length})</Typography>
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
                    <Typography variant="h6">Tasks without Deadline ({tasksNoDueDate.length})</Typography>
                </div>
                <div className={`drawer-content-calendar-drawer ${isMobile ? 'drawer-content-vertical' : ''}`}>
                    
                        <Droppable droppableId="noDeadlineTasks">
                            {(provided) => (
                                <div className="no-deadline-tasks-calendar-drawer" {...provided.droppableProps} ref={provided.innerRef}>
                                    {tasksNoDueDate.map((task, index) => (
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
                        <div className="drawer-right-title-container">
                            <Typography variant="h4" className='drawer-right-title-calendar-drawer'>Optimize Tasks</Typography>
                            <InputAdornment position="end">
                                <Tooltip title="Insert tasks without deadline to your calendar in a selected order">
                                    <IconButton>
                                        <Icon className="information-icon" path={mdiInformation} size={1.2} />
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                        </div>
                        <FormControl variant="outlined" size="small">
                            <InputLabel id="optimize-select-label">Optimize By</InputLabel>
                            <Select
                                labelId="optimize-select-label"
                                value={optimizeOption}
                                onChange={handleOptimizeOptionChange}
                                label="Optimize By"
                                sx={{ minWidth: '150px' }}
                            >
                                <MenuItem value="time">Where there is time</MenuItem>
                                <MenuItem value="asap">As soon as possible</MenuItem>
                                <MenuItem value="tags">Based on tags</MenuItem>
                                <MenuItem value="random">Randomly</MenuItem>
                            </Select>
                        </FormControl>
                        <button className='modal-button button-calendar-drawer' onClick={() => handleOptimizeTasks(totalPrice)}>
                            Go ({totalPrice}<img src="/currency-beta.png" alt="currency" className="currency-icon" />)
                        </button>
                    </div>
                </div>
            </SwipeableDrawer>
        </div>
    );
};

export default CalendarDrawer;