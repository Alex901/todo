import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Popover } from '@mui/material';
import EmojiPicker from 'emoji-picker-react';
import './EmojiSelector.css';

const EmojiSelector = ({ selectedEmoji, onEmojiSelect }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleSelectClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleEmojiClick = (event, emojiObject) => {
        console.log("DEBUG -- Emoji clicked: ", emojiObject.emoji, " -- Emoji object: ", emojiObject);
        onEmojiSelect(emojiObject.emoji);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'emoji-popover' : undefined;

    return (
        <>
            <FormControl variant="outlined" style={{ minWidth: '50px' }} size='small'>
                <InputLabel id="emoji-select-label">Emoji</InputLabel>
                <Select
                    name="repeatableEmoji"
                    labelId="emoji-select-label"
                    id="emoji-select"
                    value={selectedEmoji || ''}
                    onClick={handleSelectClick}
                    label="Select Emoji"
                    readOnly
                >
                    <MenuItem value={selectedEmoji || ''}>
                        {selectedEmoji || 'Select Emoji'}
                    </MenuItem>
                </Select>
            </FormControl>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    disableAutoFocus={true}
                    groupNames={{ smileys_people: "PEOPLE" }}
                    reactionsDefaultOpen={true}
                    native
                />
            </Popover>
        </>
    );
};

export default EmojiSelector;