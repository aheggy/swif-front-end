import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;

function UserPage() {
    
    const { username } = useParams();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${API}/people`);
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
                    console.log('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchUserData();
    }, [username]);

    return (
        <div>
            <h1>User: {username}</h1>
            {userData ? (
                <div>
                    {/* Display user-specific data here */}
                    <p>Name: {userData.name}</p>
                    <p>Email: {userData.email}</p>
                    {/* Add more user details here */}
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};

export default UserPage;