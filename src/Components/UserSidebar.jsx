import "./UserSidebar.css"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import messages from "../assets/img/messages.png"
import profile from "../assets/img/profile.png"
import subject from "../assets/img/subject.png"
import group from "../assets/img/group.png"
import library from "../assets/img/library.png"
import studyGuide from "../assets/img/studyGuide.png"
import { getUsernameFromToken } from '../utilities/tokenUtilities';
import { jwtDecode } from "jwt-decode"


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

	

	return (
		<aside className="userpage-aside">
			<div className="aside-menu">
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
						<Link to={"library"}>
							<button className="line-button-animation">
								<img src={library} alt="" />
								Library
							</button>
						</Link>
					</li>
					<li>
						<Link to={"studyguide"}>
							<button className="line-button-animation">
								<img src={studyGuide} alt="" />
								Study Guide
							</button>
						</Link>
					</li>
				</ul>
			</div>
		</aside>
	);
};

export default UserSidebar;
