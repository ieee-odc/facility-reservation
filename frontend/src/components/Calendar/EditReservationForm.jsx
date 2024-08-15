import React, { useState, useEffect } from "react";
import { Modal, Button } from "rsuite";
import axios from "axios";
import { useNotification } from "../../context/NotificationContext";
import "../event/event.css";

const EditReservationForm = ({ open, onClose, reservationData, onUpdate }) => {
  const [facilities, setFacilities] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [participants, setParticipants] = useState("");
  const [facility, setFacility] = useState("");
  const [motif, setMotif] = useState("");
  const [equipment, setEquipment] = useState({});
  const [otherMotif, setOtherMotif] = useState("");

  const showNotification = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facilityResponse = await axios.get("http://localhost:3000/api/facilities");
        setFacilities(facilityResponse.data.data || []);

        const equipmentResponse = await axios.get("http://localhost:3000/api/equipments");
        const fetchedEquipments = equipmentResponse.data.data || [];
        setEquipments(fetchedEquipments);

        if (reservationData) {
          const reservationDate = new Date(reservationData.startTime);
          setDate(reservationDate.toISOString().split('T')[0]);
          setStartTime(reservationDate.toTimeString().split(' ')[0].substring(0, 5)); // HH:MM
          const endDate = new Date(reservationData.endTime);
          setEndTime(endDate.toTimeString().split(' ')[0].substring(0, 5)); // HH:MM

          setParticipants(reservationData.participants || "");
          setFacility(reservationData.facility || "");
          setMotif(reservationData.motive || "");
          setOtherMotif(reservationData.otherMotif || "");

          const initialEquipment = reservationData.materials || [];
          const equipmentState = fetchedEquipments.reduce((acc, equip) => {
            acc[equip.label] = initialEquipment.includes(equip._id);
            return acc;
          }, {});
          setEquipment(equipmentState);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showNotification("Failed to fetch facilities or equipment data.", "error");
      }
    };

    fetchData();
  }, [reservationData, showNotification]);

  const today = new Date().toISOString().split('T')[0];

  const handleSave = async () => {
    try {
      const selectedFacility = facilities.find((f) => f.label === facility);
      const facilityId = selectedFacility ? selectedFacility._id : null;
  
      const equipmentIds = Object.entries(equipment)
        .filter(([, checked]) => checked)
        .map(([label]) => {
          const matchedEquipment = equipments.find((e) => e.label === label);
          return matchedEquipment ? matchedEquipment._id : null;
        })
        .filter((id) => id !== null);
  
      if (!facilityId) {
        throw new Error("Invalid facility selected");
      }
  
      if (equipmentIds.includes(null)) {
        throw new Error("Some equipment could not be matched to IDs");
      }
  
      if (!startTime || !endTime) {
        throw new Error("Start time and end time are required");
      }
  
      const updatedReservation = {
        date,
        startTime: `${date}T${startTime}:00`,
        endTime: `${date}T${endTime}:00`,
        participants,
        facility: facilityId,
        motif,
        materials: equipmentIds,
        id: reservationData.currentId,
      };
  
      await axios.patch(`http://localhost:3000/api/reservations/${reservationData.currentId}`, updatedReservation);
  
      showNotification("Reservation updated successfully!", "success");
      onUpdate(updatedReservation);
      onClose();
    } catch (error) {
      console.error("Error updating reservation:", error.response ? error.response.data : error.message);
      showNotification("Failed to update reservation. Please try again.", "error");
    }
  };
  

  return (
    <Modal open={open} onClose={onClose} size="md">
      <Modal.Header>
        <Modal.Title>Edit Reservation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="event-form-group">
          <label htmlFor="date" className="event-form-label">
            Date
          </label>
          <input
            type="date"
            id="date"
            className="event-input"
            value={date}
            min={today} // Set minimum date to today
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="event-form-group">
          <label htmlFor="start-time" className="event-form-label">
            Start Time
          </label>
          <input
            type="time"
            id="start-time"
            className="event-input"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div className="event-form-group">
          <label htmlFor="end-time" className="event-form-label">
            End Time
          </label>
          <input
            type="time"
            id="end-time"
            className="event-input"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        <div className="event-form-group">
          <label htmlFor="participants" className="event-form-label">
            Participants
          </label>
          <input
            type="text"
            id="participants"
            className="event-input"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
          />
        </div>
        <div className="event-form-group">
          <label htmlFor="facility" className="event-form-label">
            Facility
          </label>
          <select
            id="facility"
            className="event-input"
            value={facility}
            onChange={(e) => setFacility(e.target.value)}
          >
            {facilities.map((f) => (
              <option key={f._id} value={f.label}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="event-form-group">
          <label htmlFor="motif" className="event-form-label">
            Reasons for reservation
          </label>
          <select
            id="motif"
            className="event-input"
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
          >
            <option value="">Select a reason</option>
            <option value="Club meeting">Club meeting</option>
            <option value="Workshop">Workshop</option>
            <option value="Conference">Conference</option>
            <option value="Special event">Special event</option>
          </select>
        </div>
        <div className="event-form-group">
          <label htmlFor="otherMotif" className="event-form-label">
            Other reasons (optional)
          </label>
          <textarea
            id="otherMotif"
            className="event-input"
            value={otherMotif}
            onChange={(e) => setOtherMotif(e.target.value)}
            rows="3"
          ></textarea>
        </div>
    
        <div className="event-form-group">
          <label className="event-form-label">Reserved Equipments</label>
          <ul className="event-equipment-list">
            {equipments.map((equip) => (
              <li key={equip._id} className="event-equipment-item">
                <input
                  type="checkbox"
                  checked={!!equipment[equip.label]}
                  onChange={(e) =>
                    setEquipment((prev) => ({
                      ...prev,
                      [equip.label]: e.target.checked,
                    }))
                  }
                />
                {equip.label}
              </li>
            ))}
          </ul>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSave} appearance="primary">
          Save Changes
        </Button>
        <Button onClick={onClose} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditReservationForm;
