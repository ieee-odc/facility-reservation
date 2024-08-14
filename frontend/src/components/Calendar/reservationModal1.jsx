import React, { useEffect, useState } from "react";
import * as yup from "yup";
import "../Reserver.css";

const schema = yup.object().shape({
  date: yup.date().required("Veuillez choisir une date"),
  time: yup
    .string()
    .matches(
      /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(?:AM|PM)\s*-\s*(0?[1-9]|1[0-2]):([0-5]\d)\s?(?:AM|PM)$/i,
      "Veuillez saisir l'heure dans ce format 'HH:MM-HH:MM AM/PM'"
    )
    .required("Le temps est requis"),
  participants: yup
    .number()
    .min(1, "Le nombre de participants doit être au moins de 1")
    .max(100, "Le nombre de participants ne peut pas dépasser 100")
    .required("Veuillez entrer le nombre de participants"),
});

function ReserverTimeDate({ onSubmit, initialData, onClose }) {
  const [formData, setFormData] = useState({
    date: initialData.date || '',
    time: initialData.time || '',
    participants: 1,
  });

  if (initialData.time === "12:00 AM - 12:00 AM") {
    formData.time = "09:00 AM - 10:30 AM";
  }

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date,
        time: initialData.time,
        participants: initialData.participants,
      });
    }
  }, [initialData]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    schema
      .validate(formData, { abortEarly: false })
      .then(() => {
        setErrors({});
        onSubmit(formData.date, formData.time, formData.participants);
      })
      .catch((error) => {
        const newErrors = {};
        if (Array.isArray(error.inner)) {
          error.inner.forEach((err) => {
            newErrors[err.path] = err.message;
          });
        } else if (error.errors) {
          newErrors.general = error.errors.join(', ');
        }
        setErrors(newErrors);
      });
  };

  return (
    <div className="container3">
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
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

        <div className="form-group">
          <label htmlFor="participants" className="required-label">Participants</label>
          <div className="input-container">
            <input
              type="number"
              id="participants"
              name="participants"
              className="input"
              value={formData.participants}
              onChange={handleInputChange}
              min="1"
              max="1000"
            />
            {errors.participants && <p className="error-message">{errors.participants}</p>}
          </div>
        </div>

        <div className="info-message">
          Reservations must be made on Wednesday afternoons or on weekends, except in special cases.
        </div>

        <button type="submit" className="button">Next</button>
      </form>
    </div>
  );
}

export default ReserverTimeDate;
