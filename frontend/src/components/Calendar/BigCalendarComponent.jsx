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
    }));
    setAllEvents(formattedEvents);
  }, [events]);

  return (
    <div className="big-calendar">
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', width: '100%' }}
        className="the-calendar"
      />
    </div>
  );
};

export default BigCalendarComponent;
