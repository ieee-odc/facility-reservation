import { Reservation } from "../models/reservationModel.js";
import { Facility } from "../models/facilityModel.js";
import moment from 'moment'

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

export const findAllPureReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ event: { $eq: null } });

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

/*const timesOverlap = (startTime1, endTime1, startTime2, endTime2) => {
  const start1 = moment(startTime1, "hh:mm A");
  const end1 = moment(endTime1, "hh:mm A");
  const start2 = moment(startTime2, "hh:mm A");
  const end2 = moment(endTime2, "hh:mm A");
  
  return start1.isBefore(end2) && start2.isBefore(end1);
};

export const getAvailableFacilities = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.query;

    console.log("hello", req.query);
    const reservations = await Reservation.find({ date });

    const approvedReservations = reservations.filter(
      (reservation) => reservation.state === "Approved"
    );
    const pendingReservations = reservations.filter(
      (reservation) => reservation.state === "Pending"
    );

    const overlappingApprovedReservations = approvedReservations.filter(
      (reservation) => 
        timesOverlap(reservation.startTime, reservation.endTime, startTime, endTime)
    );
    const overlappingPendingReservations = pendingReservations.filter(
      (reservation) => 
        timesOverlap(reservation.startTime, reservation.endTime, startTime, endTime)
    );

    const reservedFacilityNames = overlappingApprovedReservations.map(
      (reservation) => reservation.facility
    );
    const pendingFacilityNames = overlappingPendingReservations.map(
      (reservation) => reservation.facility
    );

    const allFacilities = await Facility.find();

    const availableFacilities = allFacilities.filter(
      (facility) => !reservedFacilityNames.includes(facility.label)
    );

    return res.status(200).json({
      availableFacilities,
      pendingFacilities: pendingFacilityNames,
    });
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({
      message: "An error occurred when fetching available facilities",
    });
  }
};

*/

export const getAvailableFacilities = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.query;

    // Convert date to a Date object
    const reservationDate = new Date(date);

    // Find reservations that overlap with the requested time range
    const overlappingReservations = await Reservation.find({
      date: reservationDate,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    }).populate('facility');

    // Separate occupied facilities based on reservation state
    const occupiedFacilities = overlappingReservations
      .filter(reservation => reservation.state === 'Approved')
      .map(reservation => reservation.facility._id.toString());

    // Pending facilities
    const pendingFacilities = overlappingReservations
      .filter(reservation => reservation.state === 'Pending')
      .map(reservation => reservation.facility);

    // Find all facilities and filter out the occupied ones
    const allFacilities = await Facility.find();
    const availableFacilities = allFacilities.filter(facility => !occupiedFacilities.includes(facility._id.toString()));

    res.status(200).json({
      availableFacilities,
      pendingFacilities
    });
  } catch (error) {
    console.error("Error fetching available facilities:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
