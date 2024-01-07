import React, { useState, useRef, useEffect } from 'react';
import './ScreenSharing.css';
import { io } from 'socket.io-client';

const API = process.env.REACT_APP_API_URL;
const socket = io(API, {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
});

function ScreenSharing({ currentUsername, recipientUsername }) {
    const [isSharing, setIsSharing] = useState(false);
    const screenShareRef = useRef(null);
    const peerConnection = useRef(new RTCPeerConnection(null))
    const iceCandidatesQueue = useRef([]);

    // if (currentUsername) {
    //     socket.emit('register', currentUsername);
    //   } 
    useEffect(() => {
        

        peerConnection.current = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        peerConnection.current.onicecandidate = event => {
            if (event.candidate) {
                socket.emit('candidate', {
                    candidate: event.candidate,
                    sender: currentUsername,
                    recipient: recipientUsername
                });
            }
        };

        peerConnection.current.ontrack = event => {
            if (screenShareRef.current) {
                screenShareRef.current.srcObject = event.streams[0];
            }
        };

        socket.on('candidate', handleRemoteCandidate);
        socket.on('screenShareOffer', handleScreenShareOffer);

        return () => {
            if (peerConnection.current) {
                peerConnection.current.close();
                peerConnection.current = null;
            }
            socket.off('candidate', handleRemoteCandidate);
            socket.off('screenShareOffer', handleScreenShareOffer);
        };
    }, [socket, currentUsername, recipientUsername]);

    const handleScreenShareOffer = async data => {
        if (data.offer) {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            sendToPeer('screenShareOffer', { sdp: peerConnection.current.localDescription }); 
    
            // Process any queued candidates
            iceCandidatesQueue.current.forEach(candidate => {
                peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
            });
            iceCandidatesQueue.current = []; // Clear the queue
        }
    };

    const handleRemoteCandidate = data => {
        if (data.candidate) {
            const candidate = new RTCIceCandidate(data.candidate);
            if (peerConnection.current.remoteDescription) {
                peerConnection.current.addIceCandidate(candidate);
            } else {
                iceCandidatesQueue.current.push(candidate);
            }
        }
    };

    const startScreenShare = async () => {
        console.log("@@@start screen share")
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStream.getTracks().forEach(track => peerConnection.current.addTrack(track, screenStream));
        screenShareRef.current.srcObject = screenStream;
        setIsSharing(true);
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        sendToPeer('screenShareOffer', { sdp: peerConnection.current.localDescription }); 

    };

    const sendToPeer = (eventType, payload) => {
        const fullPayload = {
          ...payload,
          sender: currentUsername,
          recipient: recipientUsername,
        };
        socket.emit(eventType, fullPayload)
      };

    const stopScreenShare = () => {
        const screenStream = screenShareRef.current.srcObject;
        if (screenStream) {
            screenStream.getTracks().forEach(track => {
                track.stop();
                const sender = peerConnection.current.getSenders().find(s => s.track === track);
                if (sender) {
                    peerConnection.current.removeTrack(sender);
                }
            });
            screenShareRef.current.srcObject = null;
            setIsSharing(false);
        }
    };

    const toggleFullScreen = () => {
        const elem = document.querySelector('.screen-sharing-container');
        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className="screen-sharing-container" onDoubleClick={toggleFullScreen}>
            <div>
                <video ref={screenShareRef} autoPlay className='remote-user-Screen' />
            </div>
            {!isSharing ? (
                <button onClick={startScreenShare}>Start Sharing</button>
            ) : (
                <button onClick={stopScreenShare}>Stop Sharing</button>
            )}
        </div>
    );
}

export default ScreenSharing;
