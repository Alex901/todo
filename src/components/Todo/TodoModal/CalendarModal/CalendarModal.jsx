import React, { useEffect, useState } from 'react';
import BaseModal from '../BaseModal/BaseModal';
import { useTodoContext } from '../../../../contexts/todoContexts';
import { Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import './CalendarModal.css';

const CalendarModal = ({ isOpen, onRequestClose }) => {
    const { todoList } = useTodoContext();
    const [interval, setInterval] = useState('day');

    const handleIntervalChange = (event) => {
        setInterval(event.target.value);
    };


    return (
        <BaseModal isOpen={isOpen} onRequestClose={onRequestClose} title={"Calendar"}>
            <div className="calendar-modal">
                <Typography variant="h6">Select Interval</Typography>
                <FormControl variant="outlined" fullWidth>
                    <InputLabel id="interval-select-label">Interval</InputLabel>
                    <Select
                        labelId="interval-select-label"
                        value={interval}
                        onChange={handleIntervalChange}
                        label="Interval"
                    >
                        <MenuItem value="day">Day</MenuItem>
                        <MenuItem value="week">Week</MenuItem>
                        <MenuItem value="month">Month</MenuItem>
                    </Select>
                </FormControl>
                {/* Additional content for the modal can go here */}
            </div>
        </BaseModal>
    );
};

export default CalendarModal;