import Notification from '../models/notificationModel.js';

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().populate('recipient');
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id).populate('recipient');
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNotification = async (req, res) => {
  const { title, message, recipient } = req.body;
console.log("req.body notif", req.body);

  try {
    const notifications = recipient.map(({ value }) => ({
      title,
      message,
      recipient: value, 
    }));

    console.log("notifications", notifications);
    
    const savedNotifications = await Notification.insertMany(notifications);
    res.status(201).json(savedNotifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateNotification = async (req, res) => {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getNotificationsByRecipientId = async (req, res) => {
  try {
    const recipientId = req.params.recipientId;
    const notifications = await Notification.find({ recipient: recipientId }).populate('recipient');
    if (notifications.length === 0) {
      return res.status(404).json({ message: 'No notifications found for this recipient' });
    }
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const deletedNotification = await Notification.findByIdAndDelete(req.params.id);
    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationsAsRead = async (req, res) => {
  try {
    const recipientId = req.params.recipientId;
    
    const result = await Notification.updateMany(
      { recipient: recipientId, read: false },  // Find all unread notifications for the recipient
      { $set: { read: true } }  // Mark them as read
    );

    if (result.nModified === 0) {
      return res.status(404).json({ message: 'No unread notifications found for this recipient' });
    }

    res.status(200).json({ message: 'Notifications marked as read successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
