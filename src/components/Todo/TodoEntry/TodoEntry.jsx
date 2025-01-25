import React, { useState, useEffect, useRef } from "react";
import './TodoEntry.css'
import PropTypes from 'prop-types';
import TodoModal from "../TodoModal/TodoModal";
import ConfirmationModal from "../TodoModal/ConfirmationModal/ConfirmationModal";
import { useUserContext } from "../../../contexts/UserContext";
import { useTodoContext } from "../../../contexts/todoContexts";
import Tags from "./Tags/Tags";


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
    mdiCancel,
    mdiShoePrint
} from '@mdi/js';
import Icon from '@mdi/react';
import { toast } from 'react-toastify';

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
        tags,
        inList,
        myLists,
        owner,
        priority,
        steps,
        estimatedTime,
        totalTimeSpent } = todoData;

    const [isMoreChecked, setIsMoreChecked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [isConfirmCancelModalOpen, setIsConfirmCancelModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
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
    const { removeTodo, toggleTodoComplete, toggleTodoStart, getDoingCount,
        cancelTodo, getActiveListDoingCount, setStepCompleted, setStepUncomplete } = useTodoContext();
    const { isLoggedIn } = useUserContext();
    const [currentTime, setCurrentTime] = useState(Date.now());

    let isDueSoon = dueDate && ((dueDate.getTime() - new Date().getTime()) < 24 * 60 * 60 * 1000); // less than 24 hours left

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleEdit = () => {
        onEdit(todoData);
    }

    const handleMoreInfromationClick = () => {
        setIsMoreChecked(!isMoreChecked);
    }

    const handleClicktoComplete = () => {
        // Assuming steps is an array of step objects for the todo with id
        const allStepsCompleted = steps.every(step => step.isDone);

        if (allStepsCompleted) {
            toggleTodoComplete(id);
            toast.success(`Your task has been completed.`);
            setIsMoreChecked(false);
        } else {
            entry.current.classList.add('vibrate');
            setTimeout(() => entry.current.classList.remove('vibrate'), 1000);
            setIsMoreChecked(true);
        }
    }

    const handleClickToStart = () => {
        if ((isLoggedIn ? getActiveListDoingCount() : getDoingCount()) > 2) {
            setIsModalOpen(true);
        } else {
            toggleTodoStart(id);
            toast.info(`A new task has been started.`);
        }

    }

    //Confirmation modal functions

    const cancelConfirm = () => {
        setIsModalOpen(false);
    }

    const confirmStart = () => {
        toggleTodoStart(id);
        toast.info(`A new task has been started.`);
        setIsModalOpen(false);
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
        } else if (type === 'doing' && step.isDone) {
            setStepUncomplete(todoData._id, stepId)
        } else {
            return;
        }
    }

    const confrimeDelete = () => {
        removeTodo(id);
        setIsConfirmDeleteModalOpen(false);
    }

    const cancelDelete = () => {
        setIsConfirmDeleteModalOpen(false);
    }

    const openDeleteModal = () => {
        setIsConfirmDeleteModalOpen(true);
    }

    const openCancelModal = () => {
        setIsConfirmCancelModalOpen(true);
    }

    const cancelCancel = () => {
        setIsConfirmCancelModalOpen(false);
    }

    const confirmCancel = () => {
        cancelTodo(id);
        setIsConfirmCancelModalOpen(false);
        toast.error(`Your task has been cancelled.`);
    }

    const formatEstimatedTime = (minutes) => {
        if (minutes < 60) {
            return `${minutes}min`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (remainingMinutes === 0) {
            return `${hours}h`;
        }
        return `${hours}h ${remainingMinutes}min`;
    };

    const formatDueDate = (dueDate) => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
      
        const isToday = dueDate.toDateString() === today.toDateString();
        const isTomorrow = dueDate.toDateString() === tomorrow.toDateString();
        const isPast = dueDate < today && !isToday;
      
        if (isPast) {
          return "Past deadline";
        } else if (isToday) {
          return `Today ${dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else if (isTomorrow) {
          return `Tomorrow ${dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else {
          return `${dueDate.toLocaleDateString("en-GB")} - ${dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
      };

    //TODO: this is not pretty, make commonTodoEntry component and use it on all cases. 
    //Making changes on three places is not good practice and confusing in the long run.
    if (type === 'todo' && !isDone && !isStarted) {
        // console.log(todoData);
        return (
            <div className={`todo-columns ${todoData.repeatable ? 'repeatable' : ''}`}>
                <div className="todo-entry">
                    {isLoggedIn && (
                        <div className="information-container">
                            <div className="information-top">
                                {isUrgent && <Icon path={mdiRunFast} size={1} color={'red'} />}
                                <Icon path={priorityIcons[priority]} size={priority === 'NORMAL' ? 0.7 : 1} />
                            </div>
                            <div className="information-time">
                                <Icon path={mdiClockOutline} size={1} />
                                <span style={{ whiteSpace: 'nowrap' }}>
                                    {estimatedTime ? formatEstimatedTime(estimatedTime) : '-'}
                                </span>
                            </div>
                            {steps.length > 0 && (
                                <div className="information-steps">
                                    <Icon path={mdiShoePrint} size={1} />
                                    {steps.length}
                                </div>
                            )}
                            <div className="information-dif">
                                {difficultyIcons[difficulty].map((icon, index) => (
                                    <Icon key={index} path={icon} size={0.3} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="todo-item" onClick={handleClickToStart}>
                        <div className="time">
                            <p className="time-stamp"> <strong>Created:</strong> {created.toLocaleDateString("en-GB")} - {created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} </p>
                            {dueDate ? (
                                <>
                                    <div className="separator"> </div>
                                    <p className={`time-stamp ${isDueSoon ? 'due-soon' : ''}`}> <strong>Deadline:</strong> {formatDueDate(dueDate)} </p>
                                </>
                            ) : null}
                        </div>
                        <div className="todo-text-container">
                            {todoData.__v === 0 && <p className="new-task">NEW!</p>}
                            <p className="todo-text">{task}</p>
                        </div>
                        <div className="tags-container-entry">
                            <Tags tags={tags} />
                        </div>
                    </div>
                    <div className="buttons">
                        <button className="edit-button entryButton" onClick={handleEdit}>
                            <i className="material-icons todo-entry-icon">edit</i>
                        </button>
                        <button className="deleteButton entryButton" onClick={openDeleteModal}>
                            <i className="material-icons todo-entry-icon">delete</i>
                        </button>
                        <button className={`moreButton entryButton ${steps.length > 0 || description ? 'has-data' : ''}`} onClick={handleMoreInfromationClick}>
                            <i className="material-icons todo-entry-icon">
                                {isMoreChecked ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                            </i>
                        </button>
                    </div>
                </div>
                { isLoggedIn && (
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
                                    </>
                                ) : (
                                    <div className="no-steps">No steps in this task!</div>
                                )}
                            </div>

                            <div className="description-container">
                                <p className="description-label"> <strong>Description </strong> </p>
                                <p>{description != null ? description : "No description"}</p>

                            </div>

                        </div>
                    )
                }

                {
                    isMoreChecked && !isLoggedIn && (
                        <div className={`more-information-loggedOut ${isMoreChecked ? 'open' : ''}`}>
                            <div className="more-information-loggedOut-message">
                                <p> <strong>Log in to access this feature </strong> </p>
                            </div>
                        </div>
                    )
                }

                <ConfirmationModal
                    onRequestClose={cancelConfirm}
                    isOpen={isModalOpen}
                    onConfirm={confirmStart}
                    onClose={cancelConfirm}
                    message={addLineBreak(`You are working on ${isLoggedIn ? getActiveListDoingCount() : getDoingCount()} tasks already. 
                    Are you certain you wish to start another one?`)}
                />

                <ConfirmationModal
                    onRequestClose={cancelDelete}
                    isOpen={isConfirmDeleteModalOpen}
                    onConfirm={confrimeDelete}
                    onClose={cancelDelete}
                    message={<span>Are you sure you wish to remove <strong>{todoData.task}</strong>?</span>}
                />

            </div >
        )
    } else if (type === 'done' && isDone && isStarted) {
        //This though, please make this into a function :'D
        const durationMS = (totalTimeSpent && totalTimeSpent !== 0)
            ? totalTimeSpent
            : completed.getTime() - started.getTime();
        const remainingMS = durationMS > 0 ? durationMS : 0;
        const seconds = Math.floor(remainingMS / 1000);
        const remainingSeconds = seconds % 60;
        const remainingMinutes = Math.floor(seconds / 60) % 60;
        const remainingHours = Math.floor((seconds / 3600) % 24);
        const remainingDays = Math.floor((seconds / 3600 / 24));

        return (
            <div className={`todo-columns ${todoData.repeatable ? 'repeatable' : ''}`}>
                <div className="todo-entry">
                    {isLoggedIn && (
                        <div className="information-container">
                            <div className="information-top">
                                {isUrgent && <Icon path={mdiRunFast} size={1} color={'red'} />}
                                <Icon path={priorityIcons[priority]} size={1} />
                            </div>
                            <div className="information-time">
                                <div className="information-time">
                                    <Icon path={mdiClockOutline} size={1} />
                                    <span style={{ whiteSpace: 'nowrap' }}>
                                        {estimatedTime ? formatEstimatedTime(estimatedTime) : '-'}
                                    </span>
                                </div>
                            </div>
                            {steps.length > 0 && (
                                <div className="information-steps">
                                    <Icon path={mdiShoePrint} size={1} />
                                    {steps.length}
                                </div>
                            )}
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
                                {completed.toLocaleDateString("en-GB")} - {completed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                        <div className="tags-container-entry">
                            <Tags tags={tags} />
                        </div>
                    </div>
                    <div className="buttons">
                        <button className="deleteButton entryButton" onClick={openDeleteModal} style={{ marginTop: '26px' }}>
                            <i className="material-icons todo-entry-icon">delete</i>
                        </button>

                        <button className="entryButton" onClick={handleMoreInfromationClick}>
                            <i className="material-icons todo-entry-icon"> {isMoreChecked ? "keyboard_arrow_up" : "keyboard_arrow_down"} </i>
                        </button>
                    </div>
                </div>
                {isMoreChecked && isLoggedIn && (
                    <div className={`more-information ${isMoreChecked ? 'open' : ''}`} style={{ gridTemplateColumns: (steps && steps.length > 0 && description) ? '2fr 1fr' : '1fr' }}>
                        {steps && steps.length > 0 && (
                            <div className="steps-container">
                                {steps.map((step, index) => (
                                    <div key={index} className="step-entry" onClick={() => handleStepClick(step.id)}>
                                        <p className="step-id"><strong>{`Step ${index + 1}`}</strong></p>
                                        <p className={`step-name ${step.isDone ? 'step-completed' : ''}`}>{step.taskName}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {description && (
                            <div className="description-container">
                                <p className="description-label"> <strong>Description </strong> </p>
                                <p>{description != null ? description : "No description"}</p>
                            </div>
                        )}
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
                    onRequestClose={cancelDelete}
                    isOpen={isConfirmDeleteModalOpen}
                    onConfirm={confrimeDelete}
                    onClose={cancelDelete}
                    message={<span>Are you sure you wish to remove <strong>{todoData.task}</strong>?</span>}
                />
            </div>
        )

    } else if (type === 'doing' && isStarted && !isDone) {
        return (
            <div className={`todo-columns ${todoData.repeatable ? 'repeatable' : ''}`}>
                <div className="todo-entry">
                    {isLoggedIn && (
                        <div className="information-container">
                            <div className="information-top">
                                {isUrgent && <Icon path={mdiRunFast} size={1} color={'red'} />}
                                <Icon path={priorityIcons[priority]} size={1} />
                            </div>
                            <div className="information-time">
                                <div className="information-time">
                                    <Icon path={mdiClockOutline} size={1} />
                                    <span style={{ whiteSpace: 'nowrap' }}>
                                        {estimatedTime ? formatEstimatedTime(estimatedTime) : '-'}
                                    </span>
                                </div>
                            </div>
                            {steps.length > 0 && (
                                <div className="information-steps">
                                    <Icon path={mdiShoePrint} size={1} />
                                    {`${steps.filter(step => step.isDone).length}/${steps.length}`}
                                </div>
                            )}
                            <div className="information-dif">
                                {difficultyIcons[difficulty].map((icon, index) => (
                                    <Icon key={index} path={icon} size={0.3} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="doing-item" onClick={handleClicktoComplete}>
                        <div className="time">
                            <p className="time-stamp"> <strong>Started:</strong> {started.toLocaleDateString("en-GB")} - {started.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} </p>
                            {dueDate ? (
                                <>
                                    <div className="separator"> </div>
                                    <p className="time-stamp"> <strong>Deadline:</strong> {dueDate.toLocaleDateString("en-GB")} - {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} </p>
                                </>
                            ) : null}
                            <div className="separator"> </div>
                            <p className="time-stamp"> <strong>Time spent:</strong> {formatTime(Math.floor((currentTime - started + totalTimeSpent) / 1000))} </p>
                        </div>
                        <div className="todo-text">
                            <p ref={entry} className="doing-text"> {task} </p>
                        </div>
                        <div className="tags-container-entry">
                            <Tags tags={tags} />
                        </div>
                    </div>

                    <div className="buttons">
                        <button className="deleteButton entryButton" onClick={openDeleteModal} >
                            <i className="material-icons todo-entry-icon">delete</i>
                        </button>
                        <button className="entryButton" onClick={openCancelModal} title="cancel task">
                            <i className="material-icons todo-entry-icon">keyboard_backspace</i>
                        </button>
                        <button className="entryButton"
                            onClick={handleMoreInfromationClick}
                            disabled={!(steps.length > 0 || description)} >
                            <i className="material-icons todo-entry-icon"> {isMoreChecked ? "keyboard_arrow_up" : "keyboard_arrow_down"} </i>
                        </button>
                    </div>
                </div>
                {isMoreChecked && isLoggedIn && (
                    <div className={`more-information ${isMoreChecked ? 'open' : ''}`} style={{ gridTemplateColumns: (steps && steps.length > 0 && description) ? '2fr 1fr' : '1fr' }}>
                        {steps && steps.length > 0 && (
                            <div className="steps-container">
                                {steps.map((step, index) => (
                                    <div key={index} className="step-entry" onClick={() => handleStepClick(step.id)}>
                                        <p className="step-id"><strong>{`Step ${index + 1}`}</strong></p>
                                        <p className={`step-name-doing ${step.isDone ? 'step-completed' : ''}`}>{step.taskName}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {description && (
                            <div className="description-container">
                                <p className="description-label"> <strong>Description </strong> </p>
                                <p>{description != null ? description : "No description"}</p>
                            </div>
                        )}
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
                    onRequestClose={cancelDelete}
                    isOpen={isConfirmDeleteModalOpen}
                    onConfirm={confrimeDelete}
                    onClose={cancelDelete}
                    message={<span>Are you sure you wish to remove <strong>{todoData.task}</strong> ?  <br /><br /> This will permanently remove this task.</span>}
                />

                <ConfirmationModal
                    onRequestClose={cancelCancel}
                    isOpen={isConfirmCancelModalOpen}
                    onConfirm={confirmCancel}
                    onClose={cancelCancel}
                    message={<span>Are you sure you wish to cancel <strong>{todoData.task}</strong> ? <br /><br /> Time spent on this task will not be reset, and completed steps will remain so.</span>}
                />
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
            id: PropTypes.number
        })),
    }).isRequired,
    type: PropTypes.string.isRequired,
};

export default TodoEntry;