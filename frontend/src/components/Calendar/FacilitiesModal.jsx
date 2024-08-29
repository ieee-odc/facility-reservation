import React, { useState, useEffect } from "react";
import "../event/event.css";
import { Modal, Button, PanelGroup, Panel, TagPicker } from "rsuite";
import axios from "axios";
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
  const start = new Date(form1?.startDate).toISOString().split("T")[0];
  const end = new Date(form1?.endDate).toISOString().split("T")[0];

  const [facilities, setFacilities] = useState(initialFacilities);
  const [errorMessages, setErrorMessages] = useState(
    Array(numberOfFacilities).fill("")
  );
  const [availableFacilities, setAvailableFacilities] = useState([]);
  const [pendingFacilities, setPendingFacilities] = useState([]);
  const [availableEquipments, setAvailableEquipments] = useState([]);
  const [warningMessage, setWarningMessage] = useState("");

  const navigate = useNavigate();
  const showNotification = useNotification();



  useEffect(() => {
    const fetchAvailableFacilities = async () => {
      const { date, startTime, endTime } = facilities[0] || {date:'',startTime:'',endTime:''};
      if (date && startTime && endTime) {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/reservations/available-facilities",
            {
              params: { date, startTime, endTime },
            }
          );
          setAvailableFacilities(response.data.availableFacilities);
          setPendingFacilities(
            response.data.pendingFacilities.map((facility) => facility?._id)
          );
        } catch (error) {
          console.error("Error fetching available facilities:", error);
        }
      } else {
        setAvailableFacilities([]);
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
      } catch (error) {
        console.error("Error fetching available equipments:", error);
      }
    };

    fetchAvailableFacilities();
    fetchAvailableEquipments();
  }, [facilities]);

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

    if (
      !updatedFacilities[index].date ||
      !updatedFacilities[index].startTime ||
      !updatedFacilities[index].endTime
    ) {
      setAvailableFacilities([]);
    }

    if (field === "facility") {
      if (pendingFacilities.includes(updatedFacilities[index][field])) {
        setWarningMessage(
          "Warning: This room is likely already reserved for this time slot."
        );
      } else {
        setWarningMessage("");
      }
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
      showNotification(
        "Failed to submit the event. Please try again.",
        "error"
      );
    }
  };

  
  return (
    <Modal open={open} onClose={onClose} size="md">
      <Modal.Header>
        <Modal.Title>Facilities Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className="form-title-container">
            <h2 className="form-title">Facilities Form</h2>
          </div>
          <PanelGroup accordion bordered>
            <form className="form form-facilities" onSubmit={handleSubmit}>
              {facilities.map((facility, index) => (
                <Panel
                  header={`Facility n° ${index + 1}`}
                  defaultExpanded={index === 0}
                  key={index}
                >
                  <div className="facility-row">
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
                        {errorMessages[index] && (
                          <span className="error-message">
                            {errorMessages[index]}
                          </span>
                        )}
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
                      {warningMessage && (
                        <p className="warning-message">{warningMessage}</p>
                      )}
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
                      <label>Attachments</label>
                      <div className="facility-input-container">
                        <input
                          type="file"
                          id={`attachments-${index}`}
                          className="custom-file-input"
                          onChange={(e) => handleFilesChange(index, e)}
                          multiple
                        />
                        <div className="file-preview">
                          {facility.files.map((file) => (
                            <div key={file.name} className="file-preview-item">
                              <span className="file-name">{file.name}</span>
                              <button
                                type="button"
                                className="remove-file"
                                onClick={() =>
                                  handleRemoveFile(index, file.name)
                                }
                              >
                                X
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="facility-form-group">
                      <label>Materials</label>
                      <TagPicker
                        data={availableEquipments}
                        value={facility.materials}
                        onChange={(value) =>
                          handleChange(index, "materials", value)
                        }
                        placeholder="Select materials"
                        block
                      />
                    </div>
                  </div>
                </Panel>
              ))}
            </form>
          </PanelGroup>
        </div>
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
