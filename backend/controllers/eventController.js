import { Event } from "../models/eventModel.js";
import { Reservation } from "../models/reservationModel.js";

/*
name 
description
startDate
endDate
state
organizer
totalEffective

*/
export const findAllEvents = async (req, res) => {
  try {
    const events = await Event.find();

    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const findEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (event) {
      return res.status(200).json(event);
    } else {
      return res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndDelete(id);

    if (event) {
      return res.status(200).json({ message: "Event deleted successfully" });
    } else {
      return res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/*export const createEvent = async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      organizer,
      totalEffective,
      reservations,
    } = req.body;
console.log("req body", req.body);
    const event = await Event.create({
      name,
      description,
      startDate,
      endDate,
      organizer,
      totalEffective,
    });

    if (event) {
      const createdReservations = await Promise.all(
        reservations.map(async (reservationData) => {
          const reservation = new Reservation({
            ...reservationData,
            event: event._id,
          });
          await reservation.save();
          return reservation._id;
        })
      );

      res.status(201).json({ event, reservations: createdReservations });
    }
    return res
      .status(409)
      .json({ message: "an error occured when creating the event" });
  } catch (error) {
    console.log('error',error.message);
    res.status(500).json({ message: error.message });
  }
};*/

export const createEvent = async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      organizer,
      totalEffective,
      reservations,
    } = req.body;

    console.log("req body", req.body);

    Event.create({
      name,
      description,
      startDate,
      endDate,
      organizer,
      totalEffective,
    })
      .then(async (event) => {
        const createdReservations = await Promise.all(
          reservations.map(async (reservationData) => {
            const reservation = new Reservation({
              ...reservationData,
              event: event._id,
            });
            await reservation.save();
            return reservation._id;
          })
        );

        return res
          .status(201)
          .json({ event, reservations: createdReservations });
      })
      .catch((e) => {
        return res
          .status(409)
          .json({ message: "An error occurred when creating the event" });
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateEventState = async (req, res) => {
  try {
    const { id } = req.params;
    const reservations = await Reservation.find({ event: id });
    if (!reservations.length) {
      return res.status(404).json({ message: "Event not found" });
    }

    const allApproved = reservations.every(
      (reservation) => reservation.state === "Approved"
    );
    const allRejected = reservations.every(
      (reservation) => reservation.state === "Rejected"
    );
    const allCanceled = reservations.every(
      (reservation) => reservation.state === "Canceled"
    );
    const someApproved = reservations.some(
      (reservation) => reservation.state === "Approved"
    );
    const someRejected = reservations.some(
      (reservation) => reservation.state === "Rejected"
    );
    const somePending = reservations.some(
      (reservation) => reservation.state === "Pending"
    );

    let newState;
    if (allApproved) {
      newState = "Approved";
    } else if (allRejected) {
      newState = "Rejected";
    } else if (allCanceled) {
      newState = "Canceled";
    } else if (someApproved && (someRejected || somePending)) {
      newState = "PartiallyApproved";
    } else {
      newState = "Pending";
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { state: newState },
      { new: true }
    );
    return res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event state:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { eventData, reservations } = req.body;

    const event = await Event.findByIdAndUpdate(id, eventData, {
      new: true,
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (reservations) {
      const updatedReservations = await Promise.all(
        reservations.map(async (reservationData) => {
          const { id, ...updateData } = reservationData;
          if (id) {
            return await Reservation.findByIdAndUpdate(id, updateData, {
              new: true,
            });
          } else {
            const reservation = new Reservation({
              ...updateData,
              event: event._id,
            });
            await reservation.save();
            return reservation;
          }
        })
      );
      await updateEventState(event._id);
      res.status(200).json({ event, reservations: updatedReservations });
    }


    res.status(200).json({event});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const findEventWithReservations = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id).exec();
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const reservations = await Reservation.find({ event: id }).exec();

    const eventWithReservations = {
      ...event.toObject(),
      reservations: reservations,
    };

    res.status(200).json(eventWithReservations);
  } catch (error) {
    console.error("Error fetching event with reservations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const findAllEventstWithReservations = async (req, res) => {
  try {
    const events = await Event.find().exec();

    const eventsWithReservations = await Promise.all(
      events.map(async (event) => {
        const reservations = await Reservation.find({
          event: event._id,
        }).exec();
        console.log("reservatioooons", reservations);
        return { ...event.toObject(), reservations: reservations };
      })
    );

    res.status(200).json(eventsWithReservations);
  } catch (error) {
    console.error("Error fetching events with reservations:", error);
    res.status(500).json({ message: "Server error" });
  }
};
