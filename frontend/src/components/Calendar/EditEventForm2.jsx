import React, { useState, useEffect } from "react";
import { Modal, Button, PanelGroup, Panel, TagPicker } from "rsuite";
import axios from "axios";
import "../event/event.css";
import { useNavigate } from "react-router-dom";
import { GrAttachment } from "react-icons/gr";
import { useNotification } from "../../context/NotificationContext";

const FacilitiesForm = ({ open, onClose, numberOfFacilities, form1, facilitiesData }) => {
  const initialFacilities = facilitiesData || Array.from({ length: numberOfFacilities }, () => ({
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
  const [pendingFacilities, setPendingFacilities] = useState([]);
  const [availableEquipments, setAvailableEquipments] = useState([]);
  const navigate = useNavigate();
  const showNotification = useNotification();

  useEffect(() => {
    const fetchAvailableFacilities = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/reservations/available-facilities', {
          params: {
            date: facilities[0]?.date,
            startTime: facilities[0]?.startTime,
            endTime: facilities[0]?.endTime
          }
        });
        console.log(response);
  
        setAvailableFacilities(response.data.availableFacilities);
        setPendingFacilities(response.data.pendingFacilities.map(facility => facility?.label));
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
      showNotification("Event created successfully", "success");
      navigate("/events");
    } catch (error) {
      showNotification("Failed to create event", "error");
      console.error("Error creating event:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <Modal.Header>
        <Modal.Title>Facilities Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <PanelGroup accordion bordered>
            {facilities.map((facility, index) => (
              <Panel header={`Facility ${index + 1}`} eventKey={index} key={index}>
                <div className="form-group">
                  <label htmlFor={`date-${index}`}>Date</label>
                  <input
                    type="date"
                    id={`date-${index}`}
                    className="event-input"
                    value={facility.date}
                    onChange={(e) => handleChange(index, "date", e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`startTime-${index}`}>Start Time</label>
                  <input
                    type="time"
                    id={`startTime-${index}`}
                    className="event-input"
                    value={facility.startTime}
                    onChange={(e) =>
                      handleChange(index, "startTime", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`endTime-${index}`}>End Time</label>
                  <input
                    type="time"
                    id={`endTime-${index}`}
                    className="event-input"
                    value={facility.endTime}
                    onChange={(e) => handleChange(index, "endTime", e.target.value)}
                    required
                  />
                </div>
                {errorMessages[index] && (
                  <div className="error-message">{errorMessages[index]}</div>
                )}
                <div className="form-group">
                  <label htmlFor={`facility-${index}`}>Facility</label>
                  <select
                    id={`facility-${index}`}
                    className="event-input"
                    value={facility.facility}
                    onChange={(e) => handleChange(index, "facility", e.target.value)}
                    required
                  >
                    <option value="">Select a facility</option>
                    {availableFacilities.map((facility) => (
                      <option key={facility.value} value={facility.value}>
                        {facility.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor={`effective-${index}`}>Effective</label>
                  <input
                    type="number"
                    id={`effective-${index}`}
                    className="event-input"
                    value={facility.effective}
                    onChange={(e) =>
                      handleChange(index, "effective", Number(e.target.value))
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`motive-${index}`}>Motive</label>
                  <input
                    type="text"
                    id={`motive-${index}`}
                    className="event-input"
                    value={facility.motive}
                    onChange={(e) => handleChange(index, "motive", e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`files-${index}`}>Files</label>
                  <input
                    type="file"
                    id={`files-${index}`}
                    className="event-input"
                    onChange={(e) => handleChange(index, "files", e.target.files)}
                    multiple
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`materials-${index}`}>Materials</label>
                  <TagPicker
                    id={`materials-${index}`}
                    className="event-input"
                    data={availableEquipments}
                    value={facility.materials}
                    onChange={(value) => handleChange(index, "materials", value)}
                    block
                  />
                </div>
              </Panel>
            ))}
          </PanelGroup>
          <div className="modal-footer">
            <Button onClick={onClose} appearance="subtle">
              Cancel
            </Button>
            <Button type="submit" appearance="primary">
              {facilitiesData ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default FacilitiesForm;
