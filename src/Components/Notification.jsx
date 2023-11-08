import React, { useEffect, useState } from "react";
import "./Notification.css";

const Notification = ({ error, seterror, text, color }) => {
	const [progress, setProgress] = useState(100);

	useEffect(() => {
		if (error) {
            setProgress(100)
			const timer = setInterval(() => {
				setProgress((prevProgress) => prevProgress - 2);
			}, 100);

			const timeout = setTimeout(() => {
				seterror(false);
				clearInterval(timer);
			}, 5000);
			return () => {
				clearInterval(timer);
				clearTimeout(timeout);
			};
		}
	}, [error, seterror]);

	return (
		<div className="notification-container">
			<div
				className="notification"
				style={{
					backgroundColor: color,
					display: error ? "block" : "none",
				}}
			>
				{text}
			</div>
			<div
				className="progress-bar"
				style={{
					width: `${progress}%`,
					display: error ? "block" : "none",
				}}
			></div>
		</div>
	);
};

export default Notification;