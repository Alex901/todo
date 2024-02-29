//At least i got the naming right this time!!!
import React, {createContext, useContext, useState} from "react";

const UserContext = createContext();

const UserProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    const login = () => {
        setIsLoggedIn(true);
        setUsername("Ghost");
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUsername('');
    }

    return (
        <UserContext.Provider value={{ isLoggedIn, username, login, logout}} >
            {children}
        </UserContext.Provider>
    );
};

const useUserContext = () => useContext(UserContext);

export { UserProvider, useUserContext };