import mongoose from 'mongoose';

const responsibleSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
    unique: true,
  },
  contactPhoneNumber: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: '', 
  },
  position: {
    type: String
  },
  entity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ReservationInitiator",
    required: true,
  }
},
{
  timestamps: true,
}
);

export const Responsible = mongoose.model('Responsible', responsibleSchema);
