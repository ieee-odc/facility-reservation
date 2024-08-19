import React, { useState } from "react";
import "./EventModal.css";
import axios from "axios";
import EditReservationForm from "./EditReservationForm";
import EventForm from "./EditEventForm1";
import { useAuth } from "../../context/authContext/AuthProvider";

const EventModal = ({ show, onHide, eventDetails, onCancel, viewType }) => {
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const { userLoggedIn, currentId, currentRole } = useAuth();

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

  const handleShowCancelConfirmation = () => {
    setShowCancelConfirmation(true);
  };

  const handleCloseCancelConfirmation = () => {
    setShowCancelConfirmation(false);
  };

  const handleConfirmCancel = () => {
    handleCancel();
    setShowCancelConfirmation(false);
  };

  const handleApprove = async () => {
    try {
      await axios.patch(
        `http://localhost:3000/api/reservations/${eventDetails.id}`,
        { state: "Approved" }
      );
      onCancel(eventDetails.id);
      onHide();
    } catch (error) {
      console.error("Error approving reservation", error);
    }
  };

  const handleReject = async () => {
    try {
      await axios.patch(
        `http://localhost:3000/api/reservations/${eventDetails.id}`,
        { state: "Rejected" }
      );
      onCancel(eventDetails.id);
      onHide();
    } catch (error) {
      console.error("Error rejecting reservation", error);
    }
  };

  return (
    <>
      {show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-button" onClick={onHide}>
              &times;
            </span>
            <h2>{viewType === "events" ? eventDetails.title : eventDetails.title}</h2>
            {viewType === "events" ? (
              <>
                <p><strong>Description:</strong> {eventDetails.description}</p>
                <p><strong>Start Date:</strong> {new Date(eventDetails.start).toLocaleString()}</p>
                <p><strong>End Date:</strong> {new Date(eventDetails.end).toLocaleString()}</p>
                <p><strong>Total Effective:</strong> {eventDetails.totalEffective}</p>
                <p><strong>Organizer:</strong> {eventDetails.organizer}</p>
              </>
            ) : (
              <>
                <p><strong>Start:</strong> {new Date(eventDetails.start).toLocaleString()}</p>
                <p><strong>End:</strong> {new Date(eventDetails.end).toLocaleString()}</p>
                <p><strong>Motive:</strong> {eventDetails.title}</p>
                <p><strong>Participants:</strong> {eventDetails.participants}</p>
                <p><strong>Facility:</strong> {eventDetails.facility}</p>
              </>
            )}
            <p><strong>State:</strong> {eventDetails.state}</p>
            {eventDetails.state === "Pending" && (
              <div className="button-group">
                {currentRole === "Admin" ? (
                  <>
                    <button className="approve-button" onClick={handleApprove}>
                      Approve
                    </button>
                    <button className="reject-button" onClick={handleReject}>
                      Reject
                    </button>
                  </>
                ) : (
                  <>
                    <button className="cancel-button" onClick={handleShowCancelConfirmation}>
                      Cancel Reservation
                    </button>
                    <button className="edit-button" onClick={handleEditClick}>
                      {viewType === "events" ? "Edit Event" : "Edit Reservation"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {showCancelConfirmation && (
            <div className="confirmation-popup">
              <p>Are you sure you want to cancel this reservation?</p>
              <div className="confirmation-buttons">
                <button className="yes-button" onClick={handleConfirmCancel}>
                  Yes
                </button>
                <button className="no-button" onClick={handleCloseCancelConfirmation}>
                  No
                </button>
              </div>
            </div>
          )}

          {viewType === "requests" ? (
            <EditReservationForm
              open={editFormOpen}
              onClose={() => setEditFormOpen(false)}
              reservationData={{
                date: eventDetails.date,
                startTime: eventDetails.start,
                endTime: eventDetails.end,
                participants: eventDetails.participants,
                facility: eventDetails.facility,
                motive: eventDetails.title,
                equipment: eventDetails.equipment,
              }}
              onUpdate={(updatedReservation) => {
                // Handle the update
              }}
            />
          ) : (
            <EventForm
              open={editFormOpen}
              onClose={() => setEditFormOpen(false)}
              eventData={{
                id: eventDetails.id,
                name: eventDetails.title,
                description: eventDetails.description,
                startDate: eventDetails.start,
                endDate: eventDetails.end,
                totalEffective: eventDetails.totalEffective,
                numberOfFacilities: eventDetails.numberOfFacilities,
                organizer: eventDetails.organizer,
              }}
              onUpdate={(updatedEvent) => {
                // Handle the update
              }}
            />
          )}
        </div>
      )}
    </>
  );
};

export default EventModal;
