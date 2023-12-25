import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import "./UserPage.css";
import "../assets/css/LineButtonAnimation.css";
import succesImg from "../assets/img/succes.png";
import UserSidebar from "../Components/UserSidebar";

const API = process.env.REACT_APP_API_URL;

function UserPage({currentUsername}) {
	const { username } = useParams();
	const [userData, setUserData] = useState(null);
	const [isOwnProfile, setIsOwnProfile] = useState(false);


	
	useEffect(() => {
  		setIsOwnProfile(username === currentUsername);

		if (username) {
			axios.get(`${API}/user/${encodeURIComponent(username)}`)
				.then(response => {
					setUserData(response.data[0]);
					console.log("this is the userpage", response.data[0])
				})
				.catch(error => {
					console.error('Error fetching user data:', error);
					setUserData({ name: "catch error" });
				});
		}
	}, [username, currentUsername]);

	

	console.log(userData)


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
								Welcome <strong> {username} </strong>
								<i>
									{/* <img src={succesImg} alt="" /> */}
								</i>
							</p>
						}
						<div className="about-user">
							<div>
								<img src={userData.profile_image_url ? (userData.profile_image_url):("/default-user-img2.jpeg")} alt="Profile Image" className="profile-image"/>
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
						<hr />

						<div className="interested-subject">
							<h1>Interested subject</h1>
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
