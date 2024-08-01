// src/components/EventModal.js
import React from 'react';
import './EventModal.css';
import axios from 'axios';

const EventModal = ({ show, onHide, eventDetails, onCancel }) => {
  if (!show) return null;

  const handleCancel = async () => {
    try {
      await axios.patch(`http://localhost:3000/api/reservations/${eventDetails.id}`, {
        state: 'Cancelled'
      });
      onCancel(eventDetails.id);
      onHide();
    } catch (error) {
      console.error("Error cancelling reservation", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={onHide}>&times;</span>
        <h2>{eventDetails.title}</h2>
        <p><strong>Start:</strong> {new Date(eventDetails.start).toLocaleString()}</p>
        <p><strong>End:</strong> {new Date(eventDetails.end).toLocaleString()}</p>
        <p><strong>Motive:</strong> {eventDetails.title}</p>
        <p><strong>Facility:</strong> {eventDetails.facility}</p>

        <p><strong>State:</strong> {eventDetails.state}</p>
        <div className='button-group'>
        <button className="cancel-button" onClick={handleCancel}>Cancel Reservation</button>
        <button className="edit-button" >Edit reservation</button></div>

      </div>
    </div>
  );
};

export default EventModal;
