import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../Reserver.css";
import { IoArrowBackOutline } from "react-icons/io5";
import { GrAttachment } from "react-icons/gr";

const ReserverSalleform = ({ onSubmit, onBack, date, time }) => {
  const [facility, setFacility] = useState("");
  const [motif, setMotif] = useState("");
  const [otherMotif, setOtherMotif] = useState("");
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    facility: "",
    motif: "",
    otherMotif: "",
    files: [],
  });
  const [availableFacilities, setAvailableFacilities] = useState([]);
  const [pendingFacilities, setPendingFacilities] = useState([]);
  const [warningMessage, setWarningMessage] = useState("");
  const [fileErrors, setFileErrors] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchAvailableFacilities = async () => {
      try {
        const [startTime, endTime] = time.split(" - ").map(t => t.trim());
        console.log("start time", startTime, "end time", endTime);
        
        const response = await axios.get('http://localhost:3000/api/reservations/available-facilities', {
          params: {
            date,
            startTime,
            endTime
          }
        });
        console.log(response);
        
        setAvailableFacilities(response.data.availableFacilities); 
        setPendingFacilities(response.data.pendingFacilities.map(facility => facility?.label));
        console.log("testes",response.data.pendingFacilities.map(facility => facility?.label));
        
      } catch (error) {
        console.error("Error fetching available facilities:", error);
      }
    };
  
    fetchAvailableFacilities();
  }, [date, time]);

  const handleFacilityChange = (e) => {
    const selectedFacility = e.target.value;
    console.log("selected fac", e.target.value);
    
    setFacility(selectedFacility);
    setFormData({ ...formData, facility: selectedFacility });
    if (pendingFacilities.includes(selectedFacility)) {
      setWarningMessage(
        "Warning: This room is likely already reserved for this time slot."
      );
    } else {
      setWarningMessage("");
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const newErrors = {};

    if (!facility) {
      newErrors.facility = "Please choose a facility.";
    }
    if (!motif && !otherMotif) {
      newErrors.motif =
        "Please choose or enter the reason for the reservation.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const motifToSend = motif || otherMotif;
      onSubmit(formData.facility, motifToSend);
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const allowedTypes = ["application/pdf", "text/csv"];
    const invalidFiles = selectedFiles.filter(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setFileErrors("Please upload only PDF or CSV files.");
      return;
    }

    setFileErrors("");
    setFiles(selectedFiles);
    setFormData({ ...formData, files: selectedFiles });
  };

  const handleQuitClick = () => {
    setFormVisible(false);
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleClose = () => {
    setIsModalOpen(false);
  };
  return (
    <>
    
      <div className="container3">
        
        <form className="form" onSubmit={handleFormSubmit}>
          <div className="button-group">
            <IoArrowBackOutline className="back" size={24} onClick={onBack} />
          </div>
          <div className="form-title-container">
            <h4 className="form-title">Reservation</h4>
          </div>
          <div className="form-group">
            <label htmlFor="facility" className="required-label">
              Choose a facility
            </label>
            <select
              id="facility"
              className="input"
              value={facility}
              onChange={handleFacilityChange}
            >
              <option value="">Select a facility</option>
              {Array.isArray(availableFacilities) &&
                availableFacilities.map((fac) => (
                  <option key={fac.id} value={fac.id}>
                    {fac.label}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group">
            {errors.facility && (
              <p className="error-message">{errors.facility}</p>
            )}
            {warningMessage && (
              <p className="warning-message">{warningMessage}</p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="motif" className="required-label">
              Reasons for reservation
            </label>
            <select
              id="motif"
              className="input"
              value={motif}
              onChange={(e) => {
                setMotif(e.target.value);
                setFormData({ ...formData, motif: e.target.value });
              }}
            >
              <option value="">Select a reason</option>
              <option value="Club meeting">Club meeting</option>
              <option value="Workshop">Workshop</option>
              <option value="Conference">Conference</option>
              <option value="Special event">Special event</option>
            </select>
            {errors.motif && <p className="error-message">{errors.motif}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="otherMotif" className="label">
              Other reasons (optional)
            </label>
            <textarea
              id="otherMotif"
              className="input"
              value={otherMotif}
              onChange={(e) => {
                setOtherMotif(e.target.value);
                setFormData({ ...formData, otherMotif: e.target.value });
              }}
              rows="3"
            ></textarea>
          </div>
          <div className="form-group">
            <button className="attach-button" onClick={handleUploadButtonClick}>
              <GrAttachment className="attach" />
              Attach a file
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              multiple
              accept=".csv, .pdf"
            />
            {fileErrors && <p className="error-message">{fileErrors}</p>}
            {files.length > 0 && (
              <div>
                <p>Selected files:</p>
                <ul>
                  {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="warning-message">
            Warning! The CVs of the trainers and the list of participants are
            mandatory to attach for workshops.
          </div>
          <button type="submit" className="button">
            Reserve
          </button>
        </form>
      </div>
    </>
  );
};

export default ReserverSalleform;
