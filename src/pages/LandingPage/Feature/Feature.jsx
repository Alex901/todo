import React from 'react';
import './Feature.css';

const Feature = ({ image, title, description }) => {
    return (
        <div className="feature">
            <div className="feature-image-title">
                <img className='feature-image' src={image} alt={title} />
                <p className="feature-title">{title}</p>
            </div>
            <p className="feature-description">{description}</p>
        </div>
    );
};

export default Feature;