import "./UserCards.css"
import React, { useState, useEffect, useContext } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { getUsernameFromToken } from "../utilities/tokenUtilities";
import DataContext from "../contexts/DataProvider";

const API = process.env.REACT_APP_API_URL;

function UserCards({ userStatuses }) {
  const token = localStorage.getItem("token")
  const { people } = useContext(DataContext);
  const [sortedPeople, setSortedPeople] = useState([]);
  const currentUsername = getUsernameFromToken(token);

  useEffect(() => {
    const sorted = [...people].sort((a, b) => {
      return (userStatuses[b.username] ? 1 : 0) - (userStatuses[a.username] ? 1 : 0);
    });
    setSortedPeople(sorted);
  }, [people, userStatuses]);

  return (
    <div className="users-container">
      {sortedPeople
        .filter(user => user.username !== currentUsername) // Exclude the current user
        .map((user) => (
          <UserCard key={user.username} user={user} isOnline={userStatuses[user.username]}/>
      ))}
    </div>
  );
}

export default UserCards;

