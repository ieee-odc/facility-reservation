import React, { useEffect, useState } from "react";
import "./event.css";
import Navbar from "../navbar";
import FacilitiesForm from "./FacilitiesForm";
import { useAuth } from "../../context/authContext/AuthProvider";
import axios from "axios";

const EventForm = ({ onSubmit }) => {
  const { currentUser, userLoggedIn, loading } = useAuth();
  console.log("hello from event", currentUser);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [numberOfFacilities, setNumberOfFacilities] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [organizer, setOrganizer] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/reservationInitiators/get-user-id/${currentUser.email}`
        );
        console.log("response 2", response.data.id);
        setOrganizer(response.data.id);
      } catch (error) {
        console.error("Error fetching available facilities:", error);
      }
    };

    fetchUser();
  }, []);

  const today = new Date().toISOString().split("T")[0]; 
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
    return (
      <FacilitiesForm
        numberOfFacilities={numberOfFacilities}
        form1={{
          name,
          description,
          startDate,
          endDate,
          numberOfFacilities,
          organizer,
        }}
      />
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container2">
        <div className="event-form-title-container">
          <h2 className="event-form-title">Event Form</h2>
        </div>
        <form className="event-form" onSubmit={handleSubmit}>
          <div className="event-form-group">
            <label htmlFor="event-name">Event Name</label>
            <div className="event-input-container">
              <input
                type="text"
                id="event-name"
                className="event-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="event-form-group">
            <label htmlFor="event-description">Event Description</label>
            <div className="event-input-container">
              <input
                type="text"
                id="event-description"
                className="event-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="event-form-group">
            <label htmlFor="start-date">Start Date</label>
            <div className="event-input-container">
              <input
                type="date"
                id="start-date"
                className="event-input"
                value={startDate}
                onChange={handleStartDateChange}
                min={today}
                required
              />
            </div>
          </div>
          <div className="event-form-group">
            <label htmlFor="end-date">End Date</label>
            <div className="event-input-container">
              <input
                type="date"
                id="end-date"
                className="event-input"
                value={endDate}
                onChange={handleEndDateChange}
                min={startDate || today}
                required
              />
            </div>
          </div>
          <div className="event-form-group">
            <label htmlFor="number-of-facilities">
              Number of Facilities Required
            </label>
            <div className="event-input-container">
              <input
                type="number"
                id="number-of-facilities"
                className="event-input"
                value={numberOfFacilities}
                onChange={(e) => setNumberOfFacilities(Number(e.target.value))}
                required
              />
            </div>
          </div>
          <button type="submit" className="event-button">
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
