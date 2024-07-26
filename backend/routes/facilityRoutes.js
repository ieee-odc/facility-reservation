import express from "express";
import {
  addFacility,
  updateFacility,
  deleteFacility,
  findAllFacilities,
  findOneFacility,
} from "../controllers/facilityController.js";

const facilityRouter = express.Router();

facilityRouter.post("/", addFacility);

facilityRouter.get("/", findAllFacilities);

facilityRouter.get("/:id", findOneFacility);

facilityRouter.put("/:id", updateFacility);

facilityRouter.delete("/:id", deleteFacility);

export default facilityRouter;