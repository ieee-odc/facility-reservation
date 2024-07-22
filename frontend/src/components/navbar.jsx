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
import feedbackIcon from '../assets/feedback.png';
import lockIcon from '../assets/lock.png';
import languageIcon from '../assets/language.png';
import modeIcon from '../assets/mode.png';
import historyIcon from '../assets/history.png';

import ChangePasswordModal from './ChangePasswordModal'; 
import webLogo from "./../assets/logo/Group3.svg";

window.addEventListener('scroll', function() {
  var navbar = document.querySelector('.navbar-container');
  if (window.scrollY > 0) {
    navbar.classList.add('sticky');
  } else {
    navbar.classList.remove('sticky');
  }
});

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showSettingsCard, setShowSettingsCard] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false); 
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

  const handleChangePassword = () => {
    setShowChangePasswordModal(true);
  };

  const toggleSettingsCard = () => {
    setShowSettingsCard(!showSettingsCard);
    if (showSettingsCard) {
      setShowChangePasswordModal(false); 
    }
  };

  const toggleProfileCard = () => {
    setShowProfileCard(!showProfileCard);
  };

  const menuItems = [
    { icon: <img src={homeIcon} alt="home Icon" style={{ width: '30px', height: '30px'  }} />, text: "Dashboard"},
    { icon: <img src={calendarIcon} alt="calendar Icon" style={{ width: '30px', height: '30px' }} />, text: "Calendar"},
    { icon: <img src={reservationIcon} alt="reservation Icon" style={{ width: '30px', height: '30px' }} />, text: "Reservation"},
    { icon: <img src={historyIcon} alt="history Icon" style={{ width: '30px', height: '30px' }} />, text: "History"},

    { icon: <img src={profileIcon} alt="Profile Icon" style={{ width: '30px', height: '30px' }} />, text: "Profile", handleClick: profile },
    { icon: <img src={logoutIcon} alt="Logout Icon" style={{ width: '30px', height: '30px' }} />, text: "Logout", handleClick: Logout },
    { icon: <img src={settings} alt="settings Icon" style={{ width: '30px', height: '30px' }} />, text: "Settings"},
  ];

  return (
    <div className="navbar-container">
      {/* Left side */}
      <div className="navbar-left">
        <div onClick={() => setNav(!nav)} className="navbar-toggle">
          <AiOutlineMenu size={26} />
        </div>
      </div>

      <div className="profile-icons">
        <img src={settings} alt="settings" style={{ width: '26px', height: '26px' }} onClick={toggleSettingsCard} />
        <img src={bellIcon} alt="notifications" style={{ width: '26px', height: '26px' }}  />
        <img src={profileIcon} alt="User" style={{ width: '26px', height: '26px' }} onClick={toggleProfileCard} />
        {showProfileCard && (
          <div ref={profileCardRef} className="profile-card">
            <div className="profile-card-header">
              <FaRegUserCircle size={50} />
              <h3>{userDetails.name}</h3>
              <p className="email-card-title">{email}</p>
            </div>
            <div className="profile-card-body">
              <button className="profile-card-button" onClick={profile}>
                <img src={profileIcon} alt="profile Icon" className="button-icon" /> Your profile
              </button>
              <button className="profile-card-button" onClick={feedback}>
                <img src={feedbackIcon} alt="feedback Icon" className="button-icon" /> Give feedback
              </button>
              <button className="profile-card-button" onClick={Logout}>
                <img src={logoutIcon} alt="Logout Icon" className="button-icon" /> Logout
              </button>
            </div>
          </div>
        )}
        {showSettingsCard && (
          <div ref={settingsCardRef} className="profile-card">
            <div className="profile-card-header">
              <img src={settings} alt="settings Icon" className="button-icon" style={{ width: '70px', height: '70px' }} /> 
              <h3 className="card-title">Settings</h3>
            </div>
            <div className="profile-card-body">
              <button className="profile-card-button" onClick={handleChangePassword}>
                <img src={lockIcon} alt="lock Icon" className="button-icon" /> Change password
              </button>
              <button className="profile-card-button">
                <img src={modeIcon} alt="mode Icon" className="button-icon"/> 
                Switch Mode
              </button>
              <button className="profile-card-button">
                <img src={languageIcon} alt="language Icon" className="button-icon" /> 
                Language
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
            <div className="web-logo" >
              {/*<span className="navbar-name font-bold">EASY</span>
              <span className="navbar-name font-fine">Escapce Accessible et Système de Réservation</span>*/}
              <img src={webLogo} alt="Logo"/>
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

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={showChangePasswordModal} 
        onClose={() => setShowChangePasswordModal(false)} 
      />
    </div>
  );
};

export default Navbar;
