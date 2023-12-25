import "./UserCard.css"
import {React, useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserProvider";



export default function UserCard({ user, isOnline }) {
  const{setRecipientUser} = useContext(UserContext)
  const navigate = useNavigate()

  function handleChatIconClick(){
    setRecipientUser(user);
    localStorage.removeItem('recipientUser')
    localStorage.setItem('recipientUser', JSON.stringify(user));
    navigate('/swifconnect')

  }



  return (
    <div className="user-card">
      <Link to={`/${user.username}`} className="user-link">
        <img src={user.profile_image_url ? (user.profile_image_url):("/default-user-img2.jpeg")} alt="image" className="user-image" />
      </Link>
      <div className="user-info-below-image">

        <div className="user-info-first-line">
          
          <p className="user-name bold"> 
            {user.first_name} {user.last_name} 
          </p>

          <p className="chat-icon" onClick={handleChatIconClick}>💬</p>
        </div>
        <div>
        <p className="user-info-second-line">
          <span className="bold">Status:</span> 
          {isOnline === true? <span className="online-status">Online 🟢</span> : <span className="offline-status">Offline 🔴</span>}
        </p>
        </div>
          
      </div>
    </div>
  );
}
