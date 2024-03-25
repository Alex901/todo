import React, { useState, useEffect } from "react";
import "./AnythingList.css"
import PropTypes from 'prop-types';
import TodoButton from "../TodoButton/TodoButton";
import TodoModal from "../TodoModal/TodoModal";
import EditModal from "../TodoModal/EditModal/EditModal";
import TodoEntry from "../TodoEntry/TodoEntry";
import { useTodoContext } from "../../../contexts/todoContexts";
import { useUserContext } from "../../../contexts/UserContext";
import Icon from '@mdi/react';
import { mdiMenuUp } from '@mdi/js';
import { mdiMenuDown } from '@mdi/js';

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
    const [isDeadlineOnly, setIsDeadlineOnly] = useState(false);
    const [deadlineListOnly, setDeadlineListOnly] = useState([]);
    const [selectedOptionSort, setSelectedOptionSort] = useState({ value: 'created', label: 'Created' });
    const [filteredTodoList, setFilteredTodoList] = useState([]);
    const [sortedTodoList, setSortedTodoList] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [originalTodoList, setOriginalTodoList] = useState([]);

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

    const activeList = loggedInUser ? loggedInUser.listNames.find(list => list.name === loggedInUser.activeList) : null;

    const tags = activeList ? activeList.tags : [];

    /*   useEffect(() => {
          if (editingTask !== null) {
              setIsEditModalOpen(true);
          }
      }, [editingTask]); */
    /* Logging */
    useEffect(() => {
    }, [isEditModalOpen]);

    //Everytime todoList(or loggedInUser) changes, i want to grab only the logged in users entries
    useEffect(() => {
        filterTodoList();
    }, [todoList, loggedInUser]);

    //if the user selects a different sorting option, i want to sort the list
    useEffect(() => {
        filterActiveList();
    }, [selectedOptionSort, isAscending, activeTodoList, loggedInUser]);

    //When i load a new user, i want that users settings to be loaded
    useEffect(() => {
        if (loggedInUser && loggedInUser.settings && loggedInUser.settings.todoList) {
            setIsUrgentOnly(loggedInUser.settings.todoList.urgentOnly);
        }
    }, [loggedInUser]);

    //Only after the activeTodoList has been set, i want to filters based on user settingws

    useEffect(() => {
        if (activeTodoList.length > 0) {
            filterUrgentTasks(isUrgentOnly);
        }
    }, [isUrgentOnly, activeTodoList]);

    useEffect(() => {
        updateActiveList();
    }, [selectedTags]);

    useEffect(() => {
        if (selectedTags.length === 0) {
          setOriginalTodoList(activeTodoList);
        }
      }, [activeTodoList]);

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

    const handleTagChange = (event, values) => {
        setSelectedTags(values);
    };




    //Create the todo lists
    return (
        <div className="list-container">
            {isLoggedIn ? <div className={`title-${type}`}></div> : null}
            {isLoggedIn && (
                <div className="list-settings" style={{ display: 'flex', justifyContent: 'space-between', border: 'none' }}>
                    <div className="seartch-container" style={{ margin: '3px 20px' }}>

                        <Stack spacing={3} sx={{}}>
                            <FormControl variant="outlined" style={{ minWidth: 120 }}>
                                <Autocomplete
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
                                            limitTags={2}
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
                            label="Deadline"
                        />
                    </div>
                    <div className="Select-sorting-order" style={{ display: 'flex', flexDirection: 'row', margin: '3px 0px' }}>
                        <FormControl variant="outlined" style={{ minWidth: 150 }}>

                            <Select
                                labelId="sorting-order-label"
                                defaultValue="created"
                                onChange={handleSortChange}
                                size="small"
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