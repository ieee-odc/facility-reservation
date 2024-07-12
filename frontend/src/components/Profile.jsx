import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
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
import logo from "./../assets/ieee.webp";
import banner from "./../assets/transparent.png";
import "./Profile.css";
import Navbar from "./navbar";
import mallette from "./../assets/icons/mallette.png";
import email from "./../assets/icons/email.png";
import iphone from "./../assets/icons/iphone.png";
import organisation from "./../assets/icons/organisation.png";
import utilisateur from "./../assets/icons/utilisateur.png";
import batiment from "./../assets/icons/batiment.png";
import Vav from "./Vav";

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
  //added
  const [editingField, setEditingField] = useState(null);
  const [fieldValues, setFieldValues] = useState({
    nature: "",
    service: "",
    organisation: "",
    email: "",
    phoneNumber: "",
    manager: "",
  });

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
    // Add your save logic here
    setEditingField(null);
  };

  return (
    <div>
      <Navbar />

      <div className="profile-container">
        <div className="profile-banner">
          <div className="banner-img">
            <img src={banner} alt="Profile Banner" />
          </div>
        </div>
        <div className="profile-main">
          <div className="profile-img">
            <img src={logo} alt="Profile" />
          </div>
          <div className="main-content">
            <div className="sidebar">
              {
                //<button className="manage-account">Manage your account</button>
              }
              <div className="sidebar-content">
                <div className="about">
                  <h3>About</h3>
                  <div className="about-content">
                    <div>
                      <img src={mallette} alt="Nature" className="icon" />
                      {editingField === "nature" ? (
                        <div className="edited-input">
                          <input
                            placeholder="Nature"
                            name="nature"
                            value={fieldValues["nature"]}
                            onChange={handleFieldChange}
                            className="input"
                          />
                          <div className="interaction-buttons">
                            <button onClick={handleApprove}>
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                            <button onClick={handleCancel}>
                              <FontAwesomeIcon icon={faX} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p onClick={() => handleEdit("nature")}>
                          {fieldValues["nature"] || "Nature"}
                        </p>
                      )}
                    </div>
                    <div>
                      <img src={organisation} alt="Service" className="icon" />
                      {editingField === "service" ? (
                        <div className="edited-input">
                          <input
                            placeholder="Service"
                            name="service"
                            value={fieldValues["service"]}
                            onChange={handleFieldChange}
                            className="input"
                          />
                          <div className="interaction-buttons">
                            <button onClick={handleApprove}>
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                            <button onClick={handleCancel}>
                              <FontAwesomeIcon icon={faX} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p onClick={() => handleEdit("service")}>
                          {fieldValues["service"] || "Service"}
                        </p>
                      )}
                    </div>
                    <div>
                      <img src={batiment} alt="Organisation" className="icon" />
                      {editingField === "organisation" ? (
                        <div className="edited-input">
                          <input
                            placeholder="Organisation"
                            name="organisation"
                            value={fieldValues["organisation"]}
                            onChange={handleFieldChange}
                            className="input"
                          />
                          <div className="interaction-buttons">
                            <button onClick={handleApprove}>
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                            <button onClick={handleCancel}>
                              <FontAwesomeIcon icon={faX} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p onClick={() => handleEdit("organisation")}>
                          {fieldValues["organisation"] || "Organisation"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="contact">
                  <h3>Contact</h3>
                  <div className="contact-content">
                    <div>
                      <img src={email} alt="Nature" className="icon" />
                      {editingField === "email" ? (
                        <div className="edited-input">
                          <input
                            placeholder="email@example.com"
                            name="email"
                            value={fieldValues["email"]}
                            onChange={handleFieldChange}
                            className="input"
                          />
                          <div className="interaction-buttons">
                            <button onClick={handleApprove}>
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                            <button onClick={handleCancel}>
                              <FontAwesomeIcon icon={faX} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p onClick={() => handleEdit("email")}>
                          {fieldValues["email"] || "email@example.com"}
                        </p>
                      )}
                    </div>
                    <div>
                      <img src={iphone} alt="Nature" className="icon" />
                      {editingField === "phoneNumber" ? (
                        <div className="edited-input">
                          <input
                            placeholder="123-456-7890"
                            name="phoneNumber"
                            value={fieldValues["phoneNumber"]}
                            onChange={handleFieldChange}
                            className="input"
                          />
                          <div className="interaction-buttons">
                            <button onClick={handleApprove}>
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                            <button onClick={handleCancel}>
                              <FontAwesomeIcon icon={faX} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p onClick={() => handleEdit("phoneNumber")}>
                          {fieldValues["phoneNumber"] || "123-456-7890"}
                        </p>
                      )}
                    </div>
                    <div>
                      <img src={utilisateur} alt="Nature" className="icon" />
                      {editingField === "manager" ? (
                        <div className="edited-input">
                          <input
                            placeholder="Manager Name"
                            name="manager"
                            value={fieldValues["manager"]}
                            onChange={handleFieldChange}
                            className="input"
                          />
                          <div className="interaction-buttons">
                            <button onClick={handleApprove}>
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                            <button onClick={handleCancel}>
                              <FontAwesomeIcon icon={faX} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p onClick={() => handleEdit("manager")}>
                          {fieldValues["manager"] || "Manager Name"}
                        </p>
                      )}
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
                <Vav/>
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
