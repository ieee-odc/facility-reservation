import React, { useState } from 'react';
import ReserverTimeDate from "./reservationModal1";
import ReserverSalleform from "./reservationModal2";
import EquipmentReservationForm from './reservationModal3';
import ReservationDetails from "./reservationModal4";
import Modal from 'react-modal';
import "./style.css"; // Ensure this is imported for the styles

Modal.setAppElement('#root'); // Set the app root element for accessibility

function ParentComp({ isOpen, onRequestClose }) {
  const [reserverTimeDateSubmitted, setReserverTimeDateSubmitted] = useState(false);
  const [reserverSalleFormSubmitted, setReserverSalleFormSubmitted] = useState(false);
  const [equipmentFormSubmitted, setEquipmentFormSubmitted] = useState(false); 
  const [reservationDetails, setReservationDetails] = useState({
    date: '',
    time: '',
    participants: '',
    facility: '',
    motif: '',
    equipment: {}
  });

  const handleReservationTimeDateSubmit = (date, time, participants) => {
    setReserverTimeDateSubmitted(true);
    setReservationDetails(prevState => ({ ...prevState, date, time, participants }));
  };

  const handleReservationSalleformSubmit = (facility, motif) => {
    setReserverSalleFormSubmitted(true);
    setReservationDetails(prevState => ({ ...prevState, facility, motif }));
  };

  const handleEquipmentReservationSubmit = (equipment) => {
    setReservationDetails(prevState => ({ ...prevState, equipment }));
    setEquipmentFormSubmitted(true); 
  };

  const handleBackToTimeDate = () => {
    setReserverTimeDateSubmitted(false);
    setReserverSalleFormSubmitted(false);
    setEquipmentFormSubmitted(false);
  };

  const handleBackToSalleForm = () => {
    setReserverSalleFormSubmitted(false);
    setEquipmentFormSubmitted(false);
  };

  const handleBackToEquipmentForm = () => {
    setEquipmentFormSubmitted(false);
  };

  return (
    <div>
      <Modal
        isOpen={isOpen && !reserverTimeDateSubmitted}
        onRequestClose={onRequestClose}
        contentLabel="Reserver Time Date Modal"
        overlayClassName="custom-modal-overlay"
        className="custom-modal-content"
        shouldCloseOnOverlayClick={true} // Add this line

      >
        <ReserverTimeDate 
          onSubmit={handleReservationTimeDateSubmit} 
          date={reservationDetails.date}
          time={reservationDetails.time}
          participants={reservationDetails.participants}
        />
      </Modal>
      
      <Modal
        isOpen={isOpen && reserverTimeDateSubmitted && !reserverSalleFormSubmitted && !equipmentFormSubmitted}
        contentLabel="Reserver Salle Form Modal"
        overlayClassName="custom-modal-overlay"
        className="custom-modal-content"
        shouldCloseOnOverlayClick={true} // Add this line 

      >
        <ReserverSalleform 
          onSubmit={handleReservationSalleformSubmit} 
          onBack={handleBackToTimeDate} 
          date={reservationDetails.date} 
          time={reservationDetails.time}
          facility={reservationDetails.facility}
          motif={reservationDetails.motif}
        />
      </Modal>

      <Modal
        isOpen={isOpen && reserverSalleFormSubmitted && !equipmentFormSubmitted}
        contentLabel="Equipment Reservation Form Modal"
        overlayClassName="custom-modal-overlay"
        className="custom-modal-content"
        shouldCloseOnOverlayClick={true} // Add this line

      >
        <EquipmentReservationForm
          onSubmit={handleEquipmentReservationSubmit}
          onBack={handleBackToSalleForm}
          equipment={reservationDetails.equipment}
        />
      </Modal>

      <Modal
        isOpen={isOpen && equipmentFormSubmitted}
        contentLabel="Reservation Details Modal"
        overlayClassName="custom-modal-overlay"
        className="custom-modal-content"
        shouldCloseOnOverlayClick={true} // Add this line

      >
        <ReservationDetails
          date={reservationDetails.date}
          time={reservationDetails.time}
          facility={reservationDetails.facility}
          participants={reservationDetails.participants}
          motif={reservationDetails.motif}
          equipment={reservationDetails.equipment}
          onBack={handleBackToEquipmentForm}
          onQuit={() => onRequestClose()}
        />
      </Modal>
    </div>
  );
}

export default ParentComp;
