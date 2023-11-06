import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import googleIcon from "../assets/google.png";
import facebokIcon from "../assets/facebook.png";
import linkedinIcon from "../assets/linkedin.png";


function SignUp() {
    const navigate = useNavigate();
	return (
		<MainLayout>
			<div className="background-sign-up">
				<div className="mb-4 p-5 slogan">
					<p>Start your study journey with us!</p>
				</div>
				<div className="form-login">
					<div className="card">
						<div className="card-header">Sign Up</div>

						<div className="card-body">
							<form>
                            <div class="form-group row mb-2">
									<label
										for="firt-name"
										class="col-4 col-form-label"
									>
										First Name
									</label>
									<div class="col-8">
										<div class="input-group">
											<input
												id="firt-name"
												name="firt-name"
												placeholder="First Name"
												type="text"
												class="form-control"
											/>
										</div>
									</div>
								</div>
                                <div class="form-group row mb-2">
									<label
										for="last-name"
										class="col-4 col-form-label"
									>
										Last Name
									</label>
									<div class="col-8">
										<div class="input-group">
											<input
												id="last-name"
												name="last-name"
												placeholder="Last Name"
												type="text"
												class="form-control"
											/>
										</div>
									</div>
								</div>
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
		</MainLayout>
    )
}

export default SignUp