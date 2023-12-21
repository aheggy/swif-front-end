import 'bootstrap/dist/css/bootstrap.min.css'; 
import { jwtDecode } from 'jwt-decode';

import React, { useState } from 'react';
import './SignUp.css';
const API = process.env.REACT_APP_API_URL


const SignUpPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    confirm_password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      console.error('Passwords do not match');
      return; // Stop the function if passwords don't match
    }
  
    try {
      const response = await fetch(`${API}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          username: formData.username,
          password: formData.password,
        }),
      });
  
      if (response.ok) {
        console.log('Sign-up successful!');
        const loginData = {
          username: formData.username,
          password: formData.password,
        }
        login(loginData)
        
      } else {
        console.error('Sign-up failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const login = async (loginData) => {
    

    try {
      const response = await fetch(`${API}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);

        // Decode token to get the username
        const decodedToken = jwtDecode(data.token);
        const username = decodedToken.username; // Ensure token has username
        window.location.href=(`/${username}`); // Navigate to user's page
      } else {
        console.log('Login failed');
      }
    } catch (error) {
      console.error('Error', error);
    }
    
    
  }
  

  return (
    <div className="signup-page">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          value={formData.confirm_password}
          onChange={handleInputChange}
        />
        <button type="submit" className="btn btn-warning">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPage;
