import mongoose from "mongoose";

const equipmentSchema = mongoose.Schema(
  {
    label: {
      type: String,
      unique: true,
      required: true,
    },
    availableQuantity: {
      type: Number,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

export const Equipment = mongoose.model("equipments", equipmentSchema);
