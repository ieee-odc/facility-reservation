import React, { useState, useEffect } from "react";
import { Modal, Button } from "rsuite";
import axios from "axios";
import { useNotification } from "../../context/NotificationContext";
import "../ReservationDetails.css";

const EditReservationForm = ({ open, onClose, reservationData, onUpdate }) => {
  const [facilities, setFacilities] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [date, setDate] = useState(reservationData.date || "");
  const [startTime, setStartTime] = useState(reservationData.startTime || "");
  const [endTime, setEndTime] = useState(reservationData.endTime || "");
  const [participants, setParticipants] = useState(reservationData.participants || "");
  const [facility, setFacility] = useState(reservationData.facility || "");
  const [motif, setMotif] = useState(reservationData.motif || "");
  const [equipment, setEquipment] = useState({});

  const showNotification = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facilityResponse = await axios.get("http://localhost:3000/api/facilities");
        setFacilities(facilityResponse.data.data || []);

        const equipmentResponse = await axios.get("http://localhost:3000/api/equipments");
        setEquipments(equipmentResponse.data.data || []);

        // Pre-fill the equipment state if provided in reservationData
        const initialEquipment = reservationData.materials || [];
        const equipmentState = initialEquipment.reduce((acc, materialId) => {
          const matchedEquipment = equipments.find((e) => e._id === materialId);
          if (matchedEquipment) {
            acc[matchedEquipment.label] = true;
          }
          return acc;
        }, {});
        setEquipment(equipmentState);
      } catch (error) {
        console.error("Error fetching data:", error);
        showNotification("Failed to fetch facilities or equipment data.", "error");
      }
    };

    fetchData();
  }, [reservationData, showNotification]);

  const handleSave = async () => {
    try {
      const selectedFacility = facilities.find((f) => f.label === facility);
      const facilityId = selectedFacility ? selectedFacility._id : null;

      const equipmentIds = Object.entries(equipment)
        .map(([label, checked]) => {
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
        startTime,
        endTime,
        participants,
        facility: facilityId,
        motif,
        materials: equipmentIds,
        id: reservationData.currentId,
      };

      await axios.put(`http://localhost:3000/api/reservations/${reservationData.currentId}`, updatedReservation);

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
        <div className="form-group">
          <label htmlFor="date" className="label">
            Date
          </label>
          <input
            type="date"
            id="date"
            className="inputd"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="start-time" className="label">
            Start Time
          </label>
          <input
            type="text"
            id="start-time"
            className="inputd"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="end-time" className="label">
            End Time
          </label>
          <input
            type="text"
            id="end-time"
            className="inputd"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="participants" className="label">
            Participants
          </label>
          <input
            type="text"
            id="participants"
            className="inputd"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="facility" className="label">
            Facility
          </label>
          <select
            id="facility"
            className="inputd"
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
        <div className="form-group">
          <label htmlFor="motif" className="label">
            Reason
          </label>
          <textarea
            id="motif"
            rows="3"
            className="inputd"
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="label">Reserved Equipments</label>
          <ul className="equipment-list">
            {equipments.map((equip) => (
              <li key={equip._id} className="equipment-item">
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
