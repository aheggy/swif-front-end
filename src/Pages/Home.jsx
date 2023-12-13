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
        const username = decodedToken.username; 
        window.location.href=`/${username}`;
      } else {
        console.log('Login failed');
      }
    } catch (error) {
      console.error('Error', error);
    }
  };


  const [displayedText, setDisplayedText] = useState('');
  const fullText = ["Study With Internet Friends."];
  const textH2 = ["Connecting Minds", " ", "Empowering Learning","."]
  
  let currentTextIndex = 0;
  let charIndex = 0;
  
  useEffect(() => {
    const typeWriter = () => {
      if (charIndex < fullText[currentTextIndex].length) {
        setDisplayedText(fullText[currentTextIndex].substring(0, charIndex + 1));
        charIndex++;
        setTimeout(typeWriter, 150);
      } else {
        setTimeout(() => {
          charIndex = 0;
          currentTextIndex = (currentTextIndex + 1) % fullText.length;
          setDisplayedText('');
          typeWriter();
        }, 2000); 
      }
    };
  
    typeWriter();
  }, []);
  




  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
      e.preventDefault(); 
      console.log('Subscribing with email:', email);
      setEmail('');
  };



  document.addEventListener('DOMContentLoaded', function() {
    var images = document.querySelectorAll('.landing-page-image .home-image');
    var currentImage = 0;

    setInterval(function() {
        images[currentImage].style.display = 'none';
        currentImage = (currentImage + 1) % images.length;
        images[currentImage].style.display = 'block';
    }, 2000); // 2000 milliseconds = 2 seconds
});


  return (
    <div className='home'>
      <div className='mission-statment-container'>
        <div className='mission-statement'>
          <span className="typewriter">
            <h3>{displayedText}</h3> 
            <h3>{textH2}</h3>
            <p>
                Where awkwardness meets awesome. Study smarter, not harder, in a supportive, online community. Join filtered study groups, connect with like-minded peers, and transform learning from a solo act to a collaborative adventure. SWIF - your no-pressure zone for academic growth and meaningful connections.
            </p>
          </span>
        </div>
        <div className='subscribe'>
          <form className='subscribe-form' onSubmit={handleSubmit}>
              <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
              <button type="submit">Subscribe</button>
          </form>
          {/* <img src="../sellectPartner.png" alt="" /> */}
          <div className='appStore-googlePlay'>
            <img className='app-image' src="../appStore.png" alt="" />
            <img className='app-image' src="../googlePlay.png" alt="" />
          </div>
        </div>
      </div>
      <div className="login-image-container">
      
      
      <div className='login-container'>
        <h1>Welcome to SWIF!</h1>
        <form className='home-login-form' onSubmit={handleLogin}>
            <input
              className='home-login'
              type="text"
              name='username'
              placeholder="Username"
              value={loginData.username}
              onChange={handleInputChange}
              required
            />
            <input
              className='home-login'
              type="password"
              name='password'
              placeholder="Password"
              value={loginData.password}
              onChange={handleInputChange}
              required
            />
            <button className='login-button' type="submit">Login</button>
            <p>
              <a className='home-forgot-password' href="forgot-password">Forgot Password?</a>
            </p>
            <p>
              Don't have an account? <Link className="home-signup" to="/signup">Sign Up</Link>
            </p>
        </form>
      </div>
      <div className='landing-page-image'>
        <img className='home-image' src="../homePage.jpg" alt="" />
        <img className='home-image' src="../homePageImage.webp" alt="" />
      </div>

      
      </div>
      <hr />

      <footer className="footer">
        <p>© 2023 SWIF - All Rights Reserved</p>
        <p>Follow us on <a href="https://twitter.com">Twitter</a>, <a href="https://facebook.com">Facebook</a>, and <a href="https://instagram.com">Instagram</a></p>
      </footer>
    </div>
  );
}

export default Home;