import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { getUsernameFromToken } from '../utilities/tokenUtilities';
import { jwtDecode } from 'jwt-decode';

import Home from '../Pages/Home';
import LoginPage from '../Pages/LogIn';
import SignUpPage from '../Pages/SignUp';
import ProtectedRoute from './ProtectedRoute';
import SwifConnect from './SwifConnect';
import MessagePage from './MessagePage';
import People from '../Pages/People';
import UserPage from '../Pages/UserPage';

const AppRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {

    if (location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/signup") {
      return;
    }

    if (token) {
      const decoded = jwtDecode(token)
      const currentTime = Date.now() / 1000
      const username = getUsernameFromToken(token);
      if (decoded.exp > currentTime) {
        console.log("navigate to username page")
        navigate(`/${username}`);
      }else {
        navigate("/")
      }

    }
  }, [token, navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/messages" element={<ProtectedRoute><MessagePage /></ProtectedRoute>} />
      <Route path="/:username" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
      <Route path="/people" element={<ProtectedRoute><People /></ProtectedRoute>} />
      <Route path="/swifconnect" element={<ProtectedRoute><SwifConnect token={token} /></ProtectedRoute>} />
    </Routes>
  );
};

export default AppRoutes;
