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
  ResponsiveContainer,
} from "recharts";
import logo from "./../assets/acm.png";
import banner from "./../assets/transparent.png";
import "./Profile.css";
import Navbar from "./navbar";
import mallette from "./../assets/icons/mallette.png";
import email from "./../assets/icons/email.png";
import iphone from "./../assets/icons/iphone.png";
import organisation from "./../assets/icons/organisation.png";
import utilisateur from "./../assets/icons/utilisateur.png";
import batiment from "./../assets/icons/batiment.png";
import pen from "./../assets/icons/pen.png";
import trash from "./../assets/icons/trash.png";
import plus from "./../assets/icons/plus.png";

import manager1 from "./../assets/manager/manager1.png";
import manager2 from "./../assets/manager/manager2.png";

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
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div>
     <Navbar/>
    
    <div className="profile-container">
      <div className="profile-banner">
        <div className="banner-img">
          <img src={banner} alt="Profile Banner" />
        </div>
      </div>
      <div className="profile-main">
    
        <div className="main-content">
          <div className="sidebar">
            <button className="manage-account">Manage your account</button>
            <div className="sidebar-content">
              <div className="about">
                <h3>About</h3>
                <div className="about-content">
                  <div>
                    <img src={mallette} alt="Nature" className="icon" />
                    <p>Nature (eg. Club)</p>
                  </div>
                  <div>
                    <img src={organisation} alt="Nature" className="icon" />
                    <p>Service</p>
                  </div>
                  <div>
                    <img src={batiment} alt="Nature" className="icon" />
                    <p>Organisation</p>
                  </div>
                </div>
              </div>
              <div className="contact">
                <h3>Contact</h3>
                <div className="contact-content">
                  <div>
                    <img src={email} alt="Nature" className="icon" />
                    <p>Email</p>
                  </div>
                  <div>
                    <img src={iphone} alt="Nature" className="icon" />
                    <p>Phone number</p>
                  </div>
                  <div>
                    <img src={utilisateur} alt="Nature" className="icon" />
                    <p>Manager</p>
                  </div>
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
              {/*<button
                className={`tab ${activeTab === "Bio" ? "active" : ""}`}
                onClick={() => setActiveTab("Bio")}
              >
                Bio
              </button>*/}
            </div>
            {activeTab === "Overview" && (
              <div>
                <div className="overview">
                  <div className="event-list">
                    <h3>Event List</h3>
                    <div className="event-items">
                      <ul>
                        {dataAttendance.map((data) => (
                          <li key={data.name}>{data.name}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="most-requested-facilities">
                    <h3>Most Requested Facilities</h3>
                    <div className="chart">
                      <ResponsiveContainer width="95%" height={200}>
                        <BarChart data={dataFacilities}>
                          {/*<CartesianGrid strokeDasharray="3 3" /> */}
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#346beb" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                <div className="attendance-per-event">
                  <h3>Attendance per event</h3>
                  <div className="chart">
                    <ResponsiveContainer width="95%" height={200}>
                      <LineChart className="line-chart" data={dataAttendance}>
                        {/*<CartesianGrid strokeDasharray="3 3" />{" "}
                       i may get rid of this */}
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="attendees"
                          stroke="#346beb"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
            )}
            {activeTab === "Vis-à-vis" && (
              <div className="vis-a-vis">
                <h3>Our representents</h3>
                <div className="vav-content">
                  <img
                    src={plus}
                    alt="Nature"
                    className="add-person-icon"
                  />
                  <div className="vav-person">
                    <img src={manager1} alt="manager1" className="person-picture"/>
                    <div className="basic-info">
                      <p className="info-names">FirstName LastName</p>
                      <p className="info-position">Position</p>
                    </div>
                    <div className="more-info">
                      <p className="info-email">firstname.lastname@gmail.com</p>
                      <p className="info-phone">Phone Number</p>
                    </div>
                    <div className="person-interaction">
                      <img src={pen} alt="Nature" className="edit-person-icon" />
                      <img src={trash} alt="Nature" className="delete-person-icon" />
                    </div>
                  </div>
                  <div className="vav-person">
                    <img src={manager2} alt="manager2" className="person-picture"/>
                    <div className="basic-info">
                      <p className="info-names">FirstName LastName</p>
                      <p className="info-position">Position</p>
                    </div>
                    <div className="more-info">
                      <p className="info-email">firstname.lastname@gmail.com</p>
                      <p className="info-phone">Phone Number</p>
                    </div>
                    <div className="person-interaction">
                      <img src={pen} alt="Nature" className="edit-person-icon" />
                      <img src={trash} alt="Nature" className="delete-person-icon" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/*activeTab === "Bio" && (
              <div className="bio">
                <h3>Bio Content</h3>
                <p>hello from the bio</p>
              </div>
            )*/}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Profile;
