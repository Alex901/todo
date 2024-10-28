import React, { useEffect, useState, useMemo } from 'react';
import BaseModal from '../BaseModal/BaseModal';
import { useTodoContext } from '../../../../contexts/todoContexts';
import { useUserContext } from '../../../../contexts/UserContext';
import { Select, MenuItem, FormControl, InputLabel, Typography, IconButton } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import Icon from '@mdi/react';
import { mdiCalendarCheck, mdiChevronDoubleLeft, mdiChevronDoubleRight } from '@mdi/js';
import './CalendarModal.css';
import DailyView from './Views/DailyView/DailyView';
import WeeklyView from './Views/WeeklyView/WeeklyView';
import MonthlyView from './Views/MonthlyView/MonthlyView';
import generateCalendarOptions from '../../../../utils/generateOptions/generateOptions';
import { generateMimicTask } from '../../../../utils/generateMimicTask';


const CalendarModal = ({ isOpen, onClose }) => {
    const { todoList } = useTodoContext();
    const { loggedInUser } = useUserContext();
    const [interval, setInterval] = useState('day');
    const [selectedList, setSelectedList] = useState('all');
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);
    const [filteredList, setFilteredList] = useState(todoList);
    const tasksWithDueDate = todoList.filter(task => task.dueDate !== null);
    const tasksNoDueDate = todoList.filter(task => !task.dueDate);
    const repeatableTasks = todoList.filter(task => task.repeatable);
    const [mimicTasks, setMimicTasks] = useState(repeatableTasks);
    const [hasSwitched, setHasSwitched] = useState(false);
    const isMobile = useMediaQuery('(max-width: 800px)');

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
        return repeatableTasks.flatMap(task => generateMimicTask(task, earliest, latest));
    }, [todoList]);


    useEffect(() => {
        setMimicTasks(allMimicTasks);
    }, [allMimicTasks]);

    // console.log("DEBUG -- mimicTasks -- CalendarModal", mimicTasks);

    useEffect(() => {
        if(!hasSwitched) {
        setSelectedOption(getDefaultOption(interval));
        }
        //console.log("DEBUG -- selectedOption -- CalendarModal", selectedOption);
    }, [interval]);

    // console.log("DEBUG -- selectedOption -- CalendarModal", selectedOption);

    // Filters tasks based on selected list
    useEffect(() => {
        const filtered = todoList.filter(task =>
            task.inListNew.some(list => list.listName === selectedList) &&
            (
                (task.dueDate && new Date(task.dueDate) >= new Date(selectedOption.value.start) && new Date(task.dueDate) <= new Date(selectedOption.value.end)) ||
                (task.completed && new Date(task.completed) >= new Date(selectedOption.value.start) && new Date(task.completed) <= new Date(selectedOption.value.end))
            )
        );
        const filteredMimicTasks = mimicTasks.filter(task =>
            new Date(task.repeatDay) >= new Date(selectedOption.value.start) && new Date(task.repeatDay) <= new Date(selectedOption.value.end)
        );
        setFilteredList([...filtered, ...filteredMimicTasks]);
    }, [todoList, selectedList, selectedOption, mimicTasks]);



    // useEffect(() => {
    //     console.log("DEBUG -- filteredList -- CalendarModal", filteredList);
    // }, [filteredList]);

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
        // console.log("DEBUG -- handlePrevClick -- currentIndex", currentIndex);
        if (currentIndex > 0) {
            setSelectedOption(options[currentIndex - 1]);
        }
    };

    const handleNextClick = () => {
        const currentIndex = options.findIndex(option => option.label === selectedOption.label);
        // console.log("DEBUG -- handleNextClick -- currentIndex", currentIndex);
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
        const dayLabel = dayDate.toLocaleDateString('en-US', dateOptions);
        const matchingOption = options.find(option => option.label === dayLabel);
        console.log("Matching option: ", matchingOption);
    
        if (matchingOption) {
            setSelectedOption(matchingOption);
        } else {
            console.error("Matching option not found for the selected day");
        }
    };

    // useEffect(() => {
    //     console.log("DEBUG -- SelectedOption: ", selectedOption);
    // }, [selectedOption]);

    const resetValues = () => {
        setInterval('day');
        setSelectedList('all');
    };

    useEffect(() => {
        if (!isOpen) {
            resetValues();
        }
    }, [isOpen]);



    return (
        <BaseModal isOpen={isOpen} onRequestClose={onClose} title={
            <div className="modal-title">

                <Typography variant="h6" component="span">Calendar</Typography>
                <Icon path={mdiCalendarCheck} size={1.2} color="black" />
            </div>
        }>
            <div className={`calendar-modal`}>

                <div className="selectors">
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
                    <div className="list-selector">
                        <FormControl variant="outlined" size="small">
                            <InputLabel id="list-select-label">List</InputLabel>
                            <Select
                                labelId="list-select-label"
                                value={selectedList}
                                onChange={handleListChange}
                                label="List"
                                sx={{ minWidth: '100px' }}
                            >
                                {loggedInUser?.myLists.map((list) => (
                                    <MenuItem key={list.listName} value={list.listName}>
                                        {list.listName}
                                    </MenuItem>
                                ))}
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
                    {interval === 'day' && <DailyView tasks={filteredList} today={today} selectedDate={selectedOption} />}
                    {interval === 'week' && <WeeklyView tasks={filteredList} today={today} thisWeek={selectedOption} onDayClick={handleDayClick} />}
                    {interval === 'month' && <MonthlyView tasks={filteredList}  today={today} thisMonth={selectedOption} onDayClick={handleDayClick}/>}
                </div>
            </div>
        </BaseModal>
    );
};

export default CalendarModal;