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

import { FormControl, InputLabel, MenuItem, Select, IconButton, Checkbox, FormControlLabel } from '@mui/material';

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

    /*   useEffect(() => {
          if (editingTask !== null) {
              setIsEditModalOpen(true);
          }
      }, [editingTask]); */
    /* Logging */
    useEffect(() => {
        console.log("IsEditModalOpen?", isEditModalOpen);
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

    const handleClick = () => {
        setIsModalOpen(true);
    }

    const handleEdit = (taskData) => {
        setEditingTask(taskData);
        console.log("DEBUG:open edit modal");
        setIsEditModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setEditingTask(null);
        console.log("DEBUG: closeEditingModal");
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
        if (selectedOptionSort.value === 'task') {
            const sortedList = [...activeTodoList].sort((a, b) => {
                if (isAscending) {
                    return a.task.localeCompare(b.task);
                } else {
                    return b.task.localeCompare(a.task);
                }

            })

            if (JSON.stringify(sortedList) !== JSON.stringify(activeTodoList)) {
                setActiveTodoList(sortedList);
            }
        } else if (selectedOptionSort.value === 'created') {
            const sortedList = [...activeTodoList].sort((a, b) => {
                if (!isAscending) {
                    return a.created - b.created;
                } else {
                    return b.created - a.created;
                }
            })
            if (JSON.stringify(sortedList) !== JSON.stringify(activeTodoList)) {
                setActiveTodoList(sortedList);
            }
        } else if (selectedOptionSort.value === 'priority') {
            const sortedList = [...activeTodoList].sort((a, b) => {
                if (!isAscending) {
                    return priorityMapping[a.priority] - priorityMapping[b.priority];
                } else {
                    return priorityMapping[b.priority] - priorityMapping[a.priority];
                }
            })
            if (JSON.stringify(sortedList) !== JSON.stringify(activeTodoList)) {
                setActiveTodoList(sortedList);
            }
        } else if (selectedOptionSort.value === 'steps') {
            const sortedList = [...activeTodoList].sort((a, b) => {
                if (!isAscending) {
                    return a.steps.length - b.steps.length;
                } else {
                    return b.steps.length - a.steps.length;
                }
            })
            if (JSON.stringify(sortedList) !== JSON.stringify(activeTodoList)) {
                setActiveTodoList(sortedList);
            }
        } else if (selectedOptionSort.value === 'difficulty') {
            const sortedList = [...activeTodoList].sort((a, b) => {
                if (!isAscending) {
                    return difficultyMapping[a.difficulty] - difficultyMapping[b.difficulty];
                } else {
                    return difficultyMapping[b.difficulty] - difficultyMapping[a.difficulty];
                }
            })
            if (JSON.stringify(sortedList) !== JSON.stringify(activeTodoList)) {
                setActiveTodoList(sortedList);
            }

        } else if (selectedOptionSort.value === 'dueDate') {
            const sortedList = [...activeTodoList].sort((a, b) => {
                if (!isAscending) {
                    return a.dueDate - b.dueDate;
                } else {
                    return b.dueDate - a.dueDate;
                }
            })
            if (JSON.stringify(sortedList) !== JSON.stringify(activeTodoList)) {
                setActiveTodoList(sortedList);
            }
        } else if (selectedOptionSort.value === 'estimatedTime') {
            const sortedList = [...activeTodoList].sort((a, b) => {
                if (!isAscending) {
                    return a.estimatedTime - b.estimatedTime;
                } else {
                    return b.estimatedTime - a.estimatedTime;
                }
            })
            if (JSON.stringify(sortedList) !== JSON.stringify(activeTodoList)) {
                setActiveTodoList(sortedList);
            }
        } else {
            return;
        }
    }

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

    const handleSortChange = (selectedOption) => {
        console.log("DEBUG: selectedOption", selectedOptionSort);
        console.log("DEBUG: selectedOption:", selectedOption.target);
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
    //Create the todo lists
    return (
        <div className="list-container">
            {isLoggedIn ? <div className={`title-${type}`}></div> : null}
            {isLoggedIn && (
                <div className="list-settings" style={{ justifyContent: 'right', border: 'none' }}>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '3px 20px' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isUrgentOnly}
                                    onChange={toggleUrgentTasks}
                                />
                            }
                            label="Urgent only"
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', margin: '3px 20px' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isDeadlineOnly}
                                    onChange={toggleDeadlineOnly}
                                />
                            }
                            label="Deadline only"
                        />
                    </div>
                    <div className="Select-sorting-order" style={{ display: 'flex', flexDirection: 'row' }}>
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