import express from "express";
import {
  createEvent,
  findEventWithReservations,
  findAllEventstWithReservations,
  updateEvent,
  findEventById,
  findAllEvents,
  updateEventState,
  findAllRelatedEventstWithReservations,
} from "../controllers/eventController.js";

const eventRouter = express.Router();

eventRouter.post("/", createEvent);
eventRouter.delete("/:id", createEvent);
eventRouter.get("/reservations/:id", findEventWithReservations);
eventRouter.get("/reservations", findAllEventstWithReservations);
eventRouter.get("/reservation/:id", findAllRelatedEventstWithReservations);
eventRouter.get("/", findAllEvents);
eventRouter.get("/:id", findEventById);
eventRouter.patch("/:id", updateEvent);
eventRouter.patch("/state/:id", updateEventState);

export default eventRouter;
