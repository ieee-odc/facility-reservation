import mongoose from "mongoose";
const reservationInitiatorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

export const ReservationInitiator = mongoose.model(
  "ReservationInitiator",
  reservationInitiatorSchema
);
