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
    localStorage.setItem('recipientUser', JSON.stringify(user));
    navigate('/swifconnect')

  }



  return (
    <div className="user-card">
      <Link to={`/${user.username}`} className="user-link">
        <img src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?q=80&w=2170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="image" className="user-image" />
      </Link>
      <div className="user-info-below-image">

        <div className="user-info-first-line">
          <p>
          {user.isFavorite ? <span className="favorite-icon">⭐</span> : <span className="non-favorite-icon">✩</span>}
          </p>

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
