import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const API = process.env.REACT_APP_API_URL;

const socket = io(API, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});


export default function ChatWindow({ token, currentUsername }) {
    const [isVisible, setIsVisible] = useState(false);
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        socket.on("new_message", (messageData) => {
            if (messageData.recipient_username === currentUsername) {
                setMessages(prevMessages => [...prevMessages, messageData]);
                // Auto-open the chat window when a new message is received
                if (!isVisible) {
                    setIsVisible(true);
                }
            }
        });

        return () => {
            socket.off("new_message");
        };
    }, [currentUsername, isVisible]);

    useEffect(() => {
        if (isVisible) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isVisible]);

    const handleToggle = () => {
        setIsVisible(!isVisible);
    };

    const handleClose = () => {

    }

    
    return (
        <>
            <button className="toggle-chat-btn" onClick={handleToggle}>Chat</button>
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
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            )}
        </>
    );
}
