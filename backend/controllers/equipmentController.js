import { Equipment } from "../models/equipmentModel.js";

export const addEquipment = async (req, res) => {
  try {
    const { label, availableQuantity } = req.body;

    if (!label || !availableQuantity) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields." });
    }

    const existingEquipment = await Equipment.findOne({ label });
    if (existingEquipment) {
      return res
        .status(409)
        .json({ message: "An Equipment with this label already exists." });
    }

    const newEquipment = await Equipment.create({ label, availableQuantity });
    return res.status(201).json(newEquipment);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred when creating the Equipment." });
  }
};

export const findAllEquipments = async (req, res) => {
  try {
    const equipments = await Equipment.find({});
    return res.status(200).json({
      count: equipments.length,
      data: equipments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occured when fetching the equipments",
    });
  }
};

export const findOneEquipment = async (req, res) => {
  try {
    const { id } = req.params; // Use 'id' for retrieving by ID
    const equipment = await Equipment.findById(id);

    if (!equipment) {
      // Return 404 if the Equipment is not found
      return res.status(404).json({ message: "Equipment not found" });
    }

    // Return the Equipment if found
    return res.status(200).json(equipment);
  } catch (error) {
    // Handle any unexpected errors
    return res.status(500).json({ message: error.message });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const updatedEquipment = await Equipment.findByIdAndUpdate(
      id,
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedEquipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    return res.status(200).json(updatedEquipment);
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred when updating the Equipment.",
    });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;

    const equipment = await Equipment.findByIdAndDelete(id);

    if (equipment) {
      return res
        .status(200)
        .json({ message: "Equipment deleted successfully" });
    }
    return res.status(404).json({ message: "Equipment not found" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
