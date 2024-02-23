import React, { useState } from "react";
import "./AnythingList.css"
import PropTypes from 'prop-types';
import TodoButton from "../TodoButton/TodoButton";
import TodoModal from "../TodoModal/TodoModal";
import TodoEntry from "../TodoEntry/TodoEntry";

const AnythingList = ({type, contentList, children}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    const divStyle = { //test
        background: type === 'todo' ? 'red' : 'blue',
        color: type === 'todo' ? 'black' : 'orange',
    };


    
    return (
        <div className="list-container">
        <div className={`title-${type}`}>
            <h3> {type} </h3>
        </div>
        <div className="list-view">
        <TodoEntry type={type}/>
        <TodoEntry type={type}/>
        <TodoEntry type={type}/>
        <TodoEntry type={type}/>
        
      

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

AnythingList.prototype = {
    type: PropTypes.string.isRequired,
    contentList: PropTypes.array.isRequired,
    children: PropTypes.node
}

export default AnythingList;