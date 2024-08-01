import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import CalendarSidebar from "./CalendarSidebar";
import "./style.css";
import BigCalendarComponent from "./BigCalendarComponent";
import axios from "axios";
import { Dropdown } from 'rsuite';
import 'rsuite/dist/rsuite.min.css'; 

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [viewType, setViewType] = useState('requests'); 

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/reservations/pure"
        );
        const reservations = response.data;

        if (Array.isArray(reservations)) {
          const formattedEvents = reservations.map((reservation) => {
            const start = new Date(
              `${reservation.date.split("T")[0]} ${reservation.startTime}`
            );
            const end = new Date(
              `${reservation.date.split("T")[0]} ${reservation.endTime}`
            );

            return {
              title: reservation.motive,
              start,
              end,
              allDay: false,
              state: reservation.state,
              facility: reservation.facility,
            };
          });

          setRequests(formattedEvents);
        } else {
          console.error("Unexpected response format", reservations);
        }
      } catch (error) {
        console.error("Error fetching reservations from calendar page", error);
      }
    };
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/events/reservations"
        );
        console.log("events : ", response.data);
        const reservations = response.data;
        if (Array.isArray(reservations)) {
          const formattedEvents = reservations.map((reservation) => {
            const start = new Date(reservation.startDate)
              .toISOString()
              .split("T")[0];
            const end = new Date(reservation.endDate)
              .toISOString()
              .split("T")[0];

            return {
              title: reservation.name,
              start,
              end,
              state: reservation.state,
            };
          });

          setEvents(formattedEvents);
        } else {
          console.error("Unexpected response format", reservations);
        }
      } catch (error) {
        console.error("Error fetching reservations from calendar page", error);
      }
    };
    fetchEvents();
    fetchReservations();
  }, []);

  const handleDropdownChange = (key) => {
    setViewType(key);
  };

  return (
    <div>
      <Navbar />
      <div className="calendar-page">
        <div className="calendar-page__content">
          <div className="calendar-page__sidebar">
            <CalendarSidebar setViewType={setViewType} events={events} requests={requests} />
          </div>

          <div className="calendar-page_calendar">
            <div className="calendar-header custom-dropdown">
              <Dropdown title="Select View" activeKey={viewType} onSelect={handleDropdownChange}>
                <Dropdown.Item eventKey="requests">Requests</Dropdown.Item>
                <Dropdown.Item eventKey="events">Events</Dropdown.Item>
              </Dropdown>
            </div>
            <div className="main-calendar">
              <BigCalendarComponent
                events={events}
                requests={requests}
                viewType={viewType}
              />
            </div>
            <div className="legend">
              <div className="legend-item">
                <span className="legend-color pending"></span> Pending
              </div>
              <div className="legend-item">
                <span className="legend-color approved"></span> Approved
              </div>
              <div className="legend-item">
                <span className="legend-color rejected"></span> Rejected
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
