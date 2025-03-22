import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Register Controller
export const registerUser = (req, res) => {
  const {
    username,
    firstname,
    middlename,
    lastname,
    phone_number,
    email,
    gender,
    status,
    password,
    confirmPassword,
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  // Check if username or email already exists
  const checkUserSql = "SELECT * FROM users WHERE username = $1 OR email = $2";
  pool.query(checkUserSql, [username, email], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Server error." });
    }
    if (result.rows.length > 0) {
      return res.status(409).json({ error: "Username or email already exists." });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Hashing error:", err);
        return res.status(500).json({ error: "Server error." });
      }

      // Insert new user into PostgreSQL database
      const insertUserSql = `
        INSERT INTO users (username, firstname, middlename, lastname, phone_number, email, gender, status, password)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id
      `;
      pool.query(
        insertUserSql,
        [
          username,
          firstname,
          middlename,
          lastname,
          phone_number,
          email,
          gender,
          status,
          hashedPassword,
        ],
        (err, result) => {
          if (err) {
            console.error("Database insertion error:", err);
            return res.status(500).json({ error: "Server error." });
          }

          // Generate JWT token using the secret key from .env
          const token = jwt.sign(
            {
              id: result.rows[0].id, // Get the inserted user ID
              username,
              firstname,
              middlename,
              lastname,
              phone_number,
              email,
              gender,
              status,
            },
            process.env.JWT_SECRET_KEY, // Use the secret key from the .env file
            { expiresIn: "30d" }
          );

          // Set JWT token as a cookie
          res.cookie("token", token, {
            httpOnly: true,
            secure: true, // set to true if using HTTPS
            sameSite: "NONE",
          });

          // Respond with success and user data
          return res.json({
            status: "Success",
            user: {
              id: result.rows[0].id,
              username,
              firstname,
              middlename,
              lastname,
              phone_number,
              gender,
              status,
              email,
            },
          });
        }
      );
    });
  });
};
