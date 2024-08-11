import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
    backupEmail: {
      type: String,
      required: false,
      
    },
    phoneNumber:{
      type:String,
      unique:true,

    },
    password: {
      type: String,
      select: false,
    },
    nature: {
      type: String,
      default: ""
    },
    service: {
      type: String,
      default: ""
    },
    organisation: {
      type: String,
      default: ""
    },
  },
  {
    timestamps: true,
  }
);

reservationInitiatorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

reservationInitiatorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hash(this.password, salt);
  next();
});


export const ReservationInitiator = mongoose.model(
  "ReservationInitiator",
  reservationInitiatorSchema
);
export default ReservationInitiator;