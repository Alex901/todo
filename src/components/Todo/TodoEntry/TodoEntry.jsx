import React, { useState, useEffect, useRef } from "react";
import './TodoEntry.css'
import PropTypes from 'prop-types';
import TodoModal from "../TodoModal/TodoModal";
import ConfirmationModal from "../TodoModal/ConfirmationModal/ConfirmationModal";
import { useUserContext } from "../../../contexts/UserContext";
import { useTodoContext } from "../../../contexts/todoContexts";
import { 
    mdiRunFast, 
    mdiArrowDownBold, 
    mdiArrowDownThin, 
    mdiArrowUpBold, 
    mdiArrowUpThin, 
    mdiMinus, 
    mdiCircleOutline, 
    mdiClockOutline, 
    mdiCircle, 
    mdiRewind, 
    mdiPlay,
    mdiCancel
} from '@mdi/js';
import Icon from '@mdi/react';

const TodoEntry = ({ type, todoData, onEdit }) => { //This is not good, should use state. Maybe fix?
    const { id,
        task,
        isDone,
        created,
        completed,
        started,
        isStarted,
        updatedAt,
        description,
        difficulty,
        dueDate,
        isUrgent,
        inList,
        owner,
        priority,
        steps,
        estimatedTime } = todoData;
    const [isMoreChecked, setIsMoreChecked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const entry = useRef(null);

    //Icon mapping
    const priorityIcons = {
        'VERY HIGH': mdiArrowUpBold,
        'HIGH': mdiArrowUpThin,
        'NORMAL': mdiMinus,
        'LOW': mdiArrowDownThin,
        'VERY LOW': mdiArrowDownBold,
    };

    const difficultyIcons = {
        '': [mdiCircleOutline, mdiCircleOutline, mdiCircleOutline, mdiCircleOutline, mdiCircleOutline],
        'VERY EASY': [mdiCircle, mdiCircleOutline, mdiCircleOutline, mdiCircleOutline, mdiCircleOutline],
        'EASY': [mdiCircle, mdiCircle, mdiCircleOutline, mdiCircleOutline, mdiCircleOutline],
        'NORMAL': [mdiCircle, mdiCircle, mdiCircle, mdiCircleOutline, mdiCircleOutline],
        'HARD': [mdiCircle, mdiCircle, mdiCircle, mdiCircle, mdiCircleOutline],
        'VERY HARD': [mdiCircle, mdiCircle, mdiCircle, mdiCircle, mdiCircle],
    };

    //Contexts
    const { removeTodo, toggleTodoComplete, toggleTodoStart, getDoingCount, cancelTodo, getActiveListDoingCount, setStepCompleted } = useTodoContext();
    const { isLoggedIn } = useUserContext();
    const [currentTime, setCurrentTime] = useState(Date.now());

    let isDueSoon = dueDate && ((dueDate.getTime() - new Date().getTime()) < 24 * 60 * 60 * 1000); // less than 24 hours left

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, []);



    const handleDelete = () => {
        removeTodo(id);
    };

    const handleEdit = () => {
        onEdit(todoData);
    }

    const handleMoreInfromationClick = () => {
        setIsMoreChecked(!isMoreChecked);
        console.log(isMoreChecked);
    }

    const handleClicktoComplete = () => {
        // Assuming steps is an array of step objects for the todo with id
        const allStepsCompleted = steps.every(step => step.isDone);
    
        if (allStepsCompleted) {
            toggleTodoComplete(id);
        } else {
            entry.current.classList.add('vibrate');
            setTimeout(() => entry.current.classList.remove('vibrate'), 1000);
            console.log("There are uncompleted steps remaining.");
        }
    }

    const handleClickToStart = () => {
        console.log("doing count: ", getDoingCount())
        if ((isLoggedIn ? getActiveListDoingCount() : getDoingCount()) > 2) {
            setIsModalOpen(true);
        } else {
            toggleTodoStart(id);
        }

    }

    const handleCancel = () => {
        cancelTodo(id);
    }

    //Confirmation modal functions

    const cancelConfirm = () => {
        setIsModalOpen(false);
    }

    const confirmStart = () => {
        toggleTodoStart(id);
    }

    const addLineBreak = (str) =>
        str.split('\n').map((subStr) => {
            return (
                <>
                    {subStr}
                    <br />
                </>
            );
        });

    const formatTime = (seconds) => {
        const days = Math.floor(seconds / (60 * 60 * 24));
        const hours = Math.floor((seconds / (60 * 60)) % 24);
        const minutes = Math.floor((seconds / 60) % 60);
        seconds = seconds % 60;
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    const handleStepClick = (stepId) => {
        const step = steps.find(step => step.id === stepId);
        if (type === 'doing' && !step.isDone) {
            setStepCompleted(todoData._id, stepId)
        } else {
            console.log("nothing should happen");
        }
    }



    //TODO: this is not pretty, make commonTodoEntry component and use it on all cases. 
    //Making changes on three places is not good practice and confusing in the long run.
    if (type === 'todo' && !isDone && !isStarted) {
        // console.log(todoData);
        return (
            <div className="todo-columns">
                <div className="todo-entry">
                    {isLoggedIn && (
                        <div className="information-container">
                            <div className="information-top">
                                {isUrgent && <Icon path={mdiRunFast} size={1} color={'red'} />}
                                <Icon path={priorityIcons[priority]} size={priority === 'NORMAL' ? 0.7 : 1} />
                            </div>
                            <div className="information-time">
                                <Icon path={mdiClockOutline} size={1} /> {estimatedTime ? `${estimatedTime}h` : '-'}
                            </div>
                            <div className="information-dif">
                                {difficultyIcons[difficulty].map((icon, index) => (
                                    <Icon key={index} path={icon} size={0.3} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="todo-item" onClick={handleClickToStart}>
                        <div className="time">
                            <p className="time-stamp"> <strong>Created:</strong> {created.toLocaleDateString()} - {created.toLocaleTimeString()} </p>
                            {dueDate ? (
                                <>
                                    <div className="separator"> </div>
                                    <p className={`time-stamp ${isDueSoon ? 'due-soon' : ''}`}> <strong>Deadline:</strong> {dueDate.toLocaleDateString()} - {dueDate.toLocaleTimeString()} </p>
                                </>
                            ) : null}
                        </div>
                        <p className="todo-text"> {task}</p>
                    </div>
                    <div className="buttons">
                        <button className="edit-button entryButton" onClick={handleEdit}>
                            <i className="material-icons todo-entry-icon">edit</i>
                        </button>
                        <button className="deleteButton entryButton" onClick={handleDelete}>
                            <i className="material-icons todo-entry-icon">delete</i>
                        </button>
                        <button className={`moreButton entryButton ${steps.length > 0 || description ? 'has-data' : ''}`} onClick={handleMoreInfromationClick}>
                            <i className="material-icons todo-entry-icon">
                                {isMoreChecked ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                            </i>
                        </button>
                    </div>
                </div>
                {isMoreChecked && isLoggedIn && (
                    <div className={`more-information ${isMoreChecked ? 'open' : ''}`}>
                        <div className="steps-container">
                            {steps && steps.length > 0 ? (
                                <>
                                    {steps.map((step, index) => (
                                        <div key={index} className="step-entry" onClick={() => handleStepClick(step.id)}>
                                            <p className="step-id"><strong>{`Step ${index + 1}`}</strong></p>
                                            <p className={`step-name ${step.isDone ? 'step-completed' : ''}`}>{step.taskName}</p>
                                        </div>
                                    ))}
                                    <p className="add-step" style={{ margin: '12px' }}><strong>Add another step</strong></p>
                                </>
                            ) : (
                                <div className="add-step"><strong>Add step</strong></div>
                            )}
                        </div>

                        <div className="description-container">
                            <p className="description-label"> <strong>Description </strong> </p>
                            <p> {description} </p>
                            
                        </div>
                        
                    </div>
                )}

                {isMoreChecked && !isLoggedIn && (
                    <div className={`more-information-loggedOut ${isMoreChecked ? 'open' : ''}`}>
                        <div className="more-information-loggedOut-message">
                            <p> <strong>Log in to access this feature </strong> </p>
                        </div>
                    </div>
                )}

                <ConfirmationModal
                    onRequestClose={cancelConfirm}
                    isOpen={isModalOpen}
                    onConfirm={confirmStart}
                    onClose={cancelConfirm}
                    message={addLineBreak(`You are already working on ${isLoggedIn ? getActiveListDoingCount() : getDoingCount()} tasks already,
                    and "${task}" is estemated to be a difficult task.\n\nAre you sure you wish to proceed?
                    `)}
                />

            </div>
        )
    } else if (type === 'done' && isDone && isStarted) {
        //This though :'D
        const durationMS = completed.getTime() - started.getTime();
        const remainingMS = durationMS > 0 ? durationMS : 0;
        const seconds = Math.floor(remainingMS / 1000);
        const remainingSeconds = seconds % 60;
        const remainingMinutes = Math.floor(seconds / 60) % 60;
        const remainingHours = Math.floor((seconds / 3600) % 24);
        const remainingDays = Math.floor((seconds / 3600 / 24));

        return (
            <div className="todo-columns">
                <div className="todo-entry">
                {isLoggedIn && (
                        <div className="information-container">
                            <div className="information-top">
                                {isUrgent && <Icon path={mdiRunFast} size={1} color={'red'} />}
                                <Icon path={priorityIcons[priority]} size={1} />
                            </div>
                            <div className="information-time">
                                <Icon path={mdiClockOutline} size={1} /> {estimatedTime ? `${estimatedTime}h` : '-'}
                            </div>
                            <div className="information-dif">
                                {difficultyIcons[difficulty].map((icon, index) => (
                                    <Icon key={index} path={icon} size={0.3} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="done-item">
                        <div className="time">
                            <p className="time-stamp"> <strong>Completed:</strong>
                                {completed.toLocaleDateString()} - {completed.toLocaleTimeString()}
                            </p>
                            <div className="separator"> </div>
                            <p className="time-stamp">
                                <strong> Duration: </strong>
                                {remainingDays > 0 && `${remainingDays}D:`}
                                {remainingHours > 0 && `${remainingHours}H:`}
                                {remainingMinutes > 0 && `${remainingMinutes}M:`}
                                {remainingSeconds}S:
                            </p>
                        </div>
                        <div className="todo-text">
                            <p className="done-text"> {task} </p>
                        </div>
                    </div>
                    <div className="buttons">
                        <button className="deleteButton entryButton" onClick={handleDelete} style={{ marginTop: '26px' }}>
                            <i className="material-icons todo-entry-icon">delete</i>
                        </button>

                        <button className="entryButton" onClick={handleMoreInfromationClick}>
                            <i className="material-icons todo-entry-icon"> {isMoreChecked ? "keyboard_arrow_up" : "keyboard_arrow_down"} </i>
                        </button>
                    </div>
                </div>
                {isMoreChecked && isLoggedIn && (
                    <div className={`more-information ${isMoreChecked ? 'open' : ''}`}>
                        <div className="steps-container">
                            {steps && steps.length > 0 ? (
                                <>
                                    {steps.map((step, index) => (
                                        <div key={index} className="step-entry" onClick={() => handleStepClick(step.id)}>
                                            <p className="step-id"><strong>{`Step ${index + 1}`}</strong></p>
                                            <p className="step-name">{step.taskName}</p>
                                        </div>
                                    ))}
                                   <></>
                                </>
                            ) : (
                                <></>
                            )}
                        </div>

                        <div className="description-container">
                            <p className="description-label"> <strong>Description </strong> </p>
                            <p> {description} </p>
                        </div>
                    </div>
                )}

                {isMoreChecked && !isLoggedIn && (
                    <div className={`more-information-loggedOut ${isMoreChecked ? 'open' : ''}`}>
                        <div className="more-information-loggedOut-message">
                            <p> <strong>Log in to access this feature </strong> </p>
                        </div>
                    </div>
                )}
            </div>
        )

    } else if (type === 'doing' && isStarted && !isDone) {
        return (
            <div className="todo-columns">
                <div className="todo-entry">
                {isLoggedIn && (
                        <div className="information-container">
                            <div className="information-top">
                                {isUrgent && <Icon path={mdiRunFast} size={1} color={'red'} />}
                                <Icon path={priorityIcons[priority]} size={1} />
                            </div>
                            <div className="information-time">
                                <Icon path={mdiClockOutline} size={1} /> {estimatedTime ? `${estimatedTime}h` : '-'}
                            </div>
                            <div className="information-dif">
                                {difficultyIcons[difficulty].map((icon, index) => (
                                    <Icon key={index} path={icon} size={0.3} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="doing-item" onClick={handleClicktoComplete}>
                        <div className="time">
                            <p className="time-stamp"> <strong>Started:</strong> {started.toLocaleDateString()} - {started.toLocaleTimeString()} </p>
                            {dueDate ? (
                                <>
                                    <div className="separator"> </div>
                                    <p className="time-stamp"> <strong>Deadline:</strong> {dueDate.toLocaleDateString()} - {dueDate.toLocaleTimeString()} </p>
                                </>
                            ) : null}
                            <div className="separator"> </div>
                            <p className="time-stamp"> <strong>Time spent:</strong> {formatTime(Math.floor((currentTime - started) / 1000))} </p>
                        </div>
                        <div className="todo-text">
                            <p ref={entry} className="doing-text"> {task} </p>
                        </div>
                    </div>
                    
                    <div className="buttons">
                        <button className="deleteButton entryButton" onClick={handleDelete} >
                            <i className="material-icons todo-entry-icon">delete</i>
                        </button>
                        <button className="entryButton" onClick={handleCancel} title="cancel task">
                            <i className="material-icons todo-entry-icon">keyboard_backspace</i>
                        </button>
                        <button className="entryButton" onClick={handleMoreInfromationClick}>
                            <i className="material-icons todo-entry-icon"> {isMoreChecked ? "keyboard_arrow_up" : "keyboard_arrow_down"} </i>
                        </button>
                    </div>
                </div>
                {isMoreChecked && isLoggedIn && (
                    <div className={`more-information ${isMoreChecked ? 'open' : ''}`}>
                        <div className="steps-container">
                            {steps && steps.length > 0 ? (
                                <>
                                    {steps.map((step, index) => (
                                        <div key={index} className="step-entry" onClick={() => handleStepClick(step.id)}>
                                            <p className="step-id"><strong>{`Step ${index + 1}`}</strong></p>
                                            <p className={`step-name ${step.isDone ? 'step-completed' : ''}`}>{step.taskName}</p>
                                        </div>
                                    ))}
                                    <></>
                                </>
                            ) : (
                                <></>
                            )}
                        </div>

                        <div className="description-container">
                            <p className="description-label"> <strong>Description </strong> </p>
                            <p> {description} </p>
                        </div>
                    </div>
                )}

                {isMoreChecked && !isLoggedIn && (
                    <div className={`more-information-loggedOut ${isMoreChecked ? 'open' : ''}`}>
                        <div className="more-information-loggedOut-message">
                            <p> <strong>Log in to access this feature </strong> </p>
                        </div>
                    </div>
                )}
                </div>
                );
    } else {
        return null;
    }

}


                TodoEntry.propTypes = {
                    todoData: PropTypes.shape({
                    _id: PropTypes.string.isRequired,
                id: PropTypes.number.isRequired,
                task: PropTypes.string.isRequired,
                isDone: PropTypes.bool.isRequired,
                created: PropTypes.instanceOf(Date).isRequired,
                completed: PropTypes.instanceOf(Date),
                started: PropTypes.instanceOf(Date),
                isStarted: PropTypes.bool,
                updatedAt: PropTypes.string,
                description: PropTypes.string,
                dueDate: PropTypes.instanceOf(Date),
                inList: PropTypes.arrayOf(PropTypes.string),
                owner: PropTypes.string,
                priority: PropTypes.string,
                isUrgent: PropTypes.bool,
                difficulty: PropTypes.string,
                estimatedTime: PropTypes.number,
                steps: PropTypes.arrayOf(PropTypes.shape({
                    _id: PropTypes.string.isRequired,
                taskName: PropTypes.string.isRequired,
                isDone: PropTypes.bool.isRequired,
                id: PropTypes.number.isRequired,
        })),
    }).isRequired,
                type: PropTypes.string.isRequired,
};

                export default TodoEntry;