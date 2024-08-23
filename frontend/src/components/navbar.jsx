import React, { useState, useEffect, useRef } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { BsFillCartFill } from "react-icons/bs";
import logo from "../assets/logo_c.png";
import { useNavigate } from "react-router-dom";
import { doSignOut } from "../config/auth";
import { FaRegUserCircle } from "react-icons/fa";
import "./navbar.css";
import axios from "axios";
import logoutIcon from "../assets/signout.png";
import settings from "../assets/settings.png";
import profileIcon from "../assets/profile.png";
import userIcon from "../assets/user.png";
import reservationIcon from "../assets/reservation.png";
import calendarIcon from "../assets/calendar.png";
import homeIcon from "../assets/home.png";
import bellIcon from "../assets/notifications.png";
import feedbackIcon from "../assets/feedback.png";
import lockIcon from "../assets/lock.png";
import languageIcon from "../assets/language.png";
import fr_flag from "../assets/FR.png";
import en_flag from "../assets/EN.png";
import modeIcon from "../assets/mode.png";
import historyIcon from "../assets/history.png";
import eventIcon from "../assets/event.png";

import openDoor from "../assets/OpenDoor.png";

import GiveFeedback from "./feedback";
import ChangePasswordModal from "./ChangePasswordModal";
import webLogo from "./../assets/logo/Group3.svg";
import { useAuth } from "../context/authContext/AuthProvider";
import { useTranslation } from "react-i18next";
window.addEventListener("scroll", function () {
  var navbar = document.querySelector(".navbar-container");
  if (window.scrollY > 0) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
});

