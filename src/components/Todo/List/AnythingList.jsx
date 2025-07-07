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
import { mdiMenuUp, mdiMenuDown, mdiProgressStarFourPoints } from '@mdi/js';
import { } from '@mdi/js';
import { Grid, FallingLines } from "react-loader-spinner";
import { MagnifyingGlass } from "react-loader-spinner";
import {
    FormControl, InputLabel, MenuItem, Select, IconButton,
    Checkbox, FormControlLabel, Autocomplete, TextField, Stack,
    Chip, useMediaQuery
} from '@mui/material';
import BottomDrawerButton from "../../Mobile/BottomDrawerButton/BottomDrawerButton";

const AnythingList = ({ type, setType }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeTodoList, setActiveTodoList] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const { loggedInUser, isLoggedIn, toggleUrgent, updateSettings } = useUserContext();
    const { todoList } = useTodoContext();
    const [isAscending, setIsAscending] = useState(false);
    const [isUrgentOnly, setIsUrgentOnly] = useState(false);
    const [isNewOnly, setIsNewOnly] = useState(false); //should be "show"
    const [isDeadlineOnly, setIsDeadlineOnly] = useState(false);
    const [deadlineListOnly, setDeadlineListOnly] = useState([]);
    const [selectedOptionSort, setSelectedOptionSort] = useState({ value: 'created', label: 'Created' });
    const [selectedTags, setSelectedTags] = useState([]);
    const [originalTodoList, setOriginalTodoList] = useState([]);
    const [isTagsOpen, setIsTagsOpen] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);
    const [keepMenuOpen, setKeepMenuOpen] = useState(false);
    const [nothingToFilter, setNothingToFilter] = useState(false);
    const [isAnyFilterSelected, setIsAnyFilterSelected] = useState(false);
    const [canFinishProject, setCanFinishProject] = useState(false);

    console.log("DEBUG: loggedInuser ", activeTodoList.length);

    // console.log("DEBUG -- isFiltering:", activeTodoList.filter(todo => todo.isDone).length >= 10);

    const isMobile = useMediaQuery('(max-width: 800px)');

    useEffect(() => {
        setCanFinishProject(activeTodoList.filter(todo => todo.isDone).length >= 10);
        console.log("DEBUG -- canFinishProject: ", canFinishProject);
    }, [activeTodoList]);

    useEffect(() => {
        setIsAnyFilterSelected(
            isUrgentOnly || isDeadlineOnly || selectedTags.length > 0 || isNewOnly
        );
    }, [isUrgentOnly, isDeadlineOnly, selectedTags, isNewOnly]);

    useEffect(() => {
        // Check if there are tasks for the selected type
        const hasTasks = activeTodoList.some(todo => {
            if (type === 'done') {
                return todo.isDone;
            } else if (type === 'doing') {
                return todo.isStarted && !todo.isDone;
            } else if (type === 'todo') {
                return !todo.isStarted && !todo.isDone;
            }
            return false;
        });

        setNothingToFilter(!hasTasks); // Set to true if no tasks match the type
    }, [activeTodoList, type]);

    useEffect(() => {
        // Reset selectedTags when the active project changes
        setSelectedTags([]);
    }, [loggedInUser]);


    // console.log("activeTodoList: ", activeTodoList);
    // const debugTesks = activeTodoList.filter(todo => !todo.isStarted && !todo.isDone);
    // console.log("DEBUG -- Prepared Tasks:", debugTesks);

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
        '': 0,
    };

    const sortFunctions = {
        task: (a, b) => a.task.localeCompare(b.task),
        created: (a, b) => a.created - b.created,
        priority: (a, b) => priorityMapping[a.priority] - priorityMapping[b.priority],
        steps: (a, b) => a.steps.length - b.steps.length,
        difficulty: (a, b) => difficultyMapping[a.difficulty] - difficultyMapping[b.difficulty],
        dueDate: (a, b) => a.dueDate - b.dueDate,
        estimatedTime: (a, b) => a.estimatedTime - b.estimatedTime,
        lastUpdated: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
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
    const activeList = loggedInUser ? loggedInUser.myLists.find(list => list.listName === loggedInUser.activeList) : null;
    const tags = activeList ? activeList.tags : [];



    const customSortFunction = (a, b, isAscending) => {
        const getDateCategory = (date) => {
            if (!date) return isAscending ? -1 : 5; // No deadline
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
            return dateB - dateA;
        }

        // If dates are in the same category, sort by the actual date
        return isAscending ? new Date(b.dueDate) - new Date(a.dueDate) : new Date(a.dueDate) - new Date(b.dueDate);
    };

    const filteredTodoList = useMemo(() => {
        let list = todoList; //All todo entries
        // console.log("DEBUG -- list: ", list);

        list = list.filter(todo => todo.inListNew.some(list => list.listName === loggedInUser.activeList));

        //filter out used tags

        if (isUrgentOnly) {
            list = list.filter(todo => todo.isUrgent);
        }

        if (isDeadlineOnly) {
            list = list.filter(todo => {
                const dueDate = new Date(todo.dueDate);
                return dueDate >= startOfWeek && dueDate <= endOfWeek;
            });
        }

        if (isNewOnly) {
            list = list.filter(todo => todo.__v === 0);
        }

        if (selectedTags.length > 0) {
            //console.log("DEBUG -- selectedTags: ", selectedTags);
            list = list.filter(todo => {
                // console.log('Filtering todo:', todo);
                return selectedTags.every(tag => {
                    return todo.tags.map(t => {
                        // console.log('Comparing tag._id:', tag._id, 'with t._id:', t._id);
                        if (t._id === tag._id) {
                            //  console.log('Match found for tag._id:', tag._id);
                        }
                        return t._id;
                    }).includes(tag._id);
                });
            });
        }

        return list;
    }, [todoList, isUrgentOnly, isDeadlineOnly, selectedTags, isNewOnly]);

    console.log("DEBUG -- filteredTodoList: ", filteredTodoList);

    const sortedTodoList = useMemo(() => {
        const sortedList = [...filteredTodoList].sort((a, b) => {
            if (selectedOptionSort.value === 'deadline') {
                return isAscending ? customSortFunction(a, b, isAscending) : customSortFunction(b, a, !isAscending);
            } else if (selectedOptionSort.value === 'new') { //This is messy
                return;
            } else if (selectedOptionSort.value === 'urgent') {
                return;
            }
            return isAscending ? sortFunctions[selectedOptionSort.value](a, b, isAscending) : sortFunctions[selectedOptionSort.value](b, a, !isAscending);
        });
        return sortedList;
    }, [filteredTodoList, selectedOptionSort, isAscending]);


    //Might not need this
    useEffect(() => {
        setActiveTodoList(sortedTodoList);
        //console.log("DEBUG -- activeTodoList post sort: ", activeTodoList);
    }, [filteredTodoList, sortedTodoList]);

    //Load user settings
    useEffect(() => {
        if (loggedInUser && loggedInUser.settings && loggedInUser.settings.todoList) {
            setIsUrgentOnly(loggedInUser.settings.todoList.urgentOnly);
            setIsAscending(loggedInUser.settings.todoList.ascending);
            setIsDeadlineOnly(loggedInUser.settings.todoList.deadlineOnly);
            setIsNewOnly(loggedInUser.settings.todoList.newOnly);
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


    const handleSortChange = (selectedOption) => {
        setSelectedOptionSort(selectedOption.target);
    }

    const handleSortChangeWrapper = (event) => {
        console.log("DEBUG -- event.target.value: ", event);
        const validSortOptions = ['created', 'task', 'priority', 'steps', 'difficulty', 'dueDate', 'estimatedTime', 'lastUpdated'];
        if (validSortOptions.includes(event.target.value)) {
            handleSortChange(event);
        }
        event.stopPropagation();
    };


    const toggleSortOrder = () => {
        const newOrder = !isAscending;
        updateSettings('ascending', newOrder);
        setIsAscending(newOrder);

    }

    const toggleUrgentTasks = () => {
        const newUrgentOnly = !isUrgentOnly; // Toggle the value
        // Perform API call or any other side effects here
        updateSettings("urgentOnly", newUrgentOnly);
        setIsUrgentOnly(newUrgentOnly);
    }

    const toggleDeadlineOnly = () => {
        const newDeadlineOnly = !isDeadlineOnly;
        updateSettings("deadlineOnly", newDeadlineOnly);
        setIsDeadlineOnly(newDeadlineOnly);
    }

    const toggleNewOnly = () => {
        const newIsNewOnly = !isNewOnly;
        setIsNewOnly(newIsNewOnly);
        updateSettings('newOnly', newIsNewOnly);
    }

    const handleTagChange = (event, values) => {
        event.preventDefault();
        setSelectedTags(values);
        setIsTagsOpen(true)
    };

    const handleMenuCheckboxClick = (event) => {
        console.log("DEBUG -- event: ", event);
        event.stopPropagation();
    }

    const renderValue = (selected) => {
        const validSortOptions = {
            created: 'Created',
            task: 'Name',
            priority: 'Priority',
            steps: 'Steps',
            difficulty: 'Difficulty',
            dueDate: 'Deadline',
            estimatedTime: 'Time',
            lastUpdated: 'Updated'
        };
        return validSortOptions[selected] || 'Created';
    };

    // const MenuProps = {
    //     onClose: (event) => {
    //         // Prevent the menu from closing
    //         event.preventDefault();
    //     }
    // };

    const completeProject = () => {
        alert("Complete project")
    }

    const reviveProject = () => {
        alert("Revive project")
    }

    //Create the todo lists
    return (
        <div className="list-container">
            {isLoggedIn ? <div className={`title-${type}`}></div> : null}
            {isLoggedIn && (
                <div className={`list-settings list-settings-${type}`} style={{ display: 'flex', border: '2px solid gray' }}>
                    <div className="search-container" style={{ margin: '7px 20px' }}>

                        <Stack spacing={1} sx={{}}>
                            <FormControl variant="outlined" style={{ minWidth: 120 }}>
                                <Autocomplete
                                    disabled={nothingToFilter && selectedTags.length === 0}
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
                                    limitTags={3}
                                    options={tags}
                                    value={selectedTags}
                                    getOptionLabel={(option) => option.label}
                                    onChange={handleTagChange}
                                    renderOption={(props, option) => (
                                        <li {...props}>
                                            <Chip
                                                label={option.label}
                                                style={{ backgroundColor: option.color, color: option.textColor }}
                                            />
                                        </li>
                                    )}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                key={option._id}
                                                label={option.label}
                                                style={{ backgroundColor: option.color, color: option.textColor }}
                                                {...getTagProps({ index })}
                                            />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Find tags"

                                        />
                                    )}
                                />
                            </FormControl>
                        </Stack>
                    </div>

                    <div className="checkbox-row">
                        {!isMobile && (
                            <>
                                <div className="checkbox-container" style={{}}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={isUrgentOnly}
                                                onChange={toggleUrgentTasks}
                                                disabled={nothingToFilter && !isUrgentOnly}
                                            />
                                        }
                                        label="Urgent"
                                    />
                                </div>
                                <div className="checkbox-container" style={{}}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={isDeadlineOnly}
                                                onChange={toggleDeadlineOnly}
                                                disabled={nothingToFilter && !isDeadlineOnly}
                                            />
                                        }
                                        label="Deadline this week"
                                    />
                                </div>

                                <div className="checkbox-container" style={{}}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={isNewOnly}
                                                onChange={toggleNewOnly}
                                                disabled={nothingToFilter && !isNewOnly}
                                            />
                                        }
                                        label="New"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="Select-sorting-order" style={{ display: 'flex', flexDirection: 'row', margin: '3px 15px' }}>
                        <FormControl variant="outlined" style={{ minWidth: 150 }}>

                            <Select
                                labelId="sorting-order-label"
                                defaultValue="created"
                                onChange={handleSortChangeWrapper}
                                size="small"
                                renderValue={renderValue}
                                // MenuProps={MenuProps}
                                inputlabelprops={{
                                    style: { color: type === 'doing' ? 'black' : 'white' },
                                }}
                            >
                                <MenuItem value="created" name="created">Created</MenuItem>
                                <MenuItem value="task" name="task">Name</MenuItem>
                                <MenuItem value="priority" name="priority">Priority</MenuItem>
                                <MenuItem value="steps" name="steps">Steps</MenuItem>
                                <MenuItem value="difficulty" name="difficulty">Difficulty</MenuItem>
                                <MenuItem value="dueDate" name="dueDate">Deadline</MenuItem>
                                <MenuItem value="estimatedTime" name="estimatedTime">Time</MenuItem>
                                <MenuItem value="lastUpdated" name="lastUpdated">Updated</MenuItem>
                                {isMobile && [
                                    <MenuItem key="urgent" value="urgent" name="urgent" onClick={handleMenuCheckboxClick}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={isUrgentOnly}
                                                    onChange={(e) => {
                                                        handleMenuCheckboxClick(e);
                                                        toggleUrgentTasks(e);
                                                    }}
                                                />
                                            }
                                            label="Urgent"
                                        />
                                    </MenuItem>,
                                    <MenuItem key="deadline" value="deadline" name="deadline" onClick={handleMenuCheckboxClick}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={isDeadlineOnly}
                                                    onChange={(e) => {
                                                        handleMenuCheckboxClick(e);
                                                        toggleDeadlineOnly(e);
                                                    }}
                                                />
                                            }
                                            label="Deadline this week"
                                        />
                                    </MenuItem>,
                                    <MenuItem key="new" value="new" name="new" onClick={handleMenuCheckboxClick}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={isNewOnly}
                                                    onChange={(e) => {
                                                        handleMenuCheckboxClick(e);
                                                        toggleNewOnly(e);
                                                    }}
                                                />
                                            }
                                            label="New"
                                        />
                                    </MenuItem>
                                ]}
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

                    <div className={`list-view${isMobile ? '-mobile' : ''}`}>
                        {
                            isAnyFilterSelected && (
                                (type === 'todo' && activeTodoList.filter(todo => !todo.isStarted && !todo.isDone).length === 0) ||
                                (type === 'doing' && activeTodoList.filter(todo => todo.isStarted && !todo.isDone).length === 0) ||
                                (type === 'done' && activeTodoList.filter(todo => todo.isDone).length === 0)
                            ) ? (
                                <div style={{ width: '100%', height: '20em', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                    {type === 'todo' ? (
                                        <strong>"No prepared tasks match these filters."</strong>
                                    ) : type === 'doing' ? (
                                        <strong>"No ongoing tasks match these filters."</strong>
                                    ) : type === 'done' ? (
                                        <strong>"No completed tasks match these filters."</strong>
                                    ) : (
                                        <strong>"No result for these filters."</strong>
                                    )}
                                </div>
                            ) : (
                                // 3) Project is completed
                                activeList?.completed ? (
                                    type === 'todo' || type === 'doing' ? (
                                        // 3.1) If type == todo OR type == doing → Show revive project screen
                                        <div style={{ width: '100%', height: '20em', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                            <strong>"You have completed this project."</strong>
                                            <p>Click <span style={{ color: '#007acc', cursor: 'pointer' }} onClick={() => setType('done')}>here</span> to review.</p>
                                            <p>If you want to continue this project, you can revive it for:</p>
                                            <p>
                                                <strong>{activeList.score.score.ToFixed(1)}</strong>
                                                <Icon path={mdiProgressStarFourPoints} size={1} style={{ marginLeft: '5px', verticalAlign: 'middle' }} />
                                                <strong>{activeList.score.currency}</strong>
                                                <img src="/currency-beta.png" alt="Currency Beta" className="currency-image" style={{ marginLeft: '5px', verticalAlign: 'middle' }} />
                                            </p>
                                            <button onClick={reviveProject} style={{ padding: '10px 20px', fontSize: '1rem', backgroundColor: '#007acc', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                                Revive Project
                                            </button>
                                        </div>
                                    ) : (
                                        // 3.2) If type == done → Base case: list tasks normally, apply filters etc.
                                        activeTodoList.map(todo => (
                                            <TodoEntry key={todo.id} type={type} todoData={todo} onEdit={handleEdit} />
                                        ))
                                    )
                                ) : (
                                    // 4) Project is NOT completed
                                    canFinishProject ? (
                                        // 4.1) Project is completable
                                        type === 'todo' ? (
                                            activeTodoList.filter(todo => !todo.isStarted && !todo.isDone).length > 0 ? (
                                                // 4.1.1) type == todo → If todo tasks present → list tasks
                                                activeTodoList.map(todo => (
                                                    <TodoEntry key={todo.id} type={type} todoData={todo} onEdit={handleEdit} />
                                                ))
                                            ) : activeTodoList.filter(todo => todo.isStarted && !todo.isDone).length > 0 ? (
                                                // Else if no todo tasks but doing tasks present →
                                                // "Project is completable but uncompleted tasks remain" + link to doing
                                                <div style={{ width: '100%', height: '20em', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                                    <strong>"Project is completable but uncompleted tasks remain."</strong>
                                                    <p>Complete the remaining tasks to earn:</p>
                                                    <p>
                                                        <strong>{activeList.score.score.toFixed(1)}</strong>
                                                        <Icon path={mdiProgressStarFourPoints} size={1} style={{ marginLeft: '5px', verticalAlign: 'middle' }} />
                                                        <strong>{activeList.score.currency}</strong>
                                                        <img src="/currency-beta.png" alt="Currency Beta" className="currency-image" style={{ marginLeft: '5px', verticalAlign: 'middle' }} />
                                                    </p>
                                                    <p>Go to <span style={{ color: '#007acc', cursor: 'pointer' }} onClick={() => setType('doing')}>ongoing</span>.</p>
                                                </div>
                                            ) : (
                                                // Else (no todo or doing tasks) → show complete project screen
                                                <div style={{ width: '100%', height: '20em', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                                    <strong>"You are now able to complete this project."</strong>
                                                    <p>Completing this project will earn you:</p>
                                                    <p>
                                                        <strong>{activeList.score.score.toFixed(1)}</strong>
                                                        <Icon path={mdiProgressStarFourPoints} size={1} style={{ marginLeft: '5px', verticalAlign: 'middle' }} />
                                                        <strong>{activeList.score.currency}</strong>
                                                        <img src="/currency-beta.png" alt="Currency Beta" className="currency-image" style={{ marginLeft: '5px', verticalAlign: 'middle' }} />
                                                    </p>
                                                    <button onClick={completeProject} style={{ padding: '10px 20px', fontSize: '1rem', backgroundColor: '#007acc', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
                                                        Complete Project
                                                    </button>
                                                </div>
                                            )
                                        ) : type === 'doing' ? (
                                            activeTodoList.filter(todo => todo.isStarted && !todo.isDone).length > 0 ? (
                                                // 4.1.2) type == doing → If doing tasks present → list tasks
                                                activeTodoList.map(todo => (
                                                    <TodoEntry key={todo.id} type={type} todoData={todo} onEdit={handleEdit} />
                                                ))
                                            ) : activeTodoList.filter(todo => !todo.isStarted && !todo.isDone).length > 0 ? (
                                                // Else if no doing tasks but todo tasks present →
                                                // "Project is completable but uncompleted tasks remain" + link to todo
                                                <div style={{ width: '100%', height: '20em', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                                    <strong>"Project is completable but uncompleted tasks remain."</strong>
                                                    <p>Complete the remaining tasks to earn:</p>
                                                    <p>
                                                        <strong>{activeList.score.score.toFixed(1)}</strong>
                                                        <Icon path={mdiProgressStarFourPoints} size={1} style={{ marginLeft: '5px', verticalAlign: 'middle' }} />
                                                        <strong>{activeList.score.currency}</strong>
                                                        <img src="/currency-beta.png" alt="Currency Beta" className="currency-image" style={{ marginLeft: '5px', verticalAlign: 'middle' }} />
                                                    </p>
                                                    <p>Go to <span style={{ color: '#007acc', cursor: 'pointer' }} onClick={() => setType('todo')}>prepared</span>.</p>
                                                </div>
                                            ) : (
                                                // Else → show complete project screen
                                                <div style={{ width: '100%', height: '20em', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                                    <strong>"You are now able to complete this project."</strong>
                                                    <p>Completing this project will earn you:</p>
                                                    <p>
                                                        <strong>{activeList.score.score.toFixed(1)}</strong>
                                                        <Icon path={mdiProgressStarFourPoints} size={1} style={{ marginLeft: '5px', verticalAlign: 'middle' }} />
                                                        <strong>{activeList.score.currency}</strong>
                                                        <img src="/currency-beta.png" alt="Currency Beta" className="currency-image" style={{ marginLeft: '5px', verticalAlign: 'middle' }} />
                                                    </p>
                                                    <button onClick={completeProject} style={{ padding: '10px 20px', fontSize: '1rem', backgroundColor: '#007acc', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
                                                        Complete Project
                                                    </button>
                                                </div>
                                            )
                                        ) : (
                                            // 4.1.3) type == done → List project/tasks normally
                                            activeTodoList.map(todo => (
                                                <TodoEntry key={todo.id} type={type} todoData={todo} onEdit={handleEdit} />
                                            ))
                                        )
                                    ) : (
                                        // 4.2) Project is NOT completable
                                        type === 'todo' ? (
                                            activeTodoList.filter(todo => !todo.isStarted && !todo.isDone).length > 0 ? (
                                                // 4.2.1) type == todo → If todo tasks present → list tasks
                                                activeTodoList.map(todo => (
                                                    <TodoEntry key={todo.id} type={type} todoData={todo} onEdit={handleEdit} />
                                                ))
                                            ) : (
                                                // Else → show message:
                                                // "You don't have any prepared tasks in this project, use '+'-button to create one."
                                                <div style={{ width: '100%', height: '20em', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                                    <strong>"You don't have any prepared tasks in this project."</strong>
                                                    <p>Use the '+'-button to create one.</p>
                                                </div>
                                            )
                                        ) : type === 'doing' ? (
                                            activeTodoList.filter(todo => todo.isStarted && !todo.isDone).length > 0 ? (
                                                // 4.2.2) type == doing → If doing tasks present → list tasks
                                                activeTodoList.map(todo => (
                                                    <TodoEntry key={todo.id} type={type} todoData={todo} onEdit={handleEdit} />
                                                ))
                                            ) : (
                                                // Else → show message:
                                                // "It looks like you don’t have anything going on, go to todo (Prepared) to create a task or just enjoy the chill 😎"
                                                <div style={{ width: '100%', height: '20em', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                                    <strong>"It looks like you don’t have anything going on."</strong>
                                                    <p>Go to <span style={{ color: '#007acc', cursor: 'pointer' }} onClick={() => setType('todo')}>Prepared</span> to create a task or just enjoy the chill <span style={{ fontSize: '1.5em' }}>😎</span>.</p>
                                                </div>
                                            )
                                        ) : (
                                            activeTodoList.filter(todo => todo.isDone).length > 0 ? (
                                                // 4.2.3) type == done → If completed tasks present → list tasks
                                                activeTodoList.map(todo => (
                                                    <TodoEntry key={todo.id} type={type} todoData={todo} onEdit={handleEdit} />
                                                ))
                                            ) : (
                                                // Else → show message:
                                                // "No completed tasks yet, go to todo to prepare one."
                                                <div style={{ width: '100%', height: '20em', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                                    <strong>"No completed tasks yet."</strong>
                                                    <p>Go to <span style={{ color: '#007acc', cursor: 'pointer' }} onClick={() => setType('todo')}>Prepared</span> to create one.</p>
                                                </div>
                                            )
                                        )
                                    )
                                )
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

            <>
                {isMobile ? (
                    <>


                    </>
                ) : (
                    <>
                        {type === 'todo' && loggedInUser.activeList !== 'all' ? (
                            !activeList.completed ? (
                                <div className="button-view">
                                    <TodoButton onClick={handleClick} />
                                    <TodoModal
                                        isOpen={isModalOpen}
                                        onRequestClose={handleCloseSubmitModal}
                                    />
                                </div>
                            ) : (
                                <div className="button-view">
                                    <strong>"The project has been completed."</strong>
                                </div>
                            )
                        ) : (
                            <div className="button-view">
                                <strong>
                                    {activeList.completed ? (
                                        "The project has been completed."
                                    ) : type === 'doing' || type === 'done' ? (
                                        <>

                                        </>
                                    ) : (
                                        <>
                                            cannot create new tasks in this list. <br />
                                            please select another list!
                                        </>
                                    )}
                                </strong>
                            </div>
                        )}
                    </>
                )}
            </>
        </div>
    );
};

AnythingList.prototypes = {
    type: PropTypes.string.isRequired,
}

export default AnythingList;