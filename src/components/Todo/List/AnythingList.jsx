import React, { useState } from "react";
import "./AnythingList.css"
import PropTypes from 'prop-types';
import TodoButton from "../TodoButton/TodoButton";
import TodoModal from "../TodoModal/TodoModal";
import TodoEntry from "../TodoEntry/TodoEntry";
import { useTodoContext } from "../../../contexts/todoContexts";

const AnythingList = ({type}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { todoList } = useTodoContext();

    const handleClick = () => {
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }
  
    return (
        <div className="list-container">
        <div className={`title-${type}`}>
            <h3> {type} </h3>
        </div>
        <div className="list-view">
        {todoList.map(todo => (
            <TodoEntry key={todo.id} type={type} todoData={todo} />
        ))}

{/*         <TodoEntry type={type}/>
        <TodoEntry type={type}/>
        <TodoEntry type={type}/>
        <TodoEntry type={type}/> */}
        
      

        </div>
        {type === 'todo' && ( //later
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