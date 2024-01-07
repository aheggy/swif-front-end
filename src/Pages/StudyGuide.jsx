import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import UserSidebar from "../Components/UserSidebar";
import "./StudyGuide.css";
import "../assets/css/animatedImageCard.css";
import { getCompletionAxios } from "../utilities/OpenAI/API";

const StudyGuide = () => {
    const location = useLocation();
    const [topic, setTopic] = useState('');
    const [studyGuide, setStudyGuide] = useState('');
    const [studyDays, setStudyDays] = useState(60); // default value
    const [hoursPerDay, setHoursPerDay] = useState(1); // default value
    const [curriculumLevel, setCurriculumLevel] = useState('Beginner'); // default value
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        document.title = "Study Guide";
    }, []);

    useEffect(() => {
        if (location.pathname === '/studyguide') {
            setStudyGuide('');
            setIsSubmitted(false);
            
        }
    }, [location]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        if (topic) {
            getCompletionAxios(topic, studyDays, hoursPerDay, curriculumLevel).then((res) => {
                if (res) {
                    const formattedGuide = res.data.choices[0].text.replace(/;/g, '\n');
                    setStudyGuide(formattedGuide);
                }
            }).catch(()=>{
                setIsSubmitted(false);
            });
        } 
    };

    
    return (
        <div className="studyguide-container">
            <UserSidebar />
            <section className="studyguide-content">
            {!isSubmitted ? (
                <div>
                <h2>Generate Your Custom Study Guide</h2>
                <form className='curriculum-form' onSubmit={handleSubmit}>
                    <label htmlFor="topic">Topic:</label>
                    <input 
                        id="topic"
                        type="text" 
                        value={topic} 
                        onChange={(e) => setTopic(e.target.value)} 
                        placeholder="Enter the topic you want to study" 
                        required
                    />

                    <label htmlFor="curriculumLevel">Curriculum Level:</label>
                    <select 
                        id="curriculumLevel"
                        value={curriculumLevel} 
                        onChange={(e) => setCurriculumLevel(e.target.value)}
                    >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>

                    <button type="submit" disabled={isSubmitted}>
                        {isSubmitted ? "Submitted" : "Submit"}
                    </button>
                </form>
                </div>
                ) : (
                studyGuide && (
                    <>
                        <h3>Your {topic.toUpperCase()} Study Guide</h3>
                        <div className="study-search-container">
                            <pre>{studyGuide}</pre>
                        </div>
                    </>
                
                    )
                )}
            </section>
        </div>
    );
};

export default StudyGuide;
