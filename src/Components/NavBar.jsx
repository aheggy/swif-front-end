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

// import React, { useState, useEffect } from "react";
// import logo from "../assets/test.jpg";
// import "./NabBar.css";
// import { useNavigate } from "react-router-dom";
// import api from "../api/Api";

// function NavBar({ setIsLoggedIn, isLoggedIn }) {
// 	const navigate = useNavigate();
// 	const handleLogout = () => {
// 		api.post("/logout").then(() => {
// 			localStorage.removeItem("auth_token");
// 			setIsLoggedIn(false);
// 		});
// 	};

// 	return (
// 		<header className="p-2 d-flex align-items-center justify-content-between">
// 			<div className="d-flex align-items-center">
// 				<img src={logo} alt="logo" className="logo rounded" />
// 				<p className="m-0 app-name mx-2">
// 					<span>S</span>wif
// 				</p>
// 			</div>
// 			<div>
// 				{isLoggedIn ? (
// 					<button onClick={handleLogout} className="btn page-btn">
// 						Logout
// 					</button>
// 				) : (
// 					<div>
// 						<button
// 							className="btn page-btn mx-2"
// 							onClick={() => navigate("/login")}
// 						>
// 							Login
// 						</button>
// 						<button
// 							className="btn page-btn"
// 							onClick={() => navigate("/signup")}
// 						>
// 							Register
// 						</button>
// 					</div>
// 				)}
// 			</div>
// 		</header>
// 	);
// }

// export default NavBar;
