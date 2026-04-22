import React, { useContext, useEffect, useState } from "react";
import logo from "../assets/logo2-removebg-preview.png";
import { Link, NavLink } from "react-router";
import AuthContext from "../providers/AuthContext";
import ThemeContext from "../providers/ThemeContest";
import { motion } from "framer-motion";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const isDark = theme === "dark";
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout()
            .then(() => console.log("Logged out"))
            .catch(err => console.error(err));
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-50 bg-[var(--glass-bg)] backdrop-blur-xl border-b border-[var(--glass-border)] shadow-[var(--shadow-light)]"
        >
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* LEFT - Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-3 group">
                            <motion.img
                                src={logo}
                                className="h-10 w-10"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            />
                            <span className="text-xl font-semibold hidden md:block bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                                ContestHub
                            </span>
                        </Link>
                    </div>

                    {/* CENTER - Navigation Links */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {[
                            { to: "/", label: "Home" },
                            { to: "/all-contest", label: "All Contests" },
                            { to: "/leaderboard", label: "Leaderboard" },
                            { to: "/top-creators", label: "Top Creators" },
                            { to: "/upcoming", label: "Upcoming" }
                        ].map((item, index) => (
                            <motion.div
                                key={item.to}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                            isActive
                                                ? "bg-[var(--accent-primary)] text-white shadow-[var(--shadow-medium)]"
                                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-accent)]"
                                        }`
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            </motion.div>
                        ))}
                    </div>

                    {/* RIGHT - Auth & Theme */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <motion.button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-accent)] transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {isDark ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </motion.button>

                        {!user ? (
                            <>
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Link to="/login" className="btn-secondary">
                                        Login
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Link to="/register" className="btn-modern">
                                        Register
                                    </Link>
                                </motion.div>
                            </>
                        ) : (
                            <div className="dropdown dropdown-end">
                                <motion.div
                                    tabIndex={0}
                                    role="button"
                                    className="w-10 h-10 rounded-full border-2 border-[var(--border-medium)] overflow-hidden cursor-pointer"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <img
                                        src={user.photoURL || "https://i.ibb.co/sjYvMbZ/user.png"}
                                        className="w-full h-full object-cover"
                                        alt="User avatar"
                                    />
                                </motion.div>

                                <motion.ul
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="dropdown-content menu p-2 shadow-[var(--shadow-heavy)] bg-[var(--bg-secondary)] rounded-xl w-56 border border-[var(--border-light)] mt-2"
                                >
                                    <li className="px-4 py-3 text-center font-semibold text-[var(--text-primary)] border-b border-[var(--border-light)]">
                                        {user.displayName || "User"}
                                    </li>

                                    <li>
                                        <Link to="/dashboard" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-accent)] px-4 py-2 rounded-lg">
                                            Dashboard
                                        </Link>
                                    </li>

                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg w-full text-left"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </motion.ul>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-accent)]"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="lg:hidden border-t border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl"
                >
                    <div className="px-4 py-4 space-y-2">
                        {[
                            { to: "/", label: "Home" },
                            { to: "/all-contest", label: "All Contests" },
                            { to: "/leaderboard", label: "Leaderboard" },
                            { to: "/top-creators", label: "Top Creators" },
                            { to: "/upcoming", label: "Upcoming" }
                        ].map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `block px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                        isActive
                                            ? "bg-[var(--accent-primary)] text-white"
                                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-accent)]"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
};

export default Navbar;
