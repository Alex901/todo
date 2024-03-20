import React, { useState, useEffect } from "react";
import "./AnythingList.css"
import PropTypes from 'prop-types';
import TodoButton from "../TodoButton/TodoButton";
import TodoModal from "../TodoModal/TodoModal";
import EditModal from "../TodoModal/EditModal/EditModal";
import TodoEntry from "../TodoEntry/TodoEntry";
import { useTodoContext } from "../../../contexts/todoContexts";
import { useUserContext } from "../../../contexts/UserContext";
import Select from 'react-select'; // or '@material-ui/core/Select'
import Icon from '@mdi/react';
import { mdiMenuUp } from '@mdi/js';
import { mdiMenuDown } from '@mdi/js';
import axios from "axios";

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

    useEffect(() => {
        if (editingTask !== null) {
            setIsEditModalOpen(true);
        }
    }, [editingTask]);

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
            console.log("DEBUG: anythingList > useEffect> isUrgentOnly: ", isUrgentOnly);
        }
    }, [loggedInUser]);

    //Only after the activeTodoList has been set, i want to filters based on user settingws
   
    useEffect(() => {
        console.log("DEBUG: useEffect activeTodoList");
        if (activeTodoList.length > 0) {
            filterUrgentTasks(isUrgentOnly);
        }
    }, [isUrgentOnly, activeTodoList]);

    const handleClick = () => {
        setIsModalOpen(true);
    }

    const handleEdit = (taskData) => {
        setEditingTask(taskData);
        setIsEditModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
        setEditingTask(null);
    }

    const filterTodoList = () => {
        if (isLoggedIn && loggedInUser.activeList) {
            const filteredList = todoList.filter(todo => todo.inList.includes(loggedInUser.activeList));
            if(JSON.stringify(filteredList) !== JSON.stringify(activeTodoList)) {
            setActiveTodoList(filteredList);
            }
        } else {
            if(JSON.stringify(todoList) !== JSON.stringify(activeTodoList)) {
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
        console.log("activeTodoList: ", activeTodoList);
        console.log("isUrgentOnly: ", isUrgentOnly);
        if (urgentOnly) {
            const urgentTasks = activeTodoList.filter(task => task.isUrgent);
            console.log("urgentTasks: ", urgentTasks);
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
        console.log("selectedOption: ", selectedOption);
        
    
        setSelectedOptionSort(selectedOption);
    }

    const toggleSortOrder = () => {
        setIsAscending(!isAscending);
        console.log("isAscending: ", isAscending);
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
            <div className={`title-${type}`}>
                <h3> {isLoggedIn ? loggedInUser.activeList : type} </h3>
            </div>
            {isLoggedIn && (
                <div className="list-settings">
                    <Select
                        options={[
                            { value: 'created', label: 'Created' },
                            { value: 'task', label: 'Name' },
                            { value: 'priority', label: 'Priority' },
                            { value: 'steps', label: 'Steps' },
                            { value: 'difficulty', label: 'Difficulty' },
                            { value: 'dueDate', label: 'Deadline' },
                            { value: 'estimatedTime', label: 'Time' },
                        ]}
                        onChange={handleSortChange}
                        defaultValue={{ value: 'created', label: 'Created' }}
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                width: '150px',
                                minHeight: '36px',
                                borderRadius: '15px',
                            }),
                        }}
                    />

                    <button
                        className="toggle-order-button"
                        onClick={toggleSortOrder}
                        style={{
                            marginRight: '10px',
                            width: '60px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0)',
                            border: 'none',
                            outline: 'none',
                        }}
                    >
                        {isAscending ? <Icon path={mdiMenuUp} size={1.4} /> : <Icon path={mdiMenuDown} size={1.4} />}
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', margin: '3px 20px' }}>
                        <input type="checkbox" onChange={toggleUrgentTasks} checked={isUrgentOnly} />
                        <label>Urgent only</label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', margin: '3px 20px' }}>
                        <input type="checkbox" onChange={toggleDeadlineOnly} checked={isDeadlineOnly} />
                        <label>Dadline only</label>
                    </div>
                </div>
            )}
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
                    <TodoModal isOpen={isModalOpen} onRequestClose={handleCloseModal} />
                </div>
            )}
        </div>
    );
};

AnythingList.prototypes = {
    type: PropTypes.string.isRequired,
}

export default AnythingList;