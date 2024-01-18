import "./UserCards.css"
import React, { useState, useEffect, useContext } from "react";
import UserCard from "./UserCard";
import { getUsernameFromToken } from "../utilities/tokenUtilities";
import DataContext from "../contexts/DataProvider";

function UserCards({ userStatuses, subjectName }) {
  const token = localStorage.getItem("token")
  const { people } = useContext(DataContext);
  const [sortedPeople, setSortedPeople] = useState([]);
  const currentUsername = getUsernameFromToken(token);

  console.log("unsorted people is ", people)
  useEffect(() => {
    const sorted = [...people].sort((a, b) => {
      return (userStatuses[b.username] ? 1 : 0) - (userStatuses[a.username] ? 1 : 0);
    });
    setSortedPeople(sorted);
  }, [people, userStatuses]);
  console.log("sorted people is ", sortedPeople)

  return (
    <div className="usercards-container">
      <p className="people-instruction">{`Users Currently Studying ${subjectName ? (subjectName):("")}`}</p>
      <div className="users-container">
        {sortedPeople
          .filter(user => user.username !== currentUsername) // Exclude the current user
          .map((user) => (
            <UserCard key={user.username} user={user} isOnline={userStatuses[user.username]}/>
        ))}
      </div>
    </div>
  );
}

export default UserCards;

