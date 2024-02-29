import React, { useState, useEffect } from "react";
import "./AnythingList.css"
import PropTypes from 'prop-types';
import TodoButton from "../TodoButton/TodoButton";
import TodoModal from "../TodoModal/TodoModal";
import EditModal from "../TodoModal/EditModal/EditModal";
import TodoEntry from "../TodoEntry/TodoEntry";
import { useTodoContext } from "../../../contexts/todoContexts";

const AnythingList = ({type}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { todoList } = useTodoContext();
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        if (editingTask !== null) {
            setIsEditModalOpen(true);
        }
    }, [editingTask]);

    const handleClick = () => {
        setIsModalOpen(true);
    }

    const handleEdit = (taskData) => {
        setEditingTask(taskData);
        console.log('handleEdit-> taskdata: anythinglist: ', taskData)
        console.log('handleEdit: anythinglist: ', editingTask)
        setIsEditModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
        setEditingTask(null);
        console.log("Close Modal data: ", editingTask);
    }
  
    return (
        <div className="list-container">
        <div className={`title-${type}`}>
            <h3> {type} </h3>
        </div>
        <div className="list-view">
        {todoList.map(todo => (
            <TodoEntry key={todo.id} type={type} todoData={todo} onEdit={handleEdit} />
        ))}
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
            <TodoButton onClick={handleClick}/>
            <TodoModal isOpen={isModalOpen} onRequestClose={handleCloseModal}/>
        </div>
        )}
        </div>
    );
};

AnythingList.prototypes = {
    type: PropTypes.string.isRequired,
}

export default AnythingList;