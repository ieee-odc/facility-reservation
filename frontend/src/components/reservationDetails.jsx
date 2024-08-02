import React, { useState, useEffect, useRef } from 'react';
import './ReservationDetails.css';
import axios from 'axios';
import Navbar from "./navbar";
import { IoArrowBackOutline } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ReservationDetails = ({ date, time, participants, facility: facilityLabel, motif, equipment, onBack, onQuit }) => {
  const [facilities, setFacilities] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const navigate = useNavigate();
  const successToastShownRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facilityResponse = await axios.get('http://localhost:3000/api/facilities');
        setFacilities(facilityResponse.data.data || []); 

        const equipmentResponse = await axios.get('http://localhost:3000/api/equipments');
        setEquipments(equipmentResponse.data.data || []); 
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch facilities or equipment data.');
      }
    };

    fetchData();
  }, []);

  const handleCancel = async () => {
    onQuit();
  };

  const handleSubmit = async () => {
    try {
      const facility = facilities.find(f => f.label === facilityLabel);
      const facilityId = facility ? facility._id : null;
  
      const equipmentIds = Object.entries(equipment).map(([label, _]) => {
        const matchedEquipment = equipments.find(e => e.label === label);
        return matchedEquipment ? matchedEquipment._id : null;
      }).filter(id => id !== null);
  
      if (!facilityId) {
        throw new Error('Invalid facility selected');
      }
  
      if (equipmentIds.includes(null)) {
        throw new Error('Some equipment could not be matched to IDs');
      }
  
      const [startTime, endTime] = time.split(' - ');
  
      if (!startTime || !endTime) {
        throw new Error('Invalid time format');
      }
  
      const response = await axios.post('http://localhost:3000/api/reservations', {
        date,
        startTime,
        endTime,
        motive: motif,
        effective: participants,
        materials: equipmentIds,
        facility: facilityId,
      });
  
      console.log('Data sent to MongoDB:', response.data);
      toast.success('Reservation successfully submitted!', {
        onClose: () => {
          if (!successToastShownRef.current) {
            successToastShownRef.current = true;
            navigate("/calendar");
          }
        }
      });
    } catch (error) {
      console.error('Error sending data:', error.response ? error.response.data : error.message);
      toast.error('Failed to submit reservation. Please try again.');
    }
  };
  
  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <Navbar />
      <div className="container1">
        <div className="form">
          <div className="button-group">
            <IoArrowBackOutline className="back" size={24} onClick={onBack} />
          </div>
          <div className="form-title-container">
            <h4 className="form-title">Reservation details</h4>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="participants" className="label">Participants</label>
              <input type="text" id="participants" className="inputd" value={participants} readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="salle" className="label">Facility</label>
              <input type="text" id="salle" className="inputd" value={facilityLabel} readOnly />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date" className="label">Date</label>
              <input type="text" id="date" className="inputd" value={formatDate(date)} readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="time" className="label">Time</label>
              <input type="text" id="time" className="inputd" value={time} readOnly />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="motif" className="label">Reason</label>
            <textarea id="motif" rows="3" className="input" value={motif} readOnly />
          </div>

          <div className="form-group">
            <label className="label">Reserved Equipments</label>
            <ul className="equipment-list">
              {equipment && Object.entries(equipment).map(([key, value]) => (
                <li key={key} className="equipment-item">
                  {key}: {value}
                </li>
              ))}
            </ul>
          </div>

          <div className="button-group">
            <button type="button" className="confirm-button" onClick={handleSubmit}>Confirm</button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ReservationDetails;
