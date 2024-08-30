import React, { useState, useEffect } from "react";
import { Modal, Button, PanelGroup, Panel, TagPicker } from "rsuite";
import axios from "axios";
import "../event/event.css";
import { useNavigate } from "react-router-dom";
import { GrAttachment } from "react-icons/gr";
import { useNotification } from "../../context/NotificationContext";
import moment from "moment";
import { format } from "date-fns";
import { MdOutlineReduceCapacity } from "react-icons/md";

const ReservationsModal1 = ({
  open,
  onClose,
  currentId,
  numberOfFacilities,
  slotDetails,
  selectedEvent,
}) => {
  const [facility, setFacility] = useState('');

  const initialFacilities = Array.from({ length: numberOfFacilities }, () => ({
    date: slotDetails
      ? moment(slotDetails?.end)
          ?.subtract(
            moment(slotDetails?.end).format("YYYY-MM-DD") ==
              moment(slotDetails?.start).format("YYYY-MM-DD")
              ? 0
              : 1,
            "days"
          )
          ?.format("YYYY-MM-DD")
      : selectedEvent
      ? moment(selectedEvent?.end)
          ?.subtract(
            moment(selectedEvent?.end).format("YYYY-MM-DD") ==
              moment(selectedEvent?.start).format("YYYY-MM-DD")
              ? 0
              : 1,
            "days"
          )
          ?.format("YYYY-MM-DD")
      : "",
    startTime:selectedEvent ? moment(selectedEvent?.start).format("HH:mm"):"",
    endTime: selectedEvent ? moment(selectedEvent?.end).format("HH:mm"):"",
    facility: facility ? facility:"",
    effective: selectedEvent?selectedEvent.participants:0,
    motive: selectedEvent?selectedEvent.motive:"",
    files: [],
    materials: selectedEvent?selectedEvent.equipment:[],
    entity: currentId,
  }));

  const start = new Date(moment(slotDetails?.start))
    .toISOString()
    .split("T")[0];
  const end = new Date().toISOString().split("T")[0];
  const [facilities, setFacilities] = useState(initialFacilities);
  const [errorMessages, setErrorMessages] = useState(
    Array(numberOfFacilities).fill("")
  );
  const [availableFacilities, setAvailableFacilities] = useState([]);
  const [pendingFacilities, setPendingFacilities] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [availableEquipments, setAvailableEquipments] = useState([]);
  const [warningMessage, setWarningMessage] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const showNotification = useNotification();

  useEffect(() => {
    console.log("open", open);
    console.log("selected", selectedEvent);

    const facility = facilities[0];
    if (facility?.date && facility?.startTime && facility?.endTime) {
      const fetchAvailableFacilities = async () => {
        console.log(
          "date",
          facility.date,
          "start time",
          facility.startTime,
          "end",
          facility.endTime
        );

        try {
          const response = await axios.get(
            "http://localhost:3000/api/reservations/available-facilities",
            {
              params: {
                date: facility.date,
                startTime: facility.startTime,
                endTime: facility.endTime,
              },
            }
          );
          if (selectedEvent) {
            const fac = response.data.availableFacilities.find((facility) => facility.label === selectedEvent.facility);
            setFacilities([{...facilities[0], facility:fac?._id}])
            
          }
          console.log(response);
          setAvailableFacilities(response.data.availableFacilities);
          
          setPendingFacilities(
            response.data.pendingFacilities.map((facility) => facility?._id)
          );

         
          
        } catch (error) {
          console.error("Error fetching available facilities:", error);
        }
      };
      fetchAvailableFacilities();
    } else {
      setAvailableFacilities([]);
      setPendingFacilities([]);
    }
  }, [facilities[0].date, facilities[0].startTime, facilities[0].endTime]);

  useEffect(() => {
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
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/reservationInitiators/admins"
        );

        const data = response.data.map((item) => ({
          label: item.name,
          value: item._id,
        }));
        setAdmins(data);
      } catch (error) {
        console.error("Error fetching available equipments:", error);
      }
    };
    fetchAdmins();
    fetchAvailableEquipments();
  }, []);

  const handleChange = (index, field, value) => {
    console.log("index, field, value",index, field, value);
    //selectedEvent ? selectedEvent.facility:""
    console.log("selectedEvent.facility",selectedEvent?.facility);
    
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

    console.log("pending facilities", pendingFacilities);
    console.log("up facilities", updatedFacilities[index][field]);

    if (field === "facility") {
      if (pendingFacilities.includes(updatedFacilities[index][field])) {
        setWarningMessage(
          "Warning: This room is likely already reserved for this time slot."
        );
      } else {
        setWarningMessage("");
      }
    }
    console.log("updatedFacilities",updatedFacilities);
    setFacilities(updatedFacilities);
    setErrorMessages(updatedErrors);
  };

  const sendNotification = async (recipientIds, title, message) => {
    try {
      await axios.post("http://localhost:3000/api/notifications", {
        title,
        message,
        recipient: recipientIds,
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("available facilities", availableFacilities);
    console.log("facilities", facilities);

    const facilityLabel = availableFacilities.find(
      (facility) => facility._id === facilities[0].facility
    );

    console.log("label", facilityLabel);
    console.log("date", facilities[0].date);

    try {
      if (selectedEvent) {
        const response = await axios.patch(`http://localhost:3000/api/reservations/update-res/${selectedEvent.id}`, {
          ...facilities,
          currentId,
        });

        console.log("---------", response);
        

      } else {
        
        await axios.post("http://localhost:3000/api/reservations", {
          ...facilities,
          currentId,
        });
      }
      showNotification(
        "The reservation has been submitted successfully!",
        "success"
      );

      try {
        await sendNotification(
          admins,
          `New Reservation Created`,
          `A new reservation has been created for the facility "${facilityLabel.label}" on ${facilities[0].date}. Please check your email.`
        );
      } catch (error) {
        console.log("error from notifications", error);
      }

      navigate("/calendar");
      onClose();
    } catch (error) {
      console.log("error here", error);

      showNotification(
        "Failed to submit the reservation. Please try again.",
        "error"
      );
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="md">
      <Modal.Body>
        <div>
          <div className="event-form-title-container">
            <h2 className="event-form-title">Reservation Form</h2>
          </div>
          <PanelGroup accordion bordered>
            <form className="form form-facilities" onSubmit={handleSubmit}>
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
                                {fac.label} - {fac.capacity} 👥
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
                      <label>Materials</label>
                      <TagPicker
                        className="facility-input-container"
                        data={availableEquipments}
                        style={{ width: 300 }}
                        onChange={(value) =>
                          handleChange(index, "materials", value)
                        }
                      />
                    </div>

                    <div className="facility-form-group">
                      <label htmlFor="files" className="required-label">
                        Attach files
                      </label>
                      <div className="facility-input-container">
                        <div className="event-upload">
                          <input
                            type="file"
                            id="files"
                            className="event-file-input"
                            onChange={(e) =>
                              handleChange(index, "files", e.target.files)
                            }
                            required
                          />
                          <div className="event-upload-icon">
                            <GrAttachment size={20} />
                          </div>
                        </div>
                      </div>
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

export default ReservationsModal1;
