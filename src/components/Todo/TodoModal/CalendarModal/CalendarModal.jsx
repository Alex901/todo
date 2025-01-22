import React, { useEffect, useState, useMemo } from 'react';
import BaseModal from '../BaseModal/BaseModal';
import { useTodoContext } from '../../../../contexts/todoContexts';
import { useUserContext } from '../../../../contexts/UserContext';
import { Select, MenuItem, FormControl, InputLabel, Typography, IconButton, Checkbox, FormControlLabel, Drawer, Button } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import Icon from '@mdi/react';
import { mdiCalendarCheck, mdiChevronDoubleLeft, mdiChevronDoubleRight } from '@mdi/js';
import './CalendarModal.css';
import DailyView from './Views/DailyView/DailyView';
import WeeklyView from './Views/WeeklyView/WeeklyView';
import MonthlyView from './Views/MonthlyView/MonthlyView';
import generateCalendarOptions from '../../../../utils/generateOptions/generateOptions';
import { generateMimicTask } from '../../../../utils/generateMimicTask';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import CalendarDrawer from './CalendarDrawer/CalendarDrawer';
import { deadlineFinder } from '../../../../utils/dragAndDropUtils';

const CalendarModal = ({ isOpen, onClose }) => {
    const { todoList, editTodo } = useTodoContext();
    const { loggedInUser } = useUserContext();
    const [interval, setInterval] = useState('day');
    const [selectedList, setSelectedList] = useState('all');
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);
    const [filteredList, setFilteredList] = useState(todoList);
    const tasksWithDueDate = todoList.filter(task => task.dueDate !== null);
    const tasksNoDueDate = todoList.filter(task => !task.dueDate && !task.repeatable && !task.completed);
    let repeatableTasks = todoList.filter(task => task.repeatable);
    const [mimicTasks, setMimicTasks] = useState(repeatableTasks);
    const [hasSwitched, setHasSwitched] = useState(false);
    const [includeGroupTasks, setIncludeGroupTasks] = useState(true);
    const isMobile = useMediaQuery('(max-width: 800px)');
    const allListObject = loggedInUser?.myLists.find(list => list.listName === 'all');
    const [optimizeOption, setOptimizeOption] = useState('time');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);
    const [palceholderIndex, setPlaceholderIndex] = React.useState(null);


    // Find the earliest and latest task dates
    const earliest = tasksWithDueDate.reduce((earliest, task) => {
        const taskDates = [task.dueDate, task.completed, task.created]
            .filter(date => date) // Filter out undefined or null dates
            .map(date => new Date(date)); // Convert to Date objects

        const earliestTaskDate = taskDates.reduce((earliestDate, currentDate) =>
            currentDate < earliestDate ? currentDate : earliestDate, new Date());

        return earliestTaskDate < earliest ? earliestTaskDate : earliest;
    }, new Date());
    // console.log("DEBUG -- earliest -- CalendarModal", earliest);


    const setEndOfMonth = (date) => {
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0); // Last day of the current month
        endDate.setHours(23, 59, 59, 999); // Set to 23:59:59.999
        return endDate;
    };

    const setEndOfWeek = (date) => {
        const endDate = new Date(date);
        const dayOfWeek = endDate.getDay();
        const diffToSunday = 7 - dayOfWeek;
        endDate.setDate(endDate.getDate() + diffToSunday);
        endDate.setHours(23, 59, 59, 999); // Set to 23:59:59.999
        return endDate;
    };

    let latest = tasksWithDueDate.reduce((latest, task) => {
        const taskDate = new Date(task.dueDate);
        return taskDate > latest ? taskDate : latest;
    }, new Date());

    // Adjust latest to the later of the end of the current week or the end of the current month
    const endOfMonth = setEndOfMonth(latest);
    const endOfWeek = setEndOfWeek(latest);
    latest = endOfMonth > endOfWeek ? endOfMonth : endOfWeek;

    let options = generateCalendarOptions(interval, today, earliest, latest);
    // console.log("DEBUG -- options -- CalendarModal", options);
    // console.log("DEBUG -- interval -- CalendarModal", interval);



    const getDefaultOption = (interval) => {
        switch (interval) {
            case 'day':
                return options.find(option => option.label === 'Today')
            case 'week':
                return options.find(option => option.label === 'This Week');
            case 'month':
                const currentMonthName = today.toLocaleString('default', { month: 'long' });
                // console.log("DEBUG -- currentMonthName -- CalendarModal", currentMonthName);
                return options.find(option => option.label === currentMonthName);
            default:
                return options[options.length - 1];
        }
    }

    const [selectedOption, setSelectedOption] = useState(getDefaultOption(interval));

    const allMimicTasks = useMemo(() => {
        return repeatableTasks.flatMap(task => generateMimicTask(task, earliest, latest, allListObject, includeGroupTasks, loggedInUser._id));
    }, [todoList, includeGroupTasks]);


    useEffect(() => {
        setMimicTasks(allMimicTasks);
    }, [allMimicTasks]);


    useEffect(() => {
        if (!hasSwitched) {
            setSelectedOption(getDefaultOption(interval));
        }
    }, [interval]);


    // Filters tasks based on selected list
    useEffect(() => {
        if (!loggedInUser || !loggedInUser.myLists) {
            return;
        }

        const updatedTodoList = todoList.map(task => {
            if (includeGroupTasks && task.owner !== loggedInUser._id) {
                // Check if "all" is already in inListNew before adding
                const isAllListPresent = task.inListNew.some(list => list.listName === 'all');
                if (!isAllListPresent) {
                    return {
                        ...task,
                        inListNew: [...task.inListNew, allListObject]
                    };
                }
            }
            return task;
        });

        const nonUserTasks = updatedTodoList.filter(task => task.owner !== loggedInUser._id);

        const filtered = updatedTodoList.filter(task =>
            task.inListNew.some(list => list.listName === selectedList) &&
            (
                (task.dueDate && new Date(task.dueDate) >= new Date(selectedOption.value.start) && new Date(task.dueDate) <= new Date(selectedOption.value.end)) ||
                (task.completed && new Date(task.completed) >= new Date(selectedOption.value.start) && new Date(task.completed) <= new Date(selectedOption.value.end))
            )
        );
        const filteredMimicTasks = mimicTasks.filter(task =>
            task.inListNew.some(list => list.listName === selectedList) &&
            new Date(task.repeatDay) >= new Date(selectedOption.value.start) && new Date(task.repeatDay) <= new Date(selectedOption.value.end)
        );
        setFilteredList([...filtered, ...filteredMimicTasks]);
        // console.log("DEBUG -- filteredList -- CalendarModal", filteredList);
    }, [todoList, selectedList, selectedOption, mimicTasks, includeGroupTasks]);


    const handleIntervalChange = (event) => {
        setHasSwitched(false);
        setInterval(event.target.value);
    };


    useEffect(() => {
        const modalContent = document.querySelector('.modal-content');
        if (modalContent && !isMobile) {
            if (interval === 'week') {
                modalContent.style.width = '80%';
            } else if (interval === 'month') {
                modalContent.style.width = '90%';
            } else {
                modalContent.style.width = ''; // Reset to default
            }
        }
    }, [interval, isMobile]);


    const handleListChange = (event) => {
        setSelectedList(event.target.value);
    };

    const handlePrevClick = () => {
        const currentIndex = options.findIndex(option => option.label === selectedOption.label);
        if (currentIndex > 0) {
            setSelectedOption(options[currentIndex - 1]);
        }
    };

    const handleNextClick = () => {
        const currentIndex = options.findIndex(option => option.label === selectedOption.label);
        if (currentIndex < options.length - 1) {
            setSelectedOption(options[currentIndex + 1]);
        }
    };

    const getLabelText = () => {
        switch (interval) {
            case 'day':
                return 'Select Day';
            case 'week':
                return 'Select Week';
            case 'month':
                return 'Select Month';
            default:
                return 'Select Date';
        }
    };


    const handleOptionChange = (event) => {
        const selected = options.find(option => option.value.start === event.target.value);
        if (selected) {
            setSelectedOption(selected);
            setCurrentDate(new Date(selected.value.start));
        } else {
            console.error("Selected option not found");
        }
    };

    const handleDayClick = async (dayDate) => {
        setHasSwitched(true);
        setInterval('day'); // Change the interval to 'day'
        options = generateCalendarOptions('day', today, earliest, latest);
        console.log("Options on week -> day: ", options);

        const dateOptions = { month: 'short', day: 'numeric' };
        let dayLabel = dayDate.toLocaleDateString('en-US', dateOptions);

        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        dayDate.setHours(0, 0, 0, 0);

        if (dayDate.getTime() === todayDate.getTime()) {
            dayLabel = 'Today';
        }

        const matchingOption = options.find(option => option.label === dayLabel);



        if (matchingOption) {
            setSelectedOption(matchingOption);
        } else {
            console.error("Matching option not found for the selected day");
        }
    };


    const resetValues = () => {
        setInterval('day');
        setSelectedList('all');
    };

    useEffect(() => {
        if (!isOpen) {
            resetValues();
        }
    }, [isOpen]);

    const handleGroupTasksChange = (event) => {
        setIncludeGroupTasks(event.target.checked);
        // If a group list is selected and the checkbox is unchecked, switch to "all"
        if (!event.target.checked && selectedList !== 'all') {
            const selectedListDetails = loggedInUser.myLists.find(list => list.listName === selectedList);
            if (selectedListDetails && selectedListDetails.ownerModel === 'Group') {
                setSelectedList('all');
            }
        }
    };

    const onDragUpdate = (update) => {
        if (!update.destination) {
            setIsDrawerOpen(false);
            setPlaceholderIndex(null);
            return;
        }

        if (update.destination.droppableId !== 'noDeadlineTasks') {
            setIsDrawerOpen(false);
        } else {
            setIsDrawerOpen(true);
        }
        // Check if the source and destination are different
        if (update.destination && update.source.droppableId !== update.destination.droppableId) {
            setPlaceholderIndex(update.destination.index);
            // Only open the drawer if the destination is noDeadlineTasks
        } else {
            setPlaceholderIndex(null);
        }
    };

    const onDragStart = (start) => {
        //console.log("DEBUG -- onDragStart -- start", start.draggableId)
        setDraggedItem(start.draggableId);
    };

    // Drag and drop logic, consider moving to a separate file
    const handleDragEnd = (result) => {
        console.log("DEBUG -- handleDragEnd -- result", result);
        if (!result.destination) return;

        const { source, destination } = result;
        console.log("DEBUG -- handleDragEnd -- source", source);
        console.log("DEBUG -- handleDragEnd -- destination", destination);

        // If the task is dropped in the same place, do nothing
        if (destination.droppableId === source.droppableId) {
            console.log("Task dropped in source -- nothing happens.");
            setDraggedItem(null);
            setPlaceholderIndex(null);
            return;
        }

        const droppedTask = JSON.parse(result.draggableId);

        // Task has been dragged to another component
        if (destination.droppableId === 'noDeadlineTasks') {
            const updatedTask = { ...droppedTask, dueDate: null };
            console.log("DEBUG -- updated task -- noDeadlineTasks", updatedTask);
            // editTodo(updatedTask);
        } else if (destination.droppableId.startsWith('calendar-day')) {
            const destinationDate = new Date(destination.droppableId.replace('calendar-day:', '').split(':')[0]);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            if (destinationDate < currentDate) {
                console.log("Cannot drop tasks into the past.");
                setDraggedItem(null);
                setPlaceholderIndex(null);
                return;
            }

            const { newDueDate, movedWithinDay } = deadlineFinder(droppedTask, destination);
            if (newDueDate instanceof Date && !isNaN(newDueDate)) {
                const updatedTask = { ...droppedTask, dueDate: newDueDate.toISOString() };
                if (movedWithinDay) {
                    console.log("Task was moved to a different time within the same day.");
                }
                editTodo(updatedTask);
            } else {
                console.error("Invalid new due date:", newDueDate);
            }
        } else if(destination.droppableId.startsWith('calendar-week')) {
            console.log("Task dropped in calendar-week");
        }   

        setDraggedItem(null);
        setPlaceholderIndex(null);

        console.log("DEBUG -- handleDragEnd -- result end", result);
    };


    const handleOptimizeOptionChange = (event) => {
        setOptimizeOption(event.target.value);
    };

    const handleOptimizeTasks = () => {
        // Implement the logic to optimize tasks based on the selected option
        console.log("Optimizing tasks based on:", optimizeOption);
    };

    const drawerWidth = isMobile ? '100%' : (interval === 'day' ? '60%' : (interval === 'week' ? '80%' : '100%'));

    const toggleDrawer = (open) => {
        setIsDrawerOpen(open);
    }

    return (
        <BaseModal isOpen={isOpen} onRequestClose={onClose} title={
            <div className="modal-title">

                <Typography variant="h6" component="span">Calendar</Typography>
                <Icon path={mdiCalendarCheck} size={1.2} color="black" />
            </div>
        }>
            <div className={`calendar-modal`}>

                <div className="selectors">
                    <div className="group-selector">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={includeGroupTasks}
                                    onChange={handleGroupTasksChange}
                                    name="includeGroupTasks"
                                    color="primary"
                                />
                            }
                            label="Include Group Tasks"
                            classes={{ label: 'group-tasks-label' }}
                        />
                    </div>
                    <div className="list-selector">
                        <FormControl variant="outlined" size="small">
                            <InputLabel id="list-select-label">List</InputLabel>
                            <Select
                                labelId="list-select-label"
                                value={selectedList}
                                onChange={handleListChange}
                                label="List"
                                sx={{ minWidth: '100px', maxWidth: '150px' }}
                            >
                                {loggedInUser?.myLists
                                    .filter(list => includeGroupTasks || list.ownerModel !== 'Group')
                                    .filter(list => !(interval === 'month' || interval === 'week') || list.listName !== 'today')
                                    .map((list) => (
                                        <MenuItem key={list.listName} value={list.listName}>
                                            {list.listName}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="interval-selector">
                        <FormControl variant="outlined" size="small">
                            <InputLabel id="interval-select-label">Interval</InputLabel>
                            <Select
                                labelId="interval-select-label"
                                value={interval}
                                onChange={handleIntervalChange}
                                label="Interval"
                                sx={{ minWidth: '100px' }}
                            >
                                <MenuItem value="day">Day</MenuItem>
                                <MenuItem value="week">Week</MenuItem>
                                <MenuItem value="month">Month</MenuItem>
                            </Select>
                        </FormControl>
                    </div>


                </div>
                <div className="calendar-view" >
                    <div className="calendar-navigation">
                        <IconButton onClick={handlePrevClick}>
                            <Icon path={mdiChevronDoubleLeft} size={1} />
                        </IconButton>
                        <FormControl variant="outlined" size="small">
                            <InputLabel id="date-select-label">{getLabelText()}</InputLabel>
                            <Select
                                labelId="date-select-label"
                                value={selectedOption ? selectedOption.value.start : ''}
                                onChange={handleOptionChange}
                                label={getLabelText()}
                                sx={{ minWidth: '120px' }}
                            >
                                {/* Populate with dates that have tasks */}
                                {options.map(option => (
                                    <MenuItem key={option.value.start} value={option.value.start}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <IconButton onClick={handleNextClick}>
                            <Icon path={mdiChevronDoubleRight} size={1} />
                        </IconButton>
                    </div>
                    <DragDropContext
                        onDragEnd={handleDragEnd}
                        onDragUpdate={onDragUpdate}
                        onDragStart={onDragStart}
                    >
                        {interval === 'day' && <DailyView tasks={filteredList} today={today} selectedDate={selectedOption} loggedInUser={loggedInUser} draggedItem={draggedItem} date={selectedOption.value.end} placeholderIndex={palceholderIndex} />}
                        {interval === 'week' && <WeeklyView tasks={filteredList} today={today} thisWeek={selectedOption} onDayClick={handleDayClick} loggedInUser={loggedInUser} />}
                        {interval === 'month' && <MonthlyView tasks={filteredList} today={today} thisMonth={selectedOption} onDayClick={handleDayClick} loggedInUser={loggedInUser} />}
                        <CalendarDrawer
                            tasksNoDueDate={tasksNoDueDate}
                            optimizeOption={optimizeOption}
                            handleOptimizeOptionChange={handleOptimizeOptionChange}
                            handleOptimizeTasks={handleOptimizeTasks}
                            drawerWidth={drawerWidth}
                            isDrawerOpen={isDrawerOpen}
                            toggleDrawer={toggleDrawer}
                            isMobile={isMobile}
                            interval={interval}
                            draggedItem={draggedItem}
                        />
                    </DragDropContext>
                </div>
            </div>
        </BaseModal>
    );
};

export default CalendarModal;