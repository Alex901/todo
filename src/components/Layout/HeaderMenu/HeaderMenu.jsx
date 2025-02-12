import React from 'react';
import IconMenu from './IconMenu/IconMenu';
import ViewDisplay from './ViewDisplay/ViewDisplay';
import './HeaderMenu.css'; // Import CSS for styling

const HeaderMenu = ({ openGroupModal, openVoteModal, openCalendarModal, activeView, onViewChange }) => {
    return (
        <div className="app-main-menu">
            <ViewDisplay activeView={activeView} />
            <IconMenu
                openGroupModal={openGroupModal}
                openVoteModal={openVoteModal}
                openCalendarModal={openCalendarModal}
                activeView={activeView}
                onViewChange={onViewChange}
            />
           
        </div>
    );
};

export default HeaderMenu;