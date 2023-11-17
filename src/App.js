import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';



import Home from "./Pages/Home.jsx"
import NavBar from "./Components/NavBar"
import MessagePage from "./Components/MessagePage"
import Login from "./Pages/LogIn"
import SignUp from './Pages/SignUp';
import SignedOut from './Pages/SignedOut.jsx';
import UserPage from './Pages/UserPage.jsx';



function App() {

  const [isLoggedIn, setIsLoggedIn] = useState("")

  return (
    <div className="App">
      <Router>
        <NavBar/>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/message" element={<MessagePage />}/>
            <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}/>
            <Route path="/signup" element={<SignUp isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}/>
            <Route path="/signedout" element={<SignedOut />}/>
            <Route path="/userpage" element={<UserPage />}/>
          </Routes>
      </Router>
      
    </div>
  );
}

export default App;
