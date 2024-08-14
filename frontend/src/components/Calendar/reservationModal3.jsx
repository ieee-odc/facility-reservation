import React, { useState, useEffect } from 'react';
import { IoArrowBackOutline } from "react-icons/io5";

const EquipmentReservationForm = ({ onSubmit, onBack }) => {
  const [equipment, setEquipment] = useState({});
  const [fetchedEquipment, setFetchedEquipment] = useState([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/equipments'); 
        const result = await response.json();
        if (result && Array.isArray(result.data)) {
          setFetchedEquipment(result.data);
        } else {
          console.error('Unexpected data format:', result);
        }
      } catch (error) {
        console.error('Failed to fetch equipment data:', error);
      }
    };

    fetchEquipment();
  }, []);

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
    <>
      <div className="container3">
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
        <form className="form" onSubmit={handleFormSubmit}>
          <div className="button-group">
            <IoArrowBackOutline className="back" size={24} onClick={onBack} />
          </div>
          <div className="form-title-container">
            <h4 className="form-title">Reserve Equipment</h4>
          </div>
          {fetchedEquipment.map((item) => (
            <div className="form-group" key={item._id}>
              <label htmlFor={item.label} className="required-label">{item.label}</label>
              <input
                id={item.label}
                name={item.label}
                type="number"
                className="input"
                value={equipment[item.label] || 0}
                onChange={handleEquipmentChange}
                min="0"
                max={item.availableQuantity}
              />
            </div>
          ))}
          <div className="button-group">
            <button type="submit" className="button">
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EquipmentReservationForm;
