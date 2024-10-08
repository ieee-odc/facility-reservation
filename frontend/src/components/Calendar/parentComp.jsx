import React, { useEffect, useState } from "react";
import ReserverTimeDate from "./reservationModal1";
import ReserverSalleform from "./reservationModal2";
import EquipmentReservationForm from "./reservationModal3";
import ReservationDetails from "./reservationModal4";
import Modal from "react-modal";
import moment from "moment";
import "./style.css";

Modal.setAppElement("#root"); 

function ParentComp({ isOpen, onRequestClose, slotDetails, currentView, currentId }) {
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
  const handleClose = () => {
    setIsModalOpen(false);
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
          initialData={reservationDetails}
          onClose={handleClose}
        />
      </Modal>

      <Modal
        isOpen={
          isOpen &&
          reserverTimeDateSubmitted &&
          !reserverSalleFormSubmitted &&
          !equipmentFormSubmitted
        }
        onRequestClose={handleBackToTimeDate}
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
          currentId={currentId}

        />

      </Modal>
    </div>
  );
}

export default ParentComp;
