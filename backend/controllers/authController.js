import ReservationInitiator from "../models/reservationInitiator.js";
import generateToken from "../utils/generateToken.js"; 
import bcrypt from 'bcryptjs';

const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await ReservationInitiator.findOne({ email }).select('+password');

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export default authUser;
