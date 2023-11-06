import logo from "../assets/test.jpg"

function MainLayout({ children }) {
	return (
		<div className="main-content">
			<header className="p-2 d-row d-flex align-items-center">
                <img src={logo} alt="logo" className="logo rounded" />
                <p className="m-0 app-name mx-2">
                    <span>S</span>
                    wif
                </p>
            </header>

			<main>{children}</main>

			<footer className="p-3">this is the footer</footer>
		</div>
	);
}

export default MainLayout;