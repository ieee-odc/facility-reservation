import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./style.css";

const localizer = momentLocalizer(moment);

const BigCalendarComponent = ({ events }) => {
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    const formattedEvents = events.map((event) => ({
      title: event.title,
      start: new Date(event.start),
      end: new Date(event.end),
      allDay: event.allDay || false,
      state: event.state  
    }));
    setAllEvents(formattedEvents);
  }, [events]);

  const eventPropGetter = (event) => {
    let style = {};

    switch (event.state) {
      case "Pending":
        style = {
          backgroundColor: "#fef3e7",
          borderLeft: "6px solid #f39c12",
          color: "#9c6612",
          padding: "10px 15px",
          borderRadius: "4px",
          fontSize: "0.875em",
        };
        break;
      case "Approved":
        style = {
          backgroundColor: "#e7f7e7",
          borderLeft: "6px solid #28a745",
          color: "#155724",
          padding: "10px 15px",
          borderRadius: "4px",
          fontSize: "0.875em",
        };
        break;
      case "Rejected":
        style = {
          backgroundColor: "#f8d7da",
          borderLeft: "6px solid #dc3545",
          color: "#721c24",
          padding: "10px 15px",
          borderRadius: "4px",
          fontSize: "0.875em",
        };
        break;
      default:
        break;
    }

    return { style };
  };

  return (
    <div className="big-calendar">
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', width: '100%' }}
        eventPropGetter={eventPropGetter}  // Pass the eventPropGetter function
        className="the-calendar"
      />
    </div>
  );
};

export default BigCalendarComponent;
