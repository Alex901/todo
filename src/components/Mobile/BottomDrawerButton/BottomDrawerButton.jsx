import React, { useState } from 'react';
import { Button } from '@mui/material';
import './BottomDrawerButton.css';
import TodoModal from '../../Todo/TodoModal/TodoModal';
import BottomDrawer from '../BottomDrawer/BottomDrawer';
import Icon from '@mdi/react';
import { mdiChevronUp } from '@mdi/js';

const BottomDrawerButton = ({ listName, onOpen, onClose }) => {
    const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const handleOpenTodoModal = () => {
        setIsTodoModalOpen(true);
    };

    const handleOpenDrawer = () => {
        setDrawerOpen(true);
      };
    
      const handleCloseDrawer = () => {
        setDrawerOpen(false);
      };
    


    return (
        <div className="bottom-drawer-button-container">
       <Button className="drawer-button left" onClick={onOpen}>
          {listName}
          <Icon path={mdiChevronUp} size={1} color="black" />
        </Button>
            <Button className="drawer-button right" onClick={handleOpenTodoModal}>
                Create Entry
            </Button>
            <BottomDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} />
            <TodoModal
                isOpen={isTodoModalOpen}
                onRequestClose={() => setIsTodoModalOpen(false)} />
        </div>
    );
};

export default BottomDrawerButton;