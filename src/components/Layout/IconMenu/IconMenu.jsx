import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import Icon from '@mdi/react';
import { mdiAccountGroup, mdiVoteOutline, mdiCalendarCheck, mdiViewDashboard, mdiFormatListCheckbox, mdiAccountNetwork } from '@mdi/js';
import './IconMenu.css'; // Import CSS for styling

const IconMenu = ({ openGroupModal, openVoteModal, openCalendarModal, activeView, onViewChange }) => {
    console.log('IconMenu activeView:', activeView);
    return (
        <div className="im-icon-menu">
            <IconButton className="im-icon-button" onClick={openGroupModal}>
                <Icon path={mdiAccountGroup} size={1.2} color="white" />
            </IconButton>
            <IconButton className="im-icon-button" onClick={openVoteModal}>
                <Icon path={mdiVoteOutline} size={1.2} color="white" />
            </IconButton>
            <IconButton className="im-icon-button" onClick={openCalendarModal}>
                <Icon path={mdiCalendarCheck} size={1.2} color="white" />
            </IconButton>
            <div className="vertical-separator"></div>
            <IconButton className={`im-icon-button ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => onViewChange('dashboard')}>
                <Icon path={mdiViewDashboard} size={activeView === 'dashboard' ? 1.4 : 1.2} color={activeView === 'dashboard' ? 'yellow' : 'white'} />
            </IconButton>
            <IconButton className={`im-icon-button ${activeView === 'list' ? 'active' : ''}`} onClick={() => onViewChange('list')}>
                <Icon path={mdiFormatListCheckbox} size={activeView === 'list' ? 1.4 : 1.2} color={activeView === 'list' ? 'yellow' : 'white'} />
            </IconButton>
            <IconButton className={`im-icon-button ${activeView === 'social' ? 'active' : ''}`} onClick={() => onViewChange('social')}>
                <Icon path={mdiAccountNetwork} size={activeView === 'social' ? 1.4 : 1.2} color={activeView === 'social' ? 'yellow' : 'white'} />
            </IconButton>
        </div>
    );
};

export default IconMenu;