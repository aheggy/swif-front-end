import UserCards from "../Components/UserCards";
import "./People.css"
import UserSidebar from "../Components/UserSidebar";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const API = process.env.REACT_APP_API_URL;

const socket = io(API, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

export default function People({currentUsername}) {

  const [userStatuses, setUserStatuses] = useState({})




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
            // ... other clean up if needed ...
        };



  }, [currentUsername, socket])



  return (
    <div className="people-container">
      <UserSidebar></UserSidebar>
      <UserCards userStatuses={userStatuses}/>
    </div>
  )
}