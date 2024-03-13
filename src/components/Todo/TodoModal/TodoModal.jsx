import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import './TodoModal.css'
import { useTodoContext } from '../../../contexts/todoContexts';
import { useUserContext } from '../../../contexts/UserContext';
import Select from 'react-select'

ReactModal.setAppElement('#root');

const TodoModal = ({ isOpen, onRequestClose }) => {
    const [taskName, setTaskName] = useState('');
    const { addTodo } = useTodoContext();
    const [errorMessage, setErrorMessage] = useState('');
    const { isLoggedIn } = useUserContext();
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


    const [newTaskData, setNewTaskData] = useState({
        taskName: '',
        description: '',
        priority: '',
        isUrgent: false,
        dueDate: null,
        steps: [],
        difficulty: "",
        estimatedTime: 0,

    });

    const handleInputChange = (event) => {
        let value = event.target.value;

        setNewTaskData({
            ...newTaskData,
            [event.target.name]: value,
        });
        setErrorMessage('');
    };

    const handleCheckboxChange = (event) => {
        setNewTaskData({
            ...newTaskData,
            [event.target.name]: event.target.checked,
        });
    };

    const handleSelectChange = (selectedOption) => {
        setNewTaskData({
            ...newTaskData,
            priority: selectedOption.value,
        });
    };


    const handleSubmit = () => {
        event.preventDefault();
        console.log("TodoModal -> newTaskData", newTaskData);
        if (!newTaskData.taskName.trim()) {
            setErrorMessage('You need to enter a task name');
            return;
        }

        const allStepsHaveName = newTaskData.steps.length === 0 || newTaskData.steps.every(step => step.taskName.trim() !== '');

        if (!allStepsHaveName) {
            setErrorMessage('You need to enter all step names');
            return;
        }
        console.log("newTaskData.dueDate: ", newTaskData.dueDate);
     /*    if (newTaskData.dueDate ===) {
            newTaskData.dueDate = null;
        }
 */ 
        console.log("newTaskData.dueDate: ", newTaskData.dueDate);
        addTodo(newTaskData);
        onRequestClose();
        setErrorMessage('');
        setNewTaskData({
            taskName: '',
            description: '',
            priority: '',
            isUrgent: false,
            dueDate: null,
            steps: [],
            difficulty: "",
            estimatedTime: null,
        });
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
            onrejectionhandled();
            setErrorMessage('');
        }
    }

    const handleAddStep = () => {
        console.log("newTaskData.steps.length: ", newTaskData.steps.length);
        if (newTaskData.steps.length < 10) {
            console.log("prevData add step: ")
            setNewTaskData(prevData => ({
                ...prevData,
                steps: [...prevData.steps, { id: prevData.steps.length + 1, taskName: '', isDone: false }]
            }));
        } else {
            setErrorMessage('You can only add 10 steps');
            setTimeout(() => { setErrorMessage('') }, 5000);
            return;
        }
    };

    const handleInputChangeStep = (id, event) => {
        setNewTaskData(prevData => ({
            ...prevData,
            steps: prevData.steps.map(step =>
                step.id === id ? { ...step, taskName: event.target.value } : step
            ),
        }));
    };

    const handleDiffChange = (selectedOption) => {
        setNewTaskData({
            ...newTaskData,
            difficulty: selectedOption.value,
        });
    };



    return (

        <ReactModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add new todo task"
            className="modal-content"
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
        >
            <div className='modalTitle'> <h3 className="title"> Create task </h3></div>

            {isLoggedIn ? (

                <form className="create-entry-form" onSubmit={handleSubmit}>
                    <input
                        type='text'
                        placeholder='Enter task name'
                        onChange={handleInputChange}
                        className='create-modal-input'
                        onKeyDownCapture={handleKeyPress}
                        autoFocus
                        maxLength={70}
                        name='taskName'
                    />
                    <textarea
                        placeholder='Enter task description(optional)'
                        maxLength={500}
                        rows={4}
                        className='create-modal-input-description'
                        onChange={handleInputChange}
                        name="description"
                    />
                    <hr style={{ width: '80%', margin: '10px auto' }} />
                    <div style={{
                        display: 'flex', flexDirection: 'row', alignItems: 'center',
                        padding: '10px', width: '-webkit-fill-available'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: '20px' }}>
                            <label htmlFor='priority' style={{ width:'65px'}}>Priority</label>
                            <Select
                                id='priority'
                                options={options}
                                defaultValue='' // Preselect 'NORMAL'
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
                            <input type='checkbox' id='isUrgent' name='isUrgent' onChange={handleCheckboxChange} />
                        </div>
                    </div>
                    <div className="input-container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                        <label style={{ width:'65px' }}>Deadline</label>
                        <input
                            type='datetime-local'
                            className='modal-input-date'
                            onChange={handleInputChange}
                            name='dueDate'
                            style={{ width: '200px', height:'36px', textAlign: 'center' }}
                        />
                    </div>

                    <div className='input-container' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                        <label style={{ width:'65px', textAlign: '' }}>Est. Time</label>
                        <input
                            type='number'
                            className='modal-input-date'
                            onChange={handleInputChange}
                            name='estimatedTime'
                            style={{ width: '200px', height: '35px', textAlign: 'center' }}
                            placeholder='Estimated duration (hours)'
                            min='0'
                            
                        />
                    </div>

                    <div className="input-contariner" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', padding: '10px' }}>
                        <label style={{ width:'65px', textAlign: '' }}>Difficulty</label>
                        <Select
                            options={optionsDiff}
                            onChange={handleDiffChange} // replace with your own handler
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

                    <div className='steps' style={{ width: '100%', justifyContent: 'left' }}>
                        {newTaskData.steps.map(step => (
                            <div key={step.id} style={{ display: 'flex', flexDirection: 'row' }}>
                                <label style={{ display: 'flex', alignItems: 'center' }}>{`Step${step.id}`}</label>
                                <input className='create-modal-input' type='text' placeholder={`Enter subTask`}
                                    onChange={event => handleInputChangeStep(step.id, event)} value={newTaskData.steps[step.id - 1].value} maxLength='50' />
                            </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <p className='add-step' onClick={handleAddStep} style={{}}> <strong> add step </strong> </p> </div>
                    </div>
                    <hr style={{ width: '80%', margin: '10px auto' }} />


                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <button className='modal-button'> Submit </button>
                </form>
            ) : (
                <form className="create-entry-form" onSubmit={handleSubmit}>
                    <input
                        type='text'
                        placeholder='Enter task name'
                        onChange={handleInputChange}
                        className='create-modal-input'
                        onKeyDownCapture={handleKeyPress}
                        autoFocus
                        maxLength={1000}
                        name='taskName'
                    />
                    <textarea
                        placeholder='Enter task description(optional)'
                        maxLength={500}
                        rows={4}
                        className='create-modal-input-description'
                        onChange={handleInputChange}
                        name="description"
                    />
                    <hr style={{ width: '80%', margin: '10px auto' }} />
                    <h4 style={{color: 'red'}}> Log in for more features </h4>
                    <hr style={{ width: '80%', margin: '10px auto' }} />

                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <button className='modal-button'> Submit </button>
                </form>
            )}
        </ReactModal>

    )
}

export default TodoModal;