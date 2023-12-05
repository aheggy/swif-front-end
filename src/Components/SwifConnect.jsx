import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { getUsernameFromToken } from "../utilities/tokenUtilities";
import "./SwifConnect.css";
import Peer from "peerjs";


const API = process.env.REACT_APP_API_URL;


const socket = io(API, {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
});

export default function SwifConnect({ token }) {




  const [isChatActive, setIsChatActive] = useState(false);
  const messageInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const connectionRef = useRef(null)
  
  const currentUsername = getUsernameFromToken(token);
  
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [recipientUsername, setRecipientUsername] = useState(null);


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


    socket.on("new_message", (messageData) => {
        console.log("Message received:", messageData);
        console.log("currentUsername", currentUsername)
        console.log("messageData.sender_username", messageData.sender_username)

        console.log("messageData.recipientUsername", messageData.recipient_username)
        console.log("recipientUsername", recipientUsername)
        if ((messageData.sender_username === currentUsername && messageData.        recipient_username === recipientUsername) ||
        (messageData.sender_username === recipientUsername && messageData.recipient_username === currentUsername)) {
        console.log("done")
        setMessages((msgs) => [...msgs, messageData]);
        if (messageData.recipient_username === currentUsername && messageData.sender_username !== currentUsername) {
            // Display a notification
            // alert(`New message from ${messageData.sender_username}`);
            // Or update a state to show a notification in the UI
          }
    }
    });
  
    return () => {
      socket.off("new_message");
    };
  }, [currentUsername, recipientUsername]);
  

  const sendMessage = () => {
    if (newMessage !== "" && recipientUsername) {
      const messageData = {
        sender_username: currentUsername,
        recipient_username: recipientUsername,
        text: newMessage,
      };
  
      socket.emit("new_message", messageData);
  
      // Optionally update UI immediately for the local user
      setMessages((msgs) => [...msgs, messageData]);
  
      setNewMessage("");
      messageInputRef.current?.focus();
    }
  };
  

  const initiateChat = (user) => {
    setRecipientUsername(user.username);
    setMessages([]);
    // fetchChatHistory(user.username);
    setIsChatActive(true);
  };

  const endChat = () => {
    setMessages([]);
    setIsChatActive(false);
    setRecipientUsername(null);

  }



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



  //////////////////////////////////////////////////////
    //              VIDIO PART 
  //////////////////////////////////////////////////////
  const [isCallStarted, setIsCallStarted] = useState(false)
  const localVideoRef = useRef(null)
  const RemoteVideoRef = useRef(null)
  const pc = useRef(new RTCPeerConnection(null))
  const textRef = useRef({})
//   const candidates = useRef([])
  const [offerVisible, setOfferVisible] = useState(true)
  const [answerVisible, setAnswerVisible] = useState(false)
  const [status, setStatus] = useState("Make A call now")


  useEffect (() => {
    socket.on("connection-success", success => {
        console.log(success)
    })

    socket.on("sdp", data => {
        console.log("_____________",data)
        pc.current.setRemoteDescription(new RTCSessionDescription(data.sdp))
        textRef.current.value = JSON.stringify(data.sdp)
        
        if(data.sdp.type === "offer"){
            setOfferVisible(false)
            setAnswerVisible(true)
            setStatus("Incoming call...")
        }else {
            setStatus("Call established")
        }
    })

    socket.on("candidate", candidate => {
        console.log("candidat_____________",candidate)
        // candidates.current = [...candidates.current, candidate]
        pc.current.addIceCandidate(new RTCIceCandidate(candidate))
    })



    const constraints = {
        audio: false,
        video: true,
    }
    navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        // display video
        localVideoRef.current.srcObject = stream
        stream.getTracks().forEach(track => {
            _pc.addTrack(track, stream)
        })

    })
    .catch(e => {
        console.log("get user media error..", e)
    })

    const _pc = new RTCPeerConnection(null)
    _pc.onicecandidate = (e) => {
        if (e.candidate){
            // console.log(JSON.stringify(e.candidate))
            sendToPeer("candidate", e.candidate)
        }
    }

    _pc.oniceconnectionstatechange = (e) => {
        console.log(e)
    }

    _pc.ontrack = (e) => {
        //we got remot stream
        RemoteVideoRef.current.srcObject = e.streams[0]
    }

    pc.current = _pc

  }, [])

  const sendToPeer = (eventType, payload) => {
    socket.emit(eventType, payload)
  }

  const processSDP = (sdp) => {
    console.log(JSON.stringify(sdp))
    pc.current.setLocalDescription(sdp)

    sendToPeer("sdp", {sdp})

  }

  const createOffer = () => {
    pc.current.createOffer({
        offerToReceiveAudio:1,
        offerToReceiveVideo:1,

    }).then( sdp => {
        //send the sdp to the server
        processSDP(sdp)
        setOfferVisible(false)
        setStatus("calling...")

    }).catch(e => console.log(e))
  }

  const createAnswer = () => {
    pc.current.createAnswer({
        offerToReceiveAudio:1,
        offerToReceiveVideo:1,

    }).then( sdp => {

        processSDP(sdp)
        setAnswerVisible(false)
        setStatus("Call established")

    }).catch(e => console.log(e))
  }

  const setRemoteDescription = () => {
    const sdp = JSON.parse(textRef.current.value)

    pc.current.setRemoteDescription(new RTCSessionDescription(sdp))
  }

//   const addCandidate = () => {
//     // const candidate = JSON.parse(textRef.current.value)
//     candidates.current.forEach(candidate => {
//     pc.current.addIceCandidate(new RTCIceCandidate(candidate))
//     })
//   }



  


  const getUserMedia = () => {
    // const constraints = {
    //     audio: false,
    //     video: true,
    // }
    // navigator.mediaDevices.getUserMedia(constraints)
    // .then(stream => {
    //     // display video
    //     localVideoRef.current.srcObject = stream
    // })
    // .catch(e => {
    //     console.log("get user media error..", e)
    // })

    // // const stream = await navigator.mediaDevices.getUserMedia(constraints)
    // // localVideoRef.current.srcObject = stream

  }
  



  const showHideButtons = () => {
    if (offerVisible) {
        return(
            <div>
                <button onClick={createOffer}>Call</button>
            </div>
        )
    } else if (answerVisible) {
        return(
            <div>
                <button onClick={createAnswer}>Answer</button>
            </div>
        )
    }
  }



    return (
        <div className="swif-connect-container">
            <div className="chat-container">
                <div className="chat-box">
                    {messages.map((message, index) => (
                        <div key={index} className={message.sender_username === currentUsername ? "sent" : "received"}>
                            
                            <div><b>{message.sender_username}</b>: {message.text}</div>
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
                            <video ref={RemoteVideoRef} autoPlay muted className="user-video" />
                            {/* <span>{recipientUsername}</span> */}
                        </div>
                        <div className="participant-circle bottom-circle">
                            <video ref={localVideoRef} autoPlay muted className="user-video" />
                            {/* <span>{currentUsername}</span> */}
                        </div>
                        {/* <button onClick={() => createAnswer()}>answer</button> */}
 
                        {showHideButtons()}

                    </div>
                ) : (
                    availableUsers
                    .filter(user => user.username !== currentUsername)
                    .map((user, index) => (
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
