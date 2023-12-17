import React, {useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { getUsernameFromToken } from '../utilities/tokenUtilities';
import { jwtDecode } from 'jwt-decode';
import io from "socket.io-client";



import Home from '../Pages/Home';
// import LoginPage from '../Pages/LogIn';
import SignUpPage from '../Pages/SignUp';
import ProtectedRoute from './ProtectedRoute';
import SwifConnect from './SwifConnect';
import MessagePage from './MessagePage';
import People from '../Pages/People';
import UserPage from '../Pages/UserPage';
import Review from '../Pages/Review';
import SubjectPage from '../Pages/SubjectPage';
import ChatWindow from './ChatWindow';


const API = process.env.REACT_APP_API_URL;

const socket = io(API, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});


const AppRoutes = () => {
  const [currentUsername, setCurrentUsername] = useState("")
  const [messages, setMessages] = useState([]);


  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {

    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp > currentTime) {
        const username = getUsernameFromToken(token);
        setCurrentUsername(username);
        if (location.pathname === '/' || location.pathname === '/signup') {
          navigate(`/${username}`);
        }
        socket.emit('register', username);
        socket.on("new_message", (messageData) => {
          if (messageData.recipient_username === username) {
            setMessages(prevMessages => [...prevMessages, messageData]);
          }
        });
      } else {
        localStorage.removeItem('token');
        navigate("/");
      }
    }
  }, [token, navigate, location.pathname]);





  useEffect(() => {
    return () => {
      socket.off("new_message");
    };
  }, []);




  return (
    <>
      <ChatWindow token={token} currentUsername={currentUsername} messages={messages} />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/review" element={<Review />} />
        <Route path="/:username" element={<ProtectedRoute><UserPage currentUsername={currentUsername} /></ProtectedRoute>} />
        
        <Route path="/messages" element={<ProtectedRoute><MessagePage currentUsername={currentUsername}/></ProtectedRoute>} />
        <Route path="/people" element={<ProtectedRoute><People /></ProtectedRoute>} />
        <Route path="/subjects" element={<ProtectedRoute><SubjectPage currentUsername={currentUsername}/></ProtectedRoute>} />
        <Route path="/swifconnect" element={<ProtectedRoute><SwifConnect token={token} /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

export default AppRoutes;
