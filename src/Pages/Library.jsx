import React, { useState } from "react";
import axios from "axios";
import UserSidebar from "../Components/UserSidebar";
import "./Library.css";

export default function Library() {
    const [subject, setSubject] = useState("");
    const [data, setData] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const query = subject.trim().replace(/\s+/g, '+');

        try {
            const response = await axios.get(
                `https://openlibrary.org/search.json?q=${query}`
            );
            console.log(response.data);
            setData(response.data.docs); 
        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]);
        }
    };

    return (
        <div className="library-container">
            <UserSidebar />
            <div className="library-content">
                <div className="search_container">
                <h2>Library Page</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="subject"></label>
                    <input 
                        className="subject_search_field"
                        type="text" 
                        name="subject" 
                        id="subject" 
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter a subject"
                    />
                    <button type="submit">Submit</button>
                </form>
                </div>

                {/* Display the books here.. */}
                <div className="book-cards">
                {data.length > 0 && (
                    <div className="books-list">
                        {data.map((book, index) => (
                            <a 
                                key={index} 
                                className="book-item" 
                                href={`https://openlibrary.org${book.key}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                {book.cover_i && <img src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`} alt={book.title} />}
                                <p className="title">{book.title}</p>
                            </a>
                        ))}
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}
