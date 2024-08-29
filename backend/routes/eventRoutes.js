import express from "express";
import {
  createEvent,
  findEventWithReservations,
  findAllEventstWithReservations,
  updateEvent,
  findEventById,
  deleteEvent,
  findAllEvents,
  updateEventState,
  findAllRelatedEventstWithReservations,
  updateEventCancel,
} from "../controllers/eventController.js";

const eventRouter = express.Router();

eventRouter.post("/", createEvent);
eventRouter.delete("/:id", deleteEvent);
eventRouter.get("/reservations/:id", findEventWithReservations);
eventRouter.get("/reservations", findAllEventstWithReservations);
eventRouter.get("/reservation/:id", findAllRelatedEventstWithReservations);
eventRouter.get("/", findAllEvents);
eventRouter.get("/:id", findEventById);
eventRouter.patch("/:id", updateEvent);
eventRouter.patch("/state/:id", updateEventState);
eventRouter.patch("/cancel/:id", updateEventCancel);

export default eventRouter;
