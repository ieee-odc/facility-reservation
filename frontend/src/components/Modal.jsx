import React, { useState, useEffect } from 'react';
import './Modal.css'; // Ensure this is the correct path to your CSS file

const Modal = ({ rep, onSave, onClose }) => {
  const [formData, setFormData] = useState({ id: null, firstName: '', lastName: '', position: '', email: '', phone: '', picture: '' });

  useEffect(() => {
    if (rep) {
      setFormData(rep);
    }
  }, [rep]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{rep ? 'Edit Representative' : 'Add Representative'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            First Name:
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </label>
          <label>
            Last Name:
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </label>
          <label>
            Position:
            <input type="text" name="position" value={formData.position} onChange={handleChange} required />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
          <label>
            Phone:
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </label>
          <div className="modal-buttons">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
