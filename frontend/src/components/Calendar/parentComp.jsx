

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
  const [reservationDetails, setReservationDetails] = useState({ date: null, time: null, participants: null, facility: null, motif: null, equipment: {} });

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
      >
        <ReserverTimeDate onSubmit={handleReservationTimeDateSubmit} />
      </Modal>
      
      <Modal
        isOpen={isOpen && reserverTimeDateSubmitted && !reserverSalleFormSubmitted && !equipmentFormSubmitted}
        onRequestClose={handleBackToTimeDate}
        contentLabel="Reserver Salle Form Modal"
        overlayClassName="custom-modal-overlay"
        className="custom-modal-content"
      >
        <ReserverSalleform 
          onSubmit={handleReservationSalleformSubmit} 
          onBack={handleBackToTimeDate} 
          date={reservationDetails.date} 
          time={reservationDetails.time} 
        />
      </Modal>

      <Modal
        isOpen={isOpen && reserverSalleFormSubmitted && !equipmentFormSubmitted}
        onRequestClose={handleBackToSalleForm}
        contentLabel="Equipment Reservation Form Modal"
        overlayClassName="custom-modal-overlay"
        className="custom-modal-content"
      >
        <EquipmentReservationForm
          onSubmit={handleEquipmentReservationSubmit}
          onBack={handleBackToSalleForm}
        />
      </Modal>

      <Modal
        isOpen={isOpen && equipmentFormSubmitted}
        onRequestClose={handleBackToEquipmentForm}
        contentLabel="Reservation Details Modal"
        overlayClassName="custom-modal-overlay"
        className="custom-modal-content"
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
