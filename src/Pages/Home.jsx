import { useEffect, useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home({isLoggedInApp, setIsLoggedInApp}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

	useEffect(() => {
		if (!isLoggedInApp) {
			navigate("/login");
		}
	}, [isLoggedInApp]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Replace this with actual login logic (e.g., checking credentials)
    if (email.trim() === '' || password.trim() === '') {
      alert('Please fill in all fields.');
    } else {
      // Simulating a successful login
      setIsLoggedIn(true);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="container">
      <h1>Welcome to SWIF</h1>
      {isLoggedIn ? (
        <div>
          <p>Welcome back, {email}!</p>
        </div>
      ) : (
        isSubmitted ? (
          <p>Invalid email or password. Please try again.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
            <p>
              <a href="forgot-password">Forgot Password?</a>
            </p>
          </form>
        )
      )}
    </div>
  );
}

export default Home;