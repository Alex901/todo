import React from 'react';
import { IconButton } from '@mui/material';
import Icon from '@mdi/react';
import { mdiAccountGroup, mdiVoteOutline, mdiCalendarCheck } from '@mdi/js';
import './IconMenu.css'; // Import CSS for styling

const IconMenu = ({ openGroupModal, openVoteModal, openCalendarModal }) => {
    return (
        <div className="im-icon-menu">
            <IconButton className="im-icon-button" onClick={openGroupModal}>
                <Icon path={mdiAccountGroup} size={1.2} />
            </IconButton>
            <IconButton className="im-icon-button" onClick={openVoteModal}>
                <Icon path={mdiVoteOutline} size={1.2} />
            </IconButton>
            <IconButton className="im-icon-button" onClick={openCalendarModal}>
                <Icon path={mdiCalendarCheck} size={1.2} />
            </IconButton>
        </div>
    );
};

export default IconMenu;