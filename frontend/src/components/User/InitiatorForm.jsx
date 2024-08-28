import React, { useState, useEffect } from "react";

const InitiatorForm = ({ initiator, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    backupEmail: "",
    nature: "",
    service: "",
    organisation: "",
    role: "",
  });

  useEffect(() => {
    if (initiator) {
      setFormData(initiator);
    }
  }, [initiator]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <div className="event-form-group">
        <label htmlFor="event-name">Name</label>

        <div className="event-input-container">
          <input
            className="event-input"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
          />
        </div>
      </div>
      <div className="event-form-group">
        <label htmlFor="event-name">Email</label>

        <div className="event-input-container">
          <input
            className="event-input"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
          />
        </div>
      </div>
      <div className="event-form-group">
        <label htmlFor="event-name">Phone number</label>

        <div className="event-input-container">
          <input
            className="event-input"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
          />
        </div>
      </div>

      <div className="event-form-group">
        <label htmlFor="event-name">Backup email</label>

        <div className="event-input-container">
          <input
            className="event-input"
            name="backupEmail"
            type="email"
            value={formData.backupEmail}
            onChange={handleChange}
            placeholder="Backup Email"
          />
        </div>
      </div>

      <div className="event-form-group">
        <label htmlFor="event-name">Nature</label>

        <div className="event-input-container">
          <input
            className="event-input"
            name="nature"
            value={formData.nature}
            onChange={handleChange}
            placeholder="Nature"
          />
        </div>
      </div>

      <div className="event-form-group">
        <label htmlFor="event-name">Service</label>

        <div className="event-input-container">
          <input
            className="event-input"
            name="service"
            value={formData.service}
            onChange={handleChange}
            placeholder="Service"
          />
        </div>
      </div>

      <div className="event-form-group">
        <label htmlFor="event-name">Organisation</label>

        <div className="event-input-container">
          <input
            className="event-input"
            name="organisation"
            value={formData.organisation}
            onChange={handleChange}
            placeholder="Organisation"
          />
        </div>
      </div>

      <div className="facility-form-group">
        <label htmlFor="motif" className="required-label">
          Role
        </label>
        <div className="facility-input-container">
          <select
            id="motif"
            name="role"
            className="event-input"
            value={formData.role}
            onChange={handleChange}
            placeholder="Role"
          >
            <option value="">Select a role</option>
            <option value="Admin">Admin</option>
            <option value="SuperAdmin">SuperAdmin</option>
            <option value="User">User</option>
          </select>
        </div>
      </div>

      <button className="event-button user-button" type="submit">
        Save
      </button>
    </form>
  );
};

export default InitiatorForm;
