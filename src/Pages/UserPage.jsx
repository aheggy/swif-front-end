import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";

import "./UserPage.css";
import "../assets/css/LineButtonAnimation.css";
import UserSidebar from "../Components/UserSidebar";

const API = process.env.REACT_APP_API_URL;

function UserPage({currentUsername}) {
	const { username } = useParams();
	const [userData, setUserData] = useState(null);
	const [isOwnProfile, setIsOwnProfile] = useState(false);
	const navigate = useNavigate(); 

	
	useEffect(() => {
		document.title = "SWIF - Profile";

		// console.log("Username from params:", username); 
  		setIsOwnProfile(username === currentUsername);
		if (username) {
			// console.log("Fetching data for username:", username);
			axios.get(`${API}/user/${encodeURIComponent(username)}`)
				.then(response => {
					setUserData(response.data[0]);
					localStorage.removeItem('userData');
					localStorage.setItem('userData', JSON.stringify(userData));
					// console.log("this is the userpage", response.data[0])
				})
				.catch(error => {
					console.error('Error fetching user data:', error);
					setUserData({ name: "catch error" });
				});
		} else {
            console.log("Username is undefined");
        }
	}, [username, currentUsername]);


	return (
		<div className="user-page">
			{userData ? (
			<>
					{isOwnProfile && <div className="UserSidebar"><UserSidebar currentUsername={currentUsername}/></div>}
					<div className="userpage-container">
					<div className="user-info">
					<section className="userpage-content">
						{
							isOwnProfile && 
							<p className="userpage-message">
								Welcome <span> {username.slice(0, 1).toUpperCase() + username.slice(1)} </span>
								<i>
									{/* <img src={succesImg} alt="" /> */}
								</i>
							</p>
						}
						<div className="about-user">
							<div>
								<img src={userData.profile_image_url ? (userData.profile_image_url):("/default-user-img2.jpeg")} alt="Profile" className="profile-image"/>
							</div>
							<div className="all-info">
								<p className="user-info">Name : <span>{userData.first_name} {userData.last_name}</span></p>
								<p className="user-info">Gender : <span>{userData.gender}</span></p>
								<p className="user-info">Age : <span>{userData.age}</span></p>
								<p className="user-info">Country : <span>{userData.country}</span></p>
								<p className="user-info">City : <span>{userData.city}</span></p>
								<p className="user-info">BIO : <span>{userData.bio}</span></p>
							</div>
						</div>
						{ isOwnProfile && <button
							className="edit-profile"
							onClick={() => navigate(`/edit-profile?username=${encodeURIComponent(username)}`)}
						>
							Edit Profile
						</button>}
						<hr />

						<div className="interested-subject">
							<h4>Interested subject: </h4>
							<ul>
								{userData.subject_interest ? (
									userData.subject_interest.split(",").map((interest, index) => (
										<li key={index}>{interest.trim()}</li>
									))
								):(
									""
								)
								}
							</ul>
						</div>

						
					</section>
					</div>
				</div>
				
			</>
			) : (
				<p>Loading user data...</p>
			)}
		</div>

	);
}

export default UserPage;
