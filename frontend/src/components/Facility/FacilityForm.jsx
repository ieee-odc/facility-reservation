import React, { useState, useEffect } from "react";

const FacilityForm = ({ initiator, onSubmit }) => {
  const [formData, setFormData] = useState({
    label: "",
    capacity: "",
    state: "",
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
        <label htmlFor="event-name">Label</label>

        <div className="event-input-container">
          <input
            className="event-input"
            name="label"
            value={formData.label}
            onChange={handleChange}
            placeholder="Label"
          />
        </div>
      </div>
      <div className="event-form-group">
        <label htmlFor="event-name">Capacity</label>

        <div className="event-input-container">
          <input
            className="event-input"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Capacity"
          />
        </div>
      </div>
      <div className="event-form-group">
        <label htmlFor="event-name">State</label>

        <div className="event-input-container">
          <input
            className="event-input"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
          />
        </div>
      </div>

      <button className="event-button user-button" type="submit">
        Save
      </button>
    </form>
  );
};

export default FacilityForm;
