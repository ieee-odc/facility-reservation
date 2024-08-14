import mongoose from 'mongoose';

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
      type: String,
      enum: ["Bookable", "Forward"],
      required: true,
      default: "Bookable"
    },
  },
  {
    timestamps: true,
  }
);

export const Facility = mongoose.model('Facility', facilitySchema);
 