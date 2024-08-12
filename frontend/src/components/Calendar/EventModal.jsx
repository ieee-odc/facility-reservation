import React, { useState } from "react";
import "./EventModal.css";
import axios from "axios";
import EditReservationForm from "./EditReservationForm"; // Import the form component

const EventModal = ({ show, onHide, eventDetails, onCancel }) => {
  const [editFormOpen, setEditFormOpen] = useState(false);

  const handleCancel = async () => {
    try {
      await axios.patch(
        `http://localhost:3000/api/reservations/${eventDetails.id}`,
        { state: "Cancelled" }
      );
      onCancel(eventDetails.id);
      onHide();
    } catch (error) {
      console.error("Error cancelling reservation", error);
    }
  };

  const handleEditClick = () => {
    setEditFormOpen(true);
  };

  return (
    <>
      {show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-button" onClick={onHide}>
              &times;
            </span>
            <h2>{eventDetails.title}</h2>
            <p><strong>Start:</strong> {new Date(eventDetails.start).toLocaleString()}</p>
            <p><strong>End:</strong> {new Date(eventDetails.end).toLocaleString()}</p>
            <p><strong>Motive:</strong> {eventDetails.title}</p>
            <p><strong>Facility:</strong> {eventDetails.facility}</p>
            <p><strong>State:</strong> {eventDetails.state}</p>
            {(eventDetails.state === 'Pending') && (
              <div className="button-group">
                <button className="cancel-button" onClick={handleCancel}>
                  Cancel Reservation
                </button>
                <button className="edit-button" onClick={handleEditClick}>
                  Edit Reservation
                </button>
              </div>
            )}
          </div>
          <EditReservationForm
            open={editFormOpen}
            onClose={() => setEditFormOpen(false)}
            reservationData={{
              date: eventDetails.date, // Make sure these properties match the ones used in EditReservationForm
              startTime: eventDetails.start,
              endTime: eventDetails.end,
              participants: eventDetails.participants,
              facility: eventDetails.facility,
              motif: eventDetails.title,
              equipment: eventDetails.equipment
            }}
            onUpdate={(updatedReservation) => {
              // Handle the update, e.g., refresh the data or update state
            }}
          />
        </div>
      )}
    </>
  );
};

export default EventModal;
