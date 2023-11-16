import "./SignOut.css";
import "../assets/css/AstronautAnimation.css";
import "../assets/css/animatedBtn.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


// We can activate this component by usin the route:   <Route path="/signout" element={<SignOut />}/>
// in the App.js file


function SignOut() {
	const navigate = useNavigate()
	const [hoveredElement, setHoveredElement] = useState(null);
	const handleHover = (event) => {
		setHoveredElement(event.target.id);
	};

	const handleMouseLeave = () => {
		setHoveredElement(null);
	};

	return (
		<div className="signout-page">
			<section className="content-sign-out">
				<div
					id="div1"
					className={`goodbye-title ${
						hoveredElement
							? hoveredElement === "div1"
								? ""
								: "blured"
							: ""
					}`}
					onMouseEnter={handleHover}
					onMouseLeave={handleMouseLeave}
				>
					<h1 id="div1" className="signout-title">
						You are signed out…see you soon
					</h1>
				</div>
				<div
					id="div2"
					className={`goodbye-msg ${
						hoveredElement
							? hoveredElement === "div2"
								? ""
								: "blured"
							: ""
					}`}
					onMouseEnter={handleHover}
					onMouseLeave={handleMouseLeave}
				>
					<p id="div2" className="signout-message">
						signout message
					</p>
					<div id="div2" className="signout-buttons">
						<button id="div2"
						onClick={
							()=>{
								navigate("/login")
							}
						}
						>
							<div id="div2" className="animated-btn">
								<div id="div2">
									<span id="div2">
										<p id="div2">Do you want to log in?</p>
										<p id="div2"></p>
									</span>
								</div>
								<div id="div2">
									<span id="div2">
										<p id="div2">Go to Login Page</p>
										<p id="div2"></p>
									</span>
								</div>
							</div>
						</button>
						<button id="div2"
						onClick={
							()=>{
								navigate("/signup")
							}
						}
						>
							<div id="div2" className="animated-btn">
								<div id="div2">
									<span id="div2">
										<p id="div2">You do not have an account?</p>
										<p id="div2"></p>
									</span>
								</div>
								<div id="div2">
									<span id="div2">
										<p id="div2">Go to Sign Up Page</p>
										<p id="div2"></p>
									</span>
								</div>
							</div>
						</button>
					</div>
				</div>
				<div
					className={`space-animation ${
						hoveredElement ? "blured" : ""
					}`}
				>
					<div className="box-of-star1">
						<div className="star star-position1"></div>
						<div className="star star-position2"></div>
						<div className="star star-position3"></div>
						<div className="star star-position4"></div>
						<div className="star star-position5"></div>
						<div className="star star-position6"></div>
						<div className="star star-position7"></div>
					</div>
					<div className="box-of-star2">
						<div className="star star-position1"></div>
						<div className="star star-position2"></div>
						<div className="star star-position3"></div>
						<div className="star star-position4"></div>
						<div className="star star-position5"></div>
						<div className="star star-position6"></div>
						<div className="star star-position7"></div>
					</div>
					<div className="box-of-star3">
						<div className="star star-position1"></div>
						<div className="star star-position2"></div>
						<div className="star star-position3"></div>
						<div className="star star-position4"></div>
						<div className="star star-position5"></div>
						<div className="star star-position6"></div>
						<div className="star star-position7"></div>
					</div>
					<div className="box-of-star4">
						<div className="star star-position1"></div>
						<div className="star star-position2"></div>
						<div className="star star-position3"></div>
						<div className="star star-position4"></div>
						<div className="star star-position5"></div>
						<div className="star star-position6"></div>
						<div className="star star-position7"></div>
					</div>
					<div data-js="astro" className="astronaut">
						<div className="head"></div>
						<div className="arm arm-left"></div>
						<div className="arm arm-right"></div>
						<div className="body">
							<div className="panel"></div>
						</div>
						<div className="leg leg-left"></div>
						<div className="leg leg-right"></div>
						<div className="schoolbag"></div>
					</div>
				</div>
			</section>
		</div>
	);
}

export default SignOut;
