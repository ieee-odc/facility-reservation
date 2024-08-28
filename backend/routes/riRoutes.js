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
import path from "path";

const upload = multer({ dest: "uploads/" });

const router = express.Router();
router.post("/login", authUser);

router.post("/", createReservationInitiator);

router.post("/upload-csv", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  console.log("file", req.file);

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
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

          const existingInitiator = await ReservationInitiator.findOne({
            email,
          });
          if (existingInitiator) {
            continue;
          }

          const defaultPassword = crypto.randomBytes(12).toString("hex");
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

          await sendSetupEmail(
            email,
            "Set up your account",
            `Please set up your account and make sure to update your password. Here is your default password: ${defaultPassword}`
          );
        }
        res.status(201).json({ message: "Users added successfully" });
      } catch (error) {
        console.error("Error processing CSV:", error);
        res.status(500).json({ message: "Error processing CSV file" });
      }
    });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to save images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Generate a unique name
  },
});

const uploader = multer({ storage });

router.post(
  "/upload-profile-image",
  uploader.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const file = req.file;
      const id = req.body.currentId;
      console.log("file", file);
      const profileImagePath = req.file.path;
      console.log("currentId", id);

      const user = await ReservationInitiator.findById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.profileImage) {
        const oldImagePath = path.resolve(user.profileImage);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Error deleting old profile image:", err);
          }
        });
      }

      user.profileImage = profileImagePath;
      await user.save();
      res.status(200).json({ message: "Profile image uploaded successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error uploading profile image", error });
    }
  }
);

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
