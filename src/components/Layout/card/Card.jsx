import React from "react";
import './Card.css';
import { padding } from "@mui/system";

const Card = ({children, maxWidth, padding}) => {
    return(
        <div className="content-card" style={{maxWidth, padding}}> 
            {children} 
        </div>
    )
}

Card.defaultProps = {
    maxWidth: "60em", // Default value for maxWidth
    padding: '20px' // Default value for padding
};

export default Card;