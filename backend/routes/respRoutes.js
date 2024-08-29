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
    let profileImagePath;
    if (!req.file) {
      file = "";
      profileImagePath = "";
    } else {
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
  } catch (error) {
    console.log("error", error);

    res.status(500).json({ message: "Error adding new responsible", error });
  }
});

router.patch("/edit-responsible", uploader.single("file"), async (req, res) => {
  try {
    console.log("req.body edit", req.body);
    console.log("req.body file", req.file);

    let file;
    let profileImagePath;
   
      file = req.file;
      profileImagePath = req.file?.path;
    
    const id = req.body.currentId;
    console.log("file --", profileImagePath);
    console.log("currentId --", id);

    const {
      firstName,
      lastName,
      contactEmail,
      contactPhoneNumber,
      position,
      currentId,
    } = req.body;

    const users = await Responsible.find({ entity: id, contactEmail });
    const user = users[0];
    console.log("user --", user);

    if (!users.length) {
      return res
        .status(400)
        .json({ message: "This responsible does not exist" });
    }

    if ((user.profileImage!==undefined)&&(req.file?.path)) {
      const oldImagePath = path.resolve(user.profileImage);

      console.log("old path ", oldImagePath);

      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Error deleting old profile image:", err);
        }
      });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.contactEmail = contactEmail;
    user.contactPhoneNumber = contactPhoneNumber;
    user.position = position;
    user.profileImage = profileImagePath!==undefined ? profileImagePath:user.profileImage;
    user.entity = currentId;

    await user.save();

    res.status(200).json({ message: "New responsible uploaded successfully!" });
  } catch (error) {
    console.log("error", error);

    res.status(500).json({ message: "Error adding new responsible", error });
  }
});

export default router;
