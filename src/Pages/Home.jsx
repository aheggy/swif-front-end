import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
	const navigate = useNavigate();
	useEffect(() => {
		const token = localStorage.getItem("auth_token");
		console.log(token);
		if (!token) {
			navigate("/login");
		}
	}, []);

	return <>This is the Home Page made by AR</>;
}

export default Home;