import "./UserSidebar.css"
import messages from "../assets/img/messages.png"
import profile from "../assets/img/profile.png"
import notification from "../assets/img/notification.png"
import group from "../assets/img/group.png"
import library from "../assets/img/library.png"
import settings from "../assets/img/settings.png"

const UserSidebar = () => {
	return (
		<aside className="userpage-aside">
			<div className="aside-menu">
				<ul>
					<li>
						<button className="line-button-animation">
							<img src={messages} alt="" />
							Messages
						</button>
					</li>
					<li>
						<button className="line-button-animation">
							<img src={profile} alt="" />
							Profile
						</button>
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
