import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home({ setIsLoggedIn, isLoggedIn }) {
	const navigate = useNavigate();
	useEffect(() => {
		if (!isLoggedIn) {
			navigate("/login");
		}
	}, [isLoggedIn]);

	return <>This is the Home Page made by AR</>;
}

export default Home;
