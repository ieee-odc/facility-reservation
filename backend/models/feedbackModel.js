import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    feedbackType: {
      type: String,
      enum: ['bug', 'management', 'room', 'other'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
