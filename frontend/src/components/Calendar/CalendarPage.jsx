import React from "react";
import Navbar from "../navbar";
import CalendarSidebar from "./CalendarSidebar";
import "./style.css";
import BigCalendarComponent from "./BigCalendarComponent";

const CalendarPage = () => {
  const events = [
    {
      title: "Meeting with team",
      start: new Date("2024-07-28T10:00:00"),
      end: new Date("2024-07-28T11:00:00"),
      allDay: false,
    },
    {
      title: "Project deadline",
      start: new Date("2024-07-30T15:00:00"),
      end: new Date("2024-07-30T16:00:00"),
      allDay: false,
    },
    {
      title: "Lunch with client",
      start: new Date("2024-07-31T12:00:00"),
      end: new Date("2024-07-31T13:00:00"),
      allDay: false,
    },
  ];  
  const holidays = ["New Year's Day", "Independence Day"];

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
