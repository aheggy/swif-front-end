import { useEffect } from "react";
import image1 from "../assets/img/error-404-alert.png";
import image2 from "../assets/img/error-404-art.png";


const NotFound = () => {
	useEffect(() => {
		document.title = "Error";
	}, []);
	return (
		<div
			className="e404-container"
			style={{
				display: "flex",
				alignItems: "center",
				marginTop:"100px",
				flexDirection: "column",
				justifyContent: "center",
			}}
		>
			<h2>Error 404: Page Not Found</h2>
			<p>The page you are looking for does not exist.</p>
			<div style={{ display: "flex", justifyContent: "center" }}>
				<img
					src={image1}
					alt="Imagen 1"
					style={{ marginRight: "10px", width: "200px" }}
				/>
				<img
					src={image2}
					alt="Imagen 2"
					style={{ marginLeft: "10px", width: "200px" }}
				/>
			</div>
		</div>
	);
};

export default NotFound;
