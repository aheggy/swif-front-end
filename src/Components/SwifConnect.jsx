import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { getUsernameFromToken } from "../utilities/tokenUtilities";
import "./SwifConnect.css";

const API = process.env.REACT_APP_API_URL;
const socket = io(API);

export default function SwifConnect({ token }) {
  const [isChatActive, setIsChatActive] = useState(false);
  const messageInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [recipientUsername, setRecipientUsername] = useState(null);
  const currentUsername = getUsernameFromToken(token);

  const [isCallStarted, setIsCallStarted] = useState(false)
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);

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

    if (currentUsername) {
      socket.emit('register', currentUsername);
    }

    const handleMessage = (messageData) => {
      if ((messageData.sender_username === currentUsername && messageData.recipient_username === recipientUsername) ||
          (messageData.sender_username === recipientUsername && messageData.recipient_username === currentUsername)) {
        setMessages((msgs) => [...msgs, messageData]);
      }
    };

    socket.on("new_message", handleMessage);

    return () => socket.off("new_message", handleMessage);
  }, [currentUsername, recipientUsername]);

  const startVideoCall = async () => {
    if (isCallStarted || !recipientUsername) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;
      setLocalStream(stream);

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.ontrack = event => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      pc.onicecandidate = event => {
        if (event.candidate) {
          socket.emit('webrtc_ice_candidate', {
            candidate: event.candidate,
            recipient_username: recipientUsername,
            sender_username: currentUsername,
          });
        }
      };

      setPeerConnection(pc);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit('webrtc_offer', {
        sdp: offer,
        recipient_username: recipientUsername,
        sender_username: currentUsername,
      });

      setIsCallStarted(true);
    } catch (err) {
      console.error('Failed to start video call:', err);
      // Handle errors (like user denied camera access)
    }
  };



    const fetchChatHistory = async (username) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: { currentUsername, recipientUsername: username }
    };

    try {
      const response = await axios.get(`${API}/messages`, config);
      const filteredMessages = response.data.filter(message => {
        return (message.sender_username === currentUsername && message.recipient_username === username) ||
               (message.sender_username === username && message.recipient_username === currentUsername);
      });
      setMessages(filteredMessages);
    } catch (error) {
      console.error('Error fetching chat history', error);
    }
  };

  const sendMessage = () => {
    if (newMessage !== "" && recipientUsername) {
      const messageData = {
        sender_username: currentUsername,
        recipient_username: recipientUsername,
        text: newMessage,
      };

      socket.emit("new_message", messageData);
      setNewMessage("");
      messageInputRef.current?.focus();
    }
  };

  const initiateChat = (user) => {
    setRecipientUsername(user.username);
    setMessages([]);
    fetchChatHistory(user.username);
    setIsChatActive(true);
  };

  const endChat = () => {
    setMessages([]);
    setIsChatActive(false);
    setRecipientUsername(null);

    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }
      if (peerConnection) {
        peerConnection.close();
        setPeerConnection(null);
      }
      setIsCallStarted(false);
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


    useEffect(() => {
        if (!isCallStarted || !peerConnection) return;

    // Set up remote stream
        const remoteStream = new MediaStream();
        setRemoteStream(remoteStream);

        peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track);
        });
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    };
    }, [isCallStarted, peerConnection]);


    useEffect(() => {
        if (!isCallStarted || !remoteStream || !remoteVideoRef.current) return;
        remoteVideoRef.current.srcObject = remoteStream;
    }, [isCallStarted, remoteStream]);



  



    return (
        <div className="swif-connect-container">
            <div className="chat-container">
                <div className="chat-box">
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
                    <button className='send-button' onClick={sendMessage}>Send</button>
                </div>
            </div>

            <div className="available-user">
                {isChatActive ? (
                    <div className="chat-participants">
                        <div className="participant-circle top-circle">
                            <video ref={remoteVideoRef} autoPlay className="user-video" />
                            {/* <span>{recipientUsername}</span> */}
                        </div>
                        <div className="participant-circle bottom-circle">
                            <video ref={localVideoRef} autoPlay muted className="user-video" />
                            {/* <span>{currentUsername}</span> */}
                        </div>
                        <button onClick={endChat}>End Chat</button>
                        <button onClick={startVideoCall}>Start Call</button>
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
