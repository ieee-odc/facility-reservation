import mongoose from "mongoose";

const eventSchema = mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    facilities: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Facility",
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
    files: {
      type: [String],
      required: true,
    },
    materials: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Equipment",
    },
    state: {
      type: String,
      enum: [
        "Pending",
        "Approuved",
        "PartiallyApprouved",
        "Rejected",
        "Canceled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Event = mongoose.model("events", eventSchema);
