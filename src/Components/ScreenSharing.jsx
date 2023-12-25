import React, { useState, useRef, useEffect } from 'react';
import './ScreenSharing.css';

function ScreenSharing({ socket, currentUsername, recipientUsername, screenShareStreamRef, isScreenSharing, startScreenSharing, stopScreenSharing }) {
    const [isSharing, setIsSharing] = useState(false);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    

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
            <video ref={screenShareStreamRef} autoPlay></video>
            {isSharing ? (
                <button onClick={startScreenSharing}>Stop Sharing</button>
            ) : (
                <button onClick={startScreenSharing}>Start Sharing</button>
            )}
        </div>
    );
}

export default ScreenSharing;
