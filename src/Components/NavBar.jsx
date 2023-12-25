import React, {useEffect, useState}from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; 
import { jwtDecode } from 'jwt-decode';
// import { getUsernameFromToken } from '../utilities/tokenUtilities';

const NavBar = () => {
  
  const [token, setToken] = useState(localStorage.getItem("token"));
  // const navigate = useNavigate();
  // const username = getUsernameFromToken(token)


  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("recipientUser")
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
        <Link to="/" className="nav-link"><img src="../logo.jpg" alt="" /></Link>
      </div>

      <div className="nav-links-container">
        <ul className="nav-links">
          {token && jwtDecode(token).exp > Date.now ()/ 1000 ? (
            <>
              <li>
                <Link onClick={logout} className="nav-link">Sign Out</Link>
              </li>
            </>
        ) : (
          <>
          <li>
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </li>
          </>
        )}

        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
