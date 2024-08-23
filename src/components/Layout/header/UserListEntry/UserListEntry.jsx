import React from 'react';
import IconButton from '@mui/material/IconButton';
import { mdiDelete } from '@mdi/js';
import Icon from '@mdi/react';
import './UserListEntry.css'; // Import the CSS file
import Avatar from '@mui/material/Avatar';
import { toast } from 'react-toastify';
import { useUserContext } from '../../../../contexts/UserContext';



const UserListEntry = ({ user }) => {
    const { deleteUser } = useUserContext();

    const handleDelete = (userToDelete) => {
        if (userToDelete.role === 'admin')
            toast.error('Cannot delete admin');
        else
            deleteUser(userToDelete);

    }

    const stringToColor = (string) => {
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }
        return color;
    };

    return (
        <div className="user-list-entry">
            {/* Avatar Section */}
            <div className="avatar-section">
                {user.profilePicture ? (
                    <img
                        src={user.profilePicture}
                        alt={`${user.username}'s avatar`}
                        className="avatar"
                    />
                ) : (
                    <Avatar sx={{ bgcolor: stringToColor(user.username) }}>
                        {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                )}
            </div>

            {/* Information Section */}
            <div className="information-section">
                <span>{user.username}</span>
                <span>{user.email}</span>
                <span>{user.role}</span>
                <span>{user.updatedAt}</span>
                <span>{user.myLists.length}</span>
                <span>{user.groups.length}</span>
            </div>

            {/* Delete Button Section */}
            <div className="delete-button-section">
                <IconButton>
                    <Icon path={mdiDelete} size={1} onClick={() => handleDelete(user)} />
                </IconButton>
            </div>
        </div>
    );
};

export default UserListEntry;