import React, { useState, useEffect } from "react";
import "./Modal.css"; // Ensure this is the correct path to your CSS file
import axios from "axios";

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

  const handleSubmit = async(e) => {
    e.preventDefault();
    onSave(formData);
    const data = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      contactEmail: formData.email,
      contactPhoneNumber: formData.phone,
      position: formData.position,
      picture: formData.picture || ''
    }
    if (!rep){
      axios.post("http://localhost:3000/api/responsibles", data)
      .then((resp)=>{
        console.log(resp);
      })
      .catch((error)=>{
        console.log(error);
      })
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
          <div className="modal-buttons">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
