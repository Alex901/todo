//At least i got the naming right this time!!!
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useTodoContext } from "./todoContexts";
import { toast } from "react-toastify";
import { use } from "react";

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
    const [emojiSettings, setEmojiSettings] = useState(null);

    
    useEffect(() => {
        //console.log("User logged in, fetching users");
        // console.log("loggedInUser: ", loggedInUser);
        // IIFE for async function inside useEffect
        (async () => {
            try {
                await fetchUsers();
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        })();
    }, [loggedInUser]);

    const fetchEmojiSettings = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/settings/emoji/top/14`, {
                withCredentials: true
            });
            setEmojiSettings(response.data);
        } catch (error) {
            console.error('Error fetching emoji settings:', error);
        }
    };


    //TODO: this entire shotshow can be removed eventually
    const fetchUsers = async () => {
        if (loggedInUser === null) return;
        try {
            const response = await axios.get(`${BASE_URL}/users/getall`, {
                params: {
                    username: loggedInUser.username
                },
                withCredentials: true
            });
            // console.log("fetchUsers response: ", response.data);
            setUserList(response.data);
        } catch (error) {
            console.error('Error fetching users', error);
        }
    }

    const checkLogin = async () => {
        // console.log("Checking login start");
        let BASE_URL;
        if (process.env.NODE_ENV === 'test') {
            const config = await import('../../config');
            BASE_URL = config.default;
        } else {
            const config = await import('../../config.vite');
            BASE_URL = config.default;
        }
        try {
            const response = await axios.get(`${BASE_URL}/auth/checkLogin`, { withCredentials: true });
            if (response.data.valid) {
                // console.log("Valid user is logged in", response.data.user)
                // console.log("DEBUG -- CheckLogin user data in response: ", response.data.user)
                setLoggedInUser(response.data.user);
                await fetchEmojiSettings();
                // to make sure I don't get an invalid activeList
                if (loggedInUser?.activeList === null || loggedInUser?.activeList === undefined) {
                    setActiveList("all");
                }
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.error('Error verifying token', error);
        }
    }
    // Nice function bozo - 10/10
    const registerNewUser = async (userData) => {

        try {
            const response = await axios.post(`${BASE_URL}/users/create`, userData);
            if (response.status === 200) {

                if (loggedInUser) {
                    toast.success("User added successfully!");
                    checkLogin();
                } else {
                    toast.success("Registration successful!");
                }
            } else if (response.status === 400) {
                toast.error("Username taken!");
            } else if (response.status === 409) {
                toast.error("Email already in use");
            }

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
                                toast.success("Login successful");
                                console.log("User logged in, fetching user-data: ", userResponse.data);
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
                    toast.error("Incorrect username or password");

                } else if (response.status === 403) {
                    alert("Please verify your email before logging in");
                } else {
                    toast.error("Incorrect username or password");
                }
            })
            .catch(error => {
                if (error.response.status === 400 || error.response.status === 404) {
                    toast.error("Incorrect username or password");
                } else if (error.response.status === 403) {
                    console.error('Error logging in', error);
                    toast.error(error.response.data.error);
                } else {
                    console.error('Error logging in', error);
                    toast.error("Something went wrong, please try again later");
                }

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
        try {
            if (!isLoggedIn) {
                //console.log("User not logged in");
                return;
            }
            const _id = loggedInUser._id;

            const response = await axios.patch(`${BASE_URL}/users/setlist/${_id}`, { activeList: listName });
            if (response.status === 200) {
                console.log("Active list set to: ", listName);
                checkLogin();
            } else if (response.status === 404) {
                console.log("User not found");
            } else {
                console.log("Internal server error");
            }
        } catch (error) {
            console.error('Error setting active list', error);
        }
    }

    const createList = async (newListData) => {
        console.log("create list with data: ", newListData);

        try {
            if (!isLoggedIn) {
                console.log("User not logged in");
                return;
            }
            const _id = loggedInUser._id;
            const response = await axios.patch(`${BASE_URL}/users/addlist/${_id}`, { newListData });
            if (response.status === 200) {
                console.log("List added: ", response.data);
                checkLogin();
                console.log("loggedInUser: ", loggedInUser);
                toast.success("List added");
            } else if (response.status === 400) {
                toast.error(response.data.error || "You already have a list by that name");
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
                console.log("List , response: ", response.data);
                checkLogin();
            } else if (response.status === 400) {
                toast.error("Name already exists");
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

    const deleteTag = async (tagId, tag) => {
        //Tag is in use, a) delete entries with the tag b) remove tag from entries

        console.log("delete tag with ", tagId);
        try {
            if (!isLoggedIn) {
                console.log("User not logged in");
                return;
            }
            const _id = loggedInUser._id;
            const response = await axios.delete(`${BASE_URL}/users/deletetag/${_id}`, {
                data: { tagId, tag },
                validateStatus: function (status) {
                    return (status >= 200 && status < 300) || status === 409; // Resolve only if status is in 2xx range or 409
                }
            });
            if (response.status === 200) {
                console.log("Tag deleted: ", tagId);
                setLoggedInUser(response.data);
                toast.success("Tag deleted");
            } else if (response.status === 404) {
                console.log("User not found");
            } else if (response.status === 409) {
                toast.warn(`Failed to delete tag -- tag is used in ${response.data.uses} places`);
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
        // console.log("DEBUG: update profile picture for loggedInUser: ", file);

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
                },
                withCredentials: true
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
                // setLoggedInUser(response.data);
                toast.success("User edited");
                checkLogin();
                return response;
            } else if (response.status === 401) {
                console.log("Incorrect password");
                toast.error(response.message || "Incorrect password");
            } else if (response.status === 404) {
                console.log("User not found");
            } else {
                console.log("Internal server error");
                toast.error("Failed to edit user -- internal server error");
            }
        } catch (error) {
            console.error('Error editing user', error);
            if (loggedInUser.__v === 0) {
                toast.error("Wrong password, please try again");
            } else {
                toast.error("Failed to edit user");
            }
        }
    }

    const toggleShowDetails = async (newShowDetailsStatus) => {
        try {
            if (!isLoggedIn) {
                console.log("User not logged in");
                return;
            }
            const _id = loggedInUser._id;
            const response = await axios.patch(`${BASE_URL}/users/toggledetails/${_id}`,
                { "settings.todoList.showDetails": newShowDetailsStatus });

            if (response.status === 200) {
                console.log("Show details setting toggled");
                console.log("loggedInUser, ", loggedInUser)
                console.log("response.data, ", response.data)
                checkLogin();
            } else if (response.status === 404) {
                console.log("User not found");
            } else {
                console.log("Internal server error");
            }
        } catch (error) {
            console.error('Error toggling show details setting', error);
        }
    }

    const updateSettings = async (settingName, value) => {
        // console.log("DEBUG: update settings for loggedInUser: ", settingName, value);
        try {
            if (!isLoggedIn) {
                console.log("User not logged in");
                return;
            }
            const _id = loggedInUser._id;
            const response = await axios.patch(`${BASE_URL}/users/update-todo-settings/${_id}`, { settingName, value });
            if (response.status === 200) {
                //toast.success("Settings updated");
                if (settingName === "groupOnly" && value === true) {
                    // console.log("DEBUG: groupOnly is true, setting active list to group list");
                    const groupList = loggedInUser.myLists.find(list => list.ownerModel === "Group").listName;
                    const groupListNameCapitalized = groupList.charAt(0).toUpperCase() + groupList.slice(1);
                    // console.log("DEBUG: groupList: ", groupListNameCapitalized);
                    if (groupList) {
                        setActiveList(groupList);
                    }
                }
                checkLogin();
            } else if (response.status === 404) {
                console.log("User not found");
            } else {
                console.log("Internal server error");
                toast.error("Failed to update settings -- internal server error");
            }
        } catch (error) {
            console.error('Error updating settings', error);
            toast.error("Failed to update settings");
        }
    }

    const editUserList = async (listToEdit, editedListData) => {

        console.log("Edit project", listToEdit, "with editedListData:", editedListData, "and loggedInUser.activeList:");
        try {
            if (!isLoggedIn) {
                console.log("User not logged in");
                return;
            }
            const _id = loggedInUser._id;
            const response = await axios.patch(`${BASE_URL}/users/edit-user-list/${_id}`, { listToEdit, editedListData });
            if (response.status === 200) {

                console.log("List edited: ", response.data);
                checkLogin();
                setActiveList(editedListData.listName);
                toast.success("List edited");
            } else if (response.status === 404) {
                console.log("User not found");
            } else {
                console.log("Internal server error");
            }
        } catch (error) {
            console.error('Error editing list', error);
        }
    }

    const deleteUser = async (userToDelete) => {
        console.log("delete user ", userToDelete);
        try {
            const response = await axios.delete(`${BASE_URL}/users/delete-user/${userToDelete._id}`);

            if (response.status === 200) {
                toast.success("User deleted successfully");
                // Optionally, update the user list in the context
                checkLogin();
            } else if (response.status === 404) {
                console.log("User not found");
                toast.error("User not found");
            } else {
                console.log("Internal server error");
                toast.error("Internal server error");
            }
        } catch (error) {
            console.error('Error deleting user', error);
            toast.error('Error deleting user');
        }
    }

    const completeProject = async (projectId, userId) => {

        console.log("Complete project with ID: ", projectId);
        try {
            const response = await axios.patch(`${BASE_URL}/users/complete-project/${userId}`, { projectId });
            if (response.status === 200) {
                console.log("Project completed successfully");
                toast.success("Project completed successfully");
                checkLogin();
            } else if (response.status === 404) {
                console.log("Project not found");
                toast.error("Project not found");
            } else {
                console.log("Internal server error");
                toast.error("Failed to complete project -- internal server error");
            }
        } catch (error) {
            console.error('Error completing project', error);
            toast.error("Failed to complete project");
        }
    }

    const reviveProject = async (projectId, userId, reviveCost) => {
        if (loggedInUser.settings.currency < reviveCost) {
            toast.error("Not enough shiny coins to revive the project. :(");
            return;
        }

        try {
            // Check if the user has enough currency
            if (loggedInUser.currency < reviveCost) {
                toast.error("Not enough currency to revive the project.");
                return;
            }

            // Make the API call to revive the project
            const response = await axios.patch(`${BASE_URL}/users/revive-project/${userId}`, { projectId, reviveCost });

            if (response.status === 200) {
                console.log("Project revived successfully");
                toast.success("Project revived successfully");
                checkLogin(); // Refresh user data
            } else if (response.status === 400) {
                console.log("Not enough currency");
                toast.error("Not enough currency to revive the project.");
            } else if (response.status === 404) {
                console.log("Project not found");
                toast.error("Project not found");
            } else {
                console.log("Internal server error");
                toast.error("Failed to revive project -- internal server error");
            }
        } catch (error) {
            console.error("Error reviving project", error);
            toast.error("Failed to revive project");
        }
    };

const loginWithGoogle = async () => {
    try {
        // Redirect to the backend's Google OAuth endpoint
        window.location.href = `${BASE_URL}/auth/login/google`;
    } catch (error) {
        console.error("Error during Google login:", error);
        toast.error("Failed to log in with Google. Please try again.");
    }
};

const loginWithFacebook = async () => {
    alert('Coming soon')
    // try {
    //     // Redirect to the backend's Facebook OAuth endpoint
    //     window.location.href = `${BASE_URL}/auth/login/facebook`;
    // } catch (error) {
    //     console.error("Error during Facebook login:", error);
    //     toast.error("Failed to log in with Facebook. Please try again.");
    // }
};

const loginWithGithub = async () => {
    alert('Coming soon')
    // try {
    //     // Redirect to the backend's GitHub OAuth endpoint
    //     window.location.href = `${BASE_URL}/auth/login/github`;
    // } catch (error) {
    //     console.error("Error during GitHub login:", error);
    //     toast.error("Failed to log in with GitHub. Please try again.");
    // }
};


    return (
        <UserContext.Provider value={{
            isLoggedIn, loggedInUser, userList, emojiSettings, login, logout, registerNewUser,
            setLoggedInUser, setActiveList, createList, deleteList, toggleUrgent, addTag,
            deleteTag, updateProfilePicture, editUser, checkLogin, toggleShowDetails,
            updateSettings, editUserList, deleteUser, completeProject, reviveProject, loginWithGoogle,
            loginWithFacebook, loginWithGithub
        }} >
            {children}
        </UserContext.Provider>
    );
};

const useUserContext = () => useContext(UserContext);

export { UserProvider, useUserContext, UserContext }; 