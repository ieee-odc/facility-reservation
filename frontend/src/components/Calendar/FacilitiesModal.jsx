import React, { useState, useEffect } from "react";
import { Modal, Button, PanelGroup, Panel, TagPicker } from "rsuite";
import axios from "axios";
import "../event/event.css";
import { useNavigate } from "react-router-dom";
import { GrAttachment } from "react-icons/gr";
import { useNotification } from "../../context/NotificationContext";

const FacilitiesForm = ({ open, onClose, numberOfFacilities, form1 }) => {
  const initialFacilities = Array.from({ length: numberOfFacilities }, () => ({
    date: "",
    startTime: "",
    endTime: "",
    facility: "",
    effective: 0,
    motive: "",
    files: [],
    materials: [],
    entity: form1.organizer,
  }));
  const [facilities, setFacilities] = useState(initialFacilities);
  const [errorMessages, setErrorMessages] = useState(
    Array(numberOfFacilities).fill("")
  );
  const [availableFacilities, setAvailableFacilities] = useState([]);
  const [availableEquipments, setAvailableEquipments] = useState([]);
  const navigate = useNavigate();
  const showNotification = useNotification();

  useEffect(() => {
    const fetchAvailableFacilities = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/facilities");
        setAvailableFacilities(response.data.data || []);
      } catch (error) {
        console.error("Error fetching available facilities:", error);
      }
    };
    const fetchAvailableEquipments = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/equipments");
        const data = response.data.data.map((item) => ({
          label: item.label,
          value: item._id,
        }));
        setAvailableEquipments(data);
      } catch (error) {
        console.error("Error fetching available equipments:", error);
      }
    };

    fetchAvailableFacilities();
    fetchAvailableEquipments();
  }, []);

  const handleChange = (index, field, value) => {
    const updatedFacilities = [...facilities];
    const updatedErrors = [...errorMessages];

    if (field === "startTime") {
      const endTime = updatedFacilities[index].endTime;
      if (endTime && value >= endTime) {
        updatedErrors[index] = "Start time must be before end time";
      } else {
        updatedErrors[index] = "";
        updatedFacilities[index][field] = value;
      }
    } else if (field === "endTime") {
      const startTime = updatedFacilities[index].startTime;
      if (startTime && value <= startTime) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalEffective = facilities.reduce((total, item) => {
      return total + Number(item.effective);
    }, 0);
    try {
      await axios.post("http://localhost:3000/api/events", {
        reservations: facilities,
        ...form1,
        totalEffective,
      });
      showNotification("Event has been submitted successfully!", "success");
      navigate("/calendar");
      onClose();
    } catch (error) {
      showNotification("Failed to submit the event. Please try again.", "error");
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <Modal.Header>
        <Modal.Title>Facilities Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <PanelGroup accordion bordered>
          {facilities.map((facility, index) => (
            <Panel header={`Facility n° ${index + 1}`} defaultExpanded={index === 0} key={index}>
              <div className="facility-row">
                {/* Date */}
                <div className="facility-form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={facility.date}
                    onChange={(e) => handleChange(index, "date", e.target.value)}
                    min={form1.startDate}
                    max={form1.endDate}
                    required
                  />
                </div>
                {/* Start Time */}
                <div className="facility-form-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={facility.startTime}
                    onChange={(e) => handleChange(index, "startTime",
                        e.target.value)}
                        required
                      />
                    </div>
                    {/* End Time */}
                    <div className="facility-form-group">
                      <label>End Time</label>
                      <input
                        type="time"
                        value={facility.endTime}
                        onChange={(e) => handleChange(index, "endTime", e.target.value)}
                        required
                      />
                      {errorMessages[index] && (
                        <span className="error-message">{errorMessages[index]}</span>
                      )}
                    </div>
                  </div>
                  <div className="facility-row">
                    {/* Facility */}
                    <div className="facility-form-group">
                      <label>Facility</label>
                      <select
                        value={facility.facility}
                        onChange={(e) => handleChange(index, "facility", e.target.value)}
                        required
                      >
                        <option value="">Select a facility</option>
                        {availableFacilities.map((facility) => (
                          <option key={facility._id} value={facility._id}>
                            {facility.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Effective */}
                    <div className="facility-form-group">
                      <label>Effective</label>
                      <input
                        type="number"
                        value={facility.effective}
                        onChange={(e) => handleChange(index, "effective", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  {/* Materials */}
                  <div className="facility-form-group">
                    <label>Materials</label>
                    <TagPicker
                      block
                      data={availableEquipments}
                      value={facility.materials}
                      onChange={(value) => handleChange(index, "materials", value)}
                      placeholder="Select materials"
                    />
                  </div>
                  {/* Motive */}
                  <div className="facility-form-group">
                    <label>Motive</label>
                    <textarea
                      value={facility.motive}
                      onChange={(e) => handleChange(index, "motive", e.target.value)}
                      rows="3"
                      required
                    />
                  </div>
                  {/* Files */}
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
                </Panel>
              ))}
            </PanelGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleSubmit} appearance="primary">
              Submit
            </Button>
            <Button onClick={onClose} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      );
    };
    
    export default FacilitiesForm;
    