import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import "./ChatWindow.css"

const API = process.env.REACT_APP_API_URL;
const socket = io(API);

export default function ChatWindow({ token, currentUsername }) {
    const [isVisible, setIsVisible] = useState(false);
    const [messages, setMessages] = useState([]);


    useEffect(() => {
        socket.on("new_message", (messageData) => {
            console.log("messageData", messageData)
            if (messageData.recipient_username === currentUsername) {
                setMessages(prevMessages => [...prevMessages, messageData]);
                setIsVisible(true);
            }
        });

        return () => {
            socket.off("new_message");
        };
    }, [currentUsername]);

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <>
            {isVisible && (
                <div className="chat-popup">
                    <div className="chat-header">
                        <h3>Chat Messages</h3>
                        <button onClick={handleClose}>Close</button>
                    </div>
                    <div className="chat-body">
                        {messages.map((message, index) => (
                            <div key={index}>
                                <b>{message.sender_username}</b>: {message.text}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
