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
import { getAllFacilities } from "../apiService";
import { Panel } from "rsuite";

/*const dataFacilities = [
  { name: "ODC", count: 10 },
  { name: "239", count: 14 },
  { name: "243", count: 19 },
  { name: "A7", count: 8 },
  { name: "Auditorium", count: 23 },
];*/

/*const dataAttendance = [
  { name: "Event 1", attendees: 20 },
  { name: "Event 2", attendees: 22 },
  { name: "Event 3", attendees: 30 },
  { name: "Event 4", attendees: 25 },
  { name: "Event 5", attendees: 28 },
  { name: "Event 6", attendees: 32 },
  { name: "Event 7", attendees: 20 },
];*/

const Profile = ({ currentId, currentUser }) => {
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
  const [allEvents, setAllEvents] = useState([]);
  const [dataAttendance, setDataAttendance] = useState([]);
  const [dataFacilities, setDataFacilities] = useState([]);
  
  const [reservations, setReservations] = useState([]);
  const [organizers, setOrganizers] = useState({});
  const [facilities, setFacilities] = useState({});

  useEffect(() => {
    
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/events/reservation/${currentId}`
        );
        console.log("events", response.data);
        setAllEvents(response.data)
        const filteredEvents = response.data.filter(
          (event) =>
            event.state === "Approved" || event.state === "PartiallyApproved"
        );
        console.log("events filtered", filteredEvents);
        const attendance = filteredEvents.map((event) => ({
          name: event.name, // Assuming the event object has a 'name' property
          attendees: event.totalEffective, // Assuming the event object has a 'totalEffective' property
        }));

        console.log("attendance", attendance);

        setDataAttendance(attendance);
        setEvents(filteredEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    const fetchReservationInitiator = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/reservationInitiators/by-email/${currentUser.email}`
        );
        console.log("user", response.data);
        setFieldValues({ ...fieldValues, ...response.data });
      } catch (error) {
        console.log("Error fetching the current user", error);
      }
    };

    const fetchFacilities = async () => {
      try {
        const response = await getAllFacilities();
        const facilitiesData = response.data.data.reduce((acc, facility) => {
          acc[facility._id] = facility.label;
          return acc;
        }, {});
        setFacilities(facilitiesData);
      } catch (error) {
        console.error("Error fetching facilities", error);
      }
    };

    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/reservations/pure/${currentId}`
        );
        console.log("reservations", response.data);
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations", error);
      }
    };

    fetchReservations();
    fetchFacilities();
    fetchReservationInitiator();
    fetchEvents();
  }, []);

  useEffect(() => {
    const combineFacilityCounts = (events, reservations) => {
      const facilityCountMap = new Map();
      console.log("-------", events, "requests", reservations);

      events?.forEach((event) => {
        event?.reservations?.forEach((reservation) => {
          const facilityId = reservation.facility.toString();
          if (facilityCountMap.has(facilityId)) {
            facilityCountMap.set(
              facilityId,
              facilityCountMap.get(facilityId) + 1
            );
          } else {
            facilityCountMap.set(facilityId, 1);
          }
        });
      });

      reservations?.forEach((reservation) => {
        const facilityId = reservation.facility.toString();
        if (facilityCountMap.has(facilityId)) {
          facilityCountMap.set(
            facilityId,
            facilityCountMap.get(facilityId) + 1
          );
        } else {
          facilityCountMap.set(facilityId, 1);
        }
      });

      console.log("facilitycountmap", facilityCountMap);
      

      const facilityCountArray = Array.from(
        facilityCountMap,
        ([facilityId, count]) => ({
          name:facilities[facilityId],
          count,
        })
      );

      console.log("facilitycountarray", facilityCountArray);
      
      setDataFacilities(facilityCountArray)
      return facilityCountArray;
    };
    combineFacilityCounts(allEvents, reservations);
  }, [allEvents,reservations]);

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

  const getStateClass = (state) => {
    switch (state) {
      case "Pending":
        return `state-pending`;
      case "Approved":
        return `state-approved`;
      case "Cancelled":
        return `state-cancelled`;
      case "Rejected":
        return `state-rejected`;
      default:
        return "";
    }
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
                      <h3>List of the approved events</h3>
                      <div className="event-items">
                        {events.map((event) => (
                          <Panel
                            key={event._id}
                            header={
                              <div className="event-header">
                                <h5>{event.name}</h5>
                                <h6>
                                  {new Date(
                                    event.startDate
                                  ).toLocaleDateString()}{" "}
                                  -{" "}
                                  {new Date(event.endDate).toLocaleDateString()}
                                </h6>
                              </div>
                            }
                            className="event-panel"
                            collapsible
                            bordered
                          >
                            <div>
                              <div className="event-details">
                                <p>
                                  <strong>Description:</strong>{" "}
                                  {event.description}
                                </p>
                                <p>
                                  <strong>Start Date:</strong>{" "}
                                  {new Date(
                                    event.startDate
                                  ).toLocaleDateString()}
                                </p>
                                <p>
                                  <strong>End Date:</strong>{" "}
                                  {new Date(event.endDate).toLocaleDateString()}
                                </p>
                                <p className={getStateClass(event.state)}>
                                  <strong>State:</strong> {event.state}
                                </p>
                                <p>
                                  <strong>Total Effective:</strong>{" "}
                                  {event.totalEffective}
                                </p>
                                <p>
                                  <strong>Reservations:</strong>
                                </p>

                                <div className="event-reservations">
                                  {event.reservations.map((reservation) => (
                                    <div
                                      className="event-reservation-item"
                                      key={reservation._id}
                                    >
                                      <p>
                                        <strong>Date:</strong>{" "}
                                        {new Date(
                                          reservation.date
                                        ).toLocaleDateString()}
                                      </p>
                                      <p>
                                        <strong>Time:</strong>{" "}
                                        {reservation.startTime} -{" "}
                                        {reservation.endTime}
                                      </p>
                                      <p>
                                        <strong>Motive:</strong>{" "}
                                        {reservation.motive}
                                      </p>
                                      <p>
                                        <strong>Facility:</strong>{" "}
                                        {facilities[reservation.facility] ||
                                          "Unknown Facility"}
                                      </p>
                                      <p>
                                        <strong>Effective:</strong>{" "}
                                        {reservation.effective}
                                      </p>
                                      <p
                                        className={getStateClass(
                                          reservation.state
                                        )}
                                      >
                                        <strong>State:</strong>{" "}
                                        {reservation.state}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </Panel>
                        ))}
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
