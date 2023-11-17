import "./UserPage.css";
import "../assets/css/LineButtonAnimation.css";
import succesImg from "../assets/img/succes.png";

// We can activate this component by using the route:  <Route path="/userpage" element={<UserPage />}/>
// in the App.js file

function UserPage() {
	const User = {
		first_name: "John",
		last_name: "Doe",
		username: "John Smith",
	};
	return (
		<div className="userpage-container">
			<aside className="userpage-aside">
				<div className="aside-menu">
					<ul>
						<li>
							<button className="line-button-animation">
								Messages
							</button>
						</li>
						<li>
							<button className="line-button-animation">
								Profile
							</button>
						</li>
						<li>
							<button className="line-button-animation">
								Notifications
							</button>
						</li>
						<li>
							<button className="line-button-animation">
								My groups
							</button>
						</li>
						<li>
							<button className="line-button-animation">
								Library
							</button>
						</li>
					</ul>
				</div>
			</aside>
			<section className="userpage-content">
				<h2 className="userpage-welcome">
					Welcome to SWIF <span>{User.username}</span>
				</h2>
				<div className="userpage-message">
					<p>Your study experience with us is about to start</p>
					<i>
						<img src={succesImg} alt="" />
					</i>
				</div>
				<div className="userpage-cards">
					<div class="custom-card">
						<div class="flex-container">
							<div class="circle teal"></div>
							<div class="circle orange"></div>
							<div class="circle indigo"></div>
						</div>
						<div class="card__content"></div>
					</div>
					<div class="custom-card">
						<div class="flex-container">
							<div class="circle teal"></div>
							<div class="circle orange"></div>
							<div class="circle indigo"></div>
						</div>
						<div class="card__content"></div>
					</div>
				</div>
			</section>
		</div>
	);
}

export default UserPage;
