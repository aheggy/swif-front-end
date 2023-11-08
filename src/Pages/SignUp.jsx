import { useNavigate } from "react-router-dom";
import googleIcon from "../assets/google.png";
import facebokIcon from "../assets/facebook.png";
import linkedinIcon from "../assets/linkedin.png";
import "./SignUp.css";
import { useEffect, useState } from "react";
import Notification from "../Components/Notification";
import api from "../api/Api";

function SignUp({ setIsLoggedIn, isLoggedIn }) {
	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		country: "",
		email: "",
		password: "",
		password_c: "",
	});

	const [error, setError] = useState(false);
	const [text, setText] = useState("");

	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formData);
		if (
			formData["first_name"] &&
			formData["last_name"] &&
			formData["country"] &&
			formData["email"] &&
			formData["password_c"]
		) {
			if (formData["password_c"] === formData["password"]) {
				api.post("/signup", formData).then((res)=>{
                    navigate("/login");
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
				setText("Passwords do not match");
			}
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
			<div className="background-sign-up">
				<div className="form-login">
					<div className="card">
						<div className="card-header">Sign Up</div>
						<div className="card-body">
							<form onSubmit={handleSubmit}>
								<div className="form-group row mb-2">
									<label
										htmlFor="firt-name"
										className="col-4 col-form-label"
									>
										First Name
									</label>
									<div className="col-8">
										<div className="input-group">
											<input
												id="firt-name"
												name="first_name"
												placeholder="First Name"
												type="text"
												className="form-control"
												onChange={handleChange}
											/>
										</div>
									</div>
								</div>
								<div className="form-group row mb-2">
									<label
										htmlFor="last-name"
										className="col-4 col-form-label"
									>
										Last Name
									</label>
									<div className="col-8">
										<div className="input-group">
											<input
												id="last-name"
												name="last_name"
												placeholder="Last Name"
												type="text"
												className="form-control"
												onChange={handleChange}
											/>
										</div>
									</div>
								</div>
								<div className="form-group row mb-2">
									<label
										htmlFor="country"
										className="col-4 col-form-label"
									>
										Country
									</label>
									<div className="col-8">
										<div className="input-group">
											<input
												id="country"
												name="country"
												placeholder="Country"
												type="text"
												className="form-control"
												onChange={handleChange}
											/>
										</div>
									</div>
								</div>
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

								<div className="form-group row mb-2">
									<label
										htmlFor="password-c"
										className="col-4 col-form-label"
									>
										Confirm Password
									</label>
									<div className="col-8">
										<div className="input-group">
											<input
												id="password-c"
												name="password_c"
												placeholder="Confirm Password"
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
										Sign Up
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
										onClick={() => navigate("/login")}
									>
										Already have an account?
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

export default SignUp;
