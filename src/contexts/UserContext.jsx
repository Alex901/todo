//At least i got the naming right this time!!!
import React, {createContext, useContext, useState} from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState({
        userName: '',
        email: '',
        password: '',
        role: 'user',
        listNames: ['defaultList', 'dailyList', 'all', 'sharedWithMe']
    });

    const login = (userData) => {
        console.log("userDate in usercontext> login:", userData);
        setIsLoggedIn(true);
        //try to authenticate user here
        //if successful, grab user data from server
        //and set user data
        setLoggedInUser(userData);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setLoggedInUser({
            userName: '',
            email: '',
            password: '',
            role: 'user',
            listNames: ['defaultList', 'dailyList', 'all', 'sharedWithMe']
        });
        //Clear logged in user in the server ?
    }

    return (
        <UserContext.Provider value={{ isLoggedIn, loggedInUser, login, logout}} >
            {children}
        </UserContext.Provider>
    );
};

const useUserContext = () => useContext(UserContext);

export { UserProvider, useUserContext };