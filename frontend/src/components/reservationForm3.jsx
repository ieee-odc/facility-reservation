import React, { useState, useEffect } from 'react';
import './Reserver.css';
import axios from 'axios';
import Navbar from "./navbar";
import { IoArrowBackOutline } from "react-icons/io5";

const ReservationDetails = ({ date, time, participants, facility, motif, equipment, onBack, onQuit }) => {
  const [formVisible, setFormVisible] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  useEffect(() => {
    // Set the form data from props
  }, [date, time, participants, facility, motif, equipment]);

  const handleCancel = async () => {
    onQuit(); // Trigger the quit function
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/reservations', {
        facility,
        motive: motif,
        date,
        time,
        participants,
        equipment, // Add equipment data to the payload
      });

      console.log('Data sent to MongoDB:', response.data);
      setSubmissionStatus('success');
      setFormVisible(false);
    } catch (error) {
      console.error('Error sending data:', error);
      setSubmissionStatus('failed');
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderPopup = () => {
    if (submissionStatus === 'success') {
      return (
        <div className="popup success">
          <p>La réservation a été envoyée avec succès!</p>
        </div>
      );
    } else if (submissionStatus === 'failed') {
      return (
        <div className="popup failed">
          <p>Échec de la réservation. Veuillez réessayer.</p>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container1 container2">
        <div className="form">
          <div className="button-group">
            <IoArrowBackOutline className="back" size={24} onClick={onBack} />
          </div>
          <div className="form-title-container">
            <h4 className="form-title">Reservation details</h4>
          </div>
          <div className="form-group">
            <label htmlFor="participants" className="label">Participants</label>
            <input type="text" id="participants" className="input" value={participants} readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="salle" className="label">Facility</label>
            <input type="text" id="salle" className="input" value={facility} readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="motif" className="label">Reason</label>
            <textarea id="motif" rows="3" className="input" value={motif} readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="date" className="label">Date</label>
            <input type="text" id="date" className="input" value={formatDate(date)} readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="time" className="label">Time</label>
            <input type="text" id="time" className="input" value={time} readOnly />
          </div>
          <div className="form-group">
            <label className="label">Reserved Equipments</label>
            <ul className="equipment-list">
              {equipment && Object.entries(equipment).map(([key, value]) => (
                <li key={key} className="equipment-item">
                  {key}: {value}
                </li>
              ))}
            </ul>
          </div>
          {renderPopup()}
          <div className="button-group">
            <button type="button" className="button" onClick={handleSubmit}>Confirm</button>
            <button type="button" className="button cancel-button" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetails;
