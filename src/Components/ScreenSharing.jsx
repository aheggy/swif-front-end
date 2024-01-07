import './ScreenSharing.css';



function ScreenSharing({ screenShareRef }) {



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
            <video ref={screenShareRef} autoPlay className='remote-user-Screen' />
        </div>
    );
}

export default ScreenSharing;
