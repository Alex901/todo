import React, { useEffect, useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, TextField, Rating, Typography } from '@mui/material';
import BaseModal from '../../../Todo/TodoModal/BaseModal/BaseModal';
import './HeaderModal.css'; // Import CSS for additional styling if needed
import { useFeedbackContext } from '../../../../contexts/FeedbackContext';
import { useUserContext } from '../../../../contexts/UserContext';

const FeedbackModal = ({ isOpen, onClose }) => {
    const [feedbackType, setFeedbackType] = useState('');
    const { loggedInUser } = useUserContext();
    const [formData, setFormData] = useState({
        message: '',
        score: 0
    });
    const { submitFeedback } = useFeedbackContext();

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

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
        //console.log('Feedback submitted:', { type: feedbackType, ...formData });
        submitFeedback({ from: loggedInUser._id, subType: feedbackType, type: 'feedback', ...formData });
        onClose();
        resetForm();
    };

    const resetForm = () => {
        setFeedbackType('');
        setFormData({
            message: '',
            score: 0
        });
    }


    const renderForm = () => {
        switch (feedbackType) {
            case 'bug':
            case 'performance':
            case 'feature':
            case 'issues':
            case 'payment':
            case 'other':
                return (
                    <div>
                        <TextField
                            label="Please describe your issue"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                        />
                    </div>
                );
            case 'review':
                return (
                    <div>
                        <TextField
                            label="What do you think about our service?"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                        />
                        <div className="rating">
                            <Typography component="legend">Your Rating</Typography>
                            <Rating
                                name="score"
                                value={formData.score}
                                onChange={(event, newValue) => {
                                    handleInputChange({ target: { name: 'score', value: newValue } });
                                }}
                                
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <BaseModal isOpen={isOpen} onRequestClose={onClose} title="Submit Feedback">
            <form onSubmit={handleSubmit} style={{width: '90%'}}>
                <FormControl size="small" fullWidth margin="normal">
                    <InputLabel id="feedback-type-label" >Select topic</InputLabel>
                    <Select
                        labelId='feedback-type-label'
                        id='feedback-type'
                        value={feedbackType}
                        onChange={handleTypeChange}
                        label="Select topic"
                        sx={{ minWidth: 200 }}
                    >

                        <MenuItem value="bug">Report a bug</MenuItem>
                        <MenuItem value="performance">Performance Issue</MenuItem>
                        <MenuItem value="feature">Suggest a feature</MenuItem>
                        <MenuItem value="review">Leave a review</MenuItem>
                        <MenuItem value="issues">General Issue</MenuItem>
                        <MenuItem value="payment">Payment Issue</MenuItem>
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