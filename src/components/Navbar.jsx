import React, { useContext } from "react";
import logo from "../assets/logo2-removebg-preview.png";
import { Link, NavLink } from "react-router";
import AuthContext from "../providers/AuthContext";
import ThemeContext from "../providers/ThemeContest";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);

    const handleLogout = () => {
        logout()
            .then(() => console.log("Logged out"))
            .catch(err => console.error(err));
    };

    return (
        <div className="navbar bg-base-100 shadow-sm px-4">
            {/* LEFT */}
            <div className="navbar-start">
                <Link to="/" className="flex items-center gap-2">
                    <img src={logo} className="h-10 w-10 md:h-16 md:w-16" />
                    <span className="text-xl font-bold hidden md:block">
                        My Website
                    </span>
                </Link>
            </div>

            {/* CENTER */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 text-lg">
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/all-contest">All Contests</NavLink></li>
                    <li><NavLink to="/leaderboard">Leaderboard</NavLink></li>
                    <li><NavLink to="/top-creators">Top Creators</NavLink></li>
                    <li><NavLink to="/upcoming">Upcoming</NavLink></li>
                </ul>
            </div>

            {/* RIGHT */}
            <div className="navbar-end gap-3">
                {!user && (
                    <>
                        <Link to="/login" className="btn btn-neutral">Login</Link>
                        <Link to="/register" className="btn">Register</Link>
                    </>
                )}

                {user && (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button"
                            className="w-12 h-12 rounded-full border-2 overflow-hidden"
                        >
                            <img
                                src={user.photoURL || "https://i.ibb.co/sjYvMbZ/user.png"}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li className="text-center font-bold text-lg py-2">
                                {user.displayName || "User"}
                            </li>

                            <li>
                                <Link to="/dashboard">Dashboard</Link>
                            </li>

                            {/* 🌙 THEME TOGGLE */}
                            <li>
                                <button onClick={toggleTheme}>
                                    {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
                                </button>
                            </li>

                            <li>
                                <button onClick={handleLogout}>Logout</button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
