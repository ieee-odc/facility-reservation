import jwt from "jsonwebtoken";



function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); 
}



export default { generateToken };
