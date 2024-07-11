import React, { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { BsFillCartFill } from "react-icons/bs";
import { IoMdSettings, IoMdNotifications } from "react-icons/io";
import { SlNote } from "react-icons/sl";
import logo from '../assets/logo_c.png';
import { CiLogout } from "react-icons/ci";
import { MdFeedback } from "react-icons/md";
import { BiSolidLogOut } from "react-icons/bi";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  
    doSignOut,
  } from "../config/auth";


import { FaRegUserCircle, FaCalendarAlt, FaUserEdit, FaHome } from "react-icons/fa";
import "./navbar.css";

const Navbar = () => {
    const [nav, setNav] = useState(false);
    const [showProfileCard, setShowProfileCard] = useState(false);
    const navigate = useNavigate();
    const Logout = async () => {
        const signedOut = await doSignOut();
        console.log("signed out");
        navigate("/login");
        /*if (signedOut) {
            console.log(signedOut);
          navigate("/login");
        }*/
      };


    const menuItems = [
        { icon: <FaHome size={25} className="mr-4" />, text: "Dashboard" },
        { icon: <FaCalendarAlt size={25} className="mr-4" />, text: "Calendar" },
        { icon: <SlNote size={25} className="mr-4" />, text: "Reservation" },
        { icon: <FaUserEdit size={25} className="mr-4" />, text: "Profile"  },
        { icon: <CiLogout size={25} className="mr-4" />, text: "Logout" , handleClick: Logout },
        { icon: <IoMdSettings size={25} className="mr-4" />, text: "Settings" },
    ];

    const toggleProfileCard = () => {
        setShowProfileCard(!showProfileCard);
    };
  
    return (
        <div className="navbar-container">
            {/* Left side */}
            <div className="navbar-left">
                <div onClick={() => setNav(!nav)} className="navbar-toggle">
                    <AiOutlineMenu size={25} />
                </div>

                <h1 className="navbar-logo text-2xl sm:navbar-logo-sm lg:navbar-logo-lg">
                    <span className="font-bold">EASY</span>
                </h1>
            </div>

            <div className="profile-icons">
                <IoMdSettings size={30} />
                <IoMdNotifications size={30} />
                <FaRegUserCircle size={30} onClick={toggleProfileCard} />
                {showProfileCard && (
                    <div className="profile-card">
                        <div className="profile-card-header">
                            <FaRegUserCircle size={50} />
                            <h3>lamia belhadj</h3>
                            <p className="email">lamia.belhadjsghaier@insat.ucar.tn</p>
                        </div>
                        <div className="profile-card-body">
                          
                        <button className="profile-card-button">
  <FaUserEdit className="button-icon" size={15} /> Your Profile
</button>

<button className="profile-card-button">
  <MdFeedback className="button-icon" size={15} /> Give feedback
</button>

<button className="profile-card-button" onClick={Logout}>
  <BiSolidLogOut className="button-icon" size={15} /> Logout
</button>

                        </div>
                    </div>
                )}
            </div>

            {/* Cart button */}
            <button className="navbar-cart-button md:navbar-cart-button-md">
                <BsFillCartFill size={20} className="mr-2" /> Cart
            </button>

            {/* Mobile Menu */}
            <div className={nav ? "navbar-drawer" : "navbar-drawer navbar-drawer-hidden"}>

            
                <AiOutlineClose onClick={() => setNav(!nav)} size={30} className="navbar-close-icon" />
                <div className="top">
                    <h2 className="navbar-header">
                        <div>
                            <span className="navbar-name font-bold">EASY</span>
                            <span className="navbar-name font-fine">Escapce Accessible et Système de Réservation</span>
                        </div>
                        <div className="navbar-separator"></div>
                        <img src={logo} alt="Logo" className="navbar-logo-image" />
                    </h2>
                </div>
                <nav>
                    <ul className="navbar-menu">
                        {menuItems.map(({ icon, text, handleClick }, index) => (
                            <div key={index} className="py-4">
                                <li className="navbar-menu-item" onClick={handleClick}>
                                    {icon} {text}
                                </li>
                            </div>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Navbar;
