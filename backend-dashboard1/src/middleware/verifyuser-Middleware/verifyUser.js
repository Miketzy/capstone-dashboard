import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  console.log("token:", token); // Log token to check if it's being sent correctly.

  if (!token) {
    return res
      .status(401)
      .json({ message: "We need a token, please provide it." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    console.log("Decoded Token:", decoded); // Log the decoded token
    req.userId = decoded.id;
    req.username = decoded.username;
    req.firstname = decoded.firstname;
    req.middlename = decoded.middlename;
    req.lastname = decoded.lastname;
    req.phone_number = decoded.phone_number;
    req.email = decoded.email;
    req.gender = decoded.gender;
    req.status = decoded.status;
    req.image = decoded.image;
    req.currentPassword = decoded.currentPassword;
    req.newPassword = decoded.newPassword;
    req.confirmPassword = decoded.confirmPassword;

    next();
  });
};


export default verifyUser;