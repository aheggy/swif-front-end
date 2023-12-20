import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import io from "socket.io-client";
import { getUsernameFromToken } from "../utilities/tokenUtilities";
import "./SwifConnect.css";
import { UserContext } from "../contexts/UserProvider";


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


  const [isCallStarted, setIsCallStarted] = useState(false)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const pc = useRef(new RTCPeerConnection(null))
  const textRef = useRef({})
//   const candidates = useRef([])
  const [offerVisible, setOfferVisible] = useState(false)
  // const [answerVisible, setAnswerVisible] = useState(false)
  const [status, setStatus] = useState("Make A call now")
  const [isCameraActive, setIsCameraActive] = useState(false);



  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenStreamRef = useRef(null);
  const remoteScreenRef = useRef(null);





  // const { recipientUser } = useContext(UserContext);

  useEffect(() => {
    const savedRecipientUser = JSON.parse(localStorage.getItem('recipientUser'));
    if (savedRecipientUser) {
      setRecipientUsername(savedRecipientUser.username);
      setMessages([]);

    }
  }, [recipientUsername]);

  // useEffect(() => {
  //   if (recipientUser) {
  //     setRecipientUsername(recipientUser.username);
  //     // any other setup you need for starting a chat with this user
  //     console.log("this is the recipientuser get passed form user card:", recipientUser.username)
  //     setRecipientUsername(recipientUser.username);
  //     setMessages([]);
  //     // fetchChatHistory(user.username);
  //     setIsChatActive(true);
  //   }
  // }, [recipientUser]);




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


  setInterval(() => {
    if (currentUsername) {
      socket.emit('heartbeat', { username: currentUsername });
    }
  }, 3000); 


    socket.on("new_message", (messageData) => {
        console.log("Message received:", messageData);
        console.log("currentUsername", currentUsername)
        console.log("messageData.sender_username", messageData.sender_username)
        console.log("messageData.recipientUsername", messageData.recipient_username)
        console.log("recipientUsername", recipientUsername)

        // if ((messageData.sender_username === currentUsername && messageData.recipient_username === recipientUsername) ||
        // (messageData.sender_username === recipientUsername && messageData.recipient_username === currentUsername)) {
        // console.log("done")
        setMessages((msgs) => [...msgs, messageData]);
        // if (messageData.recipient_username === currentUsername && messageData.sender_username !== currentUsername) {
            // Display a notification
            // alert(`New message from ${messageData.sender_username}`);
            // Or update a state to show a notification in the UI
          // }
      // }
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
    const pcConfig = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };

    pc.current = new RTCPeerConnection(pcConfig);

    pc.current.onicecandidate = (e) => {
      if (e.candidate) {
        sendToPeer('candidate', { candidate: e.candidate });
      }
      console.log("pc after onicecandate", pc)
    };

    pc.current.ontrack = (e) => {
      if (remoteVideoRef.current && e.streams && e.streams[0]) {
        remoteVideoRef.current.srcObject = e.streams[0];
    }
    };

    socket.on('sdp', handleRemoteSDP);
    socket.on('candidate', handleRemoteCandidate);

    return () => {
      socket.off('register')
      socket.off('sdp');
      socket.off('candidate');

      if (pc.current) {
        pc.current.close();
      }
    };
  }, [currentUsername, recipientUsername, socket]);

  const handleRemoteSDP = (data) => {
    // if (data.recipient === currentUsername){
       pc.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
      //  textRef.current.value = JSON.stringify(data.sdp)
      // console.log("data.sdp.type", data.sdp.type, data)
      if (data.sdp.type === 'offer') {
        setOfferVisible(true);
      }
    // }
  };


  const handleRemoteCandidate = (candidateData) => {
    console.log("Received ICE candidate:", candidateData);
    if (candidateData.candidate) {
      const iceCandidate = new RTCIceCandidate({
        candidate: candidateData.candidate.candidate,
        sdpMid: candidateData.candidate.sdpMid,
        sdpMLineIndex: candidateData.candidate.sdpMLineIndex,
      });
      pc.current.addIceCandidate(iceCandidate);
    }
  };
  

  const createOffer = () => {
    console.log("1- offer created")
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach(track => pc.current.addTrack(track, stream));
      setIsCameraActive(true);

      return pc.current.createOffer({
        offerToReceiveVideo: 1,
        offerToReceiveAudio: 1,
      })
    })
    .then( offer => {
      return pc.current.setLocalDescription(offer);
    })
    .then (() => {
      // const offer = pc.current.createOffer();
      sendToPeer('sdp', { sdp: pc.current.localDescription }); 
      
    })
    .catch(e => console.log("Error creating offer or accessing user media:", e));
  };

  const createAnswer = () => {
    console.log("1- Answer created");
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach(track => pc.current.addTrack(track, stream));
        setIsCameraActive(true);
  
        return pc.current.createAnswer(); 
      })
      .then(answer => {
        return pc.current.setLocalDescription(answer);
      })
      .then(() => {
        sendToPeer('sdp', { sdp: pc.current.localDescription });
      })
      .catch(e => console.log("Error creating answer or accessing user media:", e)); 
  };
  

  const sendToPeer = (eventType, payload) => {
    const fullPayload = {
      ...payload,
      sender: currentUsername,
      recipient: recipientUsername,
    };
    console.log("2- SDP created")
    socket.emit(eventType, fullPayload)
    console.log("3- SDP created and emited", fullPayload)


  };


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



  const showHideButtons = () => {
    if (!offerVisible) {
        return(
            <div>
                <button onClick={createOffer}>Start Call</button>
            </div>
        )
    } else {
        return(
            <div>
                <button onClick={createAnswer}>Answer</button>
            </div>
        )
    }
  }





  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenStreamRef.current = screenStream;
  
      const screenTrack = screenStream.getTracks()[0];
      
      const sender = pc.current.getSenders().find(s => s.track.kind === 'video');
      sender.replaceTrack(screenTrack);
  
      setIsScreenSharing(true);
  
      screenTrack.onended = () => {
        stopScreenShare();
      };
    } catch (error) {
      console.error("Failed to start screen sharing:", error);
    }
  };
  
  const stopScreenShare = () => {
    const videoTrack = localVideoRef.current.srcObject.getTracks().find(track => track.kind === 'video');
    const sender = pc.current.getSenders().find(s => s.track.kind === 'video');
    sender.replaceTrack(videoTrack);
  
    screenStreamRef.current.getTracks().forEach(track => track.stop());
    screenStreamRef.current = null;
  
    setIsScreenSharing(false);
  };



  const getRemoteStreamStyle = () => {
    return isScreenSharing ? { position: 'absolute', zIndex: 1 } : {};
  };
  
  const getRemoteScreenStyle = () => {
    return isScreenSharing ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 } : { display: 'none' };
  };

  



  

  const endChat = () => {

    if (localVideoRef.current && localVideoRef.current.srcObject) {
        const tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        localVideoRef.current.srcObject = null;
        setIsCameraActive(false)
      }
    
      if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
        const remoteTracks = remoteVideoRef.current.srcObject.getTracks();
        remoteTracks.forEach(track => track.stop());
        remoteVideoRef.current.srcObject = null;
        setIsCameraActive(false)
      }

    setMessages([]);
    setIsChatActive(false);
    setRecipientUsername(null);

    setOfferVisible(false)
    pc.current.close();
    pc.current = new RTCPeerConnection(null);
    // window.location.href=`/swifconnect`;
    window.location.replace(`/swifconnect`);
  }






