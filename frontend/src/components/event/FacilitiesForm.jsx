import React, { useState } from 'react';
import '../Reserver.css'; 
import Navbar from '../navbar';

const FacilitiesForm = ({ numberOfFacilities, form1 }) => {
  const initialFacilities = Array.from({ length: numberOfFacilities }, () => ({
    dateTime: '',
    facility: '',
    effective: '',
    motive: '',
    files: '',
    materials: ''
  }));

  const [facilities, setFacilities] = useState(initialFacilities);

  const handleChange = (index, field, value) => {
    const updatedFacilities = [...facilities];
    updatedFacilities[index][field] = value;
    setFacilities(updatedFacilities);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(facilities);
  };

  return (
    <div>
      <Navbar />
      <div className="container1">
        <div className="form-title-container">
          <h2 className="form-title">Facilities Form</h2>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          {facilities.map((facility, index) => (
            <div key={index} className="facility-row">
              <div className="facility-form-group">
                <label>Date & Time</label>
                <div className="facility-input-container">
                  <input
                    type="datetime-local"
                    value={facility.dateTime}
                    onChange={(e) => handleChange(index, 'dateTime', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="facility-form-group">
                <label>Facility</label>
                <div className="facility-input-container">
                  <input
                    type="text"
                    value={facility.facility}
                    onChange={(e) => handleChange(index, 'facility', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="facility-form-group">
                <label>Effective</label>
                <div className="facility-input-container">
                  <input
                    type="number"
                    value={facility.effective}
                    onChange={(e) => handleChange(index, 'effective', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="facility-form-group">
                <label>Motive</label>
                <div className="facility-input-container">
                  <input
                    type="text"
                    value={facility.motive}
                    onChange={(e) => handleChange(index, 'motive', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="facility-form-group">
                <label>Files</label>
                <div className="facility-input-container">
                  <input
                    type="file"
                    value={facility.files}
                    onChange={(e) => handleChange(index, 'files', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="facility-form-group">
                <label>Materials</label>
                <div className="facility-input-container">
                  <input
                    type="text"
                    value={facility.materials}
                    onChange={(e) => handleChange(index, 'materials', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="submit" className="facility-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default FacilitiesForm;
