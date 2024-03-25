//At least i got the naming right this time!!!
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useTodoContext } from "./todoContexts";
import { toast } from "react-toastify";

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const { refreshTodoList } = useTodoContext();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const BASE_URL = import.meta.env.VITE_REACT_APP_PRODUCTION === 'true' ?
        'https://todo-backend-gkdo.onrender.com' :
        'http://localhost:5000';

    useEffect(() => {

        checkLogin();
    }, []);


    const checkLogin = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/auth/checkLogin`, { withCredentials: true });
            if (response.data.valid) {
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
                refreshTodoList();
            } else {
                console.error('Error logging out');
            }
        } catch (error) {
            console.error('Error logging out', error);
        }
    }

    const setActiveList = async (listName) => {
        console.log("listname: ", listName);
        try {
            if (!isLoggedIn) {
                console.log("User not logged in");
                return;
            }
            const _id = loggedInUser._id;

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
                console.log("List added: ", response.data);
                setLoggedInUser({
                    ...loggedInUser,
                    listNames: response.data.listNames,
                    activeList: listName
                });
                console.log("loggedInUser: ", loggedInUser);
                toast.success("List added");
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
                    ...loggedInUser,
                    listNames: loggedInUser.listNames.filter((item) => item.name !== listName),
                    activeList: loggedInUser.listNames[0].name
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

    const toggleUrgent = async (newUrgentStatus) => {
        try {
            if (!isLoggedIn) {
                console.log("User not logged in");
                return;
            }
            const _id = loggedInUser._id;
            const response = await axios.patch(`${BASE_URL}/users/toggleurgent/${_id}`,
                { "settings.todoList.urgentOnly": newUrgentStatus });

            if (response.status === 200) {
                console.log("Urgent setting toggled");
                console.log("loggedInUser, ", loggedInUser)
                console.log("response.data, ", response.data)
                setLoggedInUser(response.data);
            } else if (response.status === 404) {
                console.log("User not found");
            } else {
                console.log("Internal server error");
            }
        } catch (error) {
            console.error('Error toggling urgent setting', error);
        }
    };

    const addTag = async (tagName, tagColor, textColor) => {
        try {
            if (!isLoggedIn) {
                console.log("User not logged in");
                return;
            }

            console.log("Add tag > activeList: ", loggedInUser.activeList)

            const _id = loggedInUser._id;
            const activeList = loggedInUser.activeList;
            console.log("activeList: ", activeList);
            const response = await axios.patch(`${BASE_URL}/users/addtag/${_id}`, { tagName, tagColor, textColor, activeList });
            if (response.status === 200) {
                console.log("Tag added: response data: ", response.data);
                setLoggedInUser(response.data);
                toast.success("Tag added");
            } else if (response.status === 404) {
                console.log("User not found");
            } else {
                console.log("Internal server error");
                toast.error("Failed to add tag -- internal server error");
            }
        } catch (error) {
            console.error('Error adding tag', error);
            toast.error("Failed to add tag");
        }
    }

    const deleteTag = async (tagName) => {
        console.log("delete tag with ", tagName);
        try {
            if (!isLoggedIn) {
                console.log("User not logged in");
                return;
            }
            const _id = loggedInUser._id;
            const activeList = loggedInUser.activeList;
            const response = await axios.delete(`${BASE_URL}/users/deletetag/${_id}`, { data: { tagName, activeList } });
            if (response.status === 200) {
                console.log("Tag deleted: ", tagName);
                setLoggedInUser(response.data);
                toast.success("Tag deleted");
            } else if (response.status === 404) {
                console.log("User not found");
            } else {
                console.log("Internal server error");
                toast.error("Failed to delete tag -- internal server error");
            }
        } catch (error) {
            console.error('Error deleting tag', error);
            toast.error("Failed to delete tag");
        }
    }

    return (
        <UserContext.Provider value={{
            isLoggedIn, loggedInUser, login, logout, registerNewUser,
            setLoggedInUser, setActiveList, addList, deleteList, toggleUrgent, addTag,
            deleteTag
        }} >
            {children}
        </UserContext.Provider>
    );
};

const useUserContext = () => useContext(UserContext);

export { UserProvider, useUserContext }; 