import mongoose from "mongoose";

const facilitySchema = mongoose.Schema(
  {
    label: {
      type: String,
      unique: true,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    state: {
      type: Boolean,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

export const Facility = mongoose.model("facilities", facilitySchema);
