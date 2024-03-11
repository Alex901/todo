import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import './TodoModal.css'
import { useTodoContext } from '../../../contexts/todoContexts';
import Select from 'react-select'

ReactModal.setAppElement('#root');

const TodoModal = ({ isOpen, onRequestClose }) => {
    const [taskName, setTaskName] = useState('');
    const { addTodo } = useTodoContext();
    const [errorMessage, setErrorMessage] = useState('');
    const options = [
        { value: 'VERY LOW', label: 'VERY LOW' },
        { value: 'LOW', label: 'LOW' },
        { value: 'NORMAL', label: 'NORMAL' },
        { value: 'HIGH', label: 'HIGH' },
        { value: 'VERY HIGH', label: 'VERY HIGH' }
    ];

    const [newTaskData, setNewTaskData] = useState({
        taskName: '',
        description: '',
        priority: options[2], //preselect 'NORMAL'
        isUrgent: false,
        dueDate: null,
        steps: []
    });

    const handleInputChange = (event) => {
        console.log("TodoModal -> handleInputChange -> newTaskData", newTaskData);
        console.log("TodoModal -> handleInputChange -> event", event.target.value);
        setNewTaskData({
            ...newTaskData,
            [event.target.name]: event.target.value,
        });
        setErrorMessage('');
    };

    const handleCheckboxChange = (event) => {
        console.log("TodoModal -> handleInputChange -> newTaskData", newTaskData);
        console.log("TodoModal -> handleInputChange -> event", event.target.checked);
        setNewTaskData({
            ...newTaskData,
            [event.target.name]: event.target.checked,
        });
    };

    const handleSelectChange = (selectedOption) => {
        console.log("TodoModal -> handleInputChange -> newTaskData", newTaskData);
        console.log("TodoModal -> handleInputChange -> event", event.target.value);
        setNewTaskData({
            ...newTaskData,
            priority: selectedOption.value,
        });
    };


    const handleSubmit = () => {
        console.log("TodoModal -> newTaskData", newTaskData);
        if (!taskName.trim()) {
            setErrorMessage('You need to enter a task name');
            return;
        }

        // addTodo(taskName);

        onRequestClose();
        setErrorMessage('');
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
        if (newTaskData.steps.length < 5) {
            console.log("prevData add step: ")
            setNewTaskData(prevData => ({
                ...prevData,
                steps: [...prevData.steps, { id: prevData.steps.length + 1, taskName: '', isDone: false }]
            }));
        } else {
            setErrorMessage('You can only add 5 steps');
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
            <form className="create-entry-form" onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder='Enter task name'
                    onChange={handleInputChange}
                    className='create-modal-input'
                    onKeyDownCapture={handleKeyPress}
                    autoFocus
                    maxLength={30}
                />
                <textarea
                    placeholder='Enter task description(optional)'
                    maxLength={255}
                    rows={3}
                    className='create-modal-input-description'
                    onChange={handleInputChange}
                // Add your onChange handler here
                />
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '10px',     width: '-webkit-fill-available' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: '20px' }}>
                        <label htmlFor='priority' style={{ marginRight: '10px' }}>Priority</label>
                        <Select
                            id='priority'
                            options={options}
                            defaultValue={options[2]} // Preselect 'NORMAL'
                            onChange={handleSelectChange}
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    height: 36,
                                    minHeight: 30,
                                    width: 150,
                                    borderRadius: 10,
                                }),
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <label htmlFor='urgent' style={{ marginRight: '10px' }}>Urgent?</label>
                        <input type='checkbox' id='urgent' name='urgent' onChange={handleCheckboxChange} />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'left' }}>
                    <label style={{ marginRight: '10px' }}>Deadline</label>
                    <input
                        type='datetime-local'
                        className='modal-input'
                        onChange={handleInputChange}
                    />
                </div>
                <hr style={{ width: '80%', margin: '10px auto' }} />

                <div className='steps' style={{ width: '100%', justifyContent: 'center' }}>
                    {newTaskData.steps.map(step => (
                        <div key={step.id} style={{ display: 'flex', flexDirection: 'row' }}>
                            <label style={{ display: 'flex', alignItems: 'center' }}>{`Step${step.id}`}</label>
                            <input className='create-modal-input' type='text' placeholder={`Enter subTask`}
                                onChange={event => handleInputChangeStep(step.id, event)} value={newTaskData.steps[step.id - 1].value} />
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <p className='add-step' onClick={handleAddStep} style={{}}> <strong> add step </strong> </p> </div>
                </div>
                <hr style={{ width: '80%', margin: '10px auto' }} />

                {errorMessage && <p className="error">{errorMessage}</p>}
                <button onClick={handleSubmit} className='modal-button'> Submit </button>
            </form>
        </ReactModal>

    )
}

export default TodoModal;