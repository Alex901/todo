import React from "react";
import './TodoButton.css';
import PropTypes from 'prop-types';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { IconButton } from '@mui/material';


const TodoButton = ({ onClick }) => {


    return (
        <button onClick={onClick} className="addButton">
        <Icon path={mdiPlus} size={1.8} />
      </button>
    )
}

TodoButton.propTypes = {
    onClick: PropTypes.func.isRequired,
}

export default TodoButton;