import UserSidebar from "../Components/UserSidebar";
import "./SubjectPage.css";
import "../assets/css/animatedImageCard.css";

// We can activate this component by usin the route:   <Route path="/subjectpage" element={<SubjectPage />}/>
// in the App.js file

import { useEffect } from "react";

const SubjectPage = () => {
	useEffect(() => {
		document.title = "Subject Page";
	}, []);

	const subjects = [
		{
			id: 1,
			subject: "Life Skills and Personal Development",
			img:
				"https://drive.google.com/uc?id=1Nqq8wSCEmgiDntZCHdLGE96k8JWt77Cm",
			topics: [
				"Time Management",
				"Stress Management",
				"Goal Setting and Achievement",
				"Financial Literacy",
				"Relationship and Communication Skills",
			],
		},
		{
			id: 2,
			subject: "Science and Technology",
			img:
				"https://drive.google.com/uc?id=1zXoNOWdE7fw6X6-kejGPcLqhYkyW5ESK",
			topics: [
				"Robotics and AI",
				"Data Science and Machine Learning",
				"Astronomy and Space Exploration",
				"Environmental Science",
			],
		},
		{
			id: 3,
			subject: "Social and Cultural Studies",
			img:
				"https://drive.google.com/uc?id=1FcqLxWNpE5LeF4KiEOYpr5XO3QvzI7v9",
			topics: [
				"Sociology",
				"Anthropology",
				"Religion and Ethics",
				"Philosophy",
				"Gender and Sexuality",
			],
		},
		{
			id: 4,
			subject: "Health and Wellness",
			img:
				"https://drive.google.com/uc?id=1HWRPIfbxBWpIl9354lNBwbuWl1wDzN0K",
			topics: [
				"Nutrition and Healthy Eating",
				"Yoga and Meditation",
				"Exercise and Physical Activity",
				"Mental and Emotional Health",
			],
		},
		{
			id: 5,
			subject: "Current Events and News",
			img:
				"https://drive.google.com/uc?id=1OMhPVqrrsfPqJ1_7iofdmSiF8cKLNVAo",
			topics: [
				"Politics and Government",
				"Economics and Finance",
				"Media and Journalism",
				"History and Culture",
			],
		},
		{
			id: 6,
			subject: "Academic Subjects",
			img:
				"https://drive.google.com/uc?id=15ejf7M2bV1ZONQgdZJ1-SAz2ejv4bofx",
			topics: [
				"Mathematics" ,
				"Science (Physics, Chemistry, Biology)",
				"History" ,
				"Literature" ,
				"Foreign Languages" ,
				"Computer Science and Programming" ,
				"Economics" ,
				"Psychology" 
			],
		},
		{
			id: 7,
			subject: "Test Preparation",
			img:
				"https://drive.google.com/uc?id=1Pl3Iv1a-zVigi-wqcEa8a11V2W8puSbW",
			topics: [
				"SAT/ACT preparation",
				"GRE/GMAT preparation" ,
				"LSAT/MCAT preparation" ,
				"Professional certification exams (e.g., CPA, CFA)" 
			],
		},
		{
			id: 8,
			subject: "Skill Development",
			img:
				"https://drive.google.com/uc?id=1qdkUTn6GIncdTynyshV6d9rjc3SKexmf",
			topics: [
				"Coding and Programming" ,
				"Graphic Design" ,
				"Writing and Creative Writing" ,
				"Public Speaking and Communication" ,
				"Music and Musical Instruments" ,
				"Cooking and Culinary Arts",
				"Fitness and Yoga" 
			],
		},
		{
			id: 9,
			subject: "Hobbies and Interests",
			img:
				"https://drive.google.com/uc?id=1zOG-_qSA9ToI11hSBYjjLP8_tpi8bWK3",
			topics: [
				"Photography" ,
				"Art and Drawing" ,
				"Gaming" ,
				"Gardening" ,
				"DIY Projects" ,
				"Creative Writing" ,
				"Fashion and Design" ,
				"Film and Media Studies" 
			],
		},
		{
			id: 10,
			subject: "Career and Professional Development",
			img:
				"https://drive.google.com/uc?id=1b4eD0eKmQYO0kYF38ISSBsIWSoLzJ-4a",
			topics: [
				"Resume Building and Interview Preparation" ,
				"Leadership and Management Skills" ,
				"Project Management" ,
				"Entrepreneurship and Business" ,
				"Marketing and Social Media Strategy",

			],
		},
	];

	return (
		<div>
			<div className="subjectpage-container">
				<UserSidebar></UserSidebar>
				<section className="subjectpage-content">
					<h2>Subject Page</h2>
					<div className="subjects-container">
						{subjects.map((subject) => {
							return (
								<div className="subject" key={subject.id}>
									<a className="card_image" href="/people">
										<div className="circle">
											<div className="img">
												<img src={subject.img} alt="" />
											</div>
										</div>
										<p>{subject.subject}</p>
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
