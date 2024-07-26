import { Facility } from "../models/facilityModel.js";

export const addFacility = async (req, res) => {
  try {
    const { label, capacity, state } = req.body;

    if (!label || !capacity || !state) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields." });
    }

    const existingFacility = await Facility.findOne({ label });
    if (existingFacility) {
      return res.status(400).json({
        message: "A facility with this label does already exist",
      });
    }

    const newFacility = await Facility.create({
      label,
      capacity,
      state,
    });

    return res.status(201).json(newFacility);
  } catch (error) {
    return res.status(500).json({
      message: "an error occured when creating the facility",
    });
  }
};

export const findAllFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find({});
    return res.status(200).json({
      count: facilities.length,
      data: facilities,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occured when fetching the facilities",
    });
  }
};

export const findOneFacility = async (req, res) => {
  try {
    const { label } = req.params;
    const facility = await Facility.findById(label);
    return res.status(200).json(facility);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const updateFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const updatedSalle = await Salle.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedSalle) {
      return res.status(404).json({ message: "Facility not found" });
    }

    return res
      .status(200)
      .json({ message: "The facility has been updated successfully." });
  } catch (error) {
    return res.status(500).json({
      message: "An error occured when updating the facility.",
    });
  }
};

export const deleteFacility = async (req, res) => {
  try {
    const { id } = req.params;

    const facility = await Facility.findByIdAndDelete(id);

    if (facility) {
      return res.status(200).json({ message: "facility deleted successfully" });
    }
    return res.status(404).json({ message: "facility not found" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
