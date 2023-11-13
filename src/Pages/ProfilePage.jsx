import React from 'react';
import './ProfilePage.css';

function ProfilePage() {


  return (
    <div className="profile-container">
      <div className="sidebar">
        <ul>
          <li>Messages</li>
          <li>Profile</li>
          <li>Notifications</li>
          <li>My Groups</li>
          <li>Library</li>
        </ul>
      </div>
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-picture"></div>
          <div className="profile-info">
            <p>Name:</p>
            <p>Gender:</p>
            <p>Age:</p>
            <p>Country:</p>
            <p>City:</p>
            <p>Bio/About me:</p>
            <p>Subject of Interest:</p>
          </div>
        </div>
        <div className="profile-details">
          <div className="study-history">
            <h3>Study History</h3>
            
          </div>
          <div className="badges-achievements">
            <h3>Badges and Achievements</h3>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
