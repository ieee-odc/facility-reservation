import React, { useEffect, useState } from "react";
import "../event/event.css";
import Navbar from "../navbar";
import {
  Uploader,
  Button,
  Tag,
  Modal,
  TagPicker,
  PanelGroup,
  Panel,
  Placeholder,
} from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { GrAttachment } from "react-icons/gr";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";

const FacilitiesForm = ({ numberOfFacilities, form1, show, onClose }) => {
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
  const start = new Date(form1.startDate).toISOString().split("T")[0];
  const end = new Date(form1.endDate).toISOString().split("T")[0];

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
        showNotification("Event has been submitted successfully!", "success");
        navigate("/calendar");
      })
      .catch((error) => {
        console.log(error);
        showNotification(
          "Failed to submit the event. Please try again.",
          "error"
        );
      });
  };

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header>
        <Modal.Title>Facilities Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="form form-facilities" onSubmit={handleSubmit}>
          <PanelGroup accordion bordered>
            {facilities.map((facility, index) => (
              <Panel
                key={index}
                header={`Facility n° ${index + 1}`}
                defaultExpanded={index === 0}
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
                      value={facility.materials}
                      data={availableEquipments}
                      placeholder="Select materials"
                      onChange={(value) =>
                        handleChange(index, "materials", value)
                      }
                      style={{ width: "100%" }}
                      size="lg"
                    />
                  </div>

                  <div className="facility-form-group">
                    <label>Files</label>
                    <div className="facility-input-container">
                      <Uploader
                        multiple
                        listType="picture-text"
                        defaultFileList={facility.files}
                        onUpload={(file) => handleFilesChange(index, file)}
                      />
                    </div>
                    <div>
                      {facility.files.length > 0 &&
                        facility.files.map((file, i) => (
                          <div key={i}>
                            <span>{file.name}</span>
                            <Button
                              onClick={() => handleRemoveFile(index, file.name)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </Panel>
            ))}
          </PanelGroup>

          <Button appearance="primary" type="submit">
            Submit
          </Button>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="subtle">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FacilitiesForm;
