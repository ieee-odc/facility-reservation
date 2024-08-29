import React, { useState, useEffect } from "react";
import { Modal, Button } from "rsuite";
import axios from "axios";
import "../event/event.css";
import { useAuth } from "../../context/authContext/AuthProvider";
import FacilitiesForm from "./FacilitiesModal.jsx"; // Adjust the path as needed
import moment from "moment";

const EventForm = ({ open, onClose, onSubmit, slotDetails }) => {
  const { currentUser } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(moment(slotDetails?.start)?.format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment(slotDetails?.end)?.subtract(moment(slotDetails?.end).format("YYYY-MM-DD") == moment(slotDetails?.start).format("YYYY-MM-DD") ? 0 : 1, "days")?.format("YYYY-MM-DD"));
  const [numberOfFacilities, setNumberOfFacilities] = useState(1);
  const [organizer, setOrganizer] = useState("");
  const [facilitiesModalOpen, setFacilitiesModalOpen] = useState(false);
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
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/reservationInitiators/get-user-id/${currentUser.email}`
        );
        setOrganizer(response.data.id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUser();
  }, [currentUser]);

  

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      startDate,
      endDate,
      numberOfFacilities,
      organizer,
    });
  };

  const handleNext = () => {
    setFacilitiesModalOpen(true);
  };

  return (
    <>
      <Modal open={open} onClose={onClose} size="md"
      className="custom-modal-overlay"
      >
        
        <Modal.Body>
        <div >
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
          
        </form>
      </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleNext} appearance="primary">Next</Button>
          <Button onClick={onClose} appearance="subtle">Cancel</Button>
        </Modal.Footer>
      </Modal>

      <FacilitiesForm
        open={facilitiesModalOpen}
        onClose={() => setFacilitiesModalOpen(false)}
        numberOfFacilities={numberOfFacilities}
        form1={{ name, description, startDate, endDate, organizer }}
      />
    </>
  );
};

export default EventForm;
