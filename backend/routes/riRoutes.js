import express from 'express';
import {
  createReservationInitiator,
  getAllReservationInitiators,
  getReservationInitiatorById,
  updateReservationInitiator,
  deleteReservationInitiator,
  getReservationInitiatorByEmail} from './../controllers/riController.js'

import authUser, { verifyUser } from '../controllers/authController.js';

const router = express.Router();
router.post('/login', authUser);

router.post('/', createReservationInitiator);
router.post('/verify-user', verifyUser)

router.get('/', getAllReservationInitiators);

router.get('/:id', getReservationInitiatorById);

router.put('/:id', updateReservationInitiator);

router.delete('/:id', deleteReservationInitiator);
router.get('/by-email', getReservationInitiatorByEmail);

export default router;
