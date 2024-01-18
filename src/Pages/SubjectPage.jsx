import {useState, useEffect } from "react";
import UserSidebar from "../Components/UserSidebar";
import axios from "axios";
import "./SubjectPage.css";
import "../assets/css/animatedImageCard.css";

const API = process.env.REACT_APP_API_URL;


const SubjectPage = ({currentUsername}) => {

	const [subjects, setSubjects] = useState([])

	useEffect (()=>{
		document.title = "SWIF - Subjects";
	})
	
	useEffect (() => {
		const fetchSubjects = async () =>{
			try {
				const response = await axios.get(`${API}/subjects`)
				setSubjects(response.data)
			} catch (error) {
				console.error(`Error fetching subjects`, subjects)
			}
		}
		fetchSubjects()
	}, [])


	return (
		<div>
			<div className="subjectpage-container">
				<UserSidebar currentUsername={currentUsername}/>
				<section className="subjectpage-content">
					{/* <h2>Subjects</h2> */}
					<div className="subject-instruction-container">
						Choose a subject to see other SWIF users who are also studying it.
					</div>
					{/* <div className="subject-instruction-container">
						Select a subject to see what other SWIF users are studying this same subject.
					</div> */}
					<div className="subjects-container">
						{subjects.map((subject) => {
							return (
								<div className="subject" key={subject.subject_id}>
									<a className="card_image" href={`/people?subjectName=${encodeURIComponent(subject.subject_name)}`}>
										<div className="circle">
											<div className="subject_icon">
												<img src={subject.icon_url} alt="" />
											</div>
										</div>
										<p>{subject.subject_name}</p>
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

export default SubjectPage;
