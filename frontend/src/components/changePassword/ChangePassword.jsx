/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, IconButton, InputAdornment, Alert, FormHelperText } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

const CustomBox = styled(Box)`
    padding: 20px 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CustomForm = styled.form`
    width: 100%;
    max-width: 400px;
`;

const CustomButton = styled(Button)`
    margin-top: 16px;
    background-color: #001f3f;
    &:hover {
        background-color: #005bb5;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
`;

const CustomIconButton = styled(IconButton)`
    color: #001f3f;
    transition: color 0.3s ease, transform 0.3s ease;
    &:hover {
        color: #005bb5;
        transform: scale(1.1);
    }
`;

const AlertMessage = styled(Alert)`
    margin-bottom: 16px;
`;

const ChangePassword = () => {
    const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
    const [show, setShow] = useState({ old: false, new: false, confirm: false });
    const [messages, setMessages] = useState({ error: '', success: '', validation: [] });

    const handleClickShowPassword = (field) => setShow(prev => ({ ...prev, [field]: !prev[field] }));
    const handlePasswordChange = (event) => {
        const { name, value } = event.target;
        setPasswords(prev => ({ ...prev, [name]: value }));

        if (name === 'new') {
            const validations = [
                value.length < 8 && 'Minimum 8 characters required.',
                !/[A-Z]/.test(value) && 'At least one uppercase letter required.',
                !/[a-z]/.test(value) && 'At least one lowercase letter required.',
                !/[!@#$%^&*(),.?":{}|<>]/.test(value) && 'At least one special character required.',
                !/[0-9]/.test(value) && 'At least one number required.'
            ].filter(Boolean);
            setMessages(prev => ({ ...prev, validation: validations }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { old, new: newPassword, confirm } = passwords;

        if (newPassword !== confirm) {
            setMessages({ ...messages, error: 'New passwords do not match', validation: [] });
            return;
        }
        if (messages.validation.length) {
            setMessages({ ...messages, error: 'New password does not meet all requirements' });
            return;
        }

        try {
            const { data } = await axios.post('/api/change-password', { oldPassword: old, newPassword });
            data.success ? setMessages({ success: 'Password changed successfully!', error: '', validation: [] }) : setMessages({ error: data.message || 'An error occurred' });
            setPasswords({ old: '', new: '', confirm: '' });
        } catch {
            setMessages({ error: 'An error occurred while changing the password', validation: [] });
        }
    };

    return (
        <CustomBox>
            {messages.error && <AlertMessage severity="error">{messages.error}</AlertMessage>}
            {messages.success && <AlertMessage severity="success">{messages.success}</AlertMessage>}
            <CustomForm onSubmit={handleSubmit}>
                <TextField
                    label="Old Password"
                    type={show.old ? 'text' : 'password'}
                    name="old"
                    value={passwords.old}
                    onChange={(e) => handlePasswordChange(e)}
                    fullWidth
                    margin="normal"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <CustomIconButton onClick={() => handleClickShowPassword('old')} edge="end">
                                    {show.old ? <VisibilityOff /> : <Visibility />}
                                </CustomIconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    label="New Password"
                    type={show.new ? 'text' : 'password'}
                    name="new"
                    value={passwords.new}
                    onChange={(e) => handlePasswordChange(e)}
                    onFocus={() => setMessages(prev => ({ ...prev, validation: messages.validation }))}
                    onBlur={() => setMessages(prev => ({ ...prev, validation: messages.validation }))}
                    fullWidth
                    margin="normal"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <CustomIconButton onClick={() => handleClickShowPassword('new')} edge="end">
                                    {show.new ? <VisibilityOff /> : <Visibility />}
                                </CustomIconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                {messages.validation.length > 0 && (
                    <FormHelperText css={css`color: #d32f2f;`}>
                        {messages.validation.map((msg, idx) => <div key={idx}>{msg}</div>)}
                    </FormHelperText>
                )}
                <TextField
                    label="Confirm New Password"
                    type={show.confirm ? 'text' : 'password'}
                    name="confirm"
                    value={passwords.confirm}
                    onChange={(e) => handlePasswordChange(e)}
                    fullWidth
                    margin="normal"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <CustomIconButton onClick={() => handleClickShowPassword('confirm')} edge="end">
                                    {show.confirm ? <VisibilityOff /> : <Visibility />}
                                </CustomIconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <CustomButton type="submit" variant="contained" fullWidth>
                    Change Password
                </CustomButton>
            </CustomForm>
        </CustomBox>
    );
};

export default ChangePassword;
