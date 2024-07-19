import express from 'express';
import {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification
} from '../controllers/notificationController.js';

const router = express.Router();

// Get all notifications
router.get('/delete', getAllNotifications);

// Get a single notification by ID
router.get('/delete/:id', getNotificationById);

// Create a new notification
router.post('/delete', createNotification);

// Update a notification
router.put('/delete/:id', updateNotification);

// Delete a notification
router.delete('/delete/:id', deleteNotification);

export default router;
