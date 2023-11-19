import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Home from "./Pages/Home.jsx"
import NavBar from "./Components/NavBar"
import MessagePage from "./Components/MessagePage"
import Login from "./Pages/LogIn"
import SignUp from './Pages/SignUp';
import { Sidebar } from './Components/SideBar'; 
import ProfilePage from './Pages/ProfilePage';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState("");

  return (
    <div className="App">
      <Router>
        {/* I'm thinking this will place the SideBar on all pages except Home, LogIn and SignUp */}
        <Route render={({ location }) => (
          !['/', '/login', '/signup'].includes(location.pathname) && 
            <Sidebar width={300} height={"100vh"}>
              {/* What other children do we need in the SideBar? */}
            </Sidebar>
        )} />

        <NavBar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/message" element={<MessagePage />}/>
          <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}/>
          <Route path="/signup" element={<SignUp isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}/>
          <Route path="/profile" element={<ProfilePage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
