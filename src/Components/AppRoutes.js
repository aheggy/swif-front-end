import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { getUsernameFromToken } from '../utilities/tokenUtilities';

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
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const username = getUsernameFromToken(token);
      if (username) {
        navigate(`/${username}`);
      }
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/messages" element={<MessagePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/user/:username" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
      <Route path="/people" element={<ProtectedRoute><People /></ProtectedRoute>} />
      <Route path="/swifconnect" element={<ProtectedRoute><SwifConnect token={token} /></ProtectedRoute>} />
    </Routes>
  );
};

export default AppRoutes;
