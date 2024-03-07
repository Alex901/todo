//At least i got the naming right this time!!!
import React, {createContext, useContext, useState, useEffect} from "react";
import axios from "axios";

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState({});
    const BASE_URL = import.meta.env.VITE_REACT_APP_PRODUCTION === 'true' ? 
    'https://todo-backend-gkdo.onrender.com' : 
    'http://localhost:5000';

    console.log("loggedInUser: ", loggedInUser);
    console.log("isLoggedIn: ", isLoggedIn);    

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

    const login = async (userData) => {
        //try to authenticate user here
        //6 - redirect to home page
        //7 - show user name in header
        //8 - show logout button in header
        //9 - show user lists in a drop down somewhere
        //!! - on login fail, dont exit modal, show error message
        //if successful, grab user data from server
        //and set user data
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, userData);
            //console.log("response: ", response);
            if (response.status === 200) {
               // console.log("User authenticated, loading user data");

                const userResponse = await axios.get(`${BASE_URL}/users/${userData.username}`);
                console.log("userResponse: ", userResponse);
                if(userResponse.status === 200) {
                    
                    setLoggedInUser(userResponse.data);
                    console.log("User data loaded", loggedInUser);
                    setIsLoggedIn(true);
                    console.log("user successfully logged in");
                } else {
                    console.log("could not load user data, login terminated");
                    return;
                }
                
            } else if (response.status === 401) {
                console.log("User not found");
            } else {
                console.log("Internal server error");
            }
        } catch (error) {
            console.error('Error logging in', error.response);
        }   

         //remember to do that on complete
    };

    const logout = () => {
        setIsLoggedIn(false);
        setLoggedInUser({
        });
        //Clear logged in user in the server ?
    }

    const setActiveList = (listName) => {
        setLoggedInUser({...loggedInUser, activeList: listName});
        console.log("Active list set to: ", listName);
        console.log("loggedInUser: ", loggedInUser.listName);
    }

    return (
        <UserContext.Provider value={{ isLoggedIn, loggedInUser, login, logout, registerNewUser, setLoggedInUser}} >
            {children}
        </UserContext.Provider>
    );
};

const useUserContext = () => useContext(UserContext);

export { UserProvider, useUserContext };