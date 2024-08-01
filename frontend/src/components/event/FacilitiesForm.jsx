import React, { useEffect, useState } from "react";
import "./event.css";
import Navbar from "../navbar";
import { Uploader, Button, Tag } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { GrAttachment } from "react-icons/gr";
import { TagPicker } from "rsuite";
import axios from "axios";

const FacilitiesForm = ({ numberOfFacilities, form1 }) => {
  const initialFacilities = Array.from({ length: numberOfFacilities }, () => ({
    date: "",
    startTime: "",
    endTime: "",
    facility: "",
    effective: 0,
    motive: "",
    files: [],
    materials: "",
    entity: form1.organizer
  }));
  const start = new Date(form1.startDate).toISOString().split("T")[0];
  const end = new Date(form1.endDate).toISOString().split("T")[0];

  const [facilities, setFacilities] = useState(initialFacilities);
  const [errorMessages, setErrorMessages] = useState(
    Array(numberOfFacilities).fill("")
  );
  const [availableFacilities, setAvailableFacilities] = useState([]);
  const [availableEquipments, setAvailableEquipments] = useState([]);

  useEffect(() => {
    const fetchAvailableFacilities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/facilities"
        );
        setAvailableFacilities(response.data.data || []);
        console.log("response", response);
      } catch (error) {
        console.error("Error fetching available facilities:", error);
      }
    };
    const fetchAvailableEquipments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/equipments"
        );
        const data = response.data.data.map((item) => ({
          label: item.label,
          value: item._id,
        }));
        setAvailableEquipments(data);
        console.log("response 2", data);
      } catch (error) {
        console.error("Error fetching available facilities:", error);
      }
    };
    

    fetchAvailableFacilities();
    fetchAvailableEquipments();
  }, [initialFacilities.date, initialFacilities.time]);

  const handleChange = (index, field, value) => {
    const updatedFacilities = [...facilities];
    const updatedErrors = [...errorMessages];

    if (field === "endTime") {
      const startTime = updatedFacilities[index].startTime;
      if (startTime && value <= startTime) {
        updatedFacilities[index][field] = ""; // Reset end time field
        updatedErrors[index] = "End time must be after start time";
      } else {
        updatedErrors[index] = "";
        updatedFacilities[index][field] = value;
      }
    } else {
      updatedFacilities[index][field] = value;
    }

    setFacilities(updatedFacilities);
    setErrorMessages(updatedErrors);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalEffective = facilities.reduce((total, item) => {
      return total + Number(item.effective);
    }, 0);
    console.log("total effective", totalEffective);
    axios
      .post("http://localhost:3000/api/events", {
        reservations: facilities,
        ...form1,
        totalEffective,
      })
      .then((resp) => {
        console.log(resp);
      })
      .catch((error) => {
        console.log(error);
      });
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
              <div className="facility-form-group">
                <label>Date</label>
                <div className="facility-input-container">
                  <input
                    type="date"
                    value={facility.date}
                    onChange={(e) =>
                      handleChange(index, "date", e.target.value)
                    }
                    min={start}
                    max={end}
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
                  {errorMessages[index] && (
                    <span className="error-message">
                      {errorMessages[index]}
                    </span>
                  )}
                </div>
              </div>

              <div className="facility-form-group">
                <label>Facility</label>
                <div className="facility-input-container">
                  <select
                    id="facility"
                    className="input"
                    value={facility.facility}
                    onChange={(e) =>
                      handleChange(index, "facility", e.target.value)
                    }
                  >
                    <option value="">Select a facility</option>
                    {Array.isArray(availableFacilities) &&
                      availableFacilities.map((fac) => (
                        <option key={fac._id} value={fac._id}>
                          {fac.label}
                        </option>
                      ))}
                  </select>
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
                <label htmlFor="motif" className="required-label">
                  Reasons for reservation
                </label>
                <div className="facility-input-container">
                  <select
                    id="motif"
                    className="event-input"
                    value={facility.motive}
                    onChange={(e) =>
                      handleChange(index, "motive", e.target.value)
                    }
                  >
                    <option value="">Select a reason</option>
                    <option value="Club meeting">Club meeting</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Conference">Conference</option>
                    <option value="Special event">Special event</option>
                  </select>
                </div>
              </div>

              <div className="facility-form-group">
                <label>Other reasons (optional)</label>
                <div className="facility-input-container">
                  <textarea
                    id="otherMotif"
                    type="text"
                    className="event-input"
                    value={facility.motive}
                    onChange={(e) =>
                      handleChange(index, "motive", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="facility-form-group">
                <label>Materials</label>
                <TagPicker
                  className="facility-input-container"
                  data={availableEquipments}
                  style={{ width: 300 }}
                  onChange={(value) => handleChange(index, "materials", value)}
                />
              </div>

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
