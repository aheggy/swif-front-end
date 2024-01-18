import UserCards from "../Components/UserCards";
import "./People.css"
import UserSidebar from "../Components/UserSidebar";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

const socket = io(API, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

export default function People({currentUsername}) {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search)
  const subjectName = searchParams.get('subjectName')

  


  // setInterval(() => {
  //   if (currentUsername) {
  //     socket.emit('register', currentUsername)
  //   }
  // }, 10000); 

  const [userStatuses, setUserStatuses] = useState({})
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    // Toggle sidebar visibility
  const toggleSidebar = () => {
      setIsSidebarVisible(!isSidebarVisible);
  };

    // Effect for window resize to handle sidebar visibility
  useEffect(() => {

    document.title = "SWIF - People";

    const handleResize = () => {
      if (window.innerWidth < 500) {
        setIsSidebarVisible(false);
        } else {
          setIsSidebarVisible(true);
        }
      };


      window.addEventListener('resize', handleResize);

      return () => {
          window.removeEventListener('resize', handleResize);
      };
  }, []);

  useEffect(() => {
        // Listen for user status changes
        socket.on('user_status_change', (data) => {
          const { username, isOnline } = data;
          setUserStatuses(prevStatuses => ({
              ...prevStatuses,
              [username]: isOnline
          }));
        });
        
    
        return () => {
            // Clean up listeners when the component unmounts
            socket.off('user_status_change');
        };



  }, [currentUsername, socket])

  // setInterval(() => {
  //   if (currentUsername) {
  //     socket.emit('heartbeat', { username: currentUsername });
  //   }
  // }, 30000); 


  return (
    <div className="people-container">
      <UserSidebar isVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />
      <UserCards userStatuses={userStatuses} subjectName={subjectName}/>
    </div>
  )
}