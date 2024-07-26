import { Reservation } from "../models/reservationModel.js";
/*
  date: 
  time: 
  motive: 
  materials: 
  files: 
  effective:
  facility:
  entity:
  event:
  state: 
*/
export const findAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();

    if (reservations.length > 0) {
      return res.status(200).json(reservations);
    } else {
      return res.status(404).json({ message: "No reservations found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const findReservationById = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);

    if (reservation) {
      return res.status(200).json(reservation);
    } else {
      return res.status(404).json({ message: "Reservation not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addReservation = async (req, res) => {
  try {
    const {
      facility,
      motive,
      date,
      time,
      state,
      entity,
      event,
      effective,
      materials,
      files,
    } = req.body;

    console.log(req.body);

    const reservation = await Reservation.create({
      facility,
      motive,
      date,
      time,
      state,
      entity,
      event,
      effective,
      materials,
      files,
    });

    return res.status(201).json(reservation);
  } catch (error) {

    return res.status(409).json({ message: "an error occured when creating the reservation" });
  }
};

export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const reservation = await Reservation.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (reservation) {
      return res.status(200).json(reservation);
    } else {
      return res.status(404).json({ message: "Reservation not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByIdAndDelete(id);

    if (reservation) {
      return res.status(200).json({ message: "Reservation deleted successfully" });
    } else {
      return res.status(404).json({ message: "Reservation not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


