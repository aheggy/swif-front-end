import axios from "axios"
import React, { useState, useEffect, useRef, useContext } from "react";
import io from "socket.io-client";
import { getUsernameFromToken } from "../utilities/tokenUtilities";
import "./SwifConnect.css";
import "./ScreenSharing.css"
import Whiteboard from "./Whiteboard";
import ScreenSharing from './ScreenSharing';
import mic from "../assets/img/mic.png"
import shareScreen from "../assets/img/shareScreen.png"
import micMute from "../assets/img/mic_mute.png"
import cameraOff from "../assets/img/cameraOff.png"
import cameraOn from "../assets/img/cameraOn.png"
import incomingCall from "../assets/img/incoming-call.png"
import startCall from "../assets/img/start-call.png"
import send from "../assets/img/send.png"
import StopScreenSharing from "../assets/img/stopScreenSharing.png"
import DataContext from "../contexts/DataProvider";


const API = process.env.REACT_APP_API_URL;


const socket = io(API, {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
});

export default function SwifConnect({ token }) {
  // if (!people || people.length === 0) {
  //   return <div>Loading...</div>; 
  // }

  const {people}= useContext(DataContext)
  const messageInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const currentUsername = getUsernameFromToken(token);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [recipientUsername, setRecipientUsername] = useState(null);
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const screenShareRef = useRef(null);
  const [offerVisible, setOfferVisible] = useState(false)
  const [isLocalCameraActive, setIsLocalCameraActive] = useState(false);  
  const [isRemoteCameraActive, setIsRemoteCameraActive] = useState(false);  
  const [callActive, setCallActive] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeFeature, setActiveFeature] = useState('whiteboard');
  const [currentUsernameData, setCurrentUsernameData] = useState("")
  const [recipientUsernameData, setRecipientUsernameData] = useState("")
  

  // if (!people || people.length === 0) {
  //   return <div>Loading...</div>; 
  // }

  useEffect(() => {
    if (people && people.length > 0) {
      const currentUserData = people.find(user => user.username === currentUsername);
      const recipientUserData = people.find(user => user.username === recipientUsername);

      if (currentUserData) {
        setCurrentUsernameData(currentUserData);
      }

      if (recipientUserData) {
        setRecipientUsernameData(recipientUserData);
      }
    }
  }, [people, currentUsername, recipientUsername]);



  useEffect(() => {
    const savedRecipientUser = JSON.parse(localStorage.getItem('recipientUser'));
    if (savedRecipientUser) {
      setRecipientUsername(savedRecipientUser.username);
      setMessages([]);

    }
  }, [recipientUsername]);

  if (currentUsername) {
    socket.emit('register', currentUsername);
  } 


  // setInterval(() => {
  //   if (currentUsername) {
  //     socket.emit('heartbeat', { username: currentUsername });
  //   }
  // }, 3000); 


