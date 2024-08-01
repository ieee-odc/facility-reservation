import React, { useState } from "react";
import ReserverTimeDate from "../reservationForm1";
import Modal from "./Modal";
import "./Modal.css"; 

function ReserverModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleFormSubmit = (date, time, participants) => {
    console.log("Reservation Data:", { date, time, participants });

  };

  return (
    <div>
      <button onClick={openModal} className="open-modal-button">Open Reservation Form</button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ReserverTimeDate onSubmit={handleFormSubmit} />
      </Modal>
    </div>
  );
}

export default ReserverModal;
