import React from "react";
import './TodoButton.css';

const TodoButton = () => {

    const handleClick = () => {
        window.alert("button clicked");
    }

    return (
        <button onClick={handleClick} className="addButton"> 
        <i className="material-icons plus">add</i>
        </button>
    );
}

export default TodoButton;