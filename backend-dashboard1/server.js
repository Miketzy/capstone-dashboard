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
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinaryModule from "cloudinary";
import nodemailer from "nodemailer";
import crypto from "crypto"; // For OTP generation
import http from "http";
import { Server } from "socket.io";

dotenv.config(); // Load environment variables from .env

// Determine the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cloudinary = cloudinaryModule.v2;

// Cloudinary Config
cloudinary.config({
  cloud_name: "dvj4mroel",
  api_key: "574978959734848",
  api_secret: "C_jILnTXsUPdPj8pKQdROd8uQys",
});

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

// The verifyUser middleware
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
    req.role = decoded.role;
    req.image = decoded.image;
    req.currentPassword = decoded.currentPassword;
    req.newPassword = decoded.newPassword;
    req.confirmPassword = decoded.confirmPassword;

    next();
  });
};

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
            role: "Success",
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
// Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "species-images",
    format: async (req, file) => "jpg", // or "png"
    public_id: (req, file) => Date.now(),
  },
});

const upload = multer({ storage });

// POST Route for Uploading Species
app.post("/create", upload.single("file"), async (req, res) => {
  const {
    specificname,
    scientificname,
    commonname,
    habitat,
    population,
    threats,
    speciescategory,
    location,
    conservationstatus,
    conservationeffort,
    description,
  } = req.body;

  // Get Cloudinary URL
  const uploadimage = req.file ? req.file.path : null; // Cloudinary URL

  // Save to Database
  const query = `INSERT INTO species (specificname, scientificname, commonname, habitat, population, threats, speciescategory, location, conservationstatus, conservationeffort, description, uploadimage)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`;

  try {
    const result = await pool.query(query, [
      specificname,
      scientificname,
      commonname,
      habitat,
      population,
      threats,
      speciescategory,
      location,
      conservationstatus,
      conservationeffort,
      description,
      uploadimage, // Cloudinary URL na ito
    ]);

    res.status(201).json({
      message: "Species added successfully!",
      species: result.rows[0],
    });

  } catch (err) {
    console.error("Error inserting species data:", err);
    res.status(500).send("Server error. Failed to add species.");
  }
});

// End point to get the species table
app.get("/listspecies", (req, res) => {
  const sql = "SELECT * FROM species";
  pool.query(sql, (err, data) => {
    if (err) return res.json({ Message: "Error retrieving data" });

    // Adjust path for images in 'uploads/images' directory
    const result = data.rows.map((item) => ({
      ...item,
      uploadimage: `https://bioexplorer-backend.onrender.com/uploads/images/${item.uploadimage}`,
    }));
    
    return res.json(result);
  });
});


// Protected route to get user profile
app.get("/", verifyUser, (req, res) => {
  return res.json({
    message: "Profile retrieved successfully",
    user: {
      id: req.userId,
      username: req.username,
      firstname: req.firstname,
      middlename: req.middlename,
      lastname: req.lastname,
      phone_number: req.phone_number,
      email: req.email,
      image: req.image,
      role: req.role,
      currentPassword: req.currentPassword,
      newPassword: req.newPassword,
      confirmPassword: req.confirmPassword,
    },
  });
});

// logout route
app.get("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ Message: "Success" });
});

app.get("/countSpecies", async (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM species";

  try {
    const result = await pool.query(query);
    res.status(200).json({ count: result.rows[0].count });
  } catch (err) {
    console.error("Error fetching species count:", err);
    res.status(500).json({ error: "Server error. Failed to fetch species count." });
  }
});


// Endpoint to get the count of mammals
app.get("/countmammals", (req, res) => {
  const query =
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = $1"; // Parameterized query for PostgreSQL

  pool.query(query, ['mammals'], (err, result) => {
    if (err) {
      console.error("Error fetching mammals count:", err);
      return res
        .status(500)
        .send("Server error. Failed to fetch mammals count.");
    }

    res.status(200).json(result.rows[0]); // Send back the count
  });
});

// Endpoint to get the count of birds
app.get("/countbirds", (req, res) => {
  const query =
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = $1"; // Parameterized query for PostgreSQL

  pool.query(query, ['birds'], (err, result) => {
    if (err) {
      console.error("Error fetching birds count:", err);
      return res.status(500).send("Server error. Failed to fetch birds count.");
    }

    res.status(200).json(result.rows[0]); // Send back the count
  });
});

// Endpoint to get the count of reptiles
app.get("/countReptiles", (req, res) => {
  const query =
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = $1"; // Parameterized query for PostgreSQL

  pool.query(query, ['reptiles'], (err, result) => {
    if (err) {
      console.error("Error fetching reptiles count:", err);
      return res
        .status(500)
        .send("Server error. Failed to fetch reptiles count.");
    }

    res.status(200).json(result.rows[0]); // Send back the count
  });
});

// Endpoint to get the count of amphibians
app.get("/countAmphibians", (req, res) => {
  const query =
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = $1"; // Parameterized query for PostgreSQL

  pool.query(query, ['amphibians'], (err, result) => {
    if (err) {
      console.error("Error fetching amphibians count:", err);
      return res
        .status(500)
        .send("Server error. Failed to fetch amphibians count.");
    }

    res.status(200).json(result.rows[0]); // Send back the count
  });
});

// Endpoint to get the count of invertebrates
app.get("/countInvertebrates", (req, res) => {
  const query =
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = $1"; // Parameterized query for PostgreSQL

  pool.query(query, ['invertebrates'], (err, result) => {
    if (err) {
      console.error("Error fetching invertebrates count:", err); // Updated error message
      return res
        .status(500)
        .send("Server error. Failed to fetch invertebrates count."); // Updated error message
    }

    res.status(200).json(result.rows[0]); // Send back the count
  });
});