useEffect(() => {

    socket.on("new_message", (messageData) => {
        console.log("Message received:", messageData);
        console.log("currentUsername", currentUsername)
        console.log("messageData.sender_username", messageData.sender_username)
        console.log("messageData.recipientUsername", messageData.recipient_username)
        console.log("recipientUsername", recipientUsername)
        setMessages((msgs) => [...msgs, messageData]);
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






  const isNegotiating = useRef(false); 
  const pc = useRef({})
  
  useEffect(() => {
    const pcConfig = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };

    pc.current = new RTCPeerConnection(pcConfig);

    isNegotiating.current = false;

    
    pc.current.onicecandidate = (e) => {
      console.log("on ice candidate...")
      if (e.candidate && !isNegotiating.current) {
        sendToPeer('candidate', { candidate: e.candidate });
      }
    };


    let screenShareTrackIds = []; // Array to hold screen share track IDs

    function isScreenShareTrack(track) {
      // Check if the track's ID is in the list of screen share track IDs
      return screenShareTrackIds.includes(track.id);
    }

    // Update this list based on signaling messages
    socket.on('track-info', (data) => {
      setActiveFeature("screenshare")
      if (data.type === 'screen-share') {
        screenShareTrackIds.push(data.trackId);
      }
    });

    socket.on('screen-share-ended', (data) => {
      setActiveFeature("whiteboard")
      if (screenShareRef.current) {
        screenShareRef.current.srcObject = null;
      }
    });




    pc.current.ontrack = (e) => {
      console.log("On track event received:", e);
    
      if (e.track.kind === 'video') {
        if (isScreenShareTrack(e.track)) {
          console.log("Screen share track received:", e.track);
          screenShareRef.current.srcObject = e.streams[0];
        } else {
          if (!remoteVideoRef.current.srcObject) {
            remoteVideoRef.current.srcObject = e.streams[0];
          }
        }
      }
    };
  
    
    socket.on('sdp', handleRemoteSDP);
    // socket.on('track-info', handleRemoteScreenSDP)
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


  // Handling remote SDP
  const handleRemoteSDP = async (data) => {
    setIsRemoteCameraActive(true)
    setOfferVisible(true)
    await pc.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
    if (data.sdp.type === 'offer') {
      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);
      sendToPeer('sdp', { sdp: pc.current.localDescription });
    }
  };


  const handleRemoteCandidate = (candidateData) => {
    // console.log("Received ICE candidate:", candidateData);
    if (candidateData.candidate) {
      const iceCandidate = new RTCIceCandidate({
        candidate: candidateData.candidate.candidate,
        sdpMid: candidateData.candidate.sdpMid,
        sdpMLineIndex: candidateData.candidate.sdpMLineIndex,
      });
      pc.current.addIceCandidate(iceCandidate);
    }
  };

  const sendToPeer = (eventType, payload) => {
    const fullPayload = {
      ...payload,
      sender: currentUsername,
      recipient: recipientUsername,
    };
    socket.emit(eventType, fullPayload)
  };

  const createOffer = async () => {
    setCallActive(true)
    setIsLocalCameraActive(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach(track => pc.current.addTrack(track, stream));
    } catch (e) {
      console.error("Error:", e);
    }
  };


  const createAnswer = async () => {
    setCallActive(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach(track => pc.current.addTrack(track, stream));
    } catch (e) {
      console.error("Error:", e);
    }
  };


  // Start screen sharing
  const startScreenShare = async () => {
    setIsScreenSharing(true)
    setActiveFeature("screenshare")
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenShareRef.current.srcObject = screenStream;

      screenStream.getTracks().forEach(track => {
        pc.current.addTrack(track, screenStream);
        sendToPeer('track-info', { trackId: track.id, type: 'screen-share' });
      });

      console.log("Screen sharing started, pc is", pc);

    } catch (e) {
      console.error("Error during screen sharing:", e);
    }
  };



  const stopScreenShare = () => {
    setIsScreenSharing(false)
    const screenStream = screenShareRef.current.srcObject;
    if (screenStream) {
      // Stop each track in the screen share stream
      screenStream.getTracks().forEach(track => {
        track.stop();
  
        const sender = pc.current.getSenders().find(s => s.track === track);
        if (sender) {
          pc.current.removeTrack(sender);
        }
      });
  
      // Reset the screen share stream
      screenShareRef.current.srcObject = null;
  
      // Signal the remote peer that screen sharing has ended
      sendToPeer('screen-share-ended', {});
    }
  
    // Optionally, handle UI changes here
    setActiveFeature("whiteboard")
  };
  

  

  
  // Renegotiation needed handler
  pc.current.onnegotiationneeded = async () => {
      console.log("on negotiation needed ......");
      console.log("pc after start screen share ", pc)

      if (isNegotiating.current || pc.current.signalingState !== "stable") return;
      isNegotiating.current = true;
      try {
        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);
        sendToPeer('sdp', { sdp: pc.current.localDescription });
      } catch (e) {
        console.error("Error during negotiation:", e);
      } finally {
        isNegotiating.current = false;
      }
  };




  const endChat = () => {

    if (localVideoRef.current && localVideoRef.current.srcObject) {
      setIsRemoteCameraActive(false)
      setIsLocalCameraActive(false)
      const tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      localVideoRef.current.srcObject = null;
    }
    
    if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      setIsLocalCameraActive(false)
      setIsRemoteCameraActive(false)
      const remoteTracks = remoteVideoRef.current.srcObject.getTracks();
      remoteTracks.forEach(track => track.stop());
      remoteVideoRef.current.srcObject = null;
    }

    setMessages([]);
    setRecipientUsername(null);

    setOfferVisible(false)
    pc.current.close();
    pc.current = new RTCPeerConnection(null);
    // window.location.href=`/swifconnect`;
    setCallActive(false);    
    window.location.replace(`/${currentUsername}`);
  }




  // controle the video and audio
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);

  const toggleCamera = () => {
      const videoTrack = localVideoRef.current.srcObject.getTracks().find(track => track.kind === 'video');
      if (videoTrack) {
          videoTrack.enabled = !videoTrack.enabled;
          setIsCameraOn(videoTrack.enabled);
      }
  };
    

  const toggleMicrophone = () => {
    const audioTrack = localVideoRef.current.srcObject.getTracks().find(track => track.kind === 'audio');
    if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicrophoneOn(audioTrack.enabled);
    }
  };
  



    return (
      <>
          <div className="swif-connect-container">
            <div className="video-window"> 
              <div className="remote-user">
                { isRemoteCameraActive ? (
                  <video ref={remoteVideoRef} autoPlay className="remote-user-video" />
                ):(
                  <img className="remote-user-image" src={recipientUsernameData.profile_image_url}/>
                )}
              
              </div>

              <div className="local-user">
                { isLocalCameraActive ? (
                  <video ref={localVideoRef} autoPlay muted className="local-user-video" />
                ):(
                  <img className="local-user-image" src={currentUsernameData.profile_image_url}/>
                )}
              </div>

            </div>

            <button className="end-call-buttons" onClick={endChat}>End</button>

            <div className="available-user">
                <div className="call-button-icons-container">

                 
                    {callActive ? (
                      <>
                          {isCameraOn ?(
                            <button className="call-buttons camera-off" onClick={toggleCamera}>
                                <img className="call-button-icons" src={cameraOff} alt="icon"></img>
                            </button>
                            ):(
                            <button className="call-buttons" onClick={toggleCamera}>
                                  <img className="call-button-icons" src={cameraOn} alt="icon"></img>
                            </button>
                          )}

                          {isMicrophoneOn ? (
                            <button className="call-buttons mute-mic" onClick={toggleMicrophone}>
                                <img className="call-button-icons" src={micMute} alt="icon" />
                            </button>
                          ):(
                            <button className="call-buttons" onClick={toggleMicrophone}>
                                <img className="call-button-icons" src={mic} alt="icon" />
                            </button>
                          )}


                          {isScreenSharing ? (
                            <button className="call-buttons stop-screen-sharing" onClick={stopScreenShare}>
                              <img className="call-button-icons" src={StopScreenSharing} alt="icon" />
                            </button>
                          ):(
                            <button className="call-buttons" onClick={ startScreenShare }>
                              <img className="call-button-icons" src={shareScreen} alt="icon" />
                            </button>
                          )}
                      </>

                    ):( offerVisible ? ( 

                      <button className="call-buttons call-offer-visible" onClick={createOffer}>
                        <img className="call-button-icons" src={incomingCall} alt="icon"></img>
                      </button>
                    ):(
                      <button className="call-buttons" onClick={createOffer}>
                        <img className="call-button-icons" src={startCall} alt="icon"></img>
                      </button>
                    ))}

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
                    <button className='send-button' onClick={sendMessage}>
                      <img className="call-button-icons" src={send} alt="icon" />
                    </button>
                </div>
            </div>
            <div className="whitebard-sharescreen">
            {activeFeature === 'whiteboard' ? 
            (
              <Whiteboard 
                socket={socket} 
                currentUsername={currentUsername} 
                recipientUsername={recipientUsername}
                recipientUsernameData={recipientUsernameData}

              />
            ):(
              <ScreenSharing 
                screenShareRef={screenShareRef}
              />  
            )}
            </div>
        </div>
      </>
    );

}


