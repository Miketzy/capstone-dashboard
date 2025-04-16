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
const backendUrl = process.env.BACKEND_URL;
const port = process.env.PORT || 8080; // Default port if not defined in .env

// Cloudinary Config
cloudinary.config({
  cloud_name: "dvj4mroel",
  api_key: "574978959734848",
  api_secret: "C_jILnTXsUPdPj8pKQdROd8uQys",
});

// Initialize the Express app
const app = express(); // Move app initialization here
const server = http.createServer(app); // Create HTTP server with app


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
// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const hashedPassword = user.password;

      bcrypt.compare(password, hashedPassword, async (err, isMatch) => {
        if (err) {
          console.error("Password comparison error:", err);
          return res.status(500).json({ Message: "Error comparing passwords" });
        }

        if (isMatch) {
          // ✅ Set is_active = true after successful login
          await pool.query("UPDATE users SET is_active = true WHERE id = $1", [user.id]);

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
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
          );

          res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
          });

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


app.get("/contributors", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, firstname, lastname, email, is_active FROM users WHERE role = 'contributor'"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Could not fetch contributors" });
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

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  try {
    // Check if username, email, or phone number already exists
    const checkUserSql = `
      SELECT * FROM users WHERE username = $1 OR email = $2 OR phone_number = $3
    `;
    const result = await pool.query(checkUserSql, [username, email, phone_number]);

    // Log query result for debugging
    console.log("Check User Query Result:", result.rows);

    if (result.rows.length > 0) {
      return res.status(409).json({ error: "Username, email, or phone number already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const insertUserSql = `
      INSERT INTO users (username, firstname, middlename, lastname, phone_number, email, gender, role, password)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id
    `;

    // Debug log before inserting
    console.log("Inserting user into database:", {
      username,
      firstname,
      middlename,
      lastname,
      phone_number,
      email,
      gender,
      role,
    });

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
      secure: true, // Set to true in production (when using HTTPS)
      sameSite: "None",
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
    return res.status(500).json({ error: "Server error.", details: err.message });
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
    classification,
    description,
  } = req.body;

  // Get Cloudinary URL
  const uploadimage = req.file ? req.file.path : null; // Cloudinary URL

  // Get current date and time in Manila timezone (or you can set this to your desired timezone)
  const currentTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });

  // Automatically set the current month (e.g., "January", "February", etc.)
  const createdMonth = new Date().toLocaleString('en-US', { month: 'long', timeZone: 'Asia/Manila' });

  // Save to Database
  const query = `
    INSERT INTO species (
      specificname, scientificname, commonname, habitat, population, threats, speciescategory, 
      location, conservationstatus, conservationeffort, description, classification, 
      uploadimage, created_at, created_month
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
    RETURNING *`;

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
      classification,
      uploadimage, // Cloudinary URL
      currentTime,  // Current date and time
      createdMonth  // Automatically generated current month
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
      uploadimage: `${backendUrl}/uploads/images/${item.uploadimage}`,
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

app.get("/contrilogout", async (req, res) => {
  const { username } = req.query; // make sure pinapasa sa frontend

  try {
    // Ito ang nagse-set ng is_active = false
    await pool.query("UPDATE users SET is_active = false WHERE username = $1", [username]);

    // I-clear din ang token/cookie kung meron
    res.clearCookie("authToken");
    res.json({ Message: "Success" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ Message: "Logout failed" });
  }
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
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'fish'",
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'birds'",
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'reptiles'",
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'amphibians'",
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'insects'",
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'arachnids'",
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'mollusks'",
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'echinoderms'",
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'cnidarians'",
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'worms'",
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'sponges'",
  ];

  try {
    const results = await Promise.all(queries.map((query) => pool.query(query)));
    
    res.json({
      mammals: results[0].rows[0].count,
      fish: results[1].rows[0].count,
      birds: results[2].rows[0].count,
      reptiles: results[3].rows[0].count,
      amphibians: results[4].rows[0].count,
      insects: results[5].rows[0].count,
      arachnids: results[6].rows[0].count,
      mollusks: results[7].rows[0].count,
      echinoderms: results[8].rows[0].count,
      cnidarians: results[9].rows[0].count,
      worms: results[10].rows[0].count,
      sponges: results[11].rows[0].count,
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

    // Get total count for calculating percentages
    const totalCount = results.reduce((acc, item) => acc + item.count, 0);

    // Convert array into an object for easier use in frontend, adding percentage
    const formattedData = results.reduce((acc, item) => {
      const percentage = ((item.count / totalCount) * 100).toFixed(2);
      acc[item.status] = { count: item.count, percentage };
      return acc;
    }, {});

    res.json(formattedData);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
});



//Multiple choice
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

// POST route to save identification question
app.post("/api/identification-questions", async (req, res) => {
  const { statement, answer } = req.body;

  if (!statement || !answer) {
    return res.status(400).json({ error: "Statement and answer are required." });
  }

  try {
    const query = `INSERT INTO identification_questions (statement, answer) VALUES ($1, $2) RETURNING *;`;
    const values = [statement, answer];

    const result = await pool.query(query, values);
    res.status(201).json({ message: "Question saved successfully.", data: result.rows[0] });
  } catch (err) {
    console.error("Error saving question:", err.message);
    res.status(500).json({ error: "Failed to save question." });
  }
});

// POST route to save a matching type question
app.post("/api/matching-questions", async (req, res) => {
  const { itemA, itemB } = req.body;

  if (!itemA || !itemB) {
    return res.status(400).json({ error: "Both columns A and B are required." });
  }

  try {
    const query = `INSERT INTO matching_questions (item_a, item_b) VALUES ($1, $2) RETURNING *;`;
    const values = [itemA, itemB];

    const result = await pool.query(query, values);
    res.status(201).json({ message: "Matching question saved successfully.", data: result.rows[0] });
  } catch (err) {
    console.error("Error saving matching question:", err.message);
    res.status(500).json({ error: "Failed to save matching question." });
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
app.put("/profile", verifyUser, (req, res) => {
  const userId = req.userId;
  const {
    firstname,
    middlename,
    lastname,
    email,
    gender,
    phone_number,
    username,
  } = req.body;

  console.log("Request Data: ", req.body);
  console.log("User ID: ", userId);

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

      console.log("Profile updated successfully:", results);
      res.json({ message: "Profile updated successfully" });
    }
  );
});

app.put("/contributor-profile", verifyUser, upload.single("image"), async (req, res) => {
  console.log("Received update request:", req.body); // Debugging
  console.log("Uploaded File:", req.file); // Check if image is received

  const { firstname, middlename, lastname, email, gender, phone_number, username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    let updateQuery = `
      UPDATE users 
      SET firstname = $1, middlename = $2, lastname = $3, email = $4, 
          gender = $5, phone_number = $6
      WHERE username = $7
    `;
    let values = [firstname, middlename, lastname, email, gender, phone_number, username];

    if (req.file) {
      updateQuery = `
        UPDATE users 
        SET firstname = $1, middlename = $2, lastname = $3, email = $4, 
            gender = $5, phone_number = $6, image = $7
        WHERE username = $8
      `;
      values.push(req.file.filename);
      values.push(username);
    }

    await pool.query(updateQuery, values);
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).json({ error: "Database update error" });
  }
});



// Endpoint of contributor Request table
app.get("/request-table", async (req, res) => {
  const sql = "SELECT * FROM pending_request";
  
  try {
    const result = await pool.query(sql);

    // Adjust path for images in Cloudinary (If Cloudinary URL is stored in the database)
    const data = result.rows.map((item) => ({
      ...item,
      uploadimage: item.uploadimage
        ? `https://res.cloudinary.com/dvj4mroel/image/upload/v1742696123/species-images/${item.uploadimage}` // Replace with correct Cloudinary URL pattern
        : null,
    }));

    return res.json(data);
  } catch (err) {
    console.error("Error retrieving data:", err);
    return res.json({ Message: "Error retrieving data" });
  }
});


