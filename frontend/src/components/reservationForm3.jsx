import React, { useState, useEffect } from 'react';
import './ReservationDetails.css';
import axios from 'axios';
import Navbar from "./navbar";
import { IoArrowBackOutline } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReservationDetails = ({ date, time, participants, facility, motif, equipment, onBack, onQuit }) => {
  const [formVisible, setFormVisible] = useState(true);

  useEffect(() => {
    // Set the form data from props
  }, [date, time, participants, facility, motif, equipment]);

  const handleCancel = async () => {
    onQuit();
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/reservations', {
       
        
        date,
        time,
        motive: motif,
        materials: equipment, 
        effective: participants,
        facility,
        
       
      });

      console.log('Data sent to MongoDB:', response.data);
      toast.success('Reservation successfully submitted!');
      setFormVisible(false);
    } catch (error) {
      console.error('Error sending data:', error);
      toast.error('Failed to submit reservation. Please try again.');
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
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

          {/* Row for Participants and Facility */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="participants" className="label">Participants</label>
              <input type="text" id="participants" className="inputd" value={participants} readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="salle" className="label">Facility</label>
              <input type="text" id="salle" className="inputd" value={facility} readOnly />
            </div>
          </div>

          {/* Row for Date and Time */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date" className="label">Date</label>
              <input type="text" id="date" className="inputd" value={formatDate(date)} readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="time" className="label">Time</label>
              <input type="text" id="time" className="inputd" value={time} readOnly />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="motif" className="label">Reason</label>
            <textarea id="motif" rows="3" className="input" value={motif} readOnly />
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

          <div className="button-group">
            <button type="button" className="button" onClick={handleSubmit}>Confirm</button>
            <button type="button" className="button cancel-button" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ReservationDetails;
