import React from 'react';
import { SwipeableDrawer, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import './CalendarDrawer.css';

const CalendarDrawer = ({ tasksNoDueDate, optimizeOption, handleOptimizeOptionChange, handleOptimizeTasks, drawerWidth, isDrawerOpen, toggleDrawer, isMobile, interval }) => {
    const pricePerTask = 0.2;
    const totalPrice = (tasksNoDueDate.length * pricePerTask).toFixed(1);
    
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
                PaperProps={{ style: { width: drawerWidth, margin: '0 auto', borderRadius: isMobile ? '10px 10px 0px 0px' : '10px' } }}
            >
                <div className="drawer-header-calendar-drawer-open" onClick={() => toggleDrawer(!isDrawerOpen)}>
                    <Typography variant="h6">Tasks without Deadline ({tasksNoDueDate.length})</Typography>
                </div>
                <div className={`drawer-content-calendar-drawer ${isMobile ? 'drawer-content-vertical' : ''}`}>

                    <div className="drawer-left-calendar-drawer">
                        <Droppable droppableId="noDeadlineTasks">
                            {(provided) => (
                                <div className="no-deadline-tasks-calendar-drawer" {...provided.droppableProps} ref={provided.innerRef}>
                                    {tasksNoDueDate.map((task, index) => (
                                        <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="task-item-calendar-drawer">
                                                    {task.task}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                    <div className="drawer-right-calendar-drawer">
                        <Typography variant="h4" className='drawer-right-title-calendar-drawer'>Optimize Tasks</Typography>
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
                        <button className='modal-button button-calendar-drawer' onClick={handleOptimizeTasks(totalPrice)}>
                                Go ({totalPrice}<img src="/currency-beta.png" alt="currency" className="currency-icon" />)
                            </button>
                    </div>
                </div>
            </SwipeableDrawer>
        </div>
    );
};

export default CalendarDrawer;