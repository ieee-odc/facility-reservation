import { Reservation } from "../models/reservationModel.js";
import { Facility } from "../models/facilityModel.js";
import ReservationInitiator from "../models/reservationInitiatorModel.js";
import { getAllAdmins } from "./riController.js";
import { findAllFacilities } from "./facilityController.js";
import { sendSetupEmail } from "../utils/emailService.js";

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
      entity,
    } = req.body["0"];

    const [admins, entityName, facilityLabel] = await Promise.all([
      ReservationInitiator.find({ role: "Admin" }).select("-password"),
      ReservationInitiator.findOne({ _id: entity }).select("-password"),
      Facility.findOne({ _id: facility })
    ]);

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
      entity,
    });

    for (const admin of admins) {
      await sendSetupEmail(
        admin.email,
        "New Reservation Submitted",
        `A new reservation has been created for the facility "${facilityLabel.label}" on ${date} by ${entityName.name}.`
      );
    }

    return res.status(201).json(reservation);
  } catch (error) {
    console.error("Error creating reservation:", error);
    return res.status(500).json({ message: error.message });
  }
};


export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;
    const {state} = req.body;

    
    
    const reservation = await Reservation.findById(id);

    if (reservation) {
      await Reservation.updateOne({ _id: id }, updateFields, { runValidators: true });
      const updatedReservation = await Reservation.findById(id);
      console.log('Updated Reservation:', updatedReservation);
 
    
    console.log("state",state);
    console.log("old res", reservation);

      const [entityName, facilityLabel] = await Promise.all([
        ReservationInitiator.findOne({ _id: reservation.entity }).select(
          "-password"
        ),
        Facility.findOne({ _id: reservation.facility }),
      ]);
    

      if (state!==reservation.state) {
        console.log("entity name",entityName);

try {
  await sendSetupEmail(
    entityName.email,
    `A Reservation has been ${state}`,
    `Your reservation for the facility : ${facilityLabel.label}, motive : ${reservation.motive}, on ${reservation.date} from ${reservation.startTime} to ${reservation.endTime} has been ${state}.`
  );
  
  
} catch (error) {
  console.log("error here",error);
  
}
       
      }


      return res.status(200).json(reservation);
    } else {
      return res.status(404).json({ message: "Reservation not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/*export const updateReservationState = async (req, res) => {
  try {
    const { id } = req.params;
    const {state} = req.body;

    const reservation = await Reservation.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (reservation) {
      const [entityName, facilityLabel] = await Promise.all([
        ReservationInitiator.findOne({ _id: reservation[0].entity }).select(
          "-password"
        ),
        Facility.findOne({ _id: reservation[0].facility }),
      ]);


      await sendSetupEmail(
        entityName.email,
        `A Reservation has been ${updateFields}`,
        `A new reservation has been created for the facility "${facilityLabel.label}" on ${date} by ${entityName.name}.`
      );

      return res.status(200).json(reservation);
    } else {
      return res.status(404).json({ message: "Reservation not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};*/



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

function timeStringToMinutes(timeString) {
  const [time, modifier] = timeString.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') {
    hours = '00';
  }
  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }
  return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
}

export const getAvailableFacilities = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.query;

    console.log("startTime", startTime);
    console.log("endTime", endTime);
    
    const start = timeStringToMinutes(startTime);
    console.log("start", start);
    

    const reservationDate = new Date(date);

    const overlappingReservations = await Reservation.find({
      date: reservationDate,
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    }).populate("facility");

    console.log(overlappingReservations);
    

    const occupiedFacilities = overlappingReservations
      .filter((reservation) => reservation.state === "Approved")
      .map((reservation) => reservation.facility._id.toString());

    const pendingFacilities = overlappingReservations
      .filter((reservation) => reservation.state === "Pending")
      .map((reservation) => reservation.facility);

    console.log("pending", pendingFacilities);
      

    const allFacilities = await Facility.find({ state: "Bookable" });
    const availableFacilities = allFacilities.filter(
      (facility) => !occupiedFacilities.includes(facility._id.toString())
    );

    console.log("available", availableFacilities);
    console.log("occupied", occupiedFacilities);
    

    res.status(200).json({
      availableFacilities,
      pendingFacilities,
    });
  } catch (error) {
    console.error("Error fetching available facilities:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
