// src/contexts/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const API = process.env.REACT_APP_API_URL;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const loginUser = async (credentials) => {
        try {
            const response = await axios.post(`${API}/login`, credentials);
            if (response.data.user) {
                setUser(response.data.user); 
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
