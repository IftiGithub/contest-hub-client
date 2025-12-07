import React from 'react';
import logo from '../assets/logo2-removebg-preview.png'
import { Link, NavLink } from 'react-router';
import '../App.css';

const Navbar = () => {
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><NavLink to={`/`}>Home</NavLink></li>
                        <li>
                            <NavLink to={`all-contest`}>All Contest</NavLink>
                        </li>
                        <li><NavLink to={`extra`}>Extra Section</NavLink></li>
                    </ul>
                </div>
                <Link to={`/`} className="btn btn-ghost h-10 w-10 md:h-20 md:w-20 rounded-full p-1">
                    <img
                        className="h-full w-full object-contain"
                        src={logo}
                        alt="Logo"
                    />
                </Link>

            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><NavLink to={`/`}>Home</NavLink></li>
                    <li>
                        <NavLink to={`all-contest`}>All Contest</NavLink>
                    </li>
                    <li><NavLink to={`extra`}>Extra Section</NavLink></li>
                </ul>
            </div>
            <div className="navbar-end gap-2">
                <Link to={`/login`} className="btn">Login</Link>
                <Link to={`/register`} className="btn">Register</Link>
            </div>
        </div>
    );
};

export default Navbar;