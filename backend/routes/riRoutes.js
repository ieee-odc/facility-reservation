import express from 'express';
import {
  createReservationInitiator,
  getAllReservationInitiators,
  getReservationInitiatorById,
  updateReservationInitiator,
  deleteReservationInitiator,
} from '../controllers/reservationInitiatorController.js';

const router = express.Router();

router.post('/', createReservationInitiator);

router.get('/', getAllReservationInitiators);

router.get('/:id', getReservationInitiatorById);

router.put('/:id', updateReservationInitiator);

router.delete('/:id', deleteReservationInitiator);

export default router;
