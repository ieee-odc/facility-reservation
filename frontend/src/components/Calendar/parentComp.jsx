import React, { useEffect, useState } from "react";
import ReserverTimeDate from "./reservationModal1";
import ReserverSalleform from "./reservationModal2";
import EquipmentReservationForm from "./reservationModal3";
import ReservationDetails from "./reservationModal4";
import Modal from "react-modal";
import moment from "moment";
import "./style.css";

Modal.setAppElement("#root");

function ParentComp({
  isOpen,
  onRequestClose,
  slotDetails,
  currentView,
  currentId,
}) {
  const [reserverTimeDateSubmitted, setReserverTimeDateSubmitted] =
    useState(false);
  const [reserverSalleFormSubmitted, setReserverSalleFormSubmitted] =
    useState(false);
  const [equipmentFormSubmitted, setEquipmentFormSubmitted] = useState(false);
  const [reservationDetails, setReservationDetails] = useState({
    date: null,
    time: "09:30 AM - 10:00 AM",
    participants: null,
    facility: null,
    motif: null,
    equipment: {},
  });

  useEffect(() => {
    if (slotDetails) {
      const start = moment(slotDetails.start);
      const end = moment(slotDetails.end);

      if (currentView === "month") {
        setReservationDetails((prevState) => ({
          ...prevState,
          date: start.format("YYYY-MM-DD"),
          time: "09:30 AM - 10:00 AM",
        }));
      } else {
        setReservationDetails((prevState) => ({
          ...prevState,
          date: start.format("YYYY-MM-DD"),
          time: `${start.format("hh:mm A")} - ${end.format("hh:mm A")}`,
        }));
      }
    }
  }, [slotDetails, currentView]);

  const handleReservationTimeDateSubmit = (date, time, participants) => {
    setReserverTimeDateSubmitted(true);
    setReservationDetails((prevState) => ({
      ...prevState,
      date,
      time,
      participants,
    }));
  };

  const handleReservationSalleformSubmit = (facility, motif) => {
    setReserverSalleFormSubmitted(true);
    setReservationDetails((prevState) => ({ ...prevState, facility, motif }));
  };

  const handleEquipmentReservationSubmit = (equipment) => {
    setReservationDetails((prevState) => ({ ...prevState, equipment }));
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

  const handleClose = () => {
    onRequestClose();
    setReserverTimeDateSubmitted(false);
    setReserverSalleFormSubmitted(false);
    setEquipmentFormSubmitted(false);
  };

  return (
    <div>
      <Modal
        size="md"
        isOpen={isOpen && !reserverTimeDateSubmitted}
        onRequestClose={handleClose}
        contentLabel="Reserver Time Date Modal"
        overlayClassName="custom-modal-overlay"
        
        shouldCloseOnOverlayClick={true}
      >
        <ReserverTimeDate
          onSubmit={handleReservationTimeDateSubmit}
          initialData={reservationDetails}
          onClose={handleClose}
        />
      </Modal>

      <Modal
        size="md"
        isOpen={
          isOpen &&
          reserverTimeDateSubmitted &&
          !reserverSalleFormSubmitted &&
          !equipmentFormSubmitted
        }
        onRequestClose={handleBackToTimeDate}
        contentLabel="Reserver Salle Form Modal"
        overlayClassName="custom-modal-overlay"
        
        shouldCloseOnOverlayClick={true}
      >
        <ReserverSalleform
          onSubmit={handleReservationSalleformSubmit}
          onBack={handleBackToTimeDate}
          date={reservationDetails.date}
          time={reservationDetails.time}
        />
      </Modal>

      <Modal
        size="md"
        isOpen={isOpen && reserverSalleFormSubmitted && !equipmentFormSubmitted}
        contentLabel="Equipment Reservation Form Modal"
        overlayClassName="custom-modal-overlay"
        
        shouldCloseOnOverlayClick={true}
      >
        <EquipmentReservationForm
          onSubmit={handleEquipmentReservationSubmit}
          onBack={handleBackToSalleForm}
          equipment={reservationDetails.equipment}
        />
      </Modal>

      <Modal
        size="md"
        isOpen={isOpen && equipmentFormSubmitted}
        contentLabel="Reservation Details Modal"
        overlayClassName="custom-modal-overlay"
        
        shouldCloseOnOverlayClick={true}
      >
        <ReservationDetails
          date={reservationDetails.date}
          time={reservationDetails.time}
          facility={reservationDetails.facility}
          participants={reservationDetails.participants}
          motif={reservationDetails.motif}
          equipment={reservationDetails.equipment}
          onBack={handleBackToEquipmentForm}
          onQuit={handleClose}
          currentId={currentId}
        />
      </Modal>
    </div>
  );
}

export default ParentComp;
