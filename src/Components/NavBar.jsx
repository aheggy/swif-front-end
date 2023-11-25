import React, {useEffect, useState}from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css'; 
import { jwtDecode } from 'jwt-decode';
// import { getUsernameFromToken } from '../utilities/tokenUtilities';

const NavBar = () => {
  
  const [token, setToken] = useState(localStorage.getItem("token"));
  // const navigate = useNavigate();
  // const username = getUsernameFromToken(token)


  const logout = () => {
    localStorage.removeItem("token")
    setToken(null);
    console.log(!!token)
    window.location.href=`/`
  }

  useEffect(() => {
    // Update token state when localStorage changes
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);



  return (
    <nav >
      <div className="logo">
        <Link to="/" className="nav-link">SWIF</Link>
      </div>
      <ul className="nav-links">
        {token && jwtDecode(token).exp > Date.now ()/ 1000 ? (
          <>
            <li>
              <Link to="/swifconnect" className="nav-link">Swif-Connect</Link>
            </li>
            <li>
              <Link to="/people" className="nav-link">People</Link>
            </li>
            <li>
              <Link to="/message" className="nav-link">Message</Link>
            </li>
            <li>
              <Link onClick={logout} className="nav-link">Sign Out</Link>
            </li>
          </>
      ) : (
        <>
        <li>
          <Link to="/Review" className="nav-link">Review</Link>
        </li>
        <li>
          <Link to="/login" className="nav-link">Login</Link>
        </li>
        </>
      )}

      </ul>
    </nav>
  );
};

export default NavBar;
