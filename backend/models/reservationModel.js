import mongoose from "mongoose";

const reservationSchema = mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    motive: {
      type: String,
      required: true,
    },
    materials: {
      type: [String],
      required: true,
    },
    files: {
      type: [String],
      required: true,
    },
    effective: {
      type: Number,
      required: true,
    },
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: true,
    },
    entity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReservationInitiator",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: false,
      default: null,
    },
    state: {
      type: String,
      enum: ["Pending", "Approuved", "Rejected", "Canceled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Reservation = mongoose.model("reservations", reservationSchema);
