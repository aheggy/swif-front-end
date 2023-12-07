import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; 
import './Home.css';

const API = process.env.REACT_APP_API_URL

function Home() {
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
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
        window.location.href=`/${username}`; // Navigate to user's page
      } else {
        console.log('Login failed');
      }
    } catch (error) {
      console.error('Error', error);
    }
  };


  const [displayedText, setDisplayedText] = useState('');
  const fullText = "SWIF: Connecting Minds, Empowering Learning. We're dedicated to revolutionizing study experiences by connecting students worldwide in filtered study groups. Our platform nurtures academic growth and fosters meaningful social bonds, turning solitary study into a no-pressure, collaborative, enriching journey. Join SWIF and transform the way you learn, collaborate, and succeed.";

  useEffect(() => {
    const sentences = fullText.split('. ');
    let currentSentence = 0;
    let displayInterval = setInterval(() => {
      setDisplayedText((text) => text + sentences[currentSentence] + '. ');
      currentSentence++;
      if (currentSentence === sentences.length) clearInterval(displayInterval);
    }, 3500); // Adjust the time for each sentence

    return () => clearInterval(displayInterval);
  }, []);

  

  return (
    <div className='home'>
      <div className='mission-statement'>
        <span className="typewriter">
          <strong>SWIF: Connecting Minds,</strong> Empowering Learning. We're dedicated to revolutionizing study experiences by connecting students worldwide in filtered study groups.
          Our platform nurtures academic growth and fosters meaningful social bonds, turning solitary study into a no-pressure, collaborative, enriching journey. Join SWIF and transform the way you learn, collaborate, and succeed.
        </span>
      </div>
      <div className="container">
      <div className='login-container'>
        <h1>Welcome to SWIF!</h1>
        <form onSubmit={handleLogin}>
            <input
              type="text"
              name='username'
              placeholder="Username"
              value={loginData.username}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name='password'
              placeholder="Password"
              value={loginData.password}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Login</button>
            <p>
              <a href="forgot-password">Forgot Password?</a>
            </p>
            <p>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </form>
      </div>

      <div className='landing-image'>
        <img src="../homePageImage2.webp" alt="" />
      </div>
      </div>
      

    <footer>
      <hr />

    </footer>
    </div>
  );
}

export default Home;