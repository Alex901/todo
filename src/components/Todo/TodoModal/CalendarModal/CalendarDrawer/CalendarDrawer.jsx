import React from 'react';
import { SwipeableDrawer, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import './CalendarDrawer.css';

const CalendarDrawer = ({ tasksNoDueDate, optimizeOption, handleOptimizeOptionChange, handleOptimizeTasks, drawerWidth, isDrawerOpen, toggleDrawer }) => {
    return (
        <div className="drawer-container-calendar-drawer">
            <div className="drawer-header-calendar-drawer" onClick={() => toggleDrawer(!isDrawerOpen)}>
                <Typography variant="h6">Tasks without Deadline ({tasksNoDueDate.length})</Typography>
            </div>
            <SwipeableDrawer
                anchor="bottom"
                open={isDrawerOpen}
                variant="persistent"
                onClose={() => toggleDrawer(false)}
                onOpen={() => toggleDrawer(true)}
                className="bottom-drawer-calendar-drawer"
                PaperProps={{ style: { width: drawerWidth, margin: '0 auto' } }}
            >
                <div className="drawer-content-calendar-drawer">
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
                        <Typography variant="h6">Optimize Tasks</Typography>
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
                                <MenuItem value="random">Randomly</MenuItem>
                                <MenuItem value="tags">Based on tags</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="contained" color="primary" onClick={handleOptimizeTasks}>
                            Optimize
                        </Button>
                    </div>
                </div>
            </SwipeableDrawer>
        </div>
    );
};

export default CalendarDrawer;