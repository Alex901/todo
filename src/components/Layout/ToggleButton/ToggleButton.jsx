/* Why is this one still here ? :'D */

import React, { useState } from 'react';
import './ToggleButton.css'; // Import CSS for styling

const ToggleButton = () => {
  const [isToggled, setIsToggled] = useState(false);

  const toggleButton = () => {
    setIsToggled(!isToggled);
  };

  return (
    <div className="toggle-container">
      <button className={`toggle-button ${isToggled ? 'toggled' : ''}`} onClick={toggleButton}>
        <div className="toggle-ball"></div>
      </button>
    </div>
  );
};

export default ToggleButton;