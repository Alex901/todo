import React, { useState } from 'react';
import { Button } from '@mui/material';
import './BottomDrawerButton.css';
import TodoModal from '../../Todo/TodoModal/TodoModal';
import Icon from '@mdi/react';
import { mdiChevronUp, mdiPlus } from '@mdi/js';
import TodoButton from '../../Todo/TodoButton/TodoButton';

const BottomDrawerButton = ({ listName, onOpen, onClose, user }) => {
    const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const handleOpenTodoModal = () => {
        setIsTodoModalOpen(true);
    };


    const isButtonDisabled = user?.activeList === 'all';

    <TodoModal
        isOpen={isTodoModalOpen}
        onRequestClose={() => setIsTodoModalOpen(false)} />

    return (
     
            <div className="bottom-drawer-button-container">
                <div className="drawer-button-section">
                <Button className="drawer-button" onClick={onOpen}>
                    <Icon path={mdiChevronUp} size={1} color="white" className="left-icon" />
                    <span className="list-name-bottom-drawer-button"> {listName} </span>
                    <Icon path={mdiChevronUp} size={1} color="white" className="right-icon" />
                </Button>
                </div>
                <div className="create-entry-section">
                    <button className="todo-button-mobile" onClick={handleOpenTodoModal} disabled={isButtonDisabled}>
                        <Icon path={mdiPlus} size={1.2} />
                    </button>
                </div>
                <TodoModal
                    isOpen={isTodoModalOpen}
                    onRequestClose={() => setIsTodoModalOpen(false)} />
            </div>
     

    );

};

export default BottomDrawerButton;