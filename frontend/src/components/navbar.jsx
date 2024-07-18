import React, { useState, useEffect, useRef } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { BsFillCartFill } from "react-icons/bs";
import { IoMdSettings, IoMdNotifications, IoMdLock, IoMdMoon, IoMdGlobe } from "react-icons/io";
import { SlNote } from "react-icons/sl";
import logo from '../assets/logo_c.png';
import { CiLogout } from "react-icons/ci";
import { MdFeedback } from "react-icons/md";
import { BiSolidLogOut } from "react-icons/bi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { doSignOut } from "../config/auth";
import { FiBell } from "react-icons/fi";
import { LuSettings } from "react-icons/lu";
import { FaRegUserCircle, FaCalendarAlt, FaUserEdit, FaHome } from "react-icons/fa";
import "./navbar.css";
import axios from 'axios';
import logoutIcon from '../assets/signout.png';

import settings from '../assets/settings.png';
import profileIcon from '../assets/profile.png';
import reservationIcon from '../assets/reservation.png';
import calendarIcon from '../assets/calendar.png';
import homeIcon from '../assets/home.png';
import bellIcon from '../assets/notifications.png';








const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showSettingsCard, setShowSettingsCard] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const navigate = useNavigate();
  const email = localStorage.getItem('userEmail');
  
  const profileCardRef = useRef(null);
  const settingsCardRef = useRef(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (email) {
        try {
          const response = await axios.get('/api/reservationInitiators/by-email', { params: { email } });
          setUserDetails(response.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, [email]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileCardRef.current && !profileCardRef.current.contains(event.target)) {
        setShowProfileCard(false);
      }
      if (settingsCardRef.current && !settingsCardRef.current.contains(event.target)) {
        setShowSettingsCard(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const Logout = async () => {
    const signedOut = await doSignOut();
    console.log("signed out");
    navigate("/login");
  };

  const feedback = async () => {
    navigate("/feedback");
  };

  const profile = async () => {
    navigate("/profile");
  };

  const toggleSettingsCard = () => {
    setShowSettingsCard(!showSettingsCard);
  };

  const toggleProfileCard = () => {
    setShowProfileCard(!showProfileCard);
  };

  const menuItems = [
    { icon: <img src={homeIcon} alt="home Icon" style={{ width: '30px', height: '30px'  }} />, text: "Dashboard"},
    { icon: <img src={calendarIcon} alt="calendar Icon" style={{ width: '30px', height: '30px' }} />, text: "Calendar"},
    { icon: <img src={reservationIcon} alt="reservation Icon" style={{ width: '30px', height: '30px' }} />, text: "Reservation"},
    { icon: <img src={profileIcon} alt="Profile Icon" style={{ width: '30px', height: '30px' }} />, text: "Profile", handleClick: profile },
    { icon: <img src={logoutIcon} alt="Logout Icon" style={{ width: '30px', height: '30px' }} />, text: "Logout", handleClick: Logout },
    { icon: <img src={settings} alt="settings Icon" style={{ width: '30px', height: '30px' }} />, text: "Settings"},
  ];

  return (
    <div className="navbar-container">
      {/* Left side */}
      <div className="navbar-left">
        <div onClick={() => setNav(!nav)} className="navbar-toggle">
          <AiOutlineMenu size={30} />
        </div>
      </div>

      <div className="profile-icons">
  <img src={settings} alt="settings" style={{ width: '34px', height: '34px' }} onClick={toggleSettingsCard} />
      <img src={bellIcon} alt="notifications" style={{ width: '34px', height: '34px' }}  />
        <img src={profileIcon} alt="User" style={{ width: '34px', height: '34px' }} onClick={toggleProfileCard} />
        {showProfileCard && (
          <div ref={profileCardRef} className="profile-card">
            <div className="profile-card-header">
              <FaRegUserCircle size={50} />
              <h3>{userDetails.name}</h3>
              <p className="email card-title">{email}</p>
            </div>
            <div className="profile-card-body">
              <button className="profile-card-button" onClick={profile}>
                <FaUserEdit className="button-icon" size={15} /> Your Profile
              </button>

              <button className="profile-card-button" onClick={feedback}>
                <MdFeedback className="button-icon" size={15} /> Give feedback
              </button>

              <button className="profile-card-button" onClick={Logout}>
                <img src={logoutIcon} alt="Logout Icon" className="button-icon" style={{ width: '20px', height: '20px' }} /> Logout
              </button>
            </div>
          </div>
        )}
        {showSettingsCard && (
          <div ref={settingsCardRef} className="settings-card">
            <div className="profile-card-header">
              <LuSettings size={50} />
              <h3 className="card-title">Settings</h3>
            </div>
            <div className="profile-card-body">
              <button className="profile-card-button">
                <IoMdLock className="button-icon" size={15} /> Change Password
              </button>

              <button className="profile-card-button">
                <IoMdMoon className="button-icon" size={15} /> Switch Mode
              </button>

              <button className="profile-card-button">
                <IoMdGlobe className="button-icon" size={15} /> Language
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
