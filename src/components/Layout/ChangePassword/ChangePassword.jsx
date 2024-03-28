import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Icon from '@mdi/react';
import { mdiEye, mdiEyeOff, mdiCheckCircle } from '@mdi/js';
import { useUserContext } from '../../../contexts/UserContext';


const ChangePassword = (props) => {
    const { loggedInUser } = useUserContext();
    const { hasChanges, setHasChanges } = props;
    const [passwordError, setPasswordError] = useState('');
    const [values, setValues] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        showPassword: false,
    });

    const handleChange = (prop) => (event) => {
        setHasChanges(true);
        const updatedValues = { ...values, [prop]: event.target.value };
        setValues(updatedValues);

        if (updatedValues.currentPassword === '' && updatedValues.newPassword === '' && updatedValues.confirmPassword === '') {
            setHasChanges(false);
        } else {
            setHasChanges(true);
        }

        if (doesPasswordMatch(updatedValues.newPassword, updatedValues.confirmPassword)) {
            setPasswordError('');
            props.onPasswordChange(updatedValues.newPassword, updatedValues.currentPassword);
        } else {
            props.onPasswordChange('', ''); 
            setPasswordError("Passwords do not match");
            return;
        }
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const passwordIsValid = (password) => {
        return password.length >= 8 && !password.startsWith(' ');
    };

    const doesPasswordMatch = (password, confirmPassword) => {
        if (password.length === 0 || confirmPassword.length === 0) return false;
        return password === confirmPassword;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'flex-start', gap: 10, }}>

            <h4 style={{ textAlign: 'left' }}>Change Password</h4>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '5px', alignItems: 'center' }}>
                <TextField
                    type={values.showPassword ? 'text' : 'password'}
                    label="Current Password"
                    value={values.currentPassword}
                    onChange={handleChange('currentPassword')}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {values.showPassword ? <Icon path={mdiEye} size={1} /> : <Icon path={mdiEyeOff} size={1} />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '5px', alignItems: 'center' }}>
                <TextField
                    type={values.showPassword ? 'text' : 'password'}
                    label="New Password"
                    value={values.newPassword}
                    onChange={handleChange('newPassword')}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {values.showPassword ? <Icon path={mdiEye} size={1} /> : <Icon path={mdiEyeOff} size={1} color="black" />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                {passwordIsValid(values.newPassword) && <Icon path={mdiCheckCircle} size={1} />}
            </div>
            {values.newPassword && !passwordIsValid(values.newPassword) && <p>Please use 8 characters, and no leading spaces.</p>}

            <div style={{ display: 'flex', flexDirection: 'row', gap: '5px', alignItems: 'center' }}>
                <TextField
                    type={values.showPassword ? 'text' : 'password'}
                    label="Confirm Password"
                    value={values.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {values.showPassword ? <Icon path={mdiEye} size={1} /> : <Icon path={mdiEyeOff} size={1} />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                {doesPasswordMatch(values.newPassword, values.confirmPassword) && <Icon path={mdiCheckCircle} size={1} />}
               
            </div>
            <p className='error'> {passwordError} </p>
        </div>
    );
};

export default ChangePassword;