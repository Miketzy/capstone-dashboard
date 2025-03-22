import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";  // Import pg using default import
import { fileURLToPath } from 'url'; // Import fileURLToPath for ES module
import path from 'path'; // Import path for dirname functionality
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import multer from "multer";
import bcrypt from "bcryptjs";
import fs from "fs";
import nodemailer from "nodemailer";
import crypto from "crypto"; // For OTP generation
import http from "http";
import { Server } from "socket.io";

dotenv.config(); // Load environment variables from .env

// Determine the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the Express app
const app = express(); // Move app initialization here
const server = http.createServer(app); // Create HTTP server with app

const port = process.env.PORT || 8080; // Default port if not defined in .env

app.use(express.json()); // Middleware for parsing JSON requests

// Enable CORS with a specific origin
app.use(
  cors({
    origin: "https://davor-bioexplorer-admin.vercel.app", // Allow requests from this origin
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"], // Allowed methods
    credentials: true, // Allow cookies, if needed
  })
);

// PostgreSQL connection setup using pg default import
const { Pool } = pkg; // Destructure Pool from the imported pg module

const pool = new Pool({
  connectionString: "postgresql://reposatory:71YyyVsRMV2544ho7UjtQcGw3UcHXUSg@dpg-cvemttd2ng1s73ci1oag-a.oregon-postgres.render.com/reposatory",
  ssl: { rejectUnauthorized: false }, // Required for cloud databases like Render
});

// Database Keep-Alive - Make sure the database connection remains active
setInterval(() => {
  pool.query("SELECT 1", (err, results) => {
    if (err) {
      console.error("Database Keep-Alive error:", err);
    } else {
      console.log("✅ Database is alive");
    }
  });
}, 5 * 60 * 1000); // Keeps the connection alive every 5 minutes

// Make sure to use cookieParser before any route handling
app.use(cookieParser());

// Configure Multer for profile image storage
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/avatar"); // Folder to store uploaded images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); // Ensure the image has a unique name
  },
});

const uploaded = multer({ storage: profileStorage });
// Route to upload and update profile image
app.post("/upload-profile", uploaded.single("profileImage"), (req, res) => {
  const userId = req.body.userId || 1; // Using userId = 1 for this example

  // Check if user exists
  if (!users[userId]) {
    return res.status(404).json({ error: "User not found" });
  }

  // Optionally delete the old profile image (if user already has one)
  const existingImage = users[userId].image;
  if (existingImage) {
    fs.unlink(`./uploads/avatar/${existingImage}`, (err) => {
      if (err) console.error("Error deleting old image:", err);
    });
  }

  // Save the new image filename to the user's profile in "database"
  const newImage = req.file.filename;
  users[userId].image = newImage;

  // Respond with the new image filename
  res.json({ success: true, newImage });
});

// Serve static files for profile images
app.use(
  "/uploads/avatar",
  express.static(path.join(__dirname, "uploads/avatar"))
);

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query to fetch user from PostgreSQL database
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1", // Using $1 as a placeholder for parameterized query
      [username]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const hashedPassword = user.password;

      // Compare passwords using bcrypt
      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) {
          console.error("Password comparison error:", err);
          return res.status(500).json({ Message: "Error comparing passwords" });
        }

        if (isMatch) {
          console.log("JWT_SECRET before signing:", process.env.JWT_SECRET);

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
              role: user.role,
              currentPassword: user.currentPassword,
              newPassword: user.newPassword,
              confirmPassword: user.confirmPassword,
            },
            process.env.JWT_SECRET, // Use the secret key from the .env file
            { expiresIn: "30d" }
          );

          console.log("Generated Token:", token);

          res.cookie("token", token, {
            httpOnly: true,
            secure: true, // Use only in production
            sameSite: "None",
          });

          // Send the token in the response body
          return res.json({
            token: token,
            Status: "Success",
            role: user.role,
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
        } else {
          return res.status(401).json({ Message: "Incorrect Password" });
        }
      });
    } else {
      return res.status(404).json({ Message: "No Records Existed" });
    }
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ Message: "Server Side Error" });
  }
});

// Register endpoint
app.post("/register", async (req, res) => {
  const {
    username,
    firstname,
    middlename,
    lastname,
    phone_number,
    email,
    gender,
    role,
    password,
    confirmPassword,
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  try {
    // Check if the username or email already exists
    const checkUserSql = "SELECT * FROM users WHERE username = $1 OR email = $2";
    const result = await pool.query(checkUserSql, [username, email]);

    if (result.rows.length > 0) {
      return res.status(409).json({ error: "Username or email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const insertUserSql = `
      INSERT INTO users (username, firstname, middlename, lastname, phone_number, email, gender, role, password)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id
    `;
    const insertResult = await pool.query(insertUserSql, [
      username,
      firstname,
      middlename,
      lastname,
      phone_number,
      email,
      gender,
      role,
      hashedPassword,
    ]);

    // Get the inserted user ID
    const userId = insertResult.rows[0].id;

    // Generate JWT token
    const token = jwt.sign(
      {
        id: userId,
        username,
        firstname,
        middlename,
        lastname,
        phone_number,
        email,
        gender,
        role,
      },
      process.env.JWT_SECRET || "jsonwebtoken-secret-key", // Use environment variable for JWT secret
      { expiresIn: "30d" }
    );

    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true in production (when using HTTPS)
      sameSite: "lax",
    });

    return res.json({
      status: "Success",
      user: {
        id: userId,
        username,
        firstname,
        middlename,
        lastname,
        phone_number,
        gender,
        role,
        email,
      },
    });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Server error." });
  }
});


// Start the server
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
