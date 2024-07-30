import React, { useState } from 'react';
import '../Reserver.css'; 
import Navbar from '../navbar';
const EventForm = () => {
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  
    console.log('Event Name:', eventName);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
  };

  return (
    <body>
        <Navbar/>
    
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
          <label htmlFor="start-date">Start Date</label>
          <div className="input-container">
            <input
              type="date"
              id="start-date"
              className="input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
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
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="button">Next</button>
      </form>
    </div>
    </body>
  );
};

export default EventForm;