// Password change endpoint (Protected by JWT middleware)
app.post("/password-changes", verifyUser, async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: "New passwords do not match" });
  }

  try {
    // Retrieve the user's current password from the database using the user ID from JWT
    const result = await pool.query("SELECT password FROM users WHERE id = $1", [req.userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = result.rows[0].password;

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedNewPassword, req.userId]);

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Error updating password" });
  }
});

// Protected route to get user profile
app.get("/contrbutornavbar", verifyUser, (req, res) => {
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
      status: req.status,
      currentPassword: req.currentPassword,
      newPassword: req.newPassword,
      confirmPassword: req.confirmPassword,
    },
  });
});

// Route to add species to pending request
app.post("/species/pending", upload.single("file"), async (req, res) => {
  try {
    const {
      specificname,
      scientificname,
      commonname,
      habitat,
      population,
      threats,
      location,
      conservationstatus,
      speciescategory,
      conservationeffort,
      description,
      contributor_firstname,
      contributor_lastname,
      contributor_email,
    } = req.body;

    if (
      !specificname ||
      !scientificname ||
      !commonname ||
      !contributor_firstname ||
      !contributor_lastname ||
      !contributor_email
    ) {
      return res.status(400).json({
        message:
          "Specific name, scientific name, common name, contributor first name, and contributor last name are required.",
      });
    }

    // Generate timestamp-based filename
    const timestamp = Date.now();
    let uploadimage = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "species-images", // Cloudinary folder
        public_id: timestamp.toString(), // Filename format
        format: "jpg", // Ensure jpg format
      });

      // Format the Cloudinary URL
      uploadimage = `https://res.cloudinary.com/dvj4mroel/image/upload/v${timestamp}/species-images/${timestamp}.jpg`;
    }

    // Save to Database
    const sql = `
      INSERT INTO pending_request
      (specificname, scientificname, commonname, habitat, population, threats, 
       location, speciescategory, conservationstatus, conservationeffort, description, uploadimage, 
       contributor_firstname, contributor_lastname, contributor_email)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *;
    `;

    const result = await pool.query(sql, [
      specificname,
      scientificname,
      commonname,
      habitat,
      population,
      threats,
      location,
      speciescategory,
      conservationstatus,
      conservationeffort,
      description,
      uploadimage, // Cloudinary URL with correct format
      contributor_firstname,
      contributor_lastname,
      contributor_email,
    ]);

    res.status(201).json({
      message: "Species request submitted successfully!",
      species: result.rows[0],
    });

  } catch (err) {
    console.error("Error adding species to pending_request:", err);
    res.status(500).json({ message: "Failed to submit species request." });
  }
});


