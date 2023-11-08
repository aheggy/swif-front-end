import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import LogIn from "./Pages/LogIn";
import SignUp from "./Pages/SignUp";
import NavBar from "./Components/NavBar";
import { useState } from "react";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(
		!!localStorage.getItem("auth_token")
	);

	return (
		<>
			<BrowserRouter>
				<NavBar
					isLoggedIn={isLoggedIn}
					setIsLoggedIn={setIsLoggedIn}
				></NavBar>
				<main>
					<Routes>
						<Route
							path="/"
							element={
								<Home
									isLoggedIn={isLoggedIn}
									setIsLoggedIn={setIsLoggedIn}
								></Home>
							}
						/>
						<Route
							path="/login"
							element={
								<LogIn
									isLoggedIn={isLoggedIn}
									setIsLoggedIn={setIsLoggedIn}
								></LogIn>
							}
						/>
						<Route
							path="/signup"
							element={
								<SignUp
									isLoggedIn={isLoggedIn}
									setIsLoggedIn={setIsLoggedIn}
								></SignUp>
							}
						/>
					</Routes>
				</main>
			</BrowserRouter>
		</>
	);
}

export default App;
