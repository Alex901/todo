//At least i got the naming right this time!!!
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useTodoContext } from "./todoContexts";

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const BASE_URL = import.meta.env.VITE_REACT_APP_PRODUCTION === 'true' ?
        'https://todo-backend-gkdo.onrender.com' :
        'http://localhost:5000';

    useEffect(() => {
        checkLogin();
    }, []);

    console.log("loggedInUser: ", loggedInUser);

    const checkLogin = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/auth/checkLogin`, { withCredentials: true });
            console.log("checkLogin response: ", response); 
            if (response.data.valid){
                setLoggedInUser(response.data.user);
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.error('Error verifying token', error);
        }
    }

    const registerNewUser = async (userData) => {

        try {
            const response = await axios.post(`${BASE_URL}/users/create`, userData);
        } catch (error) {
            console.error('Error registering user', error);
        }
        //try to register user here
        //if successful, grab user data from server
        //and set user data
    }

    const login = (userData) => {
        axios.post(`${BASE_URL}/auth/login`, userData, {
            withCredentials: true
        })
            .then(response => {
                if (response.status === 200) {
                    axios.get(`${BASE_URL}/users/${userData.username}`, { withCredentials: true })
                        .then(userResponse => {
                            if (userResponse.status === 200) {
                                setLoggedInUser(userResponse.data);
                                console.log("User data loaded", loggedInUser);
                                setIsLoggedIn(true);
                            } else {
                                console.log("could not load user data, login terminated");
                            }
                        })
                        .catch(error => {
                            console.error('Error loading user data', error);
                        });
                } else if (response.status === 401) {
                    console.log("User not found");
                } else {
                    console.log("Internal server error");
                }
            })
            .catch(error => {
                console.error('Error logging in', error);
            });
    };

    const logout = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });
            if (response.status === 200) {
                console.log(response.data.message);
                setLoggedInUser(null);
                setIsLoggedIn(false);
            } else {
                console.error('Error logging out');
            }
        } catch (error) {
            console.error('Error logging out', error);
        }
    }

    const setActiveList = async (listName) => {
        console.log("logged in user", loggedInUser)
        try {
            if (!isLoggedIn) {
                console.log("User not logged in");
                return;
            }
            const _id = loggedInUser._id;

            console.log(`baseUR: ${BASE_URL}/users/setlist/${_id}`);
            const response = await axios.patch(`${BASE_URL}/users/setlist/${_id}`, { activeList: listName });
            if (response.status === 200) {
                console.log("Active list set to: ", listName);
            } else if (response.status === 404) {
                console.log("User not found");
            } else {
                console.log("Internal server error");
            }
        } catch (error) {
            console.error('Error setting active list', error);
        }
    }

    const addList = async (listName) => {
        console.log("add new list with name: ", listName);
        try {
            if (!isLoggedIn) {
                console.log("User not logged in");
                return;
            }
            const _id = loggedInUser._id;
            const response = await axios.patch(`${BASE_URL}/users/addlist/${_id}`, { listName });
            if (response.status === 200) {
                console.log("List added: ", listName);
                setLoggedInUser({ ...loggedInUser, listNames: [...loggedInUser.listNames, listName], activeList: listName });
            } else if (response.status === 404) {
                console.log("User not found");
            } else {
                console.log("Internal server error");
            }
        } catch (error) {
            console.error('Error adding list', error);
        }
    }

    const deleteList = async (listName) => {
        console.log("delete list with name: ", listName);
        try {
            if (!isLoggedIn) {
                console.log("User not logged in");
                return;
            }
            const _id = loggedInUser._id;
            const response = await axios.delete(`${BASE_URL}/users/deletelist/${_id}`, { data: { listName } });
            if (response.status === 200) {
                console.log("List deleted: ", listName);
                setLoggedInUser({
                    ...loggedInUser, listNames: loggedInUser.listNames.filter((name) => name !== listName),
                    activeList: loggedInUser.listNames[0]
                }); //This should always be 'all'
            } else if (response.status === 404) {
                console.log("User not found");
            } else {
                console.log("Internal server error");
            }
        } catch (error) {
            console.error('Error deleting list', error);
        }
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    return (
        <UserContext.Provider value={{
            isLoggedIn, loggedInUser, login, logout, registerNewUser,
            setLoggedInUser, setActiveList, addList, deleteList
        }} >
            {children}
        </UserContext.Provider>
    );
};

const useUserContext = () => useContext(UserContext);

export { UserProvider, useUserContext }; 