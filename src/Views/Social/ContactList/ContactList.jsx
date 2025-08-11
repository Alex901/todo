import React, { useEffect, useMemo } from 'react';
import './ContactList.css';
import { useUserContext } from '../../../contexts/UserContext';
import Contact from './Contact/Contact';

const ContactList = () => {
    const { loggedInUser, userList } = useUserContext();

    // Filter out the logged-in user and their contacts from the userList
    const filteredUsers = useMemo(() => {
        if (!userList || !loggedInUser) return [];
        const contactIds = loggedInUser.contacts.map((contact) => contact._id); // Get IDs of contacts
        return userList.filter(
            (user) => user._id !== loggedInUser._id && !contactIds.includes(user._id) // Exclude loggedInUser and contacts
        );
    }, [userList, loggedInUser]);


    return (
        <div className="contact-list">
            <h6>Your Contacts</h6>
            <div className="contacts-section">
                {loggedInUser?.contacts?.length > 0 ? (
                    loggedInUser.contacts.map((contact) => (
                        <Contact key={contact._id} user={contact} isContact={true} />
                    ))
                ) : (
                    <p className="no-contacts-message">You don't have any contacts yet.</p>
                )}
            </div>

            <h6>All Users</h6>
            <div className="users-section">
                {userList?.length > 0 ? (
                    filteredUsers.map((user) => (
                        <Contact key={user._id} user={user} isContact={false} 
                        isRequestSent={loggedInUser.contactRequests.includes(user._id)}/>
                    ))
                ) : (
                    <p className="no-users-message">No users found.</p>
                )}
            </div>
        </div>
    );
};

export default ContactList;