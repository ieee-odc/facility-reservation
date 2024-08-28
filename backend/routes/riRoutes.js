import express from "express";
import {
  createReservationInitiator,
  getAllReservationInitiators,
  getReservationInitiatorById,
  updateReservationInitiator,
  deleteReservationInitiator,
  getReservationInitiatorByEmail,
  updateReservationInitiatorPwd,
  getUserIdbyEmail,
  getAllAdmins,
} from "./../controllers/riController.js";

import authUser, { verifyUser } from "../controllers/authController.js";

import csv from "csv-parser";
import multer from "multer";
import fs from "fs";
import crypto from "crypto";
import { ReservationInitiator } from "../models/reservationInitiatorModel.js";
import admin from "../config/firebase-config.js";
import { sendSetupEmail } from "../utils/emailService.js";

const upload = multer({ dest: "uploads/" });

const router = express.Router();
router.post("/login", authUser);

router.post("/", createReservationInitiator);
router.post('/upload-csv', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  console.log("file", req.file);
  

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      fs.unlinkSync(req.file.path); // Remove the file after processing

      try {
        for (const record of results) {
          const {
            name,
            email,
            phoneNumber,
            backupEmail,
            nature,
            service,
            organisation,
            role,
          } = record;

          const existingInitiator = await ReservationInitiator.findOne({ email });
          if (existingInitiator) {
            continue; 
          }

          const defaultPassword = crypto.randomBytes(12).toString('hex');
          const userRecord = await admin.auth().createUser({
            email,
            emailVerified: false,
            password: defaultPassword,
            displayName: name,
          });

          await ReservationInitiator.create({
            name,
            email,
            backupEmail,
            phoneNumber,
            nature,
            service,
            organisation,
            role: role ? role : "User",
          });

          await sendSetupEmail(email, 'Set up your account', `Please set up your account and make sure to update your password. Here is your default password: ${defaultPassword}`);
        }
        res.status(201).json({ message: 'Users added successfully' });
      } catch (error) {
        console.error('Error processing CSV:', error);
        res.status(500).json({ message: 'Error processing CSV file' });
      }
    });
});
router.post("/verify-user", verifyUser);

router.get("/", getAllReservationInitiators);
router.get("/admins", getAllAdmins);

router.get("/:id", getReservationInitiatorById);

router.patch("/:id", updateReservationInitiator);
router.patch("/pwd/:id", updateReservationInitiatorPwd);

router.get("/get-user-id/:email", getUserIdbyEmail);
router.delete("/:id", deleteReservationInitiator);
router.get("/by-email/:email", getReservationInitiatorByEmail);

export default router;
