import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import LogIn from "./Pages/LogIn";
import SignUp from "./Pages/SignUp";

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element = {<Home></Home>}/>
        <Route path="/login" element = {<LogIn></LogIn>}/>
        <Route path="/signup" element = {<SignUp></SignUp>}/>
      </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