const [dragging, setDragging] = useState(false);
const [diffX, setDiffX] = useState(0);
const [diffY, setDiffY] = useState(0);
const [styles, setStyles] = useState({});

const draggableRef = useRef(null);



const handleMouseDown = (e) => {
  setDragging(true);
  const boundingBox = draggableRef.current.getBoundingClientRect();
  setDiffX(e.clientX - boundingBox.left);
  setDiffY(e.clientY - boundingBox.top);
};

const handleMouseMove = (e) => {
  if (dragging) {
      const left = e.clientX - diffX;
      const top = e.clientY - diffY;
      setStyles({ left: `${left}px`, top: `${top}px`, position: 'absolute' });
  }
};

const handleMouseUp = () => {
  setDragging(false);
};


useEffect(() => {

  const handleMouseUpGlobal = () => {
      if (dragging) {
          setDragging(false);
      }
  };

  window.addEventListener('mouseup', handleMouseUpGlobal);

  return () => {
      window.removeEventListener('mouseup', handleMouseUpGlobal);
  };
}, [dragging]);


    return (
        <div className="swif-connect-container">
            <div
              ref={draggableRef}
              style={styles}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp} 
              className="draggable-video-window"
            > 
              <div className="remote-user">
                <video ref={remoteVideoRef} autoPlay muted className="remote-user-video" />
                {!isCameraActive && <span>{recipientUsername}</span>}
              </div>
              <div className="remote-screen" style={getRemoteScreenStyle()}>
                {isScreenSharing && (
                  <video ref={remoteScreenRef} autoPlay playsInline className="remote-screen-video" />
                )}
              </div>
              <div className="local-user">
                <video ref={localVideoRef} autoPlay muted className="local-user-video" />
                {!isCameraActive && <span>{currentUsername}</span>}
              </div>
            </div>


            <div className="available-user">
                    <div className="chat-participants">
                        <div className="callandendchat-button">
                             <button onClick={endChat}>End Call</button>
                            {showHideButtons()}
                            <button onClick={startScreenShare}>share screen</button>
                        </div>
                    </div>
            </div>




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
        </div>
    );

}
