import React, { useState, useEffect } from "react";
import { Modal, Button } from "rsuite";
import axios from "axios";
import { useNotification } from "../../context/NotificationContext";
import "../event/event.css";

const EditReservationForm = ({ open, onClose, reservationData, onUpdate }) => {
  const [facilities, setFacilities] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    participants: "",
    facility: "",
    motif: "",
    otherMotif: "",
    equipment: {}
  });

  const showNotification = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facilityResponse = await axios.get("http://localhost:3000/api/facilities");
        setFacilities(facilityResponse.data.data || []);

        const equipmentResponse = await axios.get("http://localhost:3000/api/equipments");
        const fetchedEquipments = equipmentResponse.data.data || [];
        setEquipments(fetchedEquipments);
      } catch (error) {
        console.error("Error fetching data:", error);
        showNotification("Failed to fetch facilities or equipment data.", "error");
      }
    };

    fetchData();
  }, [showNotification]);

  useEffect(() => {
    if (reservationData) {
      const reservationDate = new Date(reservationData.startTime);
      const date = reservationDate.toISOString().split('T')[0];
      const startTime = reservationDate.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
      const endDate = new Date(reservationData.endTime);
      const endTime = endDate.toTimeString().split(' ')[0].substring(0, 5); // HH:MM

      const initialEquipment = reservationData.materials || [];
      const equipmentState = equipments.reduce((acc, equip) => {
        acc[equip.label] = initialEquipment.includes(equip._id);
        return acc;
      }, {});

      setFormData({
        date,
        startTime,
        endTime,
        participants: reservationData.participants || "",
        facility: reservationData.facility || "",
        motif: reservationData.motive || "",
        otherMotif: reservationData.otherMotif || "",
        equipment: equipmentState
      });
    }
  }, [reservationData, equipments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e, label) => {
    setFormData((prevData) => ({
      ...prevData,
      equipment: {
        ...prevData.equipment,
        [label]: e.target.checked,
      },
    }));
  };

  const handleSave = async () => {
    try {
      const selectedFacility = facilities.find((f) => f.label === formData.facility);
      const facilityId = selectedFacility ? selectedFacility._id : null;

      const equipmentIds = Object.entries(formData.equipment)
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

      if (!formData.startTime || !formData.endTime) {
        throw new Error("Start time and end time are required");
      }

      const updatedReservation = {
        date: formData.date,
        startTime: `${formData.date}T${formData.startTime}:00`,
        endTime: `${formData.date}T${formData.endTime}:00`,
        participants: formData.participants,
        facility: facilityId,
        motif: formData.motif,
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

  const today = new Date().toISOString().split('T')[0];

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
            name="date"
            className="event-input"
            value={formData.date}
            min={today}
            onChange={handleInputChange}
          />
        </div>
        <div className="event-form-group">
          <label htmlFor="startTime" className="event-form-label">
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            className="event-input"
            value={formData.startTime}
            onChange={handleInputChange}
          />
        </div>
        <div className="event-form-group">
          <label htmlFor="endTime" className="event-form-label">
            End Time
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            className="event-input"
            value={formData.endTime}
            onChange={handleInputChange}
          />
        </div>
        <div className="event-form-group">
          <label htmlFor="participants" className="event-form-label">
            Participants
          </label>
          <input
            type="text"
            id="participants"
            name="participants"
            className="event-input"
            value={formData.participants}
            onChange={handleInputChange}
          />
        </div>
        <div className="event-form-group">
          <label htmlFor="facility" className="event-form-label">
            Facility
          </label>
          <select
            id="facility"
            name="facility"
            className="event-input"
            value={formData.facility}
            onChange={handleInputChange}
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
            name="motif"
            className="event-input"
            value={formData.motif}
            onChange={handleInputChange}
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
            name="otherMotif"
            className="event-input"
            value={formData.otherMotif}
            onChange={handleInputChange}
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
                  checked={!!formData.equipment[equip.label]}
                  onChange={(e) => handleCheckboxChange(e, equip.label)}
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
