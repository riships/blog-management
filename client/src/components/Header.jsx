import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "react-bootstrap";

function Header() {
    const { logout, user } = useAuth();
    console.log(user);


    const navigate = useNavigate();
    function handleLogout() {
        const confirm = window.confirm("Are you sure you want to log out?");
        if (confirm) {
            logout();
            navigate('/login')
        }
    }

    return (
        <header className="header">
            <div className="logo">
                <Link to="/">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Laravel.svg"
                        alt="Website Logo"
                    />
                </Link>
            </div>
            <nav className="nav">
                <ul className="mb-0">
                    <li>
                        <NavLink to="/blogs" className={({ isActive }) => (isActive ? "active" : "")}>
                            Blogs
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/addBlog" className={({ isActive }) => (isActive ? "active" : "")}>
                            Add
                        </NavLink>
                    </li>
                </ul>
                {/* user profile picture */}
                <div className="user-profile">
                    <img
                        src={user?.userProfilePicture ? `${import.meta.env.VITE_MEDIA_URL}${user?.userProfilePicture}` : null}
                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                        alt="User Profile"
                    />
                </div>
                <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
            </nav>

        </header>
    );
}

export default Header;
