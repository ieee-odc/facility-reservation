import React, { useState, useEffect } from 'react';
import { Calendar, Badge } from 'rsuite';
import axios from 'axios';
import { fetchHolidays } from './holidayService'; // Import holiday service
import 'rsuite/dist/rsuite.min.css'; // Import RSuite's CSS
import './CalendarSidebar.css'; // Import the stylesheet for the sidebar

const CalendarSidebar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyEvents, setDailyEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [showRequests, setShowRequests] = useState(true); // State for checkbox
  const [reservations, setReservations] = useState([]); // State for reservations

  const countryCode = 'TN'; // Tunisia country code
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Fetch holidays for the current year
    const fetchHolidaysData = async () => {
      const holidaysData = await fetchHolidays(countryCode, currentYear);
      setHolidays(holidaysData);
      setUpcomingHolidays(
        holidaysData.filter(
          (holiday) => new Date(holiday.date) > new Date()
        ).sort((a, b) => new Date(a.date) - new Date(b.date))
      );
    };

    // Fetch reservations from API
    const fetchReservations = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/reservations');
        setReservations(response.data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchHolidaysData();
    fetchReservations();
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const filteredEvents = reservations.filter(reservation =>
      new Date(reservation.date).toDateString() === date.toDateString()
    ).map(reservation => ({
      time: reservation.startTime,
      title: reservation.motive
    }));
    setDailyEvents(filteredEvents);
  };

  const renderCell = (date) => {
    const list = reservations.filter(reservation =>
      new Date(reservation.date).toDateString() === date.toDateString()
    );
    const holiday = holidays.find(
      (holiday) =>
        new Date(holiday.date).toDateString() === date.toDateString()
    );

    return (
      <>
        {holiday && <Badge className="calendar-holiday-badge" />}
        {list.length > 0 && <Badge className="calendar-todo-item-badge" />}
      </>
    );
  };

  const holidayNames = holidays
    .filter(
      (holiday) =>
        new Date(holiday.date).toDateString() === selectedDate?.toDateString()
    )
    .map((holiday) => holiday.name);

  return (
    <div className="calendar-sidebar">
      <div className="calendar-sidebar__calendar-container">
        <Calendar
          compact
          renderCell={renderCell}
          style={{ width: '100%' }}
          onSelect={handleDateSelect}
        />
      </div>

      {selectedDate && (
        <div className="calendar-sidebar__content">
          {showRequests ? (
            <div className="calendar-sidebar__events">
              <h5>Events for {selectedDate.toDateString()}</h5>
              <hr />
              <ul>
                {dailyEvents.length ? (
                  dailyEvents.map((event, index) => (
                    <li key={index}>
                      {event.time} - {event.title}
                    </li>
                  ))
                ) : (
                  <li>No events for this day</li>
                )}
              </ul>
            </div>
          ) : (
            <div className="calendar-sidebar__holidays">
              <h5>Holidays</h5>
              <ul>
                {holidayNames.length ? (
                  holidayNames.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))
                ) : (
                  <li>No holidays</li>
                )}
              </ul>
            </div>
          )}
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
        <label>
          <input
            type="checkbox"
            checked={showRequests}
            onChange={() => setShowRequests(true)}
          />
          Requests
        </label>
        <br />
        </div>
        <div>
        <label>
          <input
            type="checkbox"
            checked={!showRequests}
            onChange={() => setShowRequests(false)}
          />
          Events
        </label>
      </div>
      </div>
    </div>
  );
};

export default CalendarSidebar;
