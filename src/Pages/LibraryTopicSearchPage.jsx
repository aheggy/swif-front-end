import UserSidebar from "../Components/UserSidebar";
import "./SubjectPage.css";
import "../assets/css/animatedImageCard.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCompletionAxios } from "../utilities/OpenAI/API";

// We can activate this component by usin the route:   <Route path="/library/:topic" element={<LibraryTopicSearchPage />}/>
// in the App.js file

function LibraryTopicSearchPage() {
	const { topic } = useParams();
	const [StudyGuide, setStudyGuide] = useState("");
	useEffect(() => {
		getCompletionAxios(topic).then((res) => {
			if (res) {
				setStudyGuide(res.data.choices[0].text);
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<div className="subjectpage-container">
				<UserSidebar></UserSidebar>
				<section className="library-search-content">
					<h2>Learn {topic}</h2>
					<div className="library-search-container">
						{StudyGuide.split(";").map((text) => {
							return (
								<>
									<p>{text}</p>
									<br />
								</>
							);
						})}
					</div>
				</section>
			</div>
		</div>
	);
}

export default LibraryTopicSearchPage;
