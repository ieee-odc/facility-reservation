import React, { useState, useEffect } from "react";
import { Calendar, Badge } from "rsuite";
import axios from "axios";
import { fetchHolidays } from "./holidayService"; // Import holiday service
import "rsuite/dist/rsuite.min.css"; // Import RSuite's CSS
import "./CalendarSidebar.css"; // Import the stylesheet for the sidebar

const CalendarSidebar = ({ setViewType, currentRole, currentId }) => {
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyEvents, setDailyEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [showRequests, setShowRequests] = useState(true); // State for checkbox
  const [reservations, setReservations] = useState([]); // State for reservations
  const [events, setEvents] = useState([]); // State for reservations

  const countryCode = "TN"; // Tunisia country code
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchHolidaysData = async () => {
      const holidaysData = await fetchHolidays(countryCode, currentYear);
      setHolidays(holidaysData);
      setUpcomingHolidays(
        holidaysData
          .filter((holiday) => new Date(holiday.date) > new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date))
      );
    };

    // Fetch reservations from API
    const fetchReservations = async () => {
      try {
        let url;
        if (currentRole === "Admin")
          url = "http://localhost:3000/api/reservations/pure";
        else url = `http://localhost:3000/api/reservations/pure/${currentId}`;
        const response = await axios.get(url);
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    const fetchEvents = async () => {
      try {
        let url;
        if (currentRole === "Admin")
          url = "http://localhost:3000/api/events/reservations";
        else url = `http://localhost:3000/api/events/reservation/${currentId}`;
        const response = await axios.get(url);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchHolidaysData();
    fetchReservations();
    fetchEvents();
  }, []);

  useEffect(() => {
    if (reservations.length > 0 || events.length) {
      handleDateSelect(new Date());
    }
  }, [reservations, events]);

  const handleDateSelect = (date) => {
    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);

    setSelectedDate(selected);

    const filteredReservations = reservations
      .filter(
        (reservation) =>
          new Date(reservation.date).toDateString() === date.toDateString()
      )
      .map((reservation) => ({
        time: reservation.startTime,
        title: reservation.motive,
        state: reservation.state,
      }));

    const filteredEvents = events
      .filter((event) => {
        const eventStartDate = new Date(event.startDate).setHours(0, 0, 0, 0);
        const eventEndDate = new Date(event.endDate).setHours(0, 0, 0, 0);
        const currentDate = new Date(date).setHours(0, 0, 0, 0);
        return currentDate >= eventStartDate && currentDate <= eventEndDate;
      })
      .map((event) => ({
        time: "All day", // Assuming the event has a start time
        title: event.name,
        state: event.state,
      }));

    const combinedEvents = [...filteredReservations, ...filteredEvents];

    setDailyEvents(combinedEvents);
  };

  const renderCell = (date) => {
    const list = reservations.filter(
      (reservation) =>
        new Date(reservation.date).toDateString() === date.toDateString()
    );
    const holiday = holidays.find(
      (holiday) => new Date(holiday.date).toDateString() === date.toDateString()
    );

    const eventList = events.filter((event) => {
      const eventStartDate = new Date(event.startDate).setHours(0, 0, 0, 0);
      const eventEndDate = new Date(event.endDate).setHours(0, 0, 0, 0);
      const currentDate = new Date(date).setHours(0, 0, 0, 0);
      
      return currentDate >= eventStartDate && currentDate <= eventEndDate;
    }); 

    return (
      <>
        {holiday && <Badge className="calendar-holiday-badge" />}
        {list.length > 0 && <Badge className="calendar-todo-item-badge" />}
        {eventList.length > 0 && <Badge className="calendar-todo-item-badge-event" />}
      </>
    );
  };

  const handleViewChange = (view) => {
    setShowRequests(view === "requests");
    setViewType(view);
  };

  const getDotClass = (state) => {
    switch (state) {
      case "Pending":
        return "event-dot pending";
      case "Approved":
        return "event-dot approved";
      case "Rejected":
        return "event-dot rejected";
      case "Cancelled":
        return "event-dot cancelled";
      default:
        return "";
    }
  };

  return (
    <div className="calendar-sidebar">
      <div className="calendar-sidebar__calendar-container">
        <Calendar
          compact
          renderCell={renderCell}
          style={{ width: "100%" }}
          onSelect={handleDateSelect}
        />
      </div>

      {selectedDate && (
        <div className="calendar-sidebar__content">
          <div className="calendar-sidebar__events">
            <h5>Events for {selectedDate.toDateString()}</h5>
            <hr />
            <ul>
              {dailyEvents.length ? (
                dailyEvents.map((event, index) => (
                  <li key={index}>
                    <span className={getDotClass(event.state)}></span>
                    {event.time} - {event.title}
                  </li>
                ))
              ) : (
                <li>No events for this day</li>
              )}
            </ul>
          </div>
        </div>
      )}

      <div className="calendar-sidebar__upcoming-holidays">
        <h5>Upcoming Holidays</h5>
        <hr />
        <ul>
          {upcomingHolidays.length ? (
            upcomingHolidays.map((holiday, index) => (
              <li key={index}>
                {new Date(holiday.date).toDateString()}: {holiday.name}
              </li>
            ))
          ) : (
            <li>No upcoming holidays</li>
          )}
        </ul>
      </div>

      <div className="calendar-sidebar__checkboxes">
        <h5>View</h5>
        <hr />
        <div>
          <label className="custom-checkbox">
            <input
              type="radio"
              checked={showRequests}
              onChange={() => handleViewChange("requests")}
            />
            Requests
          </label>
          <br />
        </div>
        <div>
          <label className="custom-checkbox">
            <input
              className="radio-button"
              type="radio"
              checked={!showRequests}
              onChange={() => handleViewChange("events")}
            />
            Events
          </label>
        </div>
      </div>
    </div>
  );
};

export default CalendarSidebar;
