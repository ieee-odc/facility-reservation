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
  position: {
    type: String
  }
},
{
  timestamps: true,
}
);

export const Responsible = mongoose.model('Responsible', responsibleSchema);
