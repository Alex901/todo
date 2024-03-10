import React, { useState, useEffect } from "react";
import "./AnythingList.css"
import PropTypes from 'prop-types';
import TodoButton from "../TodoButton/TodoButton";
import TodoModal from "../TodoModal/TodoModal";
import EditModal from "../TodoModal/EditModal/EditModal";
import TodoEntry from "../TodoEntry/TodoEntry";
import { useTodoContext } from "../../../contexts/todoContexts";
import { useUserContext } from "../../../contexts/UserContext";

const AnythingList = ({type}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeTodoList, setActiveTodoList] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const { loggedInUser, isLoggedIn } = useUserContext();
    const { todoList } = useTodoContext();

    useEffect(() => {
        if (editingTask !== null) {
            setIsEditModalOpen(true);
        }
    }, [editingTask]);

    useEffect(() => {
        filterTodoList();
    }, [todoList, loggedInUser]);

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
            setActiveTodoList(filteredList);
        } else {
            setActiveTodoList(todoList);
        }
    };
    //Create the todo lists
    return (
        <div className="list-container">
        <div className={`title-${type}`}>
          <h3> {isLoggedIn ? loggedInUser.activeList : type} </h3>
        </div>
        <div className="list-view">
        {activeTodoList.map(todo => (
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