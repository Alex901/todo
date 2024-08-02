import React, { useState, useEffect, useMemo } from "react";
import "./AnythingList.css"
import PropTypes from 'prop-types';
import TodoButton from "../TodoButton/TodoButton";
import TodoModal from "../TodoModal/TodoModal";
import EditModal from "../TodoModal/EditModal/EditModal";
import TodoEntry from "../TodoEntry/TodoEntry";
import { useTodoContext } from "../../../contexts/todoContexts";
import { useUserContext } from "../../../contexts/UserContext";
import Icon from '@mdi/react';
import { mdiMenuUp, mdiMenuDown } from '@mdi/js';
import { } from '@mdi/js';
import { Grid, FallingLines } from "react-loader-spinner";
import { MagnifyingGlass } from "react-loader-spinner";



import {
    FormControl, InputLabel, MenuItem, Select, IconButton,
    Checkbox, FormControlLabel, Autocomplete, TextField, Stack
} from '@mui/material';

const AnythingList = ({ type }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeTodoList, setActiveTodoList] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const { loggedInUser, isLoggedIn, toggleUrgent } = useUserContext();
    const { todoList } = useTodoContext();
    const [isAscending, setIsAscending] = useState(true);
    const [isUrgentOnly, setIsUrgentOnly] = useState(false);
    const [isNewOnly, setIsNewOnly] = useState(false); //should be "show"
    const [isDeadlineOnly, setIsDeadlineOnly] = useState(false);
    const [deadlineListOnly, setDeadlineListOnly] = useState([]);
    const [selectedOptionSort, setSelectedOptionSort] = useState({ value: 'created', label: 'Created' });
    const [selectedTags, setSelectedTags] = useState([]);
    const [originalTodoList, setOriginalTodoList] = useState([]);
    const [isTagsOpen, setIsTagsOpen] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);

    const priorityMapping = {
        'VERY LOW': 1,
        'LOW': 2,
        'NORMAL': 3,
        'HIGH': 4,
        'VERY HIGH': 5,
    };

    const difficultyMapping = {
        'VERY EASY': 1,
        'EASY': 2,
        'NORMAL': 3,
        'HARD': 4,
        'VERY HARD': 5,
    };

    const sortFunctions = {
        task: (a, b) => a.task.localeCompare(b.task),
        created: (a, b) => a.created - b.created,
        priority: (a, b) => priorityMapping[a.priority] - priorityMapping[b.priority],
        steps: (a, b) => a.steps.length - b.steps.length,
        difficulty: (a, b) => difficultyMapping[a.difficulty] - difficultyMapping[b.difficulty],
        dueDate: (a, b) => a.dueDate - b.dueDate,
        estimatedTime: (a, b) => a.estimatedTime - b.estimatedTime,
    };

    const getStartOfWeek = (date) => {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);
        return start;
    };
    
    const getEndOfWeek = (date) => {
        const end = new Date(date);
        const day = end.getDay();
        const diff = end.getDate() + (7 - day); // Adjust when day is Sunday
        end.setDate(diff);
        end.setHours(23, 59, 59, 999);
        return end;
    };
    
    const startOfWeek = getStartOfWeek(new Date());
    const endOfWeek = getEndOfWeek(new Date());
    const activeList = loggedInUser ? loggedInUser.listNames.find(list => list.name === loggedInUser.activeList) : null;
    const tags = activeList ? activeList.tags : [];

    const customSortFunction = (a, b, isAscending = true) => {
        const getDateCategory = (date) => {
            if (!date) return isAscending ? 5 : -1; // No deadline
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
    
            if (date.toDateString() === today.toDateString()) return 3; // Today
            if (date.toDateString() === tomorrow.toDateString()) return 2; // Tomorrow
            if (date < today) return 4; // Past deadline
            return 1; // Other future dates (Normal deadline)
        };
    
        const dateA = getDateCategory(a.dueDate);
        const dateB = getDateCategory(b.dueDate);
    
        if (dateA !== dateB) {
            return dateA - dateB;
        }
    
        // If dates are in the same category, sort by the actual date
        return isAscending ? new Date(a.dueDate) - new Date(b.dueDate) : new Date(b.dueDate) - new Date(a.dueDate);
    };

    const filteredTodoList = useMemo(() => {
        let list = todoList; //All todo entries

        list = list.filter(todo => todo.inListNew.some(list => list.listName === loggedInUser.activeList));

        if (isUrgentOnly) {
            list = list.filter(todo => todo.isUrgent);
        }

        if (isDeadlineOnly) {
            list = list.filter(todo => {
                const dueDate = new Date(todo.dueDate);
                return dueDate >= startOfWeek && dueDate <= endOfWeek;
            });
        }

        if(isNewOnly) {
            list = list.filter(todo => todo.__v === 0);
        }

        if (selectedTags.length > 0) {
            list = list.filter(todo =>
                selectedTags.every(tag =>
                    todo.tags.map(t => t._id).includes(tag._id)
                )
            );
        }
        return list;
    }, [todoList, isUrgentOnly, isDeadlineOnly, selectedTags, isNewOnly]);

    const sortedTodoList = useMemo(() => {
        const sortedList = [...filteredTodoList].sort((a, b) => {
            if (selectedOptionSort.value === 'deadline') {
                return customSortFunction(a, b, isAscending);
            }
            return sortFunctions[selectedOptionSort.value](a, b, !isAscending);
        });
        return isAscending ? sortedList : sortedList.reverse();
    }, [filteredTodoList, selectedOptionSort, isAscending]);


    //Might not need this
    useEffect(() => {
        setActiveTodoList(sortedTodoList);
    }, [filteredTodoList, sortedTodoList]);

    //Load user settings
    useEffect(() => {
        if (loggedInUser && loggedInUser.settings && loggedInUser.settings.todoList) {
            setIsUrgentOnly(loggedInUser.settings.todoList.urgentOnly);
        }
    }, [loggedInUser]);

    const handleClick = () => {
        setIsModalOpen(true);
    }

    const handleEdit = (taskData) => {
        setEditingTask(taskData);
        setIsEditModalOpen(true);
    }


    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setEditingTask(null);
    }

    const handleCloseSubmitModal = () => {
        setIsModalOpen(false);
    }

    const filterTodoList = () => {
        setIsFiltering(true);
        if (isLoggedIn && loggedInUser.activeList) {
            const filteredList = todoList.filter(todo => todo.inList.includes(loggedInUser.activeList));
            if (JSON.stringify(filteredList) !== JSON.stringify(activeTodoList)) {
                setActiveTodoList(filteredList);
            }
        } else {
            if (JSON.stringify(todoList) !== JSON.stringify(activeTodoList)) {
                setActiveTodoList(todoList);
            }
        }
        setIsFiltering(false);
    };

    const filterActiveList = () => {
        const sortFunction = sortFunctions[selectedOptionSort.value];
        if (!sortFunction) {
            return;
        }

        const sortedList = [...activeTodoList].sort((a, b) => {
            return !isAscending ? sortFunction(a, b) : sortFunction(b, a);
        });

        if (JSON.stringify(sortedList) !== JSON.stringify(activeTodoList)) {
            setActiveTodoList(sortedList);
        }
    };

    const filterUrgentTasks = (urgentOnly) => {
        setIsFiltering(true);
        if (urgentOnly) {
            const urgentTasks = activeTodoList.filter(task => task.isUrgent);
            if (JSON.stringify(urgentTasks) !== JSON.stringify(activeTodoList)) {
                setActiveTodoList(urgentTasks);
            }
        } else {
            if (JSON.stringify(activeTodoList) !== JSON.stringify(activeTodoList)) {
                filterTodoList();
            }
        }
        setIsFiltering(false);
    };

    const updateActiveList = () => {
        if (selectedTags.length === 0) {
            setActiveTodoList(originalTodoList);
        } else {
            const selectedTagIds = selectedTags.map(tag => tag._id);
            const filteredList = originalTodoList.filter(entry =>
                selectedTagIds.every(id => entry.tags.map(tag => tag._id).includes(id))
            );
            setActiveTodoList(filteredList);
        }
    };

    const handleSortChange = (selectedOption) => {
        setSelectedOptionSort(selectedOption.target);
    }

    const toggleSortOrder = () => {
        setIsAscending(!isAscending);
    }

    const toggleUrgentTasks = () => {
        const newUrgentOnly = !isUrgentOnly; // Toggle the value
        // Perform API call or any other side effects here
        toggleUrgent(newUrgentOnly); //API call
    }

    const toggleDeadlineOnly = () => {
        setIsDeadlineOnly(!isDeadlineOnly);
    }

    const toggleNewOnly = () => {
        setIsNewOnly(!isNewOnly);
    }

    const handleTagChange = (event, values) => {
        event.preventDefault();
        setSelectedTags(values);
        setIsTagsOpen(true)
    };

    //Create the todo lists
    return (
        <div className="list-container">
            {isLoggedIn ? <div className={`title-${type}`}></div> : null}
            {isLoggedIn && (
                <div className={`list-settings list-settings-${type}`} style={{ display: 'flex', justifyContent: 'space-between', border: '2px solid gray' }}>
                    <div className="seartch-container" style={{ margin: '3px 20px' }}>

                        <Stack spacing={3} sx={{}}>
                            <FormControl variant="outlined" style={{ minWidth: 120 }}>
                                <Autocomplete
                                    open={isTagsOpen}
                                    onOpen={() => {
                                        setIsTagsOpen(true);
                                    }}
                                    onClose={(event, reason) => {
                                        if (reason === 'select-option') {
                                            event.preventDefault();
                                        } else {
                                            setIsTagsOpen(false);
                                        }
                                    }}
                                    multiple
                                    id="tags-outlined"
                                    size="small"
                                    limitTags={2}
                                    options={tags}
                                    getOptionLabel={(option) => option.label}
                                    onChange={handleTagChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Find tags"
                                            InputLabelProps={{
                                                style: { color: type === 'doing' ? 'black' : 'white' },
                                            }}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Stack>
                    </div>


                    <div className="checkbox-container" style={{ margin: '3px 20px' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isUrgentOnly}
                                    onChange={toggleUrgentTasks}
                                />
                            }
                            label="Urgent"
                        />
                    </div>
                    <div className="checkbox-container" style={{ margin: '3px 20px' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isDeadlineOnly}
                                    onChange={toggleDeadlineOnly}
                                />
                            }
                            label="Deadline this week"
                        />
                    </div>
                    <div className="checkbox-container" style={{ margin: '3px 20px' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isNewOnly}
                                    onChange={toggleNewOnly}
                                />
                            }
                            label="New"
                        />
                    </div>
                    <div className="Select-sorting-order" style={{ display: 'flex', flexDirection: 'row', margin: '3px 15px' }}>
                        <FormControl variant="outlined" style={{ minWidth: 150 }}>

                            <Select
                                labelId="sorting-order-label"
                                defaultValue="created"
                                onChange={handleSortChange}
                                size="small"
                                sx={{ color: type === 'doing' ? 'black' : 'white' }}
                            >
                                <MenuItem value="created" name="created">Created</MenuItem>
                                <MenuItem value="task" name="task">Name</MenuItem>
                                <MenuItem value="priority" name="priority">Priority</MenuItem>
                                <MenuItem value="steps" name="steps">Steps</MenuItem>
                                <MenuItem value="difficulty" name="difficulty">Difficulty</MenuItem>
                                <MenuItem value="dueDate" name="dueDate">Deadline</MenuItem>
                                <MenuItem value="estimatedTime" name="estimatedTime">Time</MenuItem>
                            </Select>
                        </FormControl>

                        <IconButton
                            className="toggle-order-button"
                            onClick={toggleSortOrder}
                            sx={{
                                width: '40px',
                                height: '36px',
                                border: '1px solid rgba(0, 0, 0, 0.23)', // Add this line
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginLeft: '2px'
                            }}
                        >
                            {isAscending ? <Icon path={mdiMenuUp} size={1.4} /> : <Icon path={mdiMenuDown} size={1.4} />}
                        </IconButton>
                    </div>
                </div>
            )}
            {isFiltering ? (
                <div className="filtering-spinner-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
                    <MagnifyingGlass color="brown" height={60} width={60} />
                </div>
            ) : (
                <>

                    {isLoggedIn ? <div className={`title-${type}`}></div> : null}

                    <div className="list-view">

                        {
                            (type === 'todo' && activeTodoList.filter(todo => !todo.isStarted && !todo.isDone).length > 0) ||
                                (type === 'doing' && activeTodoList.filter(todo => todo.isStarted && !todo.isDone).length > 0) ||
                                (type === 'done' && activeTodoList.filter(todo => todo.isDone).length > 0) ? (
                                activeTodoList.map(todo => (
                                    <TodoEntry key={todo.id} type={type} todoData={todo} onEdit={handleEdit} />
                                ))
                            ) : (
                                <div style={{ width: '100%', height: '20em', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {type === 'todo' && <strong>"To create new a new activity, use the '+'-button."</strong>}
                                    {type === 'doing' && "Looks like you are not doing anything at the moment. Go to 'todo' to start a task."}
                                    {type === 'done' && "No finished tasks yet."}
                                </div>
                            )
                        }
                    </div>
                </>
            )}

            {isEditModalOpen && editingTask && (
                <EditModal
                    isOpen={isEditModalOpen}
                    onRequestClose={handleCloseModal}
                    editData={editingTask}

                />
            )}

            {type === 'todo' && (
                <div className="button-view">
                    <TodoButton onClick={handleClick} />
                    <TodoModal isOpen={isModalOpen} onRequestClose={handleCloseSubmitModal} />
                </div>
            )}
        </div>
    );
};

AnythingList.prototypes = {
    type: PropTypes.string.isRequired,
}

export default AnythingList;