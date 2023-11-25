import "./UserCards.css"

import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";
import axios from "axios";


const API = process.env.REACT_APP_API_URL

function UserCards() {
    
    const [people, setPeople] = useState([]);

    useEffect(() => {
      const fetchPeople = async () => {
        try {
          const response = await axios.get(`${API}/people`);
          setPeople(response.data);
          console.log(response.data)
        } catch (error) {
          console.error('Error fetching people:', error);
        }
      };
  
      fetchPeople();
    }, []);

  return (
    <div className="users-container">
      {people.map((user) => (
        <UserCard key={user.username} user={user} />
      ))}
    </div>
  );
}

export default UserCards;
