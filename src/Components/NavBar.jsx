import React from 'react';
import { Link } from 'react-router-dom'; 
import './NavBar.css'; 

const NavBar = () => {
  return (
    <nav className="navbar">
        <ul>
          <li>
            <Link to="/" className="nav-link">
              <p className="swif-link">SWIF</p>
            </Link>
          </li>
          <li>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="nav-link">
              About
            </Link>
          </li>
          <li>
            <Link to="/courses" className="nav-link">
              Courses
            </Link>
          </li>
          <li>
            <Link to="/swif-connect" className="nav-link">
              Swif-Connect
            </Link>
          </li>
          <li>
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </li>
        </ul>
      </nav>
  );
};

export default NavBar;
