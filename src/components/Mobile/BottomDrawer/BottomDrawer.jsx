import React from 'react';
import { Drawer, IconButton } from '@mui/material';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import './BottomDrawer.css';

const BottomDrawer = ({ isOpen, onClose, children }) => {
  return (
    <Drawer anchor="bottom" open={isOpen} onClose={onClose} className="bottom-drawer">
      <div className="drawer-content">
          {children}
      </div>
    </Drawer>
  );
};

export default BottomDrawer;