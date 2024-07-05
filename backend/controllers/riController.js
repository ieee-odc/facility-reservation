import { ReservationInitiator } from '../models/reservationInitiatorModel.js';
import bcrypt from 'bcryptjs';

export const createReservationInitiator = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    const existingInitiator = await ReservationInitiator.findOne({ email });
    if (existingInitiator) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newInitiator = new ReservationInitiator({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    const savedInitiator = await newInitiator.save();

    res.status(201).json(savedInitiator);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const getAllReservationInitiators = async (req, res) => {
  try {
    const initiators = await ReservationInitiator.find().select('-password');
    res.status(200).json(initiators);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const getReservationInitiatorById = async (req, res) => {
  const { id } = req.params;

  try {
    const initiator = await ReservationInitiator.findById(id).select('-password');
    if (!initiator) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(initiator);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

export const updateReservationInitiator = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, phoneNumber } = req.body;

  try {
    const initiator = await ReservationInitiator.findById(id);
    if (!initiator) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) initiator.name = name;
    if (email) initiator.email = email;
    if (phoneNumber) initiator.phoneNumber = phoneNumber;
    if (password) initiator.password = await bcrypt.hash(password, 10);

    const updatedInitiator = await initiator.save();
    res.status(200).json(updatedInitiator);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

export const deleteReservationInitiator = async (req, res) => {
  const { id } = req.params;

  try {
    const initiator = await ReservationInitiator.findById(id);
    if (!initiator) {
      return res.status(404).json({ message: 'User not found' });
    }

    await initiator.remove();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};
