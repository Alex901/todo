import React, { useState } from 'react';
import ReactModal from 'react-modal';
import './EditModal.css'
import { useTodoContext } from '../../../../contexts/todoContexts';
import { useUserContext } from '../../../../contexts/UserContext';
import Select from 'react-select'
import { mdiDelete, mdiDeleteEmpty } from '@mdi/js';
import Icon from '@mdi/react';

ReactModal.setAppElement('#root');

const EditModal = ({ isOpen, onRequestClose, editData }) => {
    const { editTodo } = useTodoContext();
    const [errorMessage, setErrorMessage] = useState('');
    const { loggedInUser, isLoggedIn } = useUserContext();
    const [selectedOption, setSelectedOption] = useState(null);
    const [hoveredStepId, setHoveredStepId] = useState(null);
    const [taskData, setTaskData] = useState({
        id: editData.id,
        task: editData.task,
        description: editData.description,
        priority: editData.priority,
        isUrgent: editData.isUrgent,
        dueDate: editData.dueDate,
        steps: editData.steps,
        difficulty: editData.difficulty,
        estimatedTime: editData.estimatedTime,
        inList: editData.inList
    });

    const options = [
        { value: 'VERY HIGH', label: 'VERY HIGH' },
        { value: 'HIGH', label: 'HIGH' },
        { value: 'NORMAL', label: 'NORMAL' },
        { value: 'LOW', label: 'LOW' },
        { value: 'VERY LOW', label: 'VERY LOW' }
    ];

    const optionsDiff = [
        { value: 'VERY EASY', label: 'VERY EASY' },
        { value: 'EASY', label: 'EASY' },
        { value: 'NORMAL', label: 'NORMAL' },
        { value: 'HARD', label: 'HARD' },
        { value: 'VERY HARD', label: 'VERY HARD' },
    ];

    const optionsListNames = isLoggedIn && loggedInUser.listNames
        ? loggedInUser.listNames
            .filter(name => !taskData.inList.includes(name))
            .map(name => ({ value: name, label: name }))
        : [];

    const includedListNames = isLoggedIn && loggedInUser.listNames
        ? loggedInUser.listNames
            .filter(name => taskData.inList.includes(name))
            .map(name => ({ value: name, label: name }))
        : [];


    const handleInputChange = (event) => {
        console.log(event.target);

        setErrorMessage('');
        setTaskData({
            ...taskData,
            [event.target.name]: event.target.value
        });
        console.log(taskData);
    };

    const handleSubmit = () => {
        console.log("ListNames ", optionsListNames);
        event.preventDefault();
        console.log("TodoModal -> newTaskData", taskData);
        if (!taskData.task.trim()) {
            setErrorMessage('You need to enter a task name');
            return;
        }

        const allStepsHaveName = taskData.steps.length === 0 || taskData.steps.every(step => step.taskName.trim() !== '');

        if (!allStepsHaveName) {
            setErrorMessage('You need to enter all step names');
            return;
        }

        console.log("taskData: ", taskData);
        editTodo(taskData);
        onRequestClose();
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    }

    const handleSelectChange = (selectedOption) => {
        setTaskData({
            ...taskData,
            priority: selectedOption.value
        });
    }

    const handleCheckboxChange = (event) => {
        setTaskData({
            ...taskData,
            isUrgent: event.target.checked
        });
    }

    const handleDiffChange = (selectedOption) => {
        setTaskData({
            ...taskData,
            difficulty: selectedOption.value
        });
    }

    const handleInputChangeStep = (id, event) => {
        setTaskData(prevData => ({
            ...prevData,
            steps: prevData.steps.map(step => 
                step._id === id ? { ...step, taskName: event.target.value } : step
            )
        }));
    };

    const handleAddStep = () => {
        console.log("newTaskData.steps.length: ", taskData.steps.length);
        if (taskData.steps.length < 10) {
            setTaskData(prevData => ({
                ...prevData,
                steps: [...prevData.steps, { taskName: '', isDone: false, _id: generateNewId() }]
            }));
        } else {
            setErrorMessage('You can only add 10 steps');
            setTimeout(() => { setErrorMessage('') }, 5000);
            return;
        }
    };

    const handleAddToList = (event) => {
        event.preventDefault();
        console.log("Add to list", selectedOption);
        if (selectedOption === null) {
            setErrorMessage('You need to select a list');
            setTimeout(() => { setErrorMessage('') }, 5000);
            return;
        }
        setTaskData(prevData => ({
            ...prevData,
            inList: [...prevData.inList, selectedOption.value]
        }));
        setSelectedOption(null);
    }

    const handleListChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    }

    const handleRemoveFromList = (listName) => {
        console.log("Remove from list", listName);
        if (listName === "all") {
            setErrorMessage('You cannot remove this list');
            setTimeout(() => { setErrorMessage('') }, 5000);
            return;
        }
        setTaskData(prevData => ({
            ...prevData,
            inList: prevData.inList.filter(name => name !== listName)
        }));
    }

    const handleDeleteStep = (stepId) => {
        console.log("Delete step", stepId);
        setTaskData(prevState => ({
            ...prevState,
            steps: prevState.steps.filter(step => step._id !== stepId)
        }));
    };

    const generateNewId = () => {
        return [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    };

    //I steal the ccs classes from my create modal -- don't judge me, haha
    return (

        <ReactModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Edit todo task"
            className="modal-content modal"
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
        >

            {isLoggedIn ? (
                <form className='edit-entry-form' onSubmit={handleSubmit}>
                    <div className='modalTitle'> <h3 className="title"> Edit task </h3></div>
                    <input
                        name='task'
                        type='text'
                        placeholder='Enter task name'
                        value={taskData.task}
                        onChange={handleInputChange}
                        className='create-modal-input'
                        onKeyDownCapture={handleKeyPress}
                        autoFocus
                    />
                    <textarea
                        placeholder='Enter task description(optional)'
                        maxLength={500}
                        rows={4}
                        className='create-modal-input-description'
                        onChange={handleInputChange}
                        name="description"
                        value={taskData.description}
                    />
                    <hr style={{ width: '80%', margin: '10px auto' }} />

                    <div style={{
                        display: 'flex', flexDirection: 'row', alignItems: 'center',
                        padding: '10px', width: '-webkit-fill-available'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: '20px' }}>
                            <label htmlFor='priority' style={{ width: '65px' }}>Priority</label>
                            <Select
                                id='priority'
                                options={options}
                                value={{ value: taskData.priority, label: taskData.priority }}
                                onChange={handleSelectChange}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: 36,
                                        minHeight: 30,
                                        width: '200px',
                                        borderRadius: 10,
                                        border: '1px solid black',

                                    }),
                                    singleValue: (provided) => ({
                                        ...provided,
                                        textAlign: 'center',
                                        margin: '0 auto',
                                        padding: '0'
                                    }),

                                }}
                            />
                        </div>
                        <div className="input-container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                            <label htmlFor='urgent' style={{ marginRight: '10px' }}>Urgent?</label>
                            <input type='checkbox' id='isUrgent' name='isUrgent' onChange={handleCheckboxChange} checked={taskData.isUrgent} />
                        </div>
                    </div>
                    <div className="input-container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                        <label style={{ width: '65px' }}>Deadline</label>
                        <input
                            type='datetime-local'
                            className='modal-input-date'
                            onChange={handleInputChange}
                            name='dueDate'
                            value={taskData.dueDate ? new Date(taskData.dueDate).toISOString().substring(0, 16) : ""}
                            style={{ width: '200px', height: '36px', textAlign: 'center' }}
                        />
                    </div>

                    <div className='input-container' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                        <label style={{ width: '65px', textAlign: '' }}>Est. Time</label>
                        <input
                            type='number'
                            className='modal-input-date'
                            onChange={handleInputChange}
                            name='estimatedTime'
                            style={{ width: '200px', height: '35px', textAlign: 'center' }}
                            placeholder='Estimated duration (hours)'
                            min='0'
                            value={taskData.estimatedTime}
                        />
                    </div>

                    <div className="input-contariner" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', padding: '10px' }}>
                        <label style={{ width: '65px', textAlign: '' }}>Difficulty</label>
                        <Select
                            options={optionsDiff}
                            onChange={handleDiffChange}
                            value={{ value: taskData.difficulty, label: taskData.difficulty }}
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    height: 40,
                                    minHeight: 36,
                                    width: '208px',
                                    borderRadius: 10,
                                    border: '1px solid black',
                                    marginLeft: '8px'
                                }),
                                singleValue: (provided) => ({
                                    ...provided,
                                    textAlign: 'center',
                                    margin: '0 auto',
                                    padding: '0'
                                }),
                            }}
                        />
                    </div>
                    <hr style={{ width: '80%', margin: '10px auto' }} />
                    <div className="input-container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', padding: '10px' }}>
                        <label style={{ width: '65px', textAlign: '' }}>Add to list</label>
                        <Select
                            options={optionsListNames}
                            onChange={handleListChange}
                            value={selectedOption}
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    height: 40,
                                    minHeight: 36,
                                    width: '208px',
                                    borderRadius: 10,
                                    border: '1px solid black',
                                    marginLeft: '8px'
                                }),
                                singleValue: (provided) => ({
                                    ...provided,
                                    textAlign: 'center',
                                    margin: '0 auto',
                                    padding: '0'
                                }),
                            }}
                        />
                        <button className="create-list-button" style={{ marginLeft: '10px' }} onClick={handleAddToList}>Add</button>
                    </div>
                    <div className="input-container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', padding: '10px' }}>
                        <label style={{ width: '65px', textAlign: '' }}>In lists</label>
                        {includedListNames.map((list, index) => (
                            <span key={index} className="mdl-chip mdl-chip--deletable">
                                <span className="mdl-chip__text">{list.label}</span>
                                <button type="button" className="mdl-chip__action" onClick={() => handleRemoveFromList(list.label)}><i className="material-icons">cancel</i></button>
                            </span>
                        ))}

                    </div>
                    <hr style={{ width: '80%', margin: '10px auto' }} />
                    <div className='steps' style={{ width: '100%', justifyContent: 'left' }}>
                        {taskData.steps.map((step, index) => (
                            <div key={step.id} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <label style={{ display: 'flex', alignItems: 'center' }}>{`Step${index + 1}`}</label>
                                <input className='create-modal-input' type='text' placeholder={`Enter subTask`}
                                    onChange={event => handleInputChangeStep(step._id, event)}
                                    defaultValue={taskData.steps.find(s => s._id === step._id).taskName || ''} maxLength='50' />
                                <div onMouseEnter={() => setHoveredStepId(step._id)} onMouseLeave={() => setHoveredStepId(null)}>
                                    <Icon
                                        path={hoveredStepId === step._id ? mdiDeleteEmpty : mdiDelete}
                                        size={1.2}
                                        color={hoveredStepId === step._id ? "initial" : "gray"}
                                        onClick={() => handleDeleteStep(step._id)}
                                    />
                                </div>
                            </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <p className='add-step' onClick={handleAddStep} style={{}}> <strong> add step </strong> </p> </div>
                    </div>
                    <hr style={{ width: '80%', margin: '10px auto' }} />


                    {errorMessage && <p className="error">{errorMessage}</p>}

                    <button className='modal-button'> Save </button>
                </form>
            ) : (
                <form className='edit-entry-form' onSubmit={handleSubmit}>
                    <div className='modalTitle'> <h3 className="title"> Edit task </h3></div>
                    <input
                        name='task'
                        type='text'
                        placeholder='Enter task name'
                        value={taskData.task}
                        onChange={handleInputChange}
                        className='create-modal-input'
                        onKeyDownCapture={handleKeyPress}
                        autoFocus
                    />
                    <textarea
                        placeholder='Enter task description(optional)'
                        maxLength={500}
                        rows={4}
                        className='create-modal-input-description'
                        onChange={handleInputChange}
                        name="description"
                        value={taskData.description}
                    />
                    <hr style={{ width: '80%', margin: '10px auto' }} />
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <button className='modal-button'> Save </button>
                </form>
            )}
        </ReactModal>

    )
}

export default EditModal;