import React from "react";
import "./AnythingList.css"
import PropTypes from 'prop-types';

const AnythingList = ({type, contentList, children}) => {
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
        <p> dummy todo tast</p>
      

        </div>
        {type === 'todo' && ( //later
        <div className="button-view">
            <i className="material-icons">add</i>
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