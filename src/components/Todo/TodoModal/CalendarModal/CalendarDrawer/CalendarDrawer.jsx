import React from 'react';
import { Drawer, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import './CalendarDrawer.css';

const CalendarDrawer = ({ tasksNoDueDate, optimizeOption, handleOptimizeOptionChange, handleOptimizeTasks, drawerWidth, isDrawerOpen, toggleDrawer }) => {
    return (
        <Drawer
            anchor="bottom"
            open={isDrawerOpen}
            variant="persistent"
            className="bottom-drawer"
            PaperProps={{ style: { width: drawerWidth, margin: '0 auto', overflow: 'hidden' } }}
        >
            <div className="drawer-header" onClick={() => toggleDrawer(!isDrawerOpen)}>
                <Typography variant="h6">Tasks without Deadline ({tasksNoDueDate.length})</Typography>
            </div>
            <div className="drawer-content">
                <div className="drawer-left">
                    <Droppable droppableId="noDeadlineTasks">
                        {(provided) => (
                            <div className="no-deadline-tasks" {...provided.droppableProps} ref={provided.innerRef}>
                                {tasksNoDueDate.map((task, index) => (
                                    <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="task-item">
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
                <div className="drawer-right">
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
        </Drawer>
    );
};

export default CalendarDrawer;