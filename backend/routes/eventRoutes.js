import express from "express";
import {
  createEvent,
  findEventWithReservations,
  findAllEventstWithReservations,
  updateEvent,
  findEventById,
  findAllEvents,
  updateEventState,
} from "../controllers/eventController.js";

const eventRouter = express.Router();

eventRouter.post("/", createEvent);
eventRouter.delete("/:id", createEvent);
eventRouter.get("/reservations/:id", findEventWithReservations);
eventRouter.get("/reservations", findAllEventstWithReservations);
eventRouter.get("/", findAllEvents);
eventRouter.get("/:id", findEventById);
eventRouter.put("/:id", updateEvent);
eventRouter.patch("/state/:id", updateEventState);

export default eventRouter;
