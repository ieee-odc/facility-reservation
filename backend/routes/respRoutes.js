import express from "express";
import {
  createResponsible,
  getAllResponsibles,
  getResponsibleById,
  updateResponsible,
  deleteResponsible,
  getAllRelatedResponsibles,
} from "../controllers/RespController.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { Responsible } from "../models/responsibleModel.js";
const router = express.Router();

router.post("/", createResponsible);
router.get("/", getAllResponsibles);
router.get("/related/:id", getAllRelatedResponsibles);
router.get("/:id", getResponsibleById);
router.put("/:id", updateResponsible);
router.delete("/:id", deleteResponsible);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to save images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Generate a unique name
  },
});

const uploader = multer({ storage });

router.post("/add-responsible", uploader.single("file"), async (req, res) => {
  try {
    let file;
    let profileImagePath ;
    if (!req.file) {
      file = "";
      profileImagePath = "";
    }else {
      file = req.file;
      profileImagePath = req.file.path;
    }
    const id = req.body.currentId;
    console.log("file", file);
    console.log("currentId", id);

    const {
      firstName,
      lastName,
      contactEmail,
      contactPhoneNumber,
      position,
      currentId,
    } = req.body;

    const user = await Responsible.find({ entity: id, contactEmail });

    console.log("user", user);

    if (user.length) {
      return res
        .status(400)
        .json({ message: "This responsible already exists" });
    }

    const newResponsible = await Responsible.create({
      firstName,
      lastName,
      contactEmail,
      contactPhoneNumber,
      position,
      profileImage: profileImagePath,
      entity: currentId,
    });

    res.status(200).json({ message: "New responsible uploaded successfully!" });

    /*if (user.profileImage) {
        const oldImagePath = path.resolve(user.profileImage);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Error deleting old profile image:", err);
          }
        });
      }

      user.profileImage = profileImagePath;
      await user.save();
      res.status(200).json({ message: "Profile image uploaded successfully!" });*/
  } catch (error) {
    console.log("error", error);

    res.status(500).json({ message: "Error adding new responsible", error });
  }
});

export default router;
