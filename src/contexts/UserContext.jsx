//At least i got the naming right this time!!!
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useTodoContext } from "./todoContexts";
import { toast } from "react-toastify";
let BASE_URL;

if (process.env.NODE_ENV === 'test') {
    import('../../config').then((config) => {
      BASE_URL = config.default;
    });
  } else {
    import('../../config.vite').then((config) => {
      BASE_URL = config.default;
    });
  }

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const { refreshTodoList } = useTodoContext();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [userList, setUserList] = useState(null); //For autocomplete in GroupModal

    useEffect(() => {
        checkLogin();
    }, []);

    useEffect(() => {
        console.log("User logged in, fetching users");
      
        // IIFE for async function inside useEffect
        (async () => {
          try {
            await fetchUsers();
          } catch (error) {
            console.error("Failed to fetch users:", error);
          }
        })();
      }, [loggedInUser]);



    const fetchUsers = async () => {
        if(loggedInUser === null) return;
        try {
            const response = await axios.get(`${BASE_URL}/users/getall`, {
                params: {
                    username: loggedInUser.username
                },
                withCredentials: true
            });
            console.log("fetchUsers response: ", response.data);
            setUserList(response.data);
        } catch (error) {
            console.error('Error fetching users', error);
        }
    }

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
                                //här ska de vara
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

    const updateProfilePicture = async (file) => {
        console.log("DEBUG: update profile picture for loggedInUser: ", file);

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            if (!isLoggedIn) {
                console.log("User not logged in");
                return;
            }
            const _id = loggedInUser._id;
            const response = await axios.patch(`${BASE_URL}/users/updateprofilepicture/${_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                console.log("Profile picture updated: ", response.data);
                setLoggedInUser(response.data);
                toast.success("Profile picture updated");
            } else if (response.status === 404) {
                console.log("User not found");
            } else {
                console.log("Internal server error");
                toast.error("Failed to update profile picture -- internal server error");
            }
        } catch (error) {
            console.error('Error updating profile picture', error);
            toast.error("Failed to update profile picture");
        }
    }
    /**
  * This function edits a user's data.
  * 
  * @param {Object} userData - The new data for the user.
  * @param {string} oldPassword - The user's current password. Can be empty if the user does not want to change their password.
  * @param {string} newPassword - The new password for the user. Can be empty if the user does not want to change their password.
  * 
  * The function first checks if the user is logged in. If not, it logs a message and returns.
  * 
  * If the user is logged in, it sends a PATCH request to the server to update the user's data.
  * The user's ID is appended to the URL, and the new user data, old password, and new password are sent in the request body.
  * 
  * If the server responds with a status of 200, the function logs the new user data, updates the loggedInUser state, and shows a success toast.
  * If the server responds with a status of 404, the function logs a message.
  * If the server responds with any other status, the function logs a message and shows an error toast.
  * 
  * If an error occurs during the execution of the function, it logs the error and shows an error toast.
  */
    const editUser = async (userData, oldPassword, newPassword) => {
        console.log("edit user with ", userData);
        console.log("old password: ", oldPassword);
        console.log("new password: ", newPassword);

        try {
            if (!isLoggedIn) {
                console.log("User not logged in");
                return;
            }
            const _id = loggedInUser._id;
            const response = await axios.patch(`${BASE_URL}/users/edituser/${_id}`, { userData, oldPassword, newPassword }, { withCredentials: true });
            if (response.status === 200) {
                console.log("User edited: ", response.data);
                setLoggedInUser(response.data);
                toast.success("User edited");
            } else if (response.status === 404) {
                console.log("User not found");
            } else {
                console.log("Internal server error");
                toast.error("Failed to edit user -- internal server error");
            }
        } catch (error) {
            console.error('Error editing user', error);
            toast.error("Failed to edit user");
        }
    }


    return (
        <UserContext.Provider value={{
            isLoggedIn, loggedInUser, userList, login, logout, registerNewUser,
            setLoggedInUser, setActiveList, addList, deleteList, toggleUrgent, addTag,
            deleteTag, updateProfilePicture, editUser, checkLogin,
        }} >
            {children}
        </UserContext.Provider>
    );
};

const useUserContext = () => useContext(UserContext);

export { UserProvider, useUserContext, UserContext }; 