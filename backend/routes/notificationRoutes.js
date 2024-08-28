import express from 'express';
import {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification, 
  getNotificationsByRecipientId,
  markNotificationsAsRead,
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getAllNotifications);

router.get('/:id', getNotificationById);
router.get('/recipient/:recipientId', getNotificationsByRecipientId);


router.post('/', createNotification);

router.put('/:id', updateNotification);

router.delete('/:id', deleteNotification);
router.patch('/mark-as-read/:recipientId', markNotificationsAsRead);


export default router;
