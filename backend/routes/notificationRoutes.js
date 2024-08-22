import express from 'express';
import {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification, 
  getNotificationsByRecipientId,
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getAllNotifications);

router.get('/:id', getNotificationById);
router.get('recipient/:id', getNotificationsByRecipientId);


router.post('/', createNotification);

router.put('/:id', updateNotification);

router.delete('/:id', deleteNotification);

export default router;
