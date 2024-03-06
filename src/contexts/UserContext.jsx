//At least i got the naming right this time!!!
import React, {createContext, useContext, useState} from "react";
import axios from "axios";

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState();
    const BASE_URL = import.meta.env.VITE_REACT_APP_PRODUCTION === 'true' ? 
    'https://todo-backend-gkdo.onrender.com' : 
    'http://localhost:5000';

    console.log("logged in user: ", loggedInUser);
    console.log("isLoggedIn: ", isLoggedIn);    

    const registerNewUser = async (userData) => {
        console.log("userDate in usercontext> registerNewUser:", userData);

        try {
            const response = await axios.post(`${BASE_URL}/users/create`, userData);
            console.log("response: ", response);
        } catch (error) { 
            console.error('Error registering user', error);
        }
        //try to register user here
        //if successful, grab user data from server
        //and set user data
    }

    const login = async (userData) => {
        console.log("userDate in usercontext> login:", userData);

        //try to authenticate user here
        //1 - send user data to server
        //2 - server checks if user exists
        //3 - server sends user data back
        //4 - set user data
        //5 - set isLoggedIn to true
        //6 - redirect to home page
        //7 - show user name in header
        //8 - show logout button in header
        //9 - show user lists in a drop down somewhere
        //if successful, grab user data from server
        //and set user data
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, userData);
            console.log("response: ", response);
            if (response.status === 200) {
                console.log("User authenticated, loading user data");

                const userResponse = await axios.get(`${BASE_URL}/users/${userData.username}`);
                if(response.status === 200) {
                    
                    setLoggedInUser(userResponse.data);
                    console.log("User data loaded");
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
        setLoggedInUser(userData);
        console.log("loggedInUser: ", loggedInUser);
         //remember to do that on complete
    };

    const logout = () => {
        setIsLoggedIn(false);
        setLoggedInUser({
        });
        console.log("logged in user: ", loggedInUser)
        //Clear logged in user in the server ?
    }

    return (
        <UserContext.Provider value={{ isLoggedIn, loggedInUser, login, logout, registerNewUser}} >
            {children}
        </UserContext.Provider>
    );
};

const useUserContext = () => useContext(UserContext);

export { UserProvider, useUserContext };