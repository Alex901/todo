import React from "react";
import './Card.css';
import { padding } from "@mui/system";

const Card = ({ children, maxWidth, padding, isMobile }) => {
    const resolvedPadding = padding !== undefined ? padding : (isMobile ? 0 : '20px');

    return (
        <div className="content-card" style={{ maxWidth, padding: resolvedPadding }}>
            {children}
        </div>
    )
}

Card.defaultProps = {
    maxWidth: "60em", // Default value for maxWidth
};

export default Card;