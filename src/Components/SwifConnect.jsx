import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { getUsernameFromToken } from "../utilities/tokenUtilities";
import "./SwifConnect.css";
import Whiteboard from "./Whiteboard";
import ScreenSharing from './ScreenSharing';



const API = process.env.REACT_APP_API_URL;


const socket = io(API, {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
});

export default function SwifConnect({ token }) {


  
  const messageInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  const currentUsername = getUsernameFromToken(token);
  
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [recipientUsername, setRecipientUsername] = useState(null);


  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const pc = useRef(new RTCPeerConnection(null))
  const textRef = useRef({})
//   const candidates = useRef([])
  const [offerVisible, setOfferVisible] = useState(false)
  // const [answerVisible, setAnswerVisible] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false);


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
    setRecipientUsername(null);

    setOfferVisible(false)
    pc.current.close();
    pc.current = new RTCPeerConnection(null);
    // window.location.href=`/swifconnect`;
    window.location.replace(`/${currentUsername}`);
  }


  //toggle between screen sharing and whiteboard

  const [activeFeature, setActiveFeature] = useState('whiteboard');


  const toggleFeature = () => {
    if (activeFeature === 'whiteboard') {
        setActiveFeature('screenShare');
    } else {
        setActiveFeature('whiteboard');
    }
  };



  // screen sharing 
  const [isScreenSharing, setIsScreenSharing] = useState(false);
    const screenShareStreamRef = useRef(null);

    // ... existing useEffect and functions

    // Function to start screen sharing
    const startScreenSharing = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            screenShareStreamRef.current = screenStream;

            // Add the screen sharing track to the peer connection
            const screenTrack = screenStream.getVideoTracks()[0];
            pc.current.addTrack(screenTrack, screenStream);

              setIsScreenSharing(true);
        } catch (error) {
              console.error('Error starting screen sharing:', error);
        }
    }

    // Function to stop screen sharing
    const stopScreenSharing = () => {
      if (screenShareStreamRef.current) {
          const screenTrack = screenShareStreamRef.current.getTracks().find(track => track.kind === 'video');
          if (screenTrack) {
              const sender = pc.current.getSenders().find(s => s.track === screenTrack);
              if (sender) {
                  pc.current.removeTrack(sender);
              }
              screenTrack.stop();
          }
          setIsScreenSharing(false);
      }
    };


// controle the video and audio
    const [isCameraOn, setIsCameraOn] = useState(true); // Initially, the camera is on
    const [isMicrophoneOn, setIsMicrophoneOn] = useState(true); // Initially, the microphone is on

    const toggleCamera = () => {
      if (isCameraOn) {
          turnCameraOff();
      } else {
          turnCameraOn();
      }
  };
  
  const turnCameraOff = () => {
      const videoTrack = localVideoRef.current.srcObject.getTracks().find(track => track.kind === 'video');
      if (videoTrack) {
          videoTrack.enabled = false; // This disables the track without stopping it
      }
      setIsCameraOn(false);
  };
  
  const turnCameraOn = () => {
      const videoTrack = localVideoRef.current.srcObject.getTracks().find(track => track.kind === 'video');
      if (videoTrack) {
          videoTrack.enabled = true; // This re-enables the track
      }
      setIsCameraOn(true);
  };



  const toggleMicrophone = () => {
    if (isMicrophoneOn) {
        turnMicrophoneOff();
    } else {
        turnMicrophoneOn();
    }
};

const turnMicrophoneOff = () => {
    const audioTrack = localVideoRef.current.srcObject.getTracks().find(track => track.kind === 'audio');
    if (audioTrack) {
        audioTrack.enabled = false; 
    }
    setIsMicrophoneOn(false);
};

const turnMicrophoneOn = () => {
    const audioTrack = localVideoRef.current.srcObject.getTracks().find(track => track.kind === 'audio');
    if (audioTrack) {
        audioTrack.enabled = true; 
    }
    setIsMicrophoneOn(true);
};

  

    return (
        <div className="swif-connect-container">
            <div className="video-window"> 
              <div className="remote-user">
                <video ref={remoteVideoRef} autoPlay className="remote-user-video" />
                {!isCameraActive && <span>{recipientUsername}</span>}
              </div>
              {/* <div className="remote-screen" style={getRemoteScreenStyle()}>
                {isScreenSharing && (
                  <video ref={remoteScreenRef} autoPlay playsInline className="remote-screen-video" />
                )}
              </div> */}
              <div className="local-user">
                <video ref={localVideoRef} autoPlay muted className="local-user-video" />
                {!isCameraActive && <span>{currentUsername}</span>}
              </div>
                <button onClick={toggleCamera}>
                    {isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
                </button>
                <button onClick={toggleMicrophone}>
                    {isMicrophoneOn ? 'Mute Microphone' : 'Unmute Microphone'}
                </button>
            </div>


            <div className="available-user">
                    <div className="chat-participants">
                        <div className="callandendchat-button">
                            <button onClick={toggleFeature}>
                            {activeFeature === 'whiteboard' ? "Switch to Screen Share" : "Switch to Whiteboard"}
                            </button>
                            {!offerVisible ? (<button onClick={createOffer}>Start Call</button>
                            ):(<button onClick={createAnswer}>Answer</button>)}
                            <button onClick={endChat}>End Call</button>
                            {/* <button onClick={startScreenShare}>share screen</button> */}
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
            <div className="whitebard-sharescreen">
            {activeFeature === 'whiteboard' ? 
            (
              <Whiteboard socket={socket} currentUsername={currentUsername} recipientUsername={recipientUsername}/>
            ):(
              <ScreenSharing socket={socket} currentUsername={currentUsername} recipientUsername={recipientUsername} screenShareStreamRef={screenShareStreamRef} isScreenSharing={isScreenSharing} startScreenSharing={startScreenSharing} stopScreenSharing={stopScreenSharing}/>
            )}
            </div>
        </div>
    );

}
