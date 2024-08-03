// ColorPicker.jsx
import React from 'react';

const webSafeColors = [
  '#000000', '#0000FF', '#00FF00', '#FF0000', '#00FFFF', '#FF00FF', '#FFFF00', '#C0C0C0',
  '#808080', '#800000', '#808000', '#800080'
];

const ColorPicker = ({ selectedColor, onChange }) => {
  return (
    <div className="color-picker">
      {webSafeColors.map(color => (
        <div
          key={color}
          className="color-swatch"
          style={{
            backgroundColor: color,
            border: selectedColor === color ? '2px solid black' : '1px solid #ccc',
            width: '24px',
            height: '24px',
            cursor: 'pointer'
          }}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
  );
};

export default ColorPicker;