// Initialize Socket.IO with additional CORS settings
const io = new Server(server);

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "michaeljohnmargate11@gmail.com", // Your dedicated email
    pass: "hdfz sazb vhna xwyn", // Your email password or app password
  },
});

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  // Emit a welcome message to the newly connected user
  socket.emit("welcome", "Welcome to the WebSocket server!");
});

// Function to send email notification
const sendEmailNotification = (contributor_email, specificName) => {
  const mailOptions = {
    from: "Admin", // Sender's email (your dedicated email)
    to: contributor_email, // Contributor's email
    subject: "Approval Notification",
    text: `Your species request for ${specificName} has been approved!`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error sending email: ", error);
    }
    console.log("Email sent: " + info.response);
  });
};

// Approve species endpoint with WebSocket notification and email
app.put("/species/approve/:id", async (req, res) => {
  const speciesId = req.params.id;

  try {
    // Fetch the pending request
    const fetchSql = "SELECT * FROM pending_request WHERE id = $1";
    const result = await pool.query(fetchSql, [speciesId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Species request not found" });
    }

    const species = result.rows[0];

    // Insert into species table
    const insertSql = `
      INSERT INTO species (specificname, scientificname, commonname, habitat, population, threats, 
      location, conservationstatus, speciescategory, conservationeffort, description, uploadimage)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `;

    await pool.query(insertSql, [
      species.specificname,
      species.scientificname,
      species.commonname,
      species.habitat,
      species.population,
      species.threats,
      species.location,
      species.conservationstatus,
      species.speciescategory,
      species.conservationeffort,
      species.description,
      species.uploadimage,
    ]);

    // Delete from pending_request after approval
    const deleteSql = "DELETE FROM pending_request WHERE id = $1";
    await pool.query(deleteSql, [speciesId]);

    // Send email notification to the contributor
    if (species.contributor_email) {
      sendEmailNotification(species.contributor_email, species.specificname);
    }

    // Emit a WebSocket notification to the contributor
    if (species.contributor_id) {
      console.log(`Notifying contributor ${species.contributor_id}`);
      io.emit(`notify-contributor-${species.contributor_id}`, {
        message: "Your species has been approved!",
      });
    }

    res.status(200).json({ message: "No Request" });
  } catch (error) {
    console.error("Error processing species approval:", error);
    res.status(500).json({ message: "Failed to approve species" });
  }
});

app.delete("/species/reject/:id", async (req, res) => {
  const speciesId = req.params.id;

  try {
    // SQL query to get the contributor email and the common name
    const sqlSelect =
      "SELECT contributor_email, commonname FROM pending_request WHERE id = $1";

    // Fetch the email and common name of the contributor
    const { rows } = await pool.query(sqlSelect, [speciesId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Species request not found" });
    }

    const contributorEmail = rows[0].contributor_email; // Get the contributor's email
    const commonName = rows[0].commonname; // Get the common name

    // SQL query to delete the species request from the pending_request table
    const sqlDelete = "DELETE FROM pending_request WHERE id = $1";

    // Execute the SQL query to delete the request
    const deleteResult = await pool.query(sqlDelete, [speciesId]);

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ message: "Species request not found" });
    }

    // Send email notification to the contributor
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email service provider
      auth: {
        user: "michaeljohnmargate11@gmail.com", // Your email address
        pass: "hdfz sazb vhna xwyn", // Your email password or app-specific password
      },
    });

    const mailOptions = {
      from: "Admin", // Sender address
      to: contributorEmail, // Recipient email
      subject: "Species Request Rejected",
      text: `Your species request with the common name "${commonName}" has been rejected.`, // Include the common name in the message
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res
          .status(500)
          .json({ message: "Failed to send email notification" });
      }

      // Respond with success message
      res.status(200).json({
        message: "No Request.",
        speciesId: speciesId, // Optional: Return the deleted species ID
      });
    });
  } catch (error) {
    console.error("Error rejecting species:", error);
    res.status(500).json({ message: "Failed to reject species" });
  }
});

