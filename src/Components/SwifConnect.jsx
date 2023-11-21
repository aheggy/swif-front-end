import "./SwifConnect.css";
import axios from "axios";
import io from "socket.io-client";
import React, { useState, useEffect, useRef } from "react";
import { getUsernameFromToken } from "../utilities/tokenUtilities";

const API = process.env.REACT_APP_API_URL;
const socket = io(API);

export default function SwifConnect({token}) {

    const [isChatActive, setIsChatActive] = useState(false); 
    const messageInputRef = useRef(null)
    const messagesEndRef = useRef(null); 




    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [recipientUsername, setRecipientUsername] = useState(null);
    const currentUsername = getUsernameFromToken(token)
    console.log("recipientUsername", recipientUsername)
    console.log("currentUsername", currentUsername)



    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${API}/people`);
                setAvailableUsers(response.data);
            } catch (error) {
                console.error('Error fetching users', error);
            }
        };

        fetchUsers();

        // Register the user with their username
        if (currentUsername) {
            socket.emit('register', currentUsername);
        }

        // Listen for incoming messages
        const handleMessage = (messageData) => {
            if ((messageData.sender_username === currentUsername && messageData.recipient_username === recipientUsername.username) ||
                (messageData.sender_username === recipientUsername.username && messageData.recipient_username === currentUsername)) {
                setMessages((msgs) => [...msgs, messageData]);
                console.log("the condetion has excuted ")
            }
        };

        socket.on("new_message", handleMessage)

        return () => socket.off("new_message", handleMessage)
    }, [currentUsername]);

    const fetchChatHistory = async (recipientUsername) => {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
            params: { currentUsername, recipientUsername }
        };
    
        try {
            const response = await axios.get(`${API}/messages`, config);
            const filteredMessages = response.data.filter(message => {
                return (message.sender_username === currentUsername && message.recipient_username === recipientUsername) ||
                   (message.sender_username === recipientUsername && message.recipient_username === currentUsername);
            })
            setMessages(filteredMessages)
        } catch (error) {
            console.error('Error fetching chat history', error);
        }
    };

    const sendMessage = () => {
        if (newMessage !== "" && recipientUsername) {
            const messageData = {
                sender_username: currentUsername, // replace with actual sender username
                recipient_username: recipientUsername.username, // replace with actual recipient username
                text: newMessage,
            };

            socket.emit("new_message", messageData);
            setNewMessage("");
            messageInputRef.current?.focus();
        }
    };


    const initiateChat = (user) => {
        setRecipientUsername(user);
        // console.log(user.username)
        setMessages([])
        fetchChatHistory(user.username);
        setIsChatActive(true); 
        
    };
    
    const endChat = () => {
        setMessages([])
        setIsChatActive(false); 
        setRecipientUsername(null);
    };

      console.log("recipientUsername",recipientUsername)
      useEffect(() => {
        if(recipientUsername) {
            fetchChatHistory(recipientUsername.username)
        }
      },[recipientUsername])


      const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey){
            e.preventDefault();
            sendMessage();
        }
      }


      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="swif-connect-container">
            <div className="chat-container">
                <div className="chat-box">
                    {console.log("messages",messages)}
                    {messages.map((message, index) => (
                        <div key={index} className={message.sender_username === currentUsername ? "sent" : "received"}>
                        <div><b>{message.sender_username}</b>: {message.message_content}</div>
                    </div>
                    ))}
                    <div ref={messagesEndRef}/>
                </div>
                <div className='input-box'>
                    <input
                        type="text"
                        placeholder="Write your message"
                        className='message-input'
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        ref={messageInputRef}
                    />
                    <button className='send-button' onClick={sendMessage}>
                        Send
                    </button>
                </div>
            </div>

            <div className="available-user">
                {isChatActive ? (
                    <div className="chat-participants">
                        <div className="participant-circle top-circle">{recipientUsername?.first_name}</div>
                        <div className="participant-circle bottom-circle">{currentUsername}</div>
                        <button onClick={endChat}>End Chat</button>
                    </div>
                ) : (
                    availableUsers.map((user, index) => (
                        <div key={index} onClick={() => initiateChat(user)}>
                            {user.first_name} {user.last_name}
                            <hr />
                        </div>
                    ))
                )}
            </div>


        </div>
    );
}
