import React, { useState, useEffect } from "react";
import CustomUploader from "./utils/CustomUploader";
import axios from "axios";
import "./Modal.css";
import { useAuth } from "../context/authContext/AuthProvider";

const Modal = ({ rep, onSave, onClose }) => {
  console.log("rep", rep);

  const { currentId } = useAuth();
  const [formData, setFormData] = useState({
    id: null,
    firstName: "",
    lastName: "",
    position: "",
    contactEmail: "",
    contactPhoneNumber: "",
    profileImage: "",
  });

  useEffect(() => {
    if (rep) {
      console.log("rep", rep);

      setFormData(rep);
    }
  }, [rep]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileSelect = (file) => {
    setFormData({ ...formData, profileImage: file });
  };

  const handleFileRemove = () => {
    setFormData({ ...formData, profileImage: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("position", formData.position);
    formDataToSend.append("contactEmail", formData.contactEmail);
    formDataToSend.append("contactPhoneNumber", formData.contactPhoneNumber);
    formDataToSend.append("currentId", currentId);
    if (formData.profileImage) {
      formDataToSend.append("file", formData.profileImage);
      console.log("formData", formData.profileImage);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/responsibles/add-responsible",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setFormData({
        id: null,
        firstName: "",
        lastName: "",
        position: "",
        contactEmail: "",
        contactPhoneNumber: "",
        profileImage: "",
      });
      console.log(response.data);
      onSave(response.data.representative);
      window.location.reload();
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
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              name="contactPhoneNumber"
              value={formData.contactPhoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Picture:</label>
            <CustomUploader
              existingPath={`http://localhost:3000/${formData.profileImage}`}
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
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
