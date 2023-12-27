import UserSidebar from "../Components/UserSidebar"
import "./Library.css"
import { useState } from "react"
import axios from "axios"
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_BOOK_API_KEY
export default function Library () {

    const [subject, setSubject] = useState("")
    const [data, setData] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Use the subject state in the query
        const query = subject.trim().replace(/\s+/g, '+');

        try {
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${GOOGLE_API_KEY}`
            );
            console.log(response.data);
            setData(response.data); // Assuming you want to store the response in state
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="library-container">
            <UserSidebar />
            <div className="library-content">
                <h1>Library page</h1>
                <form action="" onSubmit={handleSubmit}>
                    <label htmlFor="subject">Subject:</label>
                    <input 
                    placeholder="Enter a subject"
                    type="text" 
                    name="subject" 
                    id="subject" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                      
                    />
                    <button>Submit</button>
                </form>
            </div>
        </div>
    )
}