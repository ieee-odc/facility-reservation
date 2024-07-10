import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import logo from "./../assets/acm.png";
import banner from "./../assets/transparent.png";
import "./Profile.css";

const dataFacilities = [
  { name: "CDC", count: 10 },
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
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="profile-container">
      <div className="profile-banner">
        <div className="banner-img">
          <img src={banner} alt="Profile Banner" />
        </div>
      </div>
      <div className="main-content">
        <div className="profile-img">
          <img src={logo} alt="Profile" />
        </div>
        
        <div className="sidebar">
          <button className="manage-account">Manage your account</button>
          <div className="about">
            <h3>About</h3>
            <p>Nature (eg. Club)</p>
            <p>Service</p>
            <p>Organisation</p>
          </div>
          <div className="contact">
            <h3>Contact</h3>
            <p>Email</p>
            <p>Phone number</p>
            <p>Manager</p>
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
            <button
              className={`tab ${activeTab === "Bio" ? "active" : ""}`}
              onClick={() => setActiveTab("Bio")}
            >
              Bio
            </button>
          </div>
          {activeTab === "Overview" && (
            <div className="overview">
              <div className="event-list">
                <h3>Event List</h3>
                <div className="event-items">
                  <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                  </ul>
                </div>
              </div>
              <div className="most-requested-facilities">
                <h3>Most Requested Facilities</h3>
                <div className="chart">
                  <BarChart width={400} height={200} data={dataFacilities}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </div>
              </div>
              <div className="attendance-per-event">
                <h3>Attendance per event</h3>
                <div className="chart">
                  <LineChart width={400} height={200} data={dataAttendance}>
                    <CartesianGrid strokeDasharray="3 3" /> {/* i may get rid of this */}
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="attendees"
                      stroke="#8884d8"
                    />
                  </LineChart>
                </div>
              </div>
            </div>
          )}
          {activeTab === "Vis-à-vis" && (
            <div className="vis-a-vis">
              {/* Add content for Vis-à-vis tab here */}
              <h3>Vis-à-vis Content</h3>
              <p>hello from vis a vis</p>
            </div>
          )}
          {activeTab === "Bio" && (
            <div className="bio">
              {/* Add content for Bio tab here */}
              <h3>Bio Content</h3>
              <p>hello from the bio</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
