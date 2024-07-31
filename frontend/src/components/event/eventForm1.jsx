import React, { useState } from 'react';
import '../Reserver.css'; 
import Navbar from '../navbar';
import FacilitiesForm from './FacilitiesForm';

const EventForm = ({ onSubmit }) => {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [numberOfFacilities, setNumberOfFacilities] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    if (endDate && e.target.value > endDate) {
      setEndDate(e.target.value);
    }
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return <FacilitiesForm numberOfFacilities={numberOfFacilities} form1={{eventName,eventDescription,startDate,endDate,numberOfFacilities}}/>;
  }

  return (
    <div>
      <Navbar />
      <div className="container1">
        <div className="form-title-container">
          <h2 className="form-title">Event Form</h2>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="event-name">Event Name</label>
            <div className="input-container">
              <input
                type="text"
                id="event-name"
                className="input"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="event-description">Event Description</label>
            <div className="input-container">
              <input
                type="text"
                id="event-description"
                className="input"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="start-date">Start Date</label>
            <div className="input-container">
              <input
                type="date"
                id="start-date"
                className="input"
                value={startDate}
                onChange={handleStartDateChange}
                min={today}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="end-date">End Date</label>
            <div className="input-container">
              <input
                type="date"
                id="end-date"
                className="input"
                value={endDate}
                onChange={handleEndDateChange}
                min={startDate || today}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="number-of-facilities">Number of Facilities Required</label>
            <div className="input-container">
              <input
                type="number"
                id="number-of-facilities"
                className="input"
                value={numberOfFacilities}
                onChange={(e) => setNumberOfFacilities(Number(e.target.value))}
                min="1"
                required
              />
            </div>
          </div>
          <button type="submit" className="button">Next</button>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
