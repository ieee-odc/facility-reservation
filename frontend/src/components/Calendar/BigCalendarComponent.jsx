// src/components/BigCalendarComponent.js
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './style.css';
import EventModal from './EventModal';

const localizer = momentLocalizer(moment);

const BigCalendarComponent = ({ events, requests, viewType }) => {
  const [allEvents, setAllEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    const formattedRequests = requests.map((event) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end)
    }));

    const formattedEvents = events.map((event) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end)
    }));

    setAllEvents(viewType === 'requests' ? formattedRequests : formattedEvents);
  }, [events, requests, viewType]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setModalShow(true);
  };

  const handleCancel = (eventId) => {
    setAllEvents((prevEvents) => prevEvents.map((event) =>
      event.id === eventId ? { ...event, state: 'Cancelled' } : event
    ));
  };

  const eventPropGetter = (event) => {
    let style = {};

    switch (event.state) {
      case "Pending":
        style = {
          backgroundColor: "#fef3e7",
          borderLeft: "6px solid #f39c12",
          color: "#9c6612",
          padding: "4%",

          borderRadius: "4px",
          fontSize: "0.875em",
        };
        break;
      case "Approved":
        style = {
          backgroundColor: "#e7f7e7",
          borderLeft: "6px solid #28a745",
          color: "#155724",
          padding: "4%",

          borderRadius: "4px",
          fontSize: "0.875em",
        };
        break;
      case "Rejected":
        style = {
          backgroundColor: "#f8d7da",
          borderLeft: "6px solid #dc3545",
          color: "#721c24",
          padding: "4%",

          borderRadius: "4px",
          fontSize: "0.875em",
        };
        break;
      case "Cancelled":
        style = {
          backgroundColor: "#d3d3d3",
          borderLeft: "6px solid #808080",
          color: "#333333",
          padding: "4%",
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
        eventPropGetter={eventPropGetter}
        onSelectEvent={handleEventClick}
        resizable
        className="the-calendar"
      />
      {selectedEvent && (
        <EventModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          eventDetails={selectedEvent}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default BigCalendarComponent;
