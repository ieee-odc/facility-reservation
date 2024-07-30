import mongoose from "mongoose";

const modelSchema = mongoose.Schema(
  {
    label: {
      type: String,
      unique: true,
      required: true,
    },
    availableQuantity: {
      type: Number,
      required: false,
    },
  },

  {
    timestamps: true,
  }
);

export const Equipment = mongoose.model("equipments", modelSchema);