// gallery  route
app.get("/gallery", (req, res) => {
  res.clearCookie("authToken");
  res.json({ Message: "Success" });
});

// Protected route to get user profile
app.get("/cmyprofile", verifyUser, (req, res) => {
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
      status: req.status,
      currentPassword: req.currentPassword,
      newPassword: req.newPassword,
      confirmPassword: req.confirmPassword,
    },
  });
});

// Password change endpoint (Protected by JWT middleware)
app.post("/password-changes", verifyUser, async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: "New passwords do not match" });
  }

  try {
    // Retrieve the user's current password from the database using the user ID from JWT
    const result = await pool.query("SELECT password FROM users WHERE id = $1", [req.userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = result.rows[0].password;

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedNewPassword, req.userId]);

    res.status(200).json({ message: "Password changed successfully" });

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// In-memory storage for OTPs
const otpStore = {};

// Function to send email using Nodemailer
const sendOTPEmail = (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "davorbioexplorer@gmail.com", // Your Gmail address
      pass: "axln xjew aeoc rfbt", // Your Gmail password or app password
    },
  });

  const mailOptions = {
    from: '"Dav-OR BioExplorer"<davorbioexplorer@gmail.com>',
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  return transporter.sendMail(mailOptions);
};

// Generate a 6-digit OTP code
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString(); // Generates a number between 100000 and 999999
};

// Endpoint to handle OTP email sending
app.post("/send-otp", (req, res) => {
  const { email } = req.body;

  // Generate an OTP and store it in memory
  const otp = generateOTP();
  otpStore[email] = otp; // Store OTP for the email

  sendOTPEmail(email, otp)
    .then(() => {
      res.status(200).send("OTP sent to your email");
    })
    .catch((error) => {
      console.error("Error sending email:", error); // Log the error
      res.status(500).send("Error sending email");
    });
});


// Endpoint to verify OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  // Check if the email exists in the OTP store
  if (!otpStore[email]) {
    return res
      .status(400)
      .json({ success: false, message: "No OTP found for this email." });
  }

  // Check if the OTP matches
  if (otpStore[email] === otp) {
    // OTP verified successfully
    delete otpStore[email]; // Remove OTP from store after successful verification
    return res.json({ success: true, message: "OTP verified successfully!" });
  } else {
    // Invalid OTP
    return res
      .status(400)
      .json({ success: false, message: "Invalid OTP. Please try again." });
  }
});

app.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length > 0) {
      // User found, proceed to hash and update the password
      bcrypt.hash(password, 10, async (hashErr, hashedPassword) => {
        if (hashErr) {
          return res.status(500).send("Error hashing password");
        }

        try {
          await pool.query("UPDATE users SET password = $1 WHERE email = $2", [
            hashedPassword,
            email,
          ]);
          res.json({ success: true, message: "Password reset successfully!" });
        } catch (updateErr) {
          res.status(500).send("Error updating password");
        }
      });
    } else {
      res.status(404).json({ success: false, message: "Email not registered" });
    }
  } catch (err) {
    res.status(500).send("Server error");
  }
});

//Count OF Species

// Endpoint to get the count of mammals
app.get("/countmammals", async (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'mammals'"; // Adjust the field name if necessary

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows[0]); // Send back the count
  } catch (err) {
    console.error("Error fetching birds count:", err);
    res.status(500).send("Server error. Failed to fetch birds count.");
  }
});

// Endpoint to get the count of Fish
app.get("/countfish", async (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'fish'"; // Adjust the field name if necessary

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows[0]); // Send back the count
  } catch (err) {
    console.error("Error fetching birds count:", err);
    res.status(500).send("Server error. Failed to fetch birds count.");
  }
});

// Endpoint to get the count of birds
app.get("/countbirds", async (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'birds'"; // Adjust the field name if necessary

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows[0]); // Send back the count
  } catch (err) {
    console.error("Error fetching birds count:", err);
    res.status(500).send("Server error. Failed to fetch birds count.");
  }
});

// Endpoint to get the count of Reptiles
app.get("/countreptiles", async (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'reptiles'"; // Adjust the field name if necessary

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows[0]); // Send back the count
  } catch (err) {
    console.error("Error fetching birds count:", err);
    res.status(500).send("Server error. Failed to fetch birds count.");
  }
});

// Endpoint to get the count of Amphibians
app.get("/countamphibians", async (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'amphibians'"; // Adjust the field name if necessary

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows[0]); // Send back the count
  } catch (err) {
    console.error("Error fetching birds count:", err);
    res.status(500).send("Server error. Failed to fetch birds count.");
  }
});

// Endpoint to get the count of Insects
app.get("/countinsects", async (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'insects'"; // Adjust the field name if necessary

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows[0]); // Send back the count
  } catch (err) {
    console.error("Error fetching birds count:", err);
    res.status(500).send("Server error. Failed to fetch birds count.");
  }
});

// Endpoint to get the count of Arachnids
app.get("/countarachnids", async (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'arachnids'"; // Adjust the field name if necessary

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows[0]); // Send back the count
  } catch (err) {
    console.error("Error fetching birds count:", err);
    res.status(500).send("Server error. Failed to fetch birds count.");
  }
});

// Endpoint to get the count of Mollusks
app.get("/countmollusks", async (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'mollusks'"; // Adjust the field name if necessary

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows[0]); // Send back the count
  } catch (err) {
    console.error("Error fetching birds count:", err);
    res.status(500).send("Server error. Failed to fetch birds count.");
  }
});

// Endpoint to get the count of Echinoderms
app.get("/countechinoderms", async (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'echinoderms'"; // Adjust the field name if necessary

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows[0]); // Send back the count
  } catch (err) {
    console.error("Error fetching birds count:", err);
    res.status(500).send("Server error. Failed to fetch birds count.");
  }
});

// Endpoint to get the count of Cnidarians
app.get("/countcnidarians", async (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'cnidarians'"; // Adjust the field name if necessary

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows[0]); // Send back the count
  } catch (err) {
    console.error("Error fetching birds count:", err);
    res.status(500).send("Server error. Failed to fetch birds count.");
  }
});

// Endpoint to get the count of Worms
app.get("/countworms", async (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'worms'"; // Adjust the field name if necessary

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows[0]); // Send back the count
  } catch (err) {
    console.error("Error fetching birds count:", err);
    res.status(500).send("Server error. Failed to fetch birds count.");
  }
});

// Endpoint to get the count of Sponges
app.get("/countsponges", async (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'sponges'"; // Adjust the field name if necessary

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows[0]); // Send back the count
  } catch (err) {
    console.error("Error fetching birds count:", err);
    res.status(500).send("Server error. Failed to fetch birds count.");
  }
});

app.get('/api/images/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const { rows: images } = await pool.query(
      'SELECT uploadimage FROM species WHERE LOWER(speciescategory) = LOWER($1)',
      [category]
    );

    console.log("Fetched images from DB:", images); // Debugging log

    const formattedImages = images.map(img => ({
      image_filename: img.uploadimage.startsWith('http') 
        ? img.uploadimage // ✅ If it's already a full URL, keep it
        : `https://res.cloudinary.com/dvj4mroel/image/upload/v1742857519/species-images/${img.uploadimage}`
    }));

    res.json(formattedImages);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ message: 'Error fetching images' });
  }
});


// POST endpoint to create a quiz question
app.post("/api/quizzes", async (req, res) => {
  const { question, options, correctAnswer, questionType } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO quizzes(question, options, correct_answer, question_type) VALUES($1, $2, $3, $4) RETURNING *",
      [question, options, correctAnswer, questionType]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting quiz question:", error);
    res.status(500).send("Server error");
  }
});

