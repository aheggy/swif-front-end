import React, { useState, useEffect, axios } from "react";
import UserCard from "./UserCard";

const API = process.env.REACT_APP_API_URL

function UserCards() {
    
    const [people, setPeople] = useState([]);

    useEffect(() => {
      const fetchPeople = async () => {
        try {
          const response = await axios.get(`${API}/people`);
          setPeople(response.data);
          console.log(response)
        } catch (error) {
          console.error('Error fetching people:', error);
        }
      };
  
      fetchPeople();
    }, []);

  return (
    <div className="users-container">
      {people.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

export default UserCards;
