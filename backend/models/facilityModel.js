import mongoose from "mongoose";

const salleSchema = mongoose.Schema(
  {
   
    label : {
      type: String,
      unique: true,
      required: true, 
    },
    capacity: {
        type: Number,
        required: true,
      },
      state: {
        type: Boolean,
        required: true, 
      },

    },

  {
    timestamps: true,
  }
);



export const Salle = mongoose.model("facilities", salleSchema);
