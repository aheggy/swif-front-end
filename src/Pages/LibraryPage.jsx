import UserSidebar from "../Components/UserSidebar";
import "./SubjectPage.css";
import "../assets/css/animatedImageCard.css";

// We can activate this component by usin the route:   <Route path="/librarypage" element={<LibraryPage />}/>
// in the App.js file

import { useEffect } from "react";

const LibraryPage = () => {
	useEffect(() => {
		document.title = "Library Page";
	}, []);

	const categories = [
		{
			id: 1,
			name: "Art & Architecture Studies",
			img:
				"https://drive.google.com/uc?id=1b0du647uPpcgQS4zdTQ9W9S4_lBXoLuN",
		},
		{
			id: 2,
			name: "Science Studies",
			img:
				"https://drive.google.com/uc?id=1gF85Jw0XpjnqHSz4RR-RxzYXxn_LzbVX",
		},
		{
			id: 3,
			name: "Math Studies",
			img:
				"https://drive.google.com/uc?id=17aJQOA0GGYJ2Jd8EddB9oBlbZFRlc7uC",
		},
		{
			id: 4,
			name: "Biology Studies",
			img:
				"https://drive.google.com/uc?id=1o5fjK3fO_T88a3QpyJkGCk7B-lcdaaqE",
		},
		{
			id: 5,
			name: "Education",
			img:
				"https://drive.google.com/uc?id=1OF0xKB3TJMBzv283QIlPDoDiU20UIn0N",
		},
		{
			id: 6,
			name: "Languages",
			img:
				"https://drive.google.com/uc?id=1U_YaqCqTYJMayqtUTHYMXus477t2rjqb",
		},
		{
			id: 7,
			name: "Political Affairs",
			img:
				"https://drive.google.com/uc?id=1WP_H5q6V4t-KayMhXVk-by6Uzd3WmlBg",
		},
		{
			id: 8,
			name: "Culinary Arts",
			img:
				"https://drive.google.com/uc?id=1UisUoNa51Fg6Q9y7e4aybwMXA4aCHzU0",
		},
		{
			id: 9,
			name: "Sports",
			img:
				"https://drive.google.com/uc?id=1tE5Y9TUT5oEmC0KySvRNjyAaVZsl4EGJ",
		},
		{
			id: 10,
			name: "History Studies",
			img:
				"https://drive.google.com/uc?id=110DwJ1LCOsAYvaHwB1A6-Ej1xGDxaWPm",
		},
	];

	return (
		<div>
			<div className="subjectpage-container">
				<UserSidebar></UserSidebar>
				<section className="subjectpage-content">
					<h2>Library Page</h2>
					<div className="subjects-container">
						{categories.map((category) => {
							return (
								<div className="subject" key={category.id}>
									<a className="card_image" href={"/library/"+category.name}>
										<div className="circle">
											<div className="img">
												<img
													src={category.img}
													alt=""
												/>
											</div>
										</div>
										<p>{category.name}</p>
									</a>
								</div>
							);
						})}
					</div>
				</section>
			</div>
		</div>
	);
};

export default LibraryPage;
