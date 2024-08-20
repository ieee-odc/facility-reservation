import React, { useEffect, useState } from "react";
import { Panel } from "rsuite";
import "./AdminView.css";
import {
  getAllEvents,
  getAllPureReservations,
  getAllOrganizers,
  getAllFacilities,
} from "../../apiService";
import Navbar from "../navbar";

const AdminView = () => {
  const [reservations, setReservations] = useState([]);
  const [events, setEvents] = useState([]);
  const [organizers, setOrganizers] = useState({});
  const [facilities, setFacilities] = useState({});

  useEffect(() => {
    fetchReservations();
    fetchEvents();
    fetchOrganizers();
    fetchFacilities();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await getAllPureReservations();
      setReservations(response.data);
      console.log("reservations", reservations);
      
    } catch (error) {
      console.error("Error fetching reservations", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await getAllEvents();
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  const fetchOrganizers = async () => {
    try {
      const response = await getAllOrganizers(); 
      console.log("Fetched organizers:", response.data); 
      const organizersData = response.data.reduce((acc, organizer) => {
        acc[organizer._id] = organizer.name; 
        return acc;
      }, {});
      console.log("Organizers mapped:", organizersData); 
      setOrganizers(organizersData);
    } catch (error) {
      console.error("Error fetching organizers", error);
    }
  };

  const fetchFacilities = async () => {
    try {
      const response = await getAllFacilities(); // Fetch all facilities
      console.log("Fetched facilities:", response.data.data); // Debugging line
      const facilitiesData = response.data.data.reduce((acc, facility) => {
        acc[facility._id] = facility.label; // Map facility ID to name
        return acc;
      }, {});
      console.log("Facilities mapped:", facilitiesData); // Debugging line
      setFacilities(facilitiesData);
    } catch (error) {
      console.error("Error fetching facilities", error);
    }
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

  return (
    <div>
      <Navbar />
      <div className="admin-view">
        <div className="content-container">
          <div className="section events-section">
            <h2>Events</h2>
            {events.map((event) => (
              <Panel
                key={event._id}
                header={
                  <div className="event-header">
                    <h5>
                      {organizers[event.organizer] || "Unknown Organizer"}
                    </h5>
                    <h6>{event.name}</h6>
                  </div>
                }
                className="event-panel"
                collapsible
                bordered
              >
                <div>
                  <div className="event-details">
                    <p>
                      <strong>Description:</strong> {event.description}
                    </p>
                    <p>
                      <strong>Start Date:</strong>{" "}
                      {new Date(event.startDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>End Date:</strong>{" "}
                      {new Date(event.endDate).toLocaleDateString()}
                    </p>
                    <p className={getStateClass(event.state)}>
                      <strong>State:</strong> {event.state}
                    </p>
                    <p>
                      <strong>Total Effective:</strong> {event.totalEffective}
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
                            {new Date(reservation.date).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Time:</strong> {reservation.startTime} -{" "}
                            {reservation.endTime}
                          </p>
                          <p>
                            <strong>Motive:</strong> {reservation.motive}
                          </p>
                          <p>
                            <strong>Facility:</strong>{" "}
                            {facilities[reservation.facility] ||
                              "Unknown Facility"}
                          </p>
                          <p>
                            <strong>Effective:</strong> {reservation.effective}
                          </p>
                          <p className={getStateClass(reservation.state)}>
                            <strong>State:</strong> {reservation.state}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Panel>
            ))}
          </div>

          <div className="section reservations-section">
            <h2>Reservations</h2>
            {reservations.map((reservation) => (
              <div key={reservation._id} className="reservation-item">
                <h3>
                  {organizers[reservation.entity] || "Unknown Organizer"}
                </h3>
                <p>
                  <strong>Motive:</strong> {reservation.motive}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(reservation.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {reservation.startTime} -{" "}
                  {reservation.endTime}
                </p>
                
                <p>
                  <strong>Facility:</strong>{" "}
                  {facilities[reservation.facility] || "Unknown Facility"}
                </p>
                <p>
                  <strong>Effective:</strong> {reservation.effective}
                </p>
                <p className={getStateClass(reservation.state)}>
                  <strong>State:</strong> {reservation.state}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
