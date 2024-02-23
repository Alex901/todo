import React from "react";
import './TodoButton.css';
import PropTypes from 'prop-types';

const TodoButton = ({ onClick }) => {


    return (
        <button onClick={onClick} className="addButton"> 
        <i className="material-icons plus">add</i>
        </button>
    );
}

TodoButton.propTypes = {
    onClick: PropTypes.func.isRequired,
}

export default TodoButton;