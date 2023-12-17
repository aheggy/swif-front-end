import "./UserSidebar.css"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"




import messages from "../assets/img/messages.png"
import profile from "../assets/img/profile.png"
import notification from "../assets/img/notification.png"
import group from "../assets/img/group.png"
import library from "../assets/img/library.png"
import settings from "../assets/img/settings.png"
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
						<button className="line-button-animation">
							<img src={notification} alt="" />
							Notifications
						</button>
					</li>
					<li>
						<button className="line-button-animation">
							<img src={group} alt="" />
							My groups
						</button>
					</li>
					<li>
						<button className="line-button-animation">
							<img src={library} alt="" />
							Library
						</button>
					</li>
					<li>
						<button className="line-button-animation">
							<img src={settings} alt="" />
							Settings
						</button>
					</li>
				</ul>
			</div>
		</aside>
	);
};

export default UserSidebar;