app.get("/api/species/:id", async (req, res) => {
  const speciesId = req.params.id;

  try {
    const { rows } = await pool.query("SELECT * FROM species WHERE id = $1", [speciesId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Species not found" });
    }

    const species = rows[0];

    // ✅ Huwag gumamit ng default image, kung walang image, walang ilalagay
    const formattedSpecies = {
      ...species,
      uploadimage: species.uploadimage?.includes("cloudinary.com")
        ? species.uploadimage
        : species.uploadimage
        ? `https://res.cloudinary.com/dvj4mroel/image/upload/v1742857519/species-images/${species.uploadimage}`
        : "", // Walang ilalagay kapag walang image
    };

    res.json(formattedSpecies);
  } catch (error) {
    console.error("Error fetching species:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put('/listspecies/:id', upload.single('uploadimage'), async (req, res) => {
  const speciesId = req.params.id;

  // Ensure speciesId is valid (non-empty and a number)
  if (!speciesId || isNaN(speciesId)) {
    return res.status(400).json({ message: 'Invalid species ID' });
  }

  const {
    specificname,
    scientificname,
    commonname,
    habitat,
    population,
    location,
    conservationstatus,
    threats,
    conservationeffort,
    classification,
    speciescategory,
    description,
  } = req.body;

  // Check if image URL or file is provided
  let imageUrl = req.body.existingimage;

  if (req.file) {
    // If the uploaded file exists, store its file path
    imageUrl = path.join('uploads/images', req.file.filename);
  } else if (req.body.imageUrl && req.body.imageUrl.startsWith('https://')) {
    // If the image is a Cloudinary URL, store it as a string
    imageUrl = req.body.imageUrl;
  }

  // Ensure no undefined or null values are passed into the SQL query
  const values = [
    specificname || '', // Provide default values if missing
    scientificname || '',
    commonname || '',
    habitat || '',
    population || '',
    location || '',
    conservationstatus || '',
    threats || '',
    conservationeffort || '',
    classification || '',
    speciescategory || '',
    description || '',
    imageUrl || '', // Ensure a fallback for imageUrl
    speciesId, // Make sure speciesId is valid
  ];

  // Log the values for debugging
  console.log('Update query values:', values);

  try {
    const updateSpeciesQuery = `
      UPDATE species 
      SET specificname = $1, scientificname = $2, commonname = $3, habitat = $4,
          population = $5, location = $6, conservationstatus = $7, threats = $8,
          conservationeffort = $9, classification = $10, speciescategory = $11, description = $12,
          uploadimage = $13
      WHERE id = $14
      RETURNING *;
    `;

    const result = await pool.query(updateSpeciesQuery, values);

    // Check if species was updated successfully
    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Species updated successfully', species: result.rows[0] });
    } else {
      res.status(404).json({ message: 'Species not found' });
    }
  } catch (error) {
    console.error('Error updating species:', error);
    res.status(500).json({ message: 'Error updating species. Please try again.' });
  }
});

app.get("/api/species/monthly", async (req, res) => {
  const query = `
    SELECT 
      created_month, 
      COUNT(*) AS count
    FROM species
    GROUP BY created_month
    ORDER BY 
      CASE created_month
        WHEN 'January' THEN 1
        WHEN 'February' THEN 2
        WHEN 'March' THEN 3
        WHEN 'April' THEN 4
        WHEN 'May' THEN 5
        WHEN 'June' THEN 6
        WHEN 'July' THEN 7
        WHEN 'August' THEN 8
        WHEN 'September' THEN 9
        WHEN 'October' THEN 10
        WHEN 'November' THEN 11
        WHEN 'December' THEN 12
        ELSE 13
      END
  `;

  try {
    const result = await pool.query(query);

    // Define the month names in the correct order
    const monthNames = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];

    // Initialize an array for counts for each month
    const monthlyCounts = new Array(12).fill(0);

    // Process the query results
    result.rows.forEach(row => {
      const monthIndex = monthNames.indexOf(row.created_month);
      if (monthIndex !== -1) {
        monthlyCounts[monthIndex] = parseInt(row.count, 10);
      }
    });

    // Send back the monthly counts
    res.json({ monthlyCounts });
  } catch (error) {
    console.error("Error fetching monthly species data:", error);
    res.status(500).json({ message: "Server error." });
  }
});



// Start the server
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
