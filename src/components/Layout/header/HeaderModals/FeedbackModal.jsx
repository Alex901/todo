import React, { useEffect, useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, TextField, Button } from '@mui/material';
import BaseModal from '../../../Todo/TodoModal/BaseModal/BaseModal';
import './HeaderModal.css'; // Import CSS for additional styling if needed

const FeedbackModal = ({ isOpen, onClose }) => {
    const [feedbackType, setFeedbackType] = useState('');
    const [formData, setFormData] = useState({
        message: '',
        additionalInfo: ''
    });



    const handleTypeChange = (event) => {
        setFeedbackType(event.target.value);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here
        console.log('Feedback submitted:', { feedbackType, ...formData });
        onClose();
    };

    const renderForm = () => {
        switch (feedbackType) {
            case 'bug':
            case 'performance':
            case 'feature':
            case 'review':
            case 'issues':
            case 'payment':
            case 'other':
                return (
                    <div>
                        <TextField
                            label="Message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                        />
                        <TextField
                            label="Additional Information"
                            name="additionalInfo"
                            value={formData.additionalInfo}
                            onChange={handleInputChange}
                            fullWidth
                            multiline
                            rows={2}
                            margin="normal"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <BaseModal isOpen={isOpen} onRequestClose={onClose} title="Submit Feedback">
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="feedback-type-label">What do you need help with?</InputLabel>
                    <Select
                        labelId="feedback-type-label"
                        value={feedbackType}
                        onChange={handleTypeChange}
                        size='small'
                    >
                        <MenuItem value="bug">Report a bug</MenuItem>
                        <MenuItem value="performance">Performance Issues</MenuItem>
                        <MenuItem value="feature">Suggest a feature</MenuItem>
                        <MenuItem value="review">Leave a review</MenuItem>
                        <MenuItem value="issues">General Issues</MenuItem>
                        <MenuItem value="payment">Payment Issues</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                    </Select>
                </FormControl>
                {renderForm()}
                {feedbackType && (
                    <div className="modal-button-group">
                        <button type="submit" className="modal-button">
                            Submit
                        </button>
                    </div>
                )}
            </form>
        </BaseModal>
    );
};

export default FeedbackModal;