import express from "express";

import {
  findAllReservations,
  findReservationById,
  addReservation,
  updateReservation,
  deleteReservation,
  findAllPureReservations,
  getAvailableFacilities,
  findAllPureRelatedReservations,
} from "../controllers/reservationController.js";

const router = express.Router();

router.get('/', findAllReservations);
router.get('/pure', findAllPureReservations);
router.get('/available-facilities', getAvailableFacilities);
router.get('/pure/:entityId', findAllPureRelatedReservations);

router.get('/:id', findReservationById);
router.post('/', addReservation);
router.patch('/:id', updateReservation);
router.delete('/:id', deleteReservation);

export default router;