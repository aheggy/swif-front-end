import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import googleIcon from "../assets/google.png";
import facebokIcon from "../assets/facebook.png";
import linkedinIcon from "../assets/linkedin.png";

function LogIn() {
	const navigate = useNavigate();
	return (
		<MainLayout>
			<div className="background-sign-in">
				<div className="mb-4 p-5 slogan-login">
					<p>Let's start your worldwide study sessions!</p>
				</div>
				<div className="form-login">
					<div className="card">
						<div className="card-header">Login</div>

						<div className="card-body">
							<form>
								<div class="form-group row mb-2">
									<label
										for="email"
										class="col-4 col-form-label"
									>
										E-mail
									</label>
									<div class="col-8">
										<div class="input-group">
											<input
												id="email"
												name="email"
												placeholder="E-mail"
												type="text"
												class="form-control"
											/>
											<div class="input-group-append">
												<div class="input-group-text">
													<i class="fa fa-envelope-square"></i>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div class="form-group row mb-2">
									<label
										for="password"
										class="col-4 col-form-label"
									>
										Password
									</label>
									<div class="col-8">
										<div class="input-group">
											<input
												id="password"
												name="password"
												placeholder="Password"
												type="text"
												class="form-control"
											/>
											<div class="input-group-append">
												<div class="input-group-text">
													<i class="fa fa-asterisk"></i>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="form-group row mb-2 px-5">
									<button
										name="submit"
										type="submit"
										class="btn sign-in-btn"
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
		</MainLayout>
	);
}

export default LogIn;
