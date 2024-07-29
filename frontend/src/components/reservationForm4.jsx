import React, { useState } from 'react';
import { IoArrowBackOutline } from "react-icons/io5";
import Navbar from './navbar';
const EquipmentReservationForm = ({ onSubmit, onBack }) => {
  const [equipment, setEquipment] = useState({ speakers: 0, microphones: 0, projectors: 0 });

  const handleEquipmentChange = (e) => {
    const { name, value } = e.target;
    setEquipment({
      ...equipment,
      [name]: parseInt(value, 10),
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(equipment);
  };

  return (
    <body>
        <Navbar/>
 
    <div className="container1">
      <form className="form" onSubmit={handleFormSubmit}>
        <div className="button-group">
          <IoArrowBackOutline className="back" size={24} onClick={onBack} />
        </div>
        <div className="form-title-container">
          <h4 className="form-title">Reserve Equipment</h4>
        </div>
        <div className="form-group">
          <label htmlFor="speakers" className="required-label">Speakers</label>
          <input
            id="speakers"
            name="speakers"
            type="number"
            className="input"
            value={equipment.speakers}
            onChange={handleEquipmentChange}
            min="0"
          />
        </div>
        <div className="form-group">
          <label htmlFor="microphones" className="required-label">Microphones</label>
          <input
            id="microphones"
            name="microphones"
            type="number"
            className="input"
            value={equipment.microphones}
            onChange={handleEquipmentChange}
            min="0"
          />
        </div>
        <div className="form-group">
          <label htmlFor="projectors" className="required-label">Projectors</label>
          <input
            id="projectors"
            name="projectors"
            type="number"
            className="input"
            value={equipment.projectors}
            onChange={handleEquipmentChange}
            min="0"
          />
        </div>
        <div className="button-group">
          <button type="submit" className="button">
            Next
          </button>
        </div>
      </form>
    </div>
    </body>
  );
};

export default EquipmentReservationForm;
