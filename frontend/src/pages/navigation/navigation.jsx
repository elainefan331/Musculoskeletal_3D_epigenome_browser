import { NavLink } from "react-router-dom";
import "./navigation.css"
const Navigation = () => {
    return (
        <nav className="nav-bar">
            <NavLink className="nav-bar-link" to="/">
                Home
            </NavLink>
            <NavLink className="nav-bar-link">
                About
            </NavLink>
            <NavLink className="nav-bar-link">
                Contact
            </NavLink>
            <span className="nav-bar-link">
                <i className="fa-brands fa-github" style={{ color: 'rgb(105, 134, 184)', fontSize: "18px" }}></i>
                <a rel='noreferrer' target="_blank" href="https://github.com/elainefan331/Musculoskeletal_3D_epigenome_browser">Repo</a>
            </span>

        </nav>
    )
}

export default Navigation;