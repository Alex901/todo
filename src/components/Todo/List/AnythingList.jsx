import React, { useState, useEffect } from "react";
import "./AnythingList.css"
import PropTypes from 'prop-types';
import TodoButton from "../TodoButton/TodoButton";
import TodoModal from "../TodoModal/TodoModal";
import EditModal from "../TodoModal/EditModal/EditModal";
import TodoEntry from "../TodoEntry/TodoEntry";
import { useTodoContext } from "../../../contexts/todoContexts";
import { useUserContext } from "../../../contexts/UserContext";

const AnythingList = ({ type }) => {
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