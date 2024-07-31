import { Reservation } from "../models/reservationModel.js";
/*
  date: 
  startTime: 
  endTime:
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

    return res.status(200).json(reservations);
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

/*
facility: '507f1f77bcf86cd799439011',
  motive: 'Meeting',
  date: '2024-07-25T00:00:00.000Z',
  time: '10:00',
  state: 'Pending',
  entity: '507f1f77bcf86cd799439012',
  event: null,
  effective: 10,
  materials: ['Projector'],
  files: ['file1.pdf']
*/

export const addReservation = async (req, res) => {
  try {
    const {
      facility,
      motive,
      date,
      startTime,
      endTime,
      state,
      entity,
      event,
      effective,
      materials,
      files,
    } = req.body;

    const reservation = await Reservation.create({
      facility,
      motive,
      date,
      startTime,
      endTime,
      state,
      entity,
      event,
      effective,
      materials,
      files,
    });

    return res.status(201).json(reservation);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
      return res
        .status(200)
        .json({ message: "Reservation deleted successfully" });
    } else {
      return res.status(404).json({ message: "Reservation not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
