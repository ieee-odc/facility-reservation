import express from "express";

import {
  findAllReservations,
  findReservationById,
  addReservation,
  updateReservation,
  deleteReservation,
} from "../controllers/reservationController.js";

const router = express.Router();

router.get('/', findAllReservations);

router.get('/:id', findReservationById);
router.post('/', addReservation);
router.patch('/:id', updateReservation);
router.delete('/:id', deleteReservation);

export default router;