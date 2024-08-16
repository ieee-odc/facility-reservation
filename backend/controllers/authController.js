import { ReservationInitiator } from "../models/reservationInitiatorModel.js";
import bcrypt from "bcryptjs";

const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await ReservationInitiator.findOne({ email }).select(
      "+password"
    );

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        email: user.email,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const verifyUser = async (req, res) => {
  const { email, password, method } = req.body;
  console.log("email", email, password, method);
  try {
    const user = await ReservationInitiator.findOne({ email }).select(
      "+password"
    );
    console.log("user", user);

    return res.status(201).json({ isValid: (user!==null && user!==undefined), id :user._id , role:user.role });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export default authUser;
