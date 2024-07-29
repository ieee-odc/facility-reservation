import React, { useState, useEffect } from 'react';
import './Reserver.css';
import axios from 'axios';
import Navbar from "./navbar";
import { IoArrowBackOutline } from "react-icons/io5";


const ReservationDetails = ({ date, time, participants, facility, motif, otherMotif, onBack, onQuit }) => {
  const [formVisible, setFormVisible] = useState(true);
  const [formData, setFormData] = useState({ participants: '', facility: '', motif: '', date: '', time: '' });
  console.log(facility);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  useEffect(() => {
    console.log("Props received:", { date, time, participants, facility, motif, otherMotif });
    setFormData(prevState => ({
      ...prevState,
      participants,
      facility,
      date,
      time,
      motif: motif || otherMotif,
    }));
  }, [date, time, participants, facility, motif, otherMotif]);
  
  const handleCancel = async () => {
Navigate("/navbar");
  }
  const handleSubmit = async () => {
    //const userId = localStorage.getItem('userId'); 
    try {
      console.log('Data to be sent:', { ...formData });

      const response = await axios.post('http://localhost:3000/reservations', {
        facility: formData.facility,
        motive: formData.motif,
        date: formData.date,
        time: formData.time,
        participants: formData.participants,
       // userId: userId, 
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
    <body>
    <Navbar />
    <div className="container1 container2">

      <div className="form">
      <div className="button-group">
          <IoArrowBackOutline className="back" size={24}  onClick={onBack}/>

          </div>
      <div className="form-title-container">
        <h4 className="form-title">Reservation details</h4>
      </div>
        <div className="form-group">
          <label htmlFor="participants" className="label">Participants</label>
          <input type="text" id="participants" className="input" value={formData.participants} readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="salle" className="label">Facility</label>
          <input type="text" id="salle" className="input" value={formData.facility} readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="motif" className="label">Reason</label>
          <textarea id="motif" rows="3"  className="input" value={formData.motif} readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="date" className="label">Date</label>
          <input type="text" id="date" className="input" value={formatDate(formData.date)} readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="temps" className="label">Time</label>
          <input type="text" id="time" className="input" value={formData.time} readOnly />
        </div>
        {renderPopup()}
        <div className="button-group">
        <button type="button" className="button" onClick={handleSubmit}>Confirm</button>
        <button type="button" className="button cancel-button" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
    </body>
  );
};

export default ReservationDetails;
