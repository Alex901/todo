import React, { useState } from 'react';
import { Button, Popper } from '@mui/material';
import './ColorPickerButton.css';

const ColorPickerButton = ({ webSafeColors, selectedColor, handleColorSelect }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isColorPopperOpen, setIsColorPopperOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsColorPopperOpen(!isColorPopperOpen);
  };

  const handleColorClick = (event, color) => {
    handleColorSelect(color);
    setIsColorPopperOpen(false);
  };


  const open = Boolean(anchorEl);
  const id = open ? 'color-picker-popper' : undefined;

  return (
    <div>
      <Button
        aria-describedby={id}
        variant="contained"
        style={{
          backgroundColor: selectedColor,
          border: '1px solid #ccc', 
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
          height: '34px',
          width: '34px',
          borderRadius: '5px', 
        }}
        onClick={handleClick}
      >
      </Button>
      <Popper id={id} open={isColorPopperOpen} anchorEl={anchorEl} placement="top" className="color-picker-popper-root">
        <div className="color-picker">
          {webSafeColors.map(color => (
            <div
              key={color}
              className="color-swatch"
              style={{
                backgroundColor: color,
                border: selectedColor === color ? '2px solid black' : '1px solid #ccc',
                cursor: 'pointer'
              }}
              onClick={(event) => handleColorClick(event, color)}
            />
          ))}
        </div>
      </Popper>
    </div>
  );
};

export default ColorPickerButton;