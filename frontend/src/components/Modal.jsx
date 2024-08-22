import React, { useState, useEffect } from 'react';
import CustomUploader from './utils/CustomUploader';
import axios from 'axios';
import './Modal.css';

const Modal = ({ rep, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: null,
    firstName: "",
    lastName: "",
    position: "",
    email: "",
    phone: "",
    picture: "",
  });

  useEffect(() => {
    if (rep) {
      setFormData(rep);
    }
  }, [rep]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileSelect = (file) => {
    setFormData({ ...formData, picture: file });
  };

  const handleFileRemove = () => {
    setFormData({ ...formData, picture: null });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('position', formData.position);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    if (formData.picture) {
      formDataToSend.append('file', formData.picture);
    }

    try {
      const response = await axios.post("http://localhost:3000/api/upload", formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(response.data);
      onSave(response.data.representative);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{rep ? "Edit Representative" : "Add Representative"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Position:</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Picture:</label>
            <CustomUploader
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
            />
          </div>
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
