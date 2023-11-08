import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";
import "./NabBar.css";
import { useState, useEffect } from "react";
import api from "../api/Api";

const NavBar = ({ setIsLoggedIn, isLoggedIn }) => {
	const navigate = useNavigate();
	const handleLogout = () => {
		api.post("/logout").then(() => {
			localStorage.removeItem("auth_token");
			setIsLoggedIn(false);
		});
	};
	return (
		<nav className="navbar">
			<ul>
				<li>
					<Link to="/" className="nav-link">
						<p className="m-0 app-name mx-2">
							<span>S</span>wif
						</p>
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
					{isLoggedIn ? (
						<button onClick={handleLogout} className="btn page-btn">
							Logout
						</button>
					) : (
						<Link to="/login" className="nav-link">
							Login
						</Link>
					)}
				</li>
			</ul>
		</nav>
	);
};

export default NavBar;
