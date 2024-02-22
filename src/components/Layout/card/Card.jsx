import React from "react";
import './Card.css';

const Card = ({children}) => {
    return(
        <div className="content-card"> 
            {children} 
        </div>
    )
}

export default Card;