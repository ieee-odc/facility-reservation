import React, { useState } from 'react';
import ReserverTimeDate from "./reservationForm1";
import ReserverSalleform from "./reservationForm2";
import EquipmentReservationForm from './reservationForm4';
import ReservationDetails from "./reservationForm3";

function ParentComponent() {
  const [reserverTimeDateSubmitted, setReserverTimeDateSubmitted] = useState(false);
  const [reserverSalleFormSubmitted, setReserverSalleFormSubmitted] = useState(false);
  const [equipmentFormSubmitted, setEquipmentFormSubmitted] = useState(false); 
  const [reservationDetails, setReservationDetails] = useState({ date: null, time: null, participants: null, facility: null, motif: null, equipment: null });

  const handleReservationTimeDateSubmit = (date, time, participants) => {
    setReserverTimeDateSubmitted(true);
    setReservationDetails(prevState => ({ ...prevState, date, time, participants }));
  };

  const handleReservationSalleformSubmit = (facility, motif) => {
    setReserverSalleFormSubmitted(true);
    setReservationDetails(prevState => ({ ...prevState, facility, motif }));
  };

  const handleEquipmentReservationSubmit = (equipment) => {
    setReservationDetails(prevState => ({ ...prevState, equipment }));
    setEquipmentFormSubmitted(true); 
  };

  const handleBackToTimeDate = () => {
    setReserverTimeDateSubmitted(false);
    setReserverSalleFormSubmitted(false);
    setEquipmentFormSubmitted(false);
  };

  const handleBackToSalleForm = () => {
    setReserverSalleFormSubmitted(false);
    setEquipmentFormSubmitted(false);
  };

  const handleBackToEquipmentForm = () => {
    setEquipmentFormSubmitted(false);
  };

  return (
    <div>
      {!reserverTimeDateSubmitted && (
        <ReserverTimeDate onSubmit={handleReservationTimeDateSubmit} />
      )}
      {reserverTimeDateSubmitted && !reserverSalleFormSubmitted && !equipmentFormSubmitted && (
        <ReserverSalleform 
          onSubmit={handleReservationSalleformSubmit} 
          onBack={handleBackToTimeDate} 
          date={reservationDetails.date} 
          time={reservationDetails.time} 
        />
      )}
      {reserverSalleFormSubmitted && !equipmentFormSubmitted && (
        <EquipmentReservationForm
          onSubmit={handleEquipmentReservationSubmit}
          onBack={handleBackToSalleForm}
        />
      )}
      {equipmentFormSubmitted && (
        <ReservationDetails
          date={reservationDetails.date}
          time={reservationDetails.time}
          facility={reservationDetails.facility}
          participants={reservationDetails.participants}
          motif={reservationDetails.motif}
          equipment={reservationDetails.equipment}
          onBack={handleBackToEquipmentForm}
          onQuit={() => setEquipmentFormSubmitted(false)}
        />
      )}
    </div>
  );
}

export default ParentComponent;
