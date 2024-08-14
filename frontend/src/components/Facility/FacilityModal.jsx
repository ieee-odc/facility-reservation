// src/components/InitiatorModal.js
import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const FacilityModal = ({ isOpen, onRequestClose, contentLabel, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={contentLabel}
      className="user-modal"
      overlayClassName="user-modal-overlay"
    >
      <div className="user-modal-content">
        {children}
      </div>
    </Modal>
  );
};

export default FacilityModal;
