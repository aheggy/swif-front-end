import "./MessagePage.css"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API = process.env.REACT_APP_API_URL;

const MessagePage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };


  useEffect(() => {
    fetchMessages();
  }, []);


  const sendMessage = async () => {
    try {
      await axios.post(`${API}/messages`, { text: newMessage, userId: 1 }); 
      setNewMessage(''); 
      fetchMessages(); 
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  return (
    <div className='message-container'>
      <h2>Messages</h2>
      <div className='message-box'>
        {messages.map((message, index) => (
          <div key={index}>
            <p>{message.text}</p>
            <p>From: User ID {message.userId}</p>
          </div>
        ))}
      </div>
      <div className='input-button'>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className='message-input'
        />
        <button onClick={sendMessage} className='send-button'>
          Send
        </button>
      </div>
    </div>
  );
};

export default MessagePage;