const Navbar = () => {
  const { userLoggedIn, currentId, currentRole, currentUser } = useAuth();
  const { i18n, t } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };



  const [nav, setNav] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showSettingsCard, setShowSettingsCard] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showNotificationsCard, setShowNotificationsCard] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  const profileCardRef = useRef(null);
  const settingsCardRef = useRef(null);
  const notificationsCardRef = useRef(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (email) {
        try {
          const response = await axios.get(
            "/api/reservationInitiators/by-email",
            { params: { email } }
          );
          setUserDetails(response.data);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchUserDetails();
  }, [email]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("your id", currentId);

        const response = await axios.get(
          `http://localhost:3000/api/notifications/recipient/${currentId}`
        );
        console.log("Fetched notifications:", response.data); // Log the response
        setNotifications(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]); // Ensure notifications is always an array
      }
    };

    fetchNotifications();
  }, [currentId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileCardRef.current &&
        !profileCardRef.current.contains(event.target)
      ) {
        setShowProfileCard(false);
      }
      if (
        settingsCardRef.current &&
        !settingsCardRef.current.contains(event.target)
      ) {
        setShowSettingsCard(false);
      }
      if (
        notificationsCardRef.current &&
        !notificationsCardRef.current.contains(event.target)
      ) {
        setShowNotificationsCard(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const Logout = async () => {
    const signedOut = await doSignOut();
    console.log("signed out");
    localStorage.clear();
    navigate("/login");
  };

  const feedback = async () => {
    navigate("/feedback");
  };

  const profile = async () => {
    navigate("/profile");
  };
  const calendar = async () => {
    navigate("/calendar");
  };
  const reservation = async () => {
    navigate("/reserver");
  };
  const event = async () => {
    navigate("/event");
  };
  const userManagement = async () => {
    navigate("/manage-users");
  };
  const facilityManagement = async () => {
    navigate("/manage-facilities");
  };
  const EventsManagement = async () => {
    navigate("/manage-requests");
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
  const toggleNotificationsCard = () => {
    setShowNotificationsCard(!showNotificationsCard);
  };

  const menuItems = [
    {
      icon: (
        <img
          src={reservationIcon}
          alt="reservation Icon"
          style={{ width: "30px", height: "30px" }}
        />
      ),
      text: t('view_reservations'),
      handleClick: EventsManagement,
    },

    {
      icon: (
        <img
          src={homeIcon}
          alt="home Icon"
          style={{ width: "30px", height: "30px" }}
        />
      ),
      text: "Dashboard",
    },
    {
      icon: (
        <img
          src={calendarIcon}
          alt="calendar Icon"
          style={{ width: "30px", height: "30px" }}
        />
      ),
      text: t('calendar'),
      handleClick: calendar,
    },
    {
      icon: (
        <img
          src={reservationIcon}
          alt="reservation Icon"
          style={{ width: "30px", height: "30px" }}
        />
      ),
      text: t('reservation'),
      handleClick: reservation,
    },
    {
      icon: (
        <img
          src={eventIcon}
          alt="event Icon"
          style={{ width: "30px", height: "30px" }}
        />
      ),
      text: t('event'),
      handleClick: event,
    },

    {
      icon: (
        <img
          src={profileIcon}
          alt="Profile Icon"
          style={{ width: "30px", height: "30px" }}
        />
      ),
      text: t('your_profile'),
      handleClick: profile,
    },
    {
      icon: (
        <img
          src={userIcon}
          alt="User Icon"
          style={{ width: "30px", height: "30px" }}
        />
      ),
      text: t('manage_users'),
      handleClick: userManagement,
    },
    {
      icon: (
        <img
          src={openDoor}
          alt="Facility Icon"
          style={{ width: "30px", height: "30px" }}
        />
      ),
      text: t('manage_facilities'),
      handleClick: facilityManagement,
    },

    {
      icon: (
        <img
          src={logoutIcon}
          alt="Logout Icon"
          style={{ width: "30px", height: "30px" }}
        />
      ),
      text: t('logout'),
      handleClick: Logout,
    },
    {
      icon: (
        <img
          src={settings}
          alt="settings Icon"
          style={{ width: "30px", height: "30px" }}
        />
      ),
      text: "Settings",
    },
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
        <img
          src={settings}
          alt="settings"
          style={{ width: "26px", height: "26px" }}
          onClick={toggleSettingsCard}
        />
        <img
          src={bellIcon}
          alt="notifications"
          style={{ width: "26px", height: "26px" }}
          onClick={toggleNotificationsCard}
        />
        <img
          src={profileIcon}
          alt="User"
          style={{ width: "26px", height: "26px" }}
          onClick={toggleProfileCard}
        />
        {showNotificationsCard && (
          <div className="notifications-card">
            <div className="notifications-card-header">
              <h3>Notifications</h3>
            </div>
            <div ref={notificationsCardRef} className="notifications-card-body">
              {Array.isArray(notifications) && notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div key={notification._id} className="notification-item">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                  </div>
                ))
              ) : (
                <p>No notifications</p>
              )}
            </div>
          </div>
        )}
        {showProfileCard && (
          <div ref={profileCardRef} className="profile-card">
            <div className="profile-card-header">
              <FaRegUserCircle size={50} />
              <p className="email-card-title">{email}</p>
            </div>
            <div className="profile-card-body">
              <button className="profile-card-button" onClick={profile}>
                <img
                  src={profileIcon}
                  alt="profile Icon"
                  className="button-icon"
                />{" "}
                {t('your_profile')}
              </button>
              <button
                className="profile-card-button"
                onClick={() => setShowFeedbackModal(true)}
              >
                <img
                  src={feedbackIcon}
                  alt="feedback Icon"
                  className="button-icon"
                />{" "}
                {t('give_feedback')}
              </button>

              <button className="profile-card-button" onClick={Logout}>
                <img
                  src={logoutIcon}
                  alt="Logout Icon"
                  className="button-icon"
                />{" "}
                {t('logout')}
              </button>
            </div>
          </div>
        )}
        {showSettingsCard && (
          <div ref={settingsCardRef} className="profile-card">
            <div className="profile-card-header">
              <img
                src={settings}
                alt="settings Icon"
                className="button-icon"
                style={{ width: "70px", height: "70px" }}
              />
              <h3 className="card-title">Settings</h3>
            </div>
            <div className="profile-card-body">
              <button
                className="profile-card-button"
                onClick={handleChangePassword}
              >
                <img src={lockIcon} alt="lock Icon" className="button-icon" />{" "}
                {t('change_password')}
              </button>
              <button className="profile-card-button">
                <img src={modeIcon} alt="mode Icon" className="button-icon" />
                {t('switch_mode')}
              </button>
              {/*<button className="profile-card-button">
                <img
                  src={languageIcon}
                  alt="language Icon"
                  className="button-icon"
                />
                Language
              </button>*/}
              <button className="profile-card-button" onClick={() => changeLanguage("en")}>
                <img
                  src={en_flag}
                  alt="language Icon"
                  className="button-icon"
                />
                English
              </button>
              <button className="profile-card-button" onClick={() => changeLanguage("fr")}>
                <img
                  src={fr_flag}
                  alt="language Icon"
                  className="button-icon"
                />
                Français
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
      <div
        className={nav ? "navbar-drawer" : "navbar-drawer navbar-drawer-hidden"}
      >
        <AiOutlineClose
          onClick={() => setNav(!nav)}
          size={30}
          className="navbar-close-icon"
        />
        <div className="top">
          <h2 className="navbar-header">
            <div className="web-logo">
              {/*<span className="navbar-name font-bold">EASY</span>
              <span className="navbar-name font-fine">Escapce Accessible et Système de Réservation</span>*/}
              <img src={webLogo} alt="Logo" />
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
      <GiveFeedback
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </div>
  );
};

export default Navbar;
