import React from "react";
import { Link } from "react-router-dom";

export default function UserCard({ user }) {
  return (
    <div className="user-card">
      <Link to={`/users/${user.id}`} className="user-link">
        <img src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} className="user-image" />
      </Link>
      <div className="user-info">
        <span className="user-name bold">{user.firstName} {user.lastName}</span>
        <p className="user-status">
          <span className="bold">Status:</span> 
          {user.isOnline ? <span className="online-status">Online</span> : <span className="offline-status">Offline</span>}
        </p>
        <p className="user-favorite">
          <span className="bold">Favorite:</span>
          {user.isFavorite ? <span className="favorite-icon">⭐</span> : <span className="non-favorite-icon">✩</span>}
        </p>
      </div>
    </div>
  );
}
