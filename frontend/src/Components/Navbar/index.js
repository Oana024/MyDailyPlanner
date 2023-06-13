import React, {useState} from "react";
import {PersonCircle} from "react-bootstrap-icons";
import '../../css/navbar.css';
const Navbar = () => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);


    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "http://localhost:3000";
    }

    let isAuth = false;
    if (localStorage.getItem('jwt') != null){
        const token = localStorage.getItem('jwt');
        const tokenInfo = JSON.parse(atob(token.split(".")[1]));
         if(tokenInfo.exp * 1000 > Date.now()){
             isAuth = true;
         }
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item active">
                        <a className="nav-link" href="/">Home</a>
                    </li>
                </ul>
                    {
                        !isAuth ? (
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item">
                                    <a className="nav-link" href="/sign-up">SignUp</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/login">Login</a>
                                </li>
                            </ul>
                        ) : (
                            <>
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link" href="/notes">Notes</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/tasks">Tasks</a>
                                </li>
                            </ul>
                                <ul className="navbar-nav ms-auto">
                                    <button className="button btn btn-dark btn-xl dropdown" tabIndex="0" onClick={toggleDropdown}>
                                        <PersonCircle className="btn-icon"></PersonCircle>
                                    </button>
                                    <div className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}>
                                        <a className="dropdown-item" href='/' onClick={handleLogout}>Log Out</a>
                                        <a className="dropdown-item" href="/friends">Friends</a>
                                    </div>
                                </ul>
                            </>
                        )
                    }
            </div>
        </nav>
    );
};

export default Navbar;