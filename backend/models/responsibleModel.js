import mongoose from 'mongoose';

const responsibleSchema = new mongoose.Schema({
  fullname: {
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
  
},
{
  timestamps: true,
}
);

const Responsible = mongoose.model('Responsible', responsibleSchema);

export default Responsible;
