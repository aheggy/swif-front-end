import { useNavigate } from "react-router-dom";
import googleIcon from "../assets/google.png";
import facebokIcon from "../assets/facebook.png";
import linkedinIcon from "../assets/linkedin.png";
import "./Login.css";
import { useEffect, useState } from "react";
import Notification from "../Components/Notification";
import api from "../api/Api";

function LogIn({ setIsLoggedIn, isLoggedIn }) {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const navigate = useNavigate();
	const [error, setError] = useState(false);
	const [text, setText] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formData);
		if (formData["email"] && formData["password"]) {
			api.post("/login", formData).then((res)=>{
				console.log(res.data);
                localStorage.setItem("auth_token", res.data.token);
				setIsLoggedIn(true);
                navigate("/");
			}).catch((err) => {
				console.log(err);
				setError(true);
				let error;
				if (err.response.data.errors) {
					error =
						err.response.data.errors[0].msg +
						" " +
						err.response.data.errors[0].path;
				} else {
					if (err.response.data.error) {
						error = err.response.data.error;
					} else {
						error = err.response.data.message;
					}
				}
				setText(error);
			});
		} else {
			setError(true);
			setText("Please fill in the fields and try again");
		}
	};
	
	useEffect(() => {
		if (isLoggedIn) {
			navigate("/");
		}
	}, [isLoggedIn]);

	return (
		<>
			<Notification
				error={error}
				seterror={setError}
				text={text}
				color="#f33535"
			></Notification>
			<div className="background-sign-in">
				<div className="form-login">
					<div className="card">
						<div className="card-header">Login</div>

						<div className="card-body">
							<form onSubmit={handleSubmit}>
								<div className="form-group row mb-2">
									<label
										htmlFor="email"
										className="col-4 col-form-label"
									>
										E-mail
									</label>
									<div className="col-8">
										<div className="input-group">
											<input
												id="email"
												name="email"
												placeholder="E-mail"
												type="text"
												className="form-control"
												onChange={handleChange}
											/>
											<div className="input-group-append">
												<div className="input-group-text">
													<i className="fa fa-envelope-square"></i>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="form-group row mb-2">
									<label
										htmlFor="password"
										className="col-4 col-form-label"
									>
										Password
									</label>
									<div className="col-8">
										<div className="input-group">
											<input
												id="password"
												name="password"
												placeholder="Password"
												type="password"
												className="form-control"
												onChange={handleChange}
											/>
											<div className="input-group-append">
												<div className="input-group-text">
													<i className="fa fa-asterisk"></i>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="form-group row mb-2 px-5">
									<button
										name="submit"
										type="submit"
										className="btn page-btn"
									>
										Login
									</button>
								</div>
								<div className="line-container">
									<span className="line-text">OR</span>
									<hr className="line" />
								</div>

								<div className="d-flex d-row social-imgs">
									<img
										src={googleIcon}
										className="rounded"
										alt=""
									/>
									<img
										src={facebokIcon}
										className="rounded"
										alt=""
									/>
									<img
										src={linkedinIcon}
										className="rounded"
										alt=""
									/>
								</div>

								<div className="d-flex align-items-center justify-content-center">
									<button
										type="button"
										className="btn btn-link"
										onClick={() => navigate("/signup")}
									>
										Don't have an account?
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default LogIn;
