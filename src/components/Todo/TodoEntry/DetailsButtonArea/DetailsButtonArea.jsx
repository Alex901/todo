import React, { useState } from 'react';
import Icon from '@mdi/react';
import { mdiArrowExpandLeft, mdiArrowExpandRight, mdiContentCut } from '@mdi/js';
import Tooltip from '@mui/material/Tooltip';
import TodoModal from '../../TodoModal/TodoModal';
import './DetailsButtonArea.css';

const DetailsButtonArea = ({ onAddTaskBefore, onSimplifyTask, onAddTaskAfter, taskId }) => {
    const [isTodoModalOpen, setIsTodoModalOpen] = React.useState(false);
    const [modalData, setModalData] = useState({});


    const handleOpenModal = (type) => {
        const data = type === 'before' ? { tasksAfter: [taskId] } : { tasksBefore: [taskId] };
        // console.log("DEBUG -- data:", data)
        setModalData(data);
        setIsTodoModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsTodoModalOpen(false);
        setModalData({});
    };

    return (
        <div className="details-button-area">
            <hr className="details-button-area-hr" />
            <div className="details-button-container">
                <Tooltip title="Add a task before this task">
                    <button className="entryButton" onClick={() => handleOpenModal('before')}>
                        <Icon path={mdiArrowExpandLeft} size={1} />
                    </button>
                </Tooltip>
                <Tooltip title="Coming soon">
                    <button className="entryButton" onClick={onSimplifyTask }>
                        <Icon path={mdiContentCut} size={1} />
                    </button>
                </Tooltip>
                <Tooltip title="Add a task after this task">
                    <button className="entryButton" onClick={() => handleOpenModal('after')}>
                        <Icon path={mdiArrowExpandRight} size={1} />
                    </button>
                </Tooltip>
            </div>
            <TodoModal
                isOpen={isTodoModalOpen}
                onRequestClose={handleCloseModal}
                initialData={modalData}
            />
        </div>
    );
};

export default DetailsButtonArea;