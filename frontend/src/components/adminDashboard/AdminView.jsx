import React, { useEffect, useState } from "react";
import { Panel } from "rsuite";
import "./AdminView.css";
import { getAllEvents, getAllPureReservations } from "../../apiService";
import Navbar from "../navbar";

const AdminView = () => {
  const [reservations, setReservations] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchReservations();
    fetchEvents();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await getAllPureReservations();
      setReservations(response.data);
      console.log("reservations", response.data);
    } catch (error) {
      console.error("Error fetching reservations", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await getAllEvents();
      setEvents(response.data);
      console.log("events", response.data);
    } catch (error) {
      console.error("Error fetching events", error);
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
                header={
                  <div className="event-header">
                    <h5 >{event.organizer}</h5>
                    <h6>{event.name}</h6>
                  </div>
                }
                className="event-panel"
                collapsible
                bordered
              >
                <div key={event._id}>
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
                    <p>
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
                        <div className="event-reservation-item" key={reservation._id}>
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
                            <strong>Facility:</strong> {reservation.facility}
                          </p>
                          <p>
                            <strong>Effective:</strong> {reservation.effective}
                          </p>
                          <p>
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
                  <strong>Facility:</strong> {reservation.facility}
                </p>
                <p>
                  <strong>Effective:</strong> {reservation.effective}
                </p>
                <p>
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
