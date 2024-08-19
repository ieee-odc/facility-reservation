import React, { useState, useEffect } from "react";
import { Modal, Button } from "rsuite";
import axios from "axios";
import "../event/event.css";
import { useAuth } from "../../context/authContext/AuthProvider";
import FacilitiesForm from "./FacilitiesModal.jsx"; // Adjust the path as needed

const formatDateForInput = (dateString) => {
  // Convert date string from 'M/D/YYYY, H:mm:ss AM/PM' to 'YYYY-MM-DD'
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const EventForm = ({ open, onClose, onSubmit, eventData }) => {
  const { currentUser } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [numberOfFacilities, setNumberOfFacilities] = useState(1);
  const [organizer, setOrganizer] = useState("");
  const [facilitiesModalOpen, setFacilitiesModalOpen] = useState(false);

  useEffect(() => {
    if (eventData) {
      setName(eventData.name || "");
      setDescription(eventData.description || "");
      setStartDate(formatDateForInput(eventData.startDate) || new Date().toISOString().split("T")[0]);
      setEndDate(formatDateForInput(eventData.endDate) || new Date().toISOString().split("T")[0]);
      setOrganizer(eventData.organizer || "");

      
      const fetchReservations = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/reservations/event/${eventData.id}`
          );
          setNumberOfFacilities(response.data.length);
          console.log(response.data);
              console.log(response.data.length); 

        } catch (error) {
          console.error("Error fetching reservations:", error);
        }
      };

      fetchReservations();
    } else {
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
    }
  }, [eventData, currentUser]);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    if (endDate && e.target.value > endDate) {
      setEndDate(e.target.value);
    }
  };

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
    // Open the FacilitiesForm modal
    setFacilitiesModalOpen(true);
  };

  return (
    <>
      <Modal open={open} onClose={onClose} size="md">
        <Modal.Header>
          <Modal.Title>{eventData ? "Edit Event" : "Event Form"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="event-form" onSubmit={handleSubmit}>
            {/* Event Name */}
            <div className="event-form-group">
              <label htmlFor="event-name">Event Name</label>
              <input
                type="text"
                id="event-name"
                className="event-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            {/* Event Description */}
            <div className="event-form-group">
              <label htmlFor="event-description">Event Description</label>
              <input
                type="text"
                id="event-description"
                className="event-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            {/* Start Date */}
            <div className="event-form-group">
              <label htmlFor="start-date">Start Date</label>
              <input
                type="date"
                id="start-date"
                className="event-input"
                value={startDate}
                onChange={handleStartDateChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            {/* End Date */}
            <div className="event-form-group">
              <label htmlFor="end-date">End Date</label>
              <input
                type="date"
                id="end-date"
                className="event-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                required
              />
            </div>
            {/* Number of Facilities */}
            <div className="event-form-group">
              <label htmlFor="number-of-facilities">Number of Facilities Required</label>
              <input
                type="number"
                id="number-of-facilities"
                className="event-input"
                value={numberOfFacilities}
                onChange={(e) => setNumberOfFacilities(Number(e.target.value))}
                required
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleNext} appearance="primary">{eventData ? "Next" : "Next"}</Button>
          <Button onClick={onClose} appearance="subtle">Cancel</Button>
        </Modal.Footer>
      </Modal>

      <FacilitiesForm
        open={facilitiesModalOpen}
        onClose={() => setFacilitiesModalOpen(false)}
        numberOfFacilities={numberOfFacilities}
        form1={{ name, description, startDate, endDate, organizer }}
        facilitiesData={eventData?.facilities} // Pass facilities data for pre-filling
      />
    </>
  );
};

export default EventForm;
