import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'
import { useUserContext } from './UserContext';

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

const CommunicationContext = createContext();

const CommunicationProvider = ({ children }) => {
    return (
        <CommunicationContext.Provider value={{}}>
            {children}
        </CommunicationContext.Provider>
    );
};

const useCommunicationContext = () => useContext(CommunicationContext);

export { CommunicationProvider, useCommunicationContext };
