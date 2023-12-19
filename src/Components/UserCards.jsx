import "./UserCards.css"

import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { getUsernameFromToken } from "../utilities/tokenUtilities";

const API = process.env.REACT_APP_API_URL;

function UserCards({ userStatuses }) {
  const token = localStorage.getItem("token")
  const [people, setPeople] = useState([]);
  const currentUsername = getUsernameFromToken(token);


  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await axios.get(`${API}/people`);
        setPeople(response.data);
      } catch (error) {
        console.error('Error fetching people:', error);
      }
    };
    fetchPeople();
  }, []);

  // Sort people based on userStatuses
  useEffect(() => {
    setPeople(currentPeople => {
      return [...currentPeople].sort((a, b) => {
        return (userStatuses[b.username] ? 1 : 0) - (userStatuses[a.username] ? 1 : 0);
      });
    });
  }, [userStatuses]);

  return (
    <div className="users-container">
      {people
        .filter(user => user.username !== currentUsername) // Exclude the current user
        .map((user) => (
          <UserCard key={user.username} user={user} isOnline={userStatuses[user.username]}/>
      ))}
    </div>
  );
}

export default UserCards;

