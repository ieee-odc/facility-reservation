import React from 'react';
import './Modal.css'; 

const DeleteModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="delete-modal">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete this representative?</p>
        <div className="modal-buttons">
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="button" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
