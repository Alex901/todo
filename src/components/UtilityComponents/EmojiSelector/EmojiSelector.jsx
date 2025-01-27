import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Popover, Typography, Link } from '@mui/material';
import EmojiPicker from 'emoji-picker-react';
import './EmojiSelector.css';

const EmojiSelector = ({ selectedEmoji, onEmojiSelect, userEmojiList }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleSelectClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleEmojiClick = (event) => {
        console.log("event", event);
        onEmojiSelect(event.emoji);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setShowEmojiPicker(false);
    };

    const handleMoreClick = () => {
        setShowEmojiPicker(true);
    };

    const handleBackClick = () => {
        setShowEmojiPicker(false);
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
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '8px',
                        border: '2px solid black',
                    },
                }}
            >
                {showEmojiPicker ? (
                    <div className="emoji-picker-container">
                        <Link component="button" variant="body2" onClick={handleBackClick} className="back-link">
                            Back to Most Commonly Used
                        </Link>
                        <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            groupNames={{ smileys_people: "PEOPLE" }}
                            lazyLoadEmojis={true}
                            skinTonesDisabled={true}
                            searchDisabled={true}
                            emojiStyle='native'
                        />
                    </div>
                ) : (
                    <div className="emoji-list">
                        <Typography variant="subtitle1" className="emoji-list-title">Most Commonly Used</Typography>
                        <div className="emoji-grid">
                            {Array.from({ length: 14 }).map((_, index) => (
                                <span key={index} className="emoji-item" onClick={() => userEmojiList[index] && onEmojiSelect(userEmojiList[index])}>
                                    {userEmojiList[index] || ''}
                                </span>
                            ))}
                        </div>
                        <Link component="button" variant="body2" onClick={handleMoreClick} className="more-link">
                            More
                        </Link>
                    </div>
                )}
            </Popover>
        </>
    );
};

export default EmojiSelector;