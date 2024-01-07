import UserSidebar from "../Components/UserSidebar"
import "./Library.css"
import { useState } from "react"
import axios from "axios"

export default function Library () {

    const [subject, setSubject] = useState("")
    const [data, setData] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Use the subject state in the query
        const query = subject.trim().replace(/\s+/g, '+');

        try {
            const response = await axios.get(
                `https://openlibrary.org/search.json?q=${query}`
            );
            console.log(response.data);
            setData(response.data.docs); // I might need to adjust this.
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="library-container">
            <UserSidebar />
            <div className="library-content">
                <h1>Library page</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="subject">Subject:</label>
                    <input 
                        placeholder="Enter a subject"
                        type="text" 
                        name="subject" 
                        id="subject" 
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                    <button type="submit">Submit</button>
                </form>

                {/* Display the books here */}
                {data && data.map((book, index) => (
                    <div key={index}>
                        <h3>{book.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    )
}
