import { ReservationInitiator } from "../models/reservationInitiatorModel.js";
import generateToken from "../utils/generateToken.js";
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
        //token: generateToken(user._id),
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
  // any google emailPassword
  console.log("email", email, password, method);
  try {
    const user = await ReservationInitiator.findOne({ email }).select(
      "+password"
    );
    console.log("user", (user && true) || false);

    if (password !== "") {
      const validPassword = await bcrypt.compare(password, user.password);
      console.log(user.password);
      if (!validPassword) {
        return res.status(401).send({ message: "Invalid creds" });
      }
    }

    return res.status(201).json({ isValid: (user && true) || false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export default authUser;
