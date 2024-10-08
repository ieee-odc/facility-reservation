import mongoose from 'mongoose';

const reservationSchema = mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    motive: {
      type: String,
      required: true,
    },
    materials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment',
        default: [],
      },
    ],
    files: {
      type: [String],
      required: false,
    },
    effective: {
      type: Number,
      required: true,
    },
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: true,
    },
    entity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReservationInitiator',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: false,
      default: null,
    },
    state: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export const Reservation = mongoose.model('Reservation', reservationSchema);
