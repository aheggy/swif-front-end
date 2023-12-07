import "./UserCard.css"
import React from "react";
import { Link } from "react-router-dom";

export default function UserCard({ user }) {
  return (
    <div className="user-card">
      <Link to={`/swifconnect`} className="user-link">
        <img src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?q=80&w=2170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="image" className="user-image" />
      </Link>
      <div className="user-info">
        <p className="user-name bold">{user.isFavorite ? <span className="favorite-icon">⭐</span> : <span className="non-favorite-icon">✩</span>} {user.first_name} {user.last_name}</p>
        <p className="user-status">
          <span className="bold">Status:</span> 
          {user.isOnline ? <span className="online-status">Online</span> : <span className="offline-status">Offline</span>}
        </p>
        <p className="user-favorite">
          
        </p>
      </div>
    </div>
  );
}
