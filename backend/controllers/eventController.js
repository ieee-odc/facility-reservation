import { Equipment } from "../models/equipmentModel.js";
import { Event } from "../models/eventModel.js";
import { Facility } from "../models/facilityModel.js";
import ReservationInitiator from "../models/reservationInitiatorModel.js";
import { Reservation } from "../models/reservationModel.js";
import { sendSetupEmail } from "../utils/emailService.js";
import moment from "moment";

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

    const facilityIds = reservations.map((reservation) => reservation.facility);

    const materialIds = reservations.flatMap(
      (reservation) => reservation.materials
    );

    const [admins, entityName, facilities, equipments] = await Promise.all([
      ReservationInitiator.find({ role: "Admin" }).select("-password"),
      ReservationInitiator.findOne({ _id: organizer }).select("-password"),
      Facility.find({ _id: { $in: facilityIds } }),
      Equipment.find({ _id: { $in: materialIds } }),
    ]);

    console.log("facilities", facilities);
    console.log("equipments", equipments);

    const equipmentMap = equipments.reduce((acc, equipment) => {
      acc[equipment._id.toString()] = equipment.label;
      return acc;
    }, {});

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

        const emailSubject = `New Event Created by ${entityName.name.toUpperCase()}`;
        const emailBody = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #007bff;">Event Details:</h2>
          <div style="margin-bottom: 20px;">
            <p><strong>Event Name:</strong> ${name}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Organizer:</strong> ${entityName.name}</p>
            <p><strong>Start Date:</strong> ${new Date(
              startDate
            ).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> ${new Date(
              endDate
            ).toLocaleDateString()}</p>
            <p><strong>Total Effective:</strong> ${totalEffective} people</p>
          </div>
          <h2 style="color: #007bff;">Reservations Details:</h2>
          <ul style="padding-left: 20px;">
            ${reservations
              .map((reservation, index) => {
                const facility = facilities.find(
                  (f) => f._id.toString() === reservation.facility.toString()
                );
                return `
              <li style="margin-bottom: 15px;">
                <h3 style="margin-bottom: 5px;">Reservation ${index + 1}</h3>
                <div style="margin-left: 15px;">
                  <p><strong>Facility:</strong> ${
                    facility
                      ? `${facility.label} (Capacity: ${facility.capacity})`
                      : "Unknown"
                  }</p>
                  <p><strong>Motive:</strong> ${reservation.motive}</p>
                  <p><strong>Date:</strong> ${new Date(
                    reservation.date
                  ).toLocaleDateString()}</p>
                  <p><strong>Start Time:</strong> ${reservation.startTime}</p>
                  <p><strong>End Time:</strong> ${reservation.endTime}</p>
                  <p><strong>Effective:</strong> ${reservation.effective}</p>
                  <p><strong>Materials:</strong> ${reservation.materials
                    .map(
                      (materialId) =>
                        equipmentMap[materialId.toString()] || "Unknown"
                    )
                    .join(", ")}</p>
                </div>
              </li>`;
              })
              .join("")}
          </ul>
        </div>
      `;

        for (const admin of admins) {
          await sendSetupEmail(admin.email, emailSubject, emailBody);
        }

        return res
          .status(201)
          .json({ event, reservations: createdReservations });
      })
      .catch((e) => {
        console.log(e);
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
      (reservation) => reservation.state === "Cancelled"
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
      newState = "Cancelled";
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
    console.log("id event", id);

    const { eventData, reservations } = req.body;
    console.log("req.body", req.body);

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

    res.status(200).json({ event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*export const updateEventCancel = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id event", id);
    
    //const reservations = await Reservation.find({event: id});
    console.log("req.body", req.body);


    

    const event = await Event.findByIdAndUpdate(id, {state: "Cancelled"}, {
      new: true,
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const [entityName, reservations] = await Promise.all([
      ReservationInitiator.findOne({ _id: event.organizer }).select(
        "-password"
      ),
      Reservation.find({event: id})
    ]);
    

    let updatedReservations;
    if (reservations) {
      updatedReservations = await Promise.all(
        reservations.map(async (reservationData) => {
          const { _id } = reservationData;
          if (_id) {
            return await Reservation.findByIdAndUpdate(_id, {state: "Cancelled"}, {
              new: true,
            });
          }
        })
      );
    }

    try {
      await sendSetupEmail(
        entityName.email,
        `An Event has been Cancelled`,
        `You have cancelled your event named ${event.name} planned from ${event.startDate} to ${event.endDate}
         description : ${event.description}.`
      );
    } catch (error) {
      console.log("error here", error);
    }

    return res.status(200).json({ event,updatedReservations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/

export const updateEventCancel = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id event", id);

    // const reservations = await Reservation.find({ event: id });
    console.log("req.body", req.body);

    const event = await Event.findByIdAndUpdate(
      id,
      { state: "Cancelled" },
      {
        new: true,
      }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const [entityName, reservations] = await Promise.all([
      ReservationInitiator.findOne({ _id: event.organizer }).select(
        "-password"
      ),
      Reservation.find({ event: id }),
    ]);

    let updatedReservations = [];
    if (reservations.length > 0) {
      updatedReservations = await Promise.all(
        reservations.map(async (reservationData) => {
          const { _id } = reservationData;
          if (_id) {
            return await Reservation.findByIdAndUpdate(
              _id,
              { state: "Cancelled" },
              {
                new: true,
              }
            );
          }
        })
      );
    }

    if (entityName && entityName.email) {
      try {
        const formattedStartDate = moment(event.startDate).format(
          "dddd, MMMM D YYYY, h:mm A"
        );
        const formattedEndDate = moment(event.endDate).format(
          "dddd, MMMM D YYYY, h:mm A"
        );

        const emailBody = `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #007bff;">An Event has been Cancelled</h2>
          <div style="margin-bottom: 20px;">
            <p>You have cancelled your event named <strong>${event.name}</strong> planned from <strong>${formattedStartDate}</strong> to <strong>${formattedEndDate}</strong>.</p>
            <p><strong>Description:</strong> ${event.description}</p>
          </div>
        </div>
      `;

        await sendSetupEmail(
          entityName.email,
          "An Event has been Cancelled",
          emailBody
        );
      } catch (error) {
        console.log("Error sending email:", error);
      }
    }

    return res.status(200).json({ event, updatedReservations });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const findEventWithReservations = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id).exec();
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const reservations = await Reservation.find({ event: id })
      .populate("facility", "label") // Fetch facility details (e.g., name)
      .exec();

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

/**
 * Finds all events related to a specific organizer and includes their reservations with facility data.
 */
export const findAllRelatedEventstWithReservations = async (req, res) => {
  try {
    const { id } = req.params;
    const events = await Event.find({ organizer: id }).exec();

    const eventsWithReservations = await Promise.all(
      events.map(async (event) => {
        const reservations = await Reservation.find({ event: event._id })
          .populate("facility", "name") // Fetch facility details (e.g., name)
          .exec();
        return { ...event.toObject(), reservations: reservations };
      })
    );

    res.status(200).json(eventsWithReservations);
  } catch (error) {
    console.error("Error fetching events with reservations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Finds all events and includes their reservations with facility data.
 */
export const findAllEventstWithReservations = async (req, res) => {
  try {
    const events = await Event.find().exec();

    const eventsWithReservations = await Promise.all(
      events.map(async (event) => {
        const reservations = await Reservation.find({ event: event._id })
          .populate("facility", "name") // Fetch facility details (e.g., name)
          .exec();
        return { ...event.toObject(), reservations: reservations };
      })
    );

    res.status(200).json(eventsWithReservations);
  } catch (error) {
    console.error("Error fetching events with reservations:", error);
    res.status(500).json({ message: "Server error" });
  }
};
