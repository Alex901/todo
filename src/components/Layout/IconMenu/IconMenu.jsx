import React from 'react';
import { IconButton } from '@mui/material';
import Icon from '@mdi/react';
import { mdiAccountGroup, mdiVoteOutline, mdiCalendarCheck, mdiViewDashboard, mdiFormatListCheckbox, mdiAccountNetwork } from '@mdi/js';
import './IconMenu.css'; // Import CSS for styling

const IconMenu = ({ openGroupModal, openVoteModal, openCalendarModal }) => {
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
            <IconButton className="im-icon-button">
                <Icon path={mdiViewDashboard} size={1.2} color="white" />
            </IconButton>
            <IconButton className="im-icon-button">
                <Icon path={mdiFormatListCheckbox} size={1.2} color="white" />
            </IconButton>
            <IconButton className="im-icon-button">
                <Icon path={mdiAccountNetwork} size={1.2} color="white" />
            </IconButton>
        </div>
    );
};

export default IconMenu;