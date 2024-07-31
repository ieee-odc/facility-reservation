import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import CalendarSidebar from "./CalendarSidebar";
import "./style.css";
import BigCalendarComponent from "./BigCalendarComponent";
import axios from "axios";

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const holidays = ["New Year's Day", "Independence Day"];

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/reservations");
        const reservations = response.data;
  
        if (Array.isArray(reservations)) {
          const formattedEvents = reservations.map(reservation => {
            const start = new Date(`${reservation.date.split("T")[0]} ${reservation.startTime}`);
            const end = new Date(`${reservation.date.split("T")[0]} ${reservation.endTime}`);
            
            return {
              title: reservation.motive,
              start,
              end,
              allDay: false 
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
  
    fetchReservations();
  }, []);
  
  return (
    <div>
      <Navbar />
      <div className="calendar-page">
        <div className="calendar-page__content">
          <div className="calendar-page__sidebar">
            <CalendarSidebar events={events} holidays={holidays} />
          </div>
          <div className="calendar-page_calendar">
            <div className="main-calendar">
              <BigCalendarComponent events={events} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
