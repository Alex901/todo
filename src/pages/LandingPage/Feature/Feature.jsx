import React from 'react';
import './Feature.css';

const Feature = ({ image, title, description }) => {
    return (
        <div className="feature">
            <div className="feature-image-title">
                <img className='feature-image' src={image}/>
                <p>{title}</p>
                </div>

                    <p>{description}</p>
            </div>
            );
};

            export default Feature;