import React from 'react';
import './ViewDisplay.css'; // Import CSS for styling

const ViewDisplay = ({ activeView }) => {
    const viewTitles = {
        list: 'Project',
        dashboard: 'Dashboard',
        social: 'Social'
    };

    return (
        <div className="view-display">
            <h2>{viewTitles[activeView]}</h2>
        </div>
    );
};

export default ViewDisplay;