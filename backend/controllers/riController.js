import { ReservationInitiator } from "../models/reservationInitiatorModel.js";
import bcrypt from "bcryptjs";

export const createReservationInitiator = async (req, res) => {
  const {
    name,
    email,
    phoneNumber,
    backupEmail,
    nature,
    service,
    organisation,
    role,
  } = req.body;

  console.log("create", req.body);

  try {
    const existingInitiator = await ReservationInitiator.findOne({ email });
    if (existingInitiator) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newInitiator = await ReservationInitiator.create({
      name,
      email,
      backupEmail,
      phoneNumber,
      nature,
      service,
      organisation,
      role,
    });

    //const savedInitiator = await newInitiator.save();

    return res.status(201).json(newInitiator);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user", error });
  }
};

export const getAllReservationInitiators = async (req, res) => {
  try {
    const initiators = await ReservationInitiator.find().select("-password");
    res.status(200).json(initiators);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const getReservationInitiatorById = async (req, res) => {
  const { id } = req.params;

  try {
    const initiator = await ReservationInitiator.findById(id).select(
      "-password"
    );
    if (!initiator) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(initiator);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

export const updateReservationInitiator = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    password,
    phoneNumber,
    backupEmail,
    nature,
    service,
    organisation,
    role,
  } = req.body;

  try {
    const initiator = await ReservationInitiator.findById(id);
    if (!initiator) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) initiator.name = name;
    if (email) initiator.email = email;
    if (backupEmail) initiator.backupEmail = backupEmail;
    if (phoneNumber) initiator.phoneNumber = phoneNumber;
    if (nature) initiator.nature = nature;
    if (service) initiator.service = service;
    if (organisation) initiator.organisation = organisation;
    if (role) initiator.role = role;

    if (password) initiator.password = await bcrypt.hash(password, 10);

    const updatedInitiator = await initiator.save();
    res.status(200).json(updatedInitiator);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

export const deleteReservationInitiator = async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  

  try {
    const deletedInitiator = await ReservationInitiator.findByIdAndDelete(id);

    if (!deletedInitiator) {
      // If no initiator is found, return a 404 error
      return res.status(404).json({ message: 'Initiator not found' });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

export const getReservationInitiatorByEmail = async (req, res) => {
  const { email } = req.query;

  try {
    const initiator = await ReservationInitiator.findOne({ email }).select(
      "-password"
    );
    if (!initiator) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(initiator);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};
export const updateReservationInitiatorPwd = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const initiator = await ReservationInitiator.findById(id);
    if (!initiator) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password) initiator.password = password;
    const pwd = await bcrypt.hash(password, 10);
    console.log(initiator.password);

    const updatedInitiator = await initiator.save();
    res.status(200).json(updatedInitiator);
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error });
  }
};

export const getUserIdbyEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const initiator = await ReservationInitiator.findOne({ email });
    if (!initiator) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ id: initiator._id });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user ID", error });
  }
};
