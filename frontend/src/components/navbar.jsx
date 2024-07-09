import React, { useState } from "react";
import { AiOutlineMenu, AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { BsFillCartFill } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { SlNote } from "react-icons/sl";
import logo from '../assets/logo_c.png'; 
import { CiLogout } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import {  FaCalendarAlt,FaUserEdit } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";

import "./navbar.css"; 

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const menuItems = [
    { icon: <FaHome  size={25} className="mr-4" />, text: "  Dashboard" },
    { icon: < FaCalendarAlt size={25} className="mr-4" />, text: "  Calendar" },
    { icon: < SlNote size={25} className="mr-4" />, text: "Reservation" },
   
    { icon: < FaUserEdit size={25} className="mr-4" />, text: "Profile" },
    { icon: < CiLogout size={25} className="mr-4" />, text: "Logout" },
    { icon: < IoMdSettings size={25} className="mr-4" />, text: "Settings" },

  ];

  return (
    <div className="navbar-container" >
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
      <IoMdSettings size={30}/>
        <IoMdNotifications size={30}/>
       
        <FaRegUserCircle size={30} />

      </div>
      
   
      {/* Cart button */}
      <button className="navbar-cart-button md:navbar-cart-button-md">
        <BsFillCartFill size={20} className="mr-2" /> Cart
      </button>

      {/* Mobile Menu */}
      {/* Overlay */}
      {nav ? <div className="navbar-overlay"></div> : ""}

      {/* Side drawer menu */}
      <div className={nav ? "navbar-drawer" : "navbar-drawer navbar-drawer-hidden"}>
        <AiOutlineClose
          onClick={() => setNav(!nav)}
          size={30}
          className="navbar-close-icon"
        />
       <div className="top">
  <h2 className="navbar-header">
 <div>
    <span className="navbar-name font-bold">EASY</span>
    <span className="navbar-name font-fine">Escapce Accessible et Système de Réservation</span></div>

    <div className="navbar-separator"></div>
    <img src={logo} alt="Logo" className="navbar-logo-image" />
  </h2>
</div>

        <nav>
          <ul className="navbar-menu">
            {menuItems.map(({ icon, text }, index) => (
              <div key={index} className="py-4">
                <li className="navbar-menu-item">
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
