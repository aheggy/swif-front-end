import "./UserSidebar.css";
import "../assets/css/burger.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import messages from "../assets/img/messages.png";
import profile from "../assets/img/profile.png";
import subject from "../assets/img/subject.png";
import group from "../assets/img/group.png";
import library from "../assets/img/library.png";
import studyGuide from "../assets/img/studyGuide.png";
import { getUsernameFromToken } from "../utilities/tokenUtilities";
import { jwtDecode } from "jwt-decode";

const UserSidebar = () => {
	const [currentUsername, setCurrentUsername] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			const decoded = jwtDecode(token);
			const currentTime = Date.now() / 1000;
			if (decoded.exp > currentTime) {
				const username = getUsernameFromToken(token);
				setCurrentUsername(username);
			}
		}
	}, []);

	function handleBurgerChange(event) {
		const menu = document.getElementById("aside-menu");
		if (event.target.checked) {
			menu.classList.remove("aside-menu");
			menu.classList.add("aside-menu-active");
		}else{
			menu.classList.add("aside-menu");
			menu.classList.remove("aside-menu-active");
		}
	}

	return (
		<>
			<aside className="userpage-aside">
				<label for="burger" class="burger" onClick={handleBurgerChange}>
					<input id="burger" type="checkbox" />
					<span></span>
					<span></span>
					<span></span>
				</label>
				<div className="aside-menu" id="aside-menu">
					<ul>
						<li>
							<Link to="/messages">
								<button className="line-button-animation">
									<img src={messages} alt="" />
									Messages
								</button>
							</Link>
						</li>
						<li>
							<Link to={`/${currentUsername}`}>
								<button className="line-button-animation">
									<img src={profile} alt="" />
									Profile
								</button>
							</Link>
						</li>
						<li>
							<Link to={"/subjects"}>
								<button className="line-button-animation">
									<img src={subject} alt="" />
									Subjects
								</button>
							</Link>
						</li>
						<li>
							<Link to={"/people"}>
								<button className="line-button-animation">
									<img src={group} alt="" />
									People
								</button>
							</Link>
						</li>
						<li>
							<Link to={"/library"}>
								<button className="line-button-animation">
									<img src={library} alt="" />
									Library
								</button>
							</Link>
						</li>
						<li>
							<Link to={"/studyguide"}>
								<button className="line-button-animation">
									<img src={studyGuide} alt="" />
									Study Guide
								</button>
							</Link>
						</li>
					</ul>
				</div>
			</aside>
		</>
	);
};

export default UserSidebar;
