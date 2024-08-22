import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import logo from "./../assets/logo/flexispace-favicon-black.png";
import banner from "./../assets/banner1.jpg";
import "./Profile.css";
import Navbar from "./navbar";
import mallette from "./../assets/icons/mallette.png";
import email from "./../assets/icons/email.png";
import iphone from "./../assets/icons/iphone.png";
import organisation from "./../assets/icons/organisation.png";
import utilisateur from "./../assets/icons/utilisateur.png";
import batiment from "./../assets/icons/batiment.png";
import Vav from "./Vav";
import EditableField from "./EditableField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/authContext/AuthProvider";

const dataFacilities = [
  { name: "ODC", count: 10 },
  { name: "239", count: 14 },
  { name: "243", count: 19 },
  { name: "A7", count: 8 },
  { name: "Auditorium", count: 23 },
];

const dataAttendance = [
  { name: "Event 1", attendees: 20 },
  { name: "Event 2", attendees: 22 },
  { name: "Event 3", attendees: 30 },
  { name: "Event 4", attendees: 25 },
  { name: "Event 5", attendees: 28 },
  { name: "Event 6", attendees: 32 },
  { name: "Event 7", attendees: 20 },
];

const Profile = () => {
  const { currentUser, userLoggedIn, loading } = useAuth();
console.log(currentUser);

  const [activeTab, setActiveTab] = useState("Overview");
  const [editingField, setEditingField] = useState(null);
  const [fieldValues, setFieldValues] = useState({
    nature: "",
    service: "",
    organisation: "",
    email: currentUser.email,
    phoneNumber: "",
    manager: "",
  });
  const [profileImage, setProfileImage] = useState(logo);
  const [bannerImage, setBannerImage] = useState(banner);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    const fetchReservationInitiator = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/reservationInitiators/by-email/${currentUser.email}`);
        console.log("user", response.data);
        setFieldValues({...fieldValues, ...response.data})
      } catch (error) {
        console.log("Error fetching the current user", error);
      }

    }

    fetchReservationInitiator();
    fetchEvents();
  }, []);

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFieldValues({
      ...fieldValues,
      [name]: value,
    });
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  const handleApprove = () => {
    setEditingField(null);
  };

  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleBannerImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setBannerImage(e.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-banner">
          <img src={bannerImage} alt="Profile Banner" />
          <div className="overlay">
            <label htmlFor="banner-upload">
              <FontAwesomeIcon icon={faCamera} className="icon" />
            </label>
            <input
              id="banner-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleBannerImageChange}
            />
          </div>
        </div>
        <div className="profile-main">
          <div className="profile-img">
            <img src={profileImage} alt="Profile" className="profile-picture" />
            <div className="overlay">
              <label htmlFor="profile-upload">
                <FontAwesomeIcon icon={faCamera} className="icon" />
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleProfileImageChange}
              />
            </div>
          </div>

          <div className="main-content">
            <div className="sidebar">
              <div className="sidebar-content main-profile-card">
                <div className="about">
                  <h3>About</h3>
                  <div className="about-content">
                    <EditableField
                      iconSrc={mallette}
                      placeholder="Nature"
                      name="nature"
                      value={fieldValues.nature}
                      editingField={editingField}
                      handleEdit={handleEdit}
                      handleFieldChange={handleFieldChange}
                      handleCancel={handleCancel}
                      handleApprove={handleApprove}
                    />
                    <EditableField
                      iconSrc={organisation}
                      placeholder="Service"
                      name="service"
                      value={fieldValues.service}
                      editingField={editingField}
                      handleEdit={handleEdit}
                      handleFieldChange={handleFieldChange}
                      handleCancel={handleCancel}
                      handleApprove={handleApprove}
                    />
                    <EditableField
                      iconSrc={batiment}
                      placeholder="Organisation"
                      name="organisation"
                      value={fieldValues.organisation}
                      editingField={editingField}
                      handleEdit={handleEdit}
                      handleFieldChange={handleFieldChange}
                      handleCancel={handleCancel}
                      handleApprove={handleApprove}
                    />
                  </div>
                </div>
                <div className="contact">
                  <h3>Contact</h3>
                  <div className="contact-content">
                    <EditableField
                      iconSrc={email}
                      placeholder="email@example.com"
                      name="email"
                      value={fieldValues.email}
                      editingField={editingField}
                      handleEdit={handleEdit}
                      handleFieldChange={handleFieldChange}
                      handleCancel={handleCancel}
                      handleApprove={handleApprove}
                      
                    />
                    <EditableField
                      iconSrc={iphone}
                      placeholder="123-456-7890"
                      name="phoneNumber"
                      value={fieldValues.phoneNumber}
                      editingField={editingField}
                      handleEdit={handleEdit}
                      handleFieldChange={handleFieldChange}
                      handleCancel={handleCancel}
                      handleApprove={handleApprove}
                    />
                    <EditableField
                      iconSrc={utilisateur}
                      placeholder="Manager Name"
                      name="manager"
                      value={fieldValues.manager}
                      editingField={editingField}
                      handleEdit={handleEdit}
                      handleFieldChange={handleFieldChange}
                      handleCancel={handleCancel}
                      handleApprove={handleApprove}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="content">
              <div className="tabs">
                <button
                  className={`tab ${activeTab === "Overview" ? "active" : ""}`}
                  onClick={() => setActiveTab("Overview")}
                >
                  Overview
                </button>
                <button
                  className={`tab ${activeTab === "Vis-à-vis" ? "active" : ""}`}
                  onClick={() => setActiveTab("Vis-à-vis")}
                >
                  Vis-à-vis
                </button>
              </div>
              {activeTab === "Overview" && (
                <div>
                  <div className="overview">
                    <div className="event-list main-profile-card">
                      <h3>Event List</h3>
                      <div className="event-items">
                        <ul>
                          {events.map((event) => (
                            <li key={event._id}>{event.name}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="most-requested-facilities main-profile-card">
                      <h3>Most Requested Facilities</h3>
                      <div className="chart">
                        <ResponsiveContainer width="95%" height={200}>
                          <BarChart data={dataFacilities}>
                            <defs>
                              <linearGradient
                                id="gradient1"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="1"
                              >
                                <stop offset="0%" stopColor="#22c1c3" />
                                <stop offset="43%" stopColor="#30caad" />
                                <stop offset="100%" stopColor="#4f2dfd" />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="url(#gradient1)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  <div className="attendance-per-event main-profile-card">
                    <h3>Attendance per event</h3>
                    <div className="chart">
                      <ResponsiveContainer width="95%" height={200}>
                        <LineChart className="line-chart" data={dataAttendance}>
                          <defs>
                            <linearGradient
                              id="gradient1"
                              x1="0"
                              y1="0"
                              x2="1"
                              y2="1"
                            >
                              <stop offset="0%" stopColor="#22c1c3" />
                              <stop offset="43%" stopColor="#30caad" />
                              <stop offset="100%" stopColor="#4f2dfd" />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="attendees"
                            stroke="#89f5e5"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "Vis-à-vis" && <Vav />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
