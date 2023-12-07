import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./UserPage.css";
import "../assets/css/LineButtonAnimation.css";
import succesImg from "../assets/img/succes.png";
import UserSidebar from "../Components/UserSidebar";

const API = process.env.REACT_APP_API_URL;

function UserPage() {
	const { username } = useParams();
	const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${API}/people`);
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
					setUserData({
						name: "test",
					});
				}
			} catch (error) {
				setUserData({
					name: "test",
				});
			}
		};

		fetchUserData();
	}, [username]);

	return (
		<div>
			{userData ? (
				// <div>
				//     {/* Display user-specific data here */}
				//     <p>Name: {userData.name}</p>
				//     <p>Email: {userData.email}</p>
				//     {/* Add more user details here */}
				// </div>
				<div className="userpage-container">
					<UserSidebar></UserSidebar>
					<section className="userpage-content">
						<h2 className="userpage-welcome">
							Welcome to SWIF <span>{userData.name}</span>
						</h2>
						<div className="userpage-message">
							<p>
								Your study experience with us is about to start
							</p>
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
			) : (
				<p>Loading user data...</p>
			)}
		</div>
	);
}

export default UserPage;
