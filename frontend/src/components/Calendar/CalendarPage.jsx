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
  const [facilities, setFacilities] = useState({});
  const [viewType, setViewType] = useState('requests'); 

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/facilities");
        const facilitiesArray = response.data.data; 
        if (Array.isArray(facilitiesArray)) {
          const facilitiesData = facilitiesArray.reduce((acc, facility) => {
            acc[facility._id] = facility.label;
            return acc;
          }, {});
          setFacilities(facilitiesData);
        } else {
          console.error("Unexpected response format for facilities", response.data);
        }
      } catch (error) {
        console.error("Error fetching facilities", error);
      }
    };

    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/reservations/pure"
        );
        const reservations = response.data;

        if (Array.isArray(reservations)) {
          const formattedRequests = reservations.map((reservation) => {
            const start = new Date(
              `${reservation.date.split("T")[0]} ${reservation.startTime}`
            );
            const end = new Date(
              `${reservation.date.split("T")[0]} ${reservation.endTime}`
            );

            return {
              id: reservation._id,
              title: reservation.motive,
              start,
              end,
              allDay: false,
              state: reservation.state,
              facility: facilities[reservation.facility] || "Unknown Facility",
            };
          });

          setRequests(formattedRequests);
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
              id: reservation._id,
              title: reservation.name,
              start,
              end,
              state: reservation.state,
              facility: facilities[reservation.facility] || "Unknown Facility",
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

    fetchFacilities();
    fetchEvents();
    fetchReservations();
  }, [facilities]);

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
              <div className="legend-item">
                <span className="legend-color cancelled"></span> Cancelled
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
