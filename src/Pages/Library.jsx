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
                <h1>Library Page</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="subject">Subject:</label>
                    <input 
                        type="text" 
                        name="subject" 
                        id="subject" 
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter a subject"
                    />
                    <button type="submit">Submit</button>
                </form>

                {/* Display the books here.. */}
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
                                {/* Optional: Display the author */}
                                {/* {book.author_name && <p className="author">Author: {book.author_name.join(', ')}</p>} */}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
