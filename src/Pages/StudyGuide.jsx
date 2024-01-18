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
    // const [studyDays, setStudyDays] = useState(60); // default value
    // const [hoursPerDay, setHoursPerDay] = useState(1); // default value
    const [curriculumLevel, setCurriculumLevel] = useState('Beginner'); // default value
    const [isSubmitted, setIsSubmitted] = useState(false);

    const prohibitedTerms = [
        'kill', 'murder', 'assassinate', 'suicide', 'self-harm', 'self-injury', 'overdose', 
        'poison', 'bomb', 'explosive', 'terrorist', 'militant', 'extremist', 'radicalize', 
        'hijack', 'kidnap', 'abduct', 'torture', 'maim', 'massacre', 'arson', 'lynch', 
        'genocide', 'ethnic cleansing', 'chemical weapon', 'biological weapon', 'nuclear bomb', 
        'sabotage', 'anarchy', 'coup', 'shoot', 'stab', 'terrorize', 'hostage', 'warfare', 
        'guerrilla', 'insurgent', 'rebel', 'jihad', 'sniper', 'assault', 'strangle', 'vandalize', 
        'riot', 'loot', 'pillaging', 'cyberattack', 'hacking', 'fraud', 'theft', 'smuggle', 
        'trafficking', 'blackmail', 'extortion', 'spy', 'espionage', 'sedition', 'treason', 
        'radicalism', 'subversion', 'rebellion', 'insurrection', 'revolution', 'overthrow', 
        'destructive', 'annihilate', 'decimate', 'wreak havoc', 'ravage', 'devastate', 'infiltrate', 
        'undermine', 'subjugate', 'intimidate', 'threaten', 'menace', 'coerce', 'molest', 'abuse', 
        'harass', 'stalk', 'persecute', 'oppress', 'enslave', 'torturous', 'malicious', 'malevolent', 
        'nefarious', 'vile', 'sinister', 'dastardly', 'cruel', 'brutal', 'barbaric', 'sadistic', 
        'heinous', 'atrocious', 'monstrous', 'diabolical', 'fiendish', 'vicious', 'savage', 'ruthless'
    ];



    useEffect(() => {
        document.title = "SWIF - Study Guide";
    }, []);

    useEffect(() => {
        if (location.pathname === '/studyguide') {
            setStudyGuide('');
            setIsSubmitted(false);
            
        }
    }, [location]);


    // Function to check if a string contains any of the prohibited terms
    function containsProhibitedTerms(inputString) {
        return prohibitedTerms.some(term => 
            inputString.toLowerCase().includes(term.toLowerCase())
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (containsProhibitedTerms(topic)) {
            alert('Your topic contains prohibited words. Please remove them and try again.');
            return; // Prevent form submission
        }
        
        setIsSubmitted(true);
        if (topic) {
            getCompletionAxios(topic, curriculumLevel).then((res) => {
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
                <div className="instruction-container">
                    Enter any subject and generate a study guide below. This study guide will tell you what materials you will need to study, as well give you a specific breakdown and timeline.
                </div>
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
                        {isSubmitted ? "Submitted" : "Generate"}
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
