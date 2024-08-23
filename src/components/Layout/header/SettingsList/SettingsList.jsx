import React from 'react';
import './SettingsList.css';

const SettingsList = ({ items, renderItem }) => {
  return (
    <div className="settings-list">
      {items.map((item, index) => (
        <div key={index} className="settings-list-entry">
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
};

export default SettingsList;