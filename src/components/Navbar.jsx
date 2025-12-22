import React, { useContext } from "react";
import logo from "../assets/logo2-removebg-preview.png";
import { Link, NavLink } from "react-router";
import "../App.css";
import AuthContext from "../providers/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout()
            .then(() => console.log("Logged out"))
            .catch((err) => console.error(err));
    };

    return (
        <div className="navbar bg-base-100 shadow-sm px-4">
            {/* LEFT SECTION */}
            <div className="navbar-start">
                {/* MOBILE MENU */}
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </div>

                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
                    >
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/all-contest">All Contests</NavLink></li>
                        <li><NavLink to="/extra">Extra Section</NavLink></li>
                        <li><NavLink to="/extra">Extra Section</NavLink></li>
                    </ul>
                </div>

                {/* LOGO + WEBSITE NAME */}
                <Link to="/" className="flex items-center gap-2">
                    <img src={logo} className="h-10 w-10 md:h-16 md:w-16 object-contain" />
                    <span className="text-xl font-bold hidden md:block">
                        My Website
                    </span>
                </Link>
            </div>

            {/* CENTER MENU (DESKTOP) */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 text-lg">
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/all-contest">All Contests</NavLink></li>
                    <li><NavLink to="/extra">Extra Section</NavLink></li>
                    <li><NavLink to="/leaderboard">LeaderBoard</NavLink></li>
                    <li><NavLink to="/top-creators">TopCreators</NavLink></li>
                    <li><NavLink to="/upcoming">UpcomingContests</NavLink></li>
                </ul>
            </div>

            {/* RIGHT SECTION */}
            <div className="navbar-end gap-3">

                {/* If NOT logged in → show Login / Register */}
                {!user && (
                    <>
                        <Link to="/login" className="btn btn-neutral">Login</Link>
                        <Link to="/register" className="btn">Register</Link>
                    </>
                )}

                {/* If logged in → show Profile Image + Dropdown */}
                {user && (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="w-12 h-12 rounded-full border-2 overflow-hidden">
                            <img
                                src={user.photoURL || "https://i.ibb.co/sjYvMbZ/user.png"}
                                className="w-full h-full object-cover"
                                alt="User"
                            />
                        </div>

                        <ul
                            tabIndex={0}
                            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                        >
                            <li className="text-center font-bold text-lg py-2">
                                {user.displayName || "User"}
                            </li>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li><button onClick={handleLogout}>Logout</button></li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
