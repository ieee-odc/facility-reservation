import express from 'express';
import {
  createReservationInitiator,
  getAllReservationInitiators,
  getReservationInitiatorById,
  updateReservationInitiator,
  deleteReservationInitiator} from './../controllers/riController.js'

import authUser from '../controllers/authController.js';

const router = express.Router();
router.post('/login', authUser);

router.post('/', createReservationInitiator);

router.get('/', getAllReservationInitiators);

router.get('/:id', getReservationInitiatorById);

router.put('/:id', updateReservationInitiator);

router.delete('/:id', deleteReservationInitiator);

export default router;
