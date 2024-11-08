import { NavLink } from "react-router-dom";
import "./navigation.css"
const Navigation = () => {
    return (
        <div className="logo-nav-container">
            <div className="logo-home-container">
                <img src="/dnalogo.png" alt="logo" style={{height: '50px', width: '50px'}}></img>
                <NavLink to="/" className="home-link">
                    MSK 3D Epigenome Browser
                </NavLink>
            </div>
        <nav className="nav-bar">
            <NavLink className="nav-bar-link" to="/about">
                About
            </NavLink>
            <NavLink className="nav-bar-link" to="/contact">
                Contact
            </NavLink>
            <span className="nav-bar-link">
                <i className="fa-brands fa-github" style={{ color: 'rgb(105, 134, 184)', fontSize: "18px" }}></i>
                <a rel='noreferrer' target="_blank" href="https://github.com/elainefan331/Musculoskeletal_3D_epigenome_browser">Repo</a>
            </span>

        </nav>
        </div>
    )
}

export default Navigation;