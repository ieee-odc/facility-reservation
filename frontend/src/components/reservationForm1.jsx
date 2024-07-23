import React, { useState, useEffect } from "react";
import * as yup from "yup";
import "./Reserver.css";
import Navbar from "./navbar";

const schema = yup.object().shape({
  date: yup.date().required("Veuillez choisir une date"),
  time: yup
    .string()
    .matches(
      /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(?:AM|PM)\s*-\s*(0?[1-9]|1[0-2]):([0-5]\d)\s?(?:AM|PM)$/i,
      "Veuillez saisir l'heure dans ce format 'HH:MM-HH:MM AM/PM'"
    )
    .required("Le temps est requis"),
});

function ReserverTimeDate({ onSubmit }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: "09:00 AM - 10:30 AM",
   
  });
  const [errors, setErrors] = useState({});


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    schema
      .validate(formData, { abortEarly: false })
      .then(() => {
        onSubmit(formData.date, formData.time);
      })
      .catch((error) => {
        const newErrors = {};
        error.inner.forEach((err) => {
          if (err.path === 'date' && formData.date === 'mm/dd/yyyy') {
            newErrors[err.path] = 'Veuillez sélectionner une date.';
          } else {
            newErrors[err.path] = err.message;
          }
        });
        setErrors(newErrors);
      });
  };



  return (
    <div>
    <Navbar />
    <div className="container1">
        
      
      <form className="form" onSubmit={handleFormSubmit}>
      <div className="form-title-container">
        <h4 className="form-title">Reservation</h4>
      </div>
        <div className="form-group">
          <label htmlFor="date" className="required-label">Date</label>
          <div className="input-container">
            <input
              type="date"
              id="date"
              name="date"
              className="input"
              value={formData.date}
              min={new Date().toISOString().split("T")[0]}
              onChange={handleInputChange}
            />
            {errors.date && <p className="error-message">{errors.date}</p>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="time" className="required-label">Time</label>
          <div className="input-container">
            <input
              type="text"
              id="time"
              name="time"
              className="input"
              value={formData.time}
              onChange={handleInputChange}
            />
            {errors.time && <p className="error-message">{errors.time}</p>}
          </div>
        </div>


        <div className="info-message">
        Reservations must be made on Wednesday afternoons or on weekends, except in special cases.        </div>

        <button type="submit" className="button">Next</button>
      </form>
    </div>
    </div>
  );
}

export default ReserverTimeDate;
