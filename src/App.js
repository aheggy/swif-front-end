import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";


import NavBar from "./Components/NavBar";
import AppRoutes from "./Components/AppRoutes";

function App() {
  return (
      <div className="App">
        <Router>
          <NavBar />
          <AppRoutes />
        </Router>
      </div>
  );
}

export default App;
