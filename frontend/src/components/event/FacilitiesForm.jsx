import React, { useState } from "react";
import "./event.css";
import Navbar from "../navbar";
import { Uploader, Button, Tag } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { GrAttachment } from "react-icons/gr";

const FacilitiesForm = ({ numberOfFacilities }) => {
  const initialFacilities = Array.from({ length: numberOfFacilities }, () => ({
    date: "",
    startTime: "",
    endTime: "",
    facility: "",
    effective: "",
    motive: "",
    files: [],
    materials: "",
  }));
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  const [facilities, setFacilities] = useState(initialFacilities);

  const handleChange = (index, field, value) => {
    const updatedFacilities = [...facilities];
    updatedFacilities[index][field] = value;
    setFacilities(updatedFacilities);
  };

  const handleFilesChange = (index, event) => {
    const files = Array.from(event.target.files);
    const updatedFacilities = [...facilities];
    updatedFacilities[index].files = files;
    setFacilities(updatedFacilities);
  };

  const handleRemoveFile = (index, fileName) => {
    const updatedFacilities = [...facilities];
    updatedFacilities[index].files = updatedFacilities[index].files.filter(
      (file) => file.name !== fileName
    );
    setFacilities(updatedFacilities);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(facilities);
  };

  return (
    <div>
      <Navbar />
      <div className="container2">
        <div className="form-title-container">
          <h2 className="form-title">Facilities Form</h2>
        </div>
        <form className="form form-facilities" onSubmit={handleSubmit}>
          {facilities.map((facility, index) => (
            <div key={index} className="facility-row">
              {/*              <div className="facility-form-group">
                <label>Date & Time</label>
                <div className="facility-input-container">
                  <input
                    type="datetime-local"
                    value={facility.dateTime}
                    onChange={(e) =>
                      handleChange(index, "dateTime", e.target.value)
                    }
                    required
                  />
                </div>
              </div>*/}
              <div className="facility-form-group">
                <label>Date</label>
                <div className="facility-input-container">
                  <input
                    type="date"
                    value={facility.date}
                    onChange={(e) =>
                      handleChange(index, "date", e.target.value)
                    }
                    min={today}
                    required
                  />
                </div>
              </div>

              <div className="facility-form-group">
                <label>Start Time</label>
                <div className="facility-input-container">
                  <input
                    type="time"
                    value={facility.startTime}
                    onChange={(e) =>
                      handleChange(index, "startTime", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="facility-form-group">
                <label>End Time</label>
                <div className="facility-input-container">
                  <input
                    type="time"
                    value={facility.endTime}
                    onChange={(e) =>
                      handleChange(index, "endTime", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleChange(index, "facility", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleChange(index, "effective", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleChange(index, "motive", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
              {/*<div className="facility-form-group">
                <label>Files</label>
                <div className="facility-input-container">
                  <div className="custom-file-input">
                    <input
                      type="file"
                      value={facility.files}
                      onChange={(e) => handleChange(index, 'files', e.target.value)}
                      required
                      multiple
                    accept=".csv, .pdf" 
                    />
                  </div>
                </div>
              </div>*/}
              <div className="facility-form-group">
                <label htmlFor={`file-input-${index}`}>Files</label>
                <div className="file-upload-container">
                  <input
                    id={`file-input-${index}`}
                    type="file"
                    multiple
                    accept=".csv, .pdf"
                    onChange={(e) => handleFilesChange(index, e)}
                    className="file-input"
                  />
                  <label
                    htmlFor={`file-input-${index}`}
                    className="file-input-label"
                  >
                    <GrAttachment className="attach" />
                    <span>Select Files</span>
                  </label>
                  <div className="file-list">
                    {facility.files.map((file) => (
                      <div key={file.name} className="file-item">
                        <span className="file-name">{file.name}</span>
                        <button
                          type="button"
                          className="remove-file-button"
                          onClick={() => handleRemoveFile(index, file.name)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="facility-form-group">
                <label>Materials</label>
                <div className="facility-input-container">
                  <input
                    type="text"
                    value={facility.materials}
                    onChange={(e) =>
                      handleChange(index, "materials", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="submit" className="facility-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FacilitiesForm;
