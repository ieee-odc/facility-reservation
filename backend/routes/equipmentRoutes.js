import express from "express";
import {
  addEquipment,
  updateEquipment,
  deleteEquipment,
  findAllEquipments,
  findOneEquipment,
} from "../controllers/equipmentController.js";

const equipmentRouter = express.Router();

equipmentRouter.post("/", addEquipment);

equipmentRouter.get("/", findAllEquipments);

equipmentRouter.get("/:id", findOneEquipment);

equipmentRouter.patch("/:id", updateEquipment);

equipmentRouter.delete("/:id", deleteEquipment);

export default equipmentRouter;
