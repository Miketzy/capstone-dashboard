import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import client from "../config/db.js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const sql = `SELECT * FROM users WHERE username = $1 LIMIT 1`;
    const result = await client.query(sql, [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ Message: "No Records Existed" });
    }

    const user = result.rows[0];
    const hashedPassword = user.password;

    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ Message: "Incorrect Password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        middlename: user.middlename,
        phone_number: user.phone_number,
        lastname: user.lastname,
        email: user.email,
        gender: user.gender,
        image: user.image,
        status: user.status,
        currentPassword: user.currentPassword,
        newPassword: user.newPassword,
        confirmPassword: user.confirmPassword,
      },
      process.env.JWT_SECRET, // ✅ Now using secret from .env
      { expiresIn: "30d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.json({
        token: token,
            Status: "Success",
            status: user.status,
            firstname: user.firstname,
            middlename: user.middlename,
            lastname: user.lastname,
            phone_number: user.phone_number,
            gender: user.gender,
            image: user.image,
            email: user.email,
            currentPassword: user.currentPassword,
            newPassword: user.newPassword,
            confirmPassword: user.confirmPassword,
    });

  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ Message: "Server Side Error" });
  }
});

export default loginroutes;
