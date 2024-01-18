import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserSidebar from './UserSidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./MessagePage.css";
// import {jwtDecode} from 'jwt-decode'; 
import { getUsernameFromToken } from '../utilities/tokenUtilities';

const API = process.env.REACT_APP_API_URL;

const MessagePage = () => {
  const [messages, setMessages] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState("") 

  
  useEffect(() => {
    document.title = "SWIF - Messages";

    const token = localStorage.getItem("token")
    // console.log(token)
    setCurrentUser(getUsernameFromToken(token));
    // console.log(currentUser)
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API}/messages`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setMessages(response.data);
        // Include current user in the recipients list
        const allUsers = response.data.reduce((acc, msg) => {
          acc.add(msg.sender_username);
          acc.add(msg.recipient_username);
          return acc;
        }, new Set());
        allUsers.delete(currentUser); // Remove current user from the list
        setRecipients(Array.from(allUsers));
        setError('');
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to fetch messages. Please try again.');
      }
    };

    fetchMessages();
  }, []);

  const handleRecipientClick = (username) => {
    setSelectedRecipient(username);
  };

  // Filter messages for a conversation between the current user and the selected recipient
  const messagesToShow = messages.filter(msg => 
    (msg.sender_username === currentUser && msg.recipient_username === selectedRecipient) ||
    (msg.sender_username === selectedRecipient && msg.recipient_username === currentUser)
  );

  return (
    <div className='message-container d-flex'>
      <div className='user-sidebar'>
        <UserSidebar />
      </div>
      <div className="recipients-list">
        {recipients.map(user => (
          <button key={user} onClick={() => handleRecipientClick(user)} className="recipient-button">
            {user}
          </button>
        ))}
      </div>

      <div className='messages-content'>
        <div className='message-box'>
          {messagesToShow.map((message, index) => (
            <div key={index} className='message'>
              <p className='message-user'>
                {message.sender_username === currentUser ? 'You: ' : message.sender_username + ": "} 
              <span className='message-text'>{message.message_content}</span>
              </p>
            </div>
          ))}
          {error && <div className='error-message'>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