// Endpoint to get the count of vertebrates
app.get("/countvertebrates", (req, res) => {
  const query =
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = $1"; // Parameterized query for PostgreSQL

  pool.query(query, ['vertebrates'], (err, result) => {
    if (err) {
      console.error("Error fetching vertebrates count:", err); // Updated error message
      return res
        .status(500)
        .send("Server error. Failed to fetch vertebrates count."); // Updated error message
    }

    res.status(200).json(result.rows[0]); // Send back the count
  });
});

// Endpoint to get the count of fish
app.get("/countFish", (req, res) => {
  const query =
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = $1"; // Parameterized query for PostgreSQL

  pool.query(query, ['fish'], (err, result) => {
    if (err) {
      console.error("Error fetching fish count:", err); // Updated error message
      return res.status(500).send("Server error. Failed to fetch fish count."); // Updated error message
    }

    res.status(200).json(result.rows[0]); // Send back the count
  });
});


// GET Route to Fetch Images from Database
app.get("/api/images", async (req, res) => {
  try {
    const sql = "SELECT id, commonname, uploadimage FROM species";
    const result = await pool.query(sql);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});



app.delete("/delete-species/:id", async (req, res) => {
  const deleteSpeciesQuery = "DELETE FROM species WHERE id = $1";

  try {
    await pool.query(deleteSpeciesQuery, [req.params.id]);
    res.status(200).json({ message: "Species deleted successfully" });
  } catch (err) {
    console.error("Error deleting species:", err);
    res.status(500).json({ error: "Error deleting species" });
  }
});

app.get("/speciesCounts", async (req, res) => {
  const queries = [
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'mammals'",
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'birds'",
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'reptiles'",
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'amphibians'",
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'invertebrates'",
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'vertebrates'",
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'fish'",
  ];

  try {
    const results = await Promise.all(queries.map((query) => pool.query(query)));
    
    res.json({
      mammals: results[0].rows[0].count,
      birds: results[1].rows[0].count,
      reptiles: results[2].rows[0].count,
      amphibians: results[3].rows[0].count,
      invertebrates: results[4].rows[0].count,
      vertebrates: results[5].rows[0].count,
      fish: results[6].rows[0].count,
    });
  } catch (err) {
    console.error("Error fetching species counts:", err);
    res.status(500).json({ error: "Failed to fetch species counts" });
  }
});

app.get("/api/conservation-status-count", async (req, res) => {
  const conservationStatuses = [
    "critically-endangered",
    "endangered",
    "vulnerable",
    "near-threatened",
    "least-concern",
  ];

  try {
    const results = await Promise.all(
      conservationStatuses.map(async (status) => {
        const result = await pool.query(
          `SELECT COUNT(*) AS count FROM species WHERE conservationstatus = $1`,
          [status]
        );
        return { status, count: parseInt(result.rows[0].count, 10) };
      })
    );

    // Convert array into an object for easier use in frontend
    const formattedData = results.reduce((acc, item) => {
      acc[item.status] = item.count;
      return acc;
    }, {});

    res.json(formattedData);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
});

app.post("/api/questions", async (req, res) => {
  const { question, optiona, optionb, optionc, optiond, correctanswer } = req.body;

  if (!question || !optiona || !optionb || !optionc || !optiond || !correctanswer) {
    console.error("Missing fields:", req.body); // ✅ Log missing fields
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const query = `
      INSERT INTO questions (question, optiona, optionb, optionc, optiond, correctanswer)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;

    const values = [question, optiona, optionb, optionc, optiond, correctanswer];

    const result = await pool.query(query, values);
    res.status(201).json({ message: "Question saved successfully.", data: result.rows[0] });
  } catch (err) {
    console.error("Error saving question:", err.message);
    res.status(500).json({ error: "Failed to save question." });
  }
});

// Protected route to get user profile
app.get("/myprofile", verifyUser, (req, res) => {
  return res.json({
    message: "Profile retrieved successfully",
    user: {
      id: req.userId,
      username: req.username,
      firstname: req.firstname,
      gender: req.gender,
      middlename: req.middlename,
      lastname: req.lastname,
      phone_number: req.phone_number,
      email: req.email,
      image: req.image,
      role: req.role,
      currentPassword: req.currentPassword,
      newPassword: req.newPassword,
      confirmPassword: req.confirmPassword,
    },
  });
});

// Profile update route (No Image Update) for PostgreSQL
app.put("/profile", verifyUser, (req, res) => {
  const userId = req.userId; // User ID from the verified token
  const {
    firstname,
    middlename,
    lastname,
    email,
    gender,
    phone_number,
    username,
  } = req.body;

  // Prepare the update query for PostgreSQL
  const updateSql = `
    UPDATE users SET 
      firstname = $1, 
      middlename = $2, 
      lastname = $3, 
      email = $4, 
      gender = $5, 
      phone_number = $6, 
      username = $7 
    WHERE id = $8
  `;

  // Execute the update query with parameters
  pool.query(
    updateSql,
    [
      firstname,
      middlename,
      lastname,
      email,
      gender,
      phone_number,
      username,
      userId,
    ],
    (err, results) => {
      if (err) {
        console.error("Database update error:", err);
        return res.status(500).json({ message: "Server error" });
      }

      res.json({ message: "Profile updated successfully" });
    }
  );
});

// Start the server
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
