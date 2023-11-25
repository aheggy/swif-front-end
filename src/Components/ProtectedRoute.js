import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; 
      return decoded.exp < currentTime; 
    } catch (error) {
      // return true; 
    }
  };

  return token && !isTokenExpired(token) ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
