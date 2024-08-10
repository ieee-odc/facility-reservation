import mongoose from "mongoose";

const eventSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    state: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "PartiallyApproved",
        "Rejected",
        "Cancelled",
      ],
      default: "Pending",
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReservationInitiator",
      required: true,
    },
    totalEffective: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Event = mongoose.model("events", eventSchema);
