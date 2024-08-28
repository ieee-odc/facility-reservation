import { Reservation } from "../models/reservationModel.js";
import { Facility } from "../models/facilityModel.js";

export const findAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();

    return res.status(200).json(reservations);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const findAllPureReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ event: { $eq: null } });

    return res.status(200).json(reservations);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const findAllPureRelatedReservations = async (req, res) => {
  try {
    const { entityId } = req.params;

    const reservations = await Reservation.find({
      event: { $eq: null },
      entity: entityId,
    });

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

export const addReservation = async (req, res) => {
  try {
    const {
      facility,
      motive,
      date,
      startTime,
      endTime,
      state,
      event,
      effective,
      materials,
      files,
      entity
    } = req.body["0"];
console.log("req body,", req.body["0"]);

console.log("hello",{
  facility,
  motive,
  date,
  startTime,
  endTime,
  state,
  event,
  effective,
  materials,
  files
});


    const reservation = await Reservation.create({
      facility,
      motive,
      date,
      startTime,
      endTime,
      state,
      event,
      effective,
      materials,
      files,
      entity
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

export const getAvailableFacilities = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.query;

    const reservationDate = new Date(date);

    const overlappingReservations = await Reservation.find({
      date: reservationDate,
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    }).populate("facility");

    const occupiedFacilities = overlappingReservations
      .filter((reservation) => reservation.state === "Approved")
      .map((reservation) => reservation.facility._id.toString());

    const pendingFacilities = overlappingReservations
      .filter((reservation) => reservation.state === "Pending")
      .map((reservation) => reservation.facility);

    const allFacilities = await Facility.find({state: "Bookable"});
    const availableFacilities = allFacilities.filter(
      (facility) => !occupiedFacilities.includes(facility._id.toString())
    );

    res.status(200).json({
      availableFacilities,
      pendingFacilities,
    });
  } catch (error) {
    console.error("Error fetching available facilities:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
