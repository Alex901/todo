import React from 'react';
import { Drawer, IconButton } from '@mui/material';
import Icon from '@mdi/react';
import { mdiClose, mdiChevronDown } from '@mdi/js';
import './BottomDrawer.css';

const BottomDrawer = ({ isOpen, onClose, children, listName }) => {
  return (
    <Drawer anchor="bottom" open={isOpen} onClose={onClose} className="bottom-drawer">
         <div className="drawer-header" onClick={onClose}>
        <Icon path={mdiChevronDown} size={1} color="white" className="left-icon" />
        <span className="drawer-title">{listName}</span>
        <Icon path={mdiChevronDown} size={1} color="white" className="right-icon" />
      </div>
      <div className="drawer-content">
          {children}
      </div>
    </Drawer>
  );
};

export default BottomDrawer;