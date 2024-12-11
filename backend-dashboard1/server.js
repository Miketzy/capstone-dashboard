import express from 'express'
import mysql2 from 'mysql2'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import path from 'path';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import fs from 'fs';
import nodemailer from "nodemailer";
import crypto from 'crypto'; // For OTP generation
import http from 'http';
import { Server as socketIo } from 'socket.io'; // Correct way to import socket.io

// Determine the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();
app.use(express.json());




app.use(cors({
  origin: 'http://localhost:3000', // Payagan ang iyong React frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Payagan ang HTTP methods
  credentials: true, // Kung gumagamit ka ng cookies o authorization headers
}));






const db = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'reposatory01'
});


// Make sure to use cookieParser before any route handling
app.use(cookieParser());

/// Middleware to verify user
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "We need a token, please provide it." });
  }

  jwt.verify(token, "jsonwebtoken-secret-key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

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


// Configure Multer for profile image storage
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/avatar'); // Folder to store uploaded images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Ensure the image has a unique name
  }
});

const uploaded = multer({ storage: profileStorage });
// Route to upload and update profile image
app.post('/upload-profile', uploaded.single('profileImage'), (req, res) => {
  const userId = req.body.userId || 1; // Using userId = 1 for this example

  // Check if user exists
  if (!users[userId]) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Optionally delete the old profile image (if user already has one)
  const existingImage = users[userId].image;
  if (existingImage) {
    fs.unlink(`./uploads/avatar/${existingImage}`, (err) => {
      if (err) console.error('Error deleting old image:', err);
    });
  }

  // Save the new image filename to the user's profile in "database"
  const newImage = req.file.filename;
  users[userId].image = newImage;

  // Respond with the new image filename
  res.json({ success: true, newImage });
});

app.use('/uploads/avatar', express.static(path.join(__dirname, 'uploads/avatar')));
const profileStorages = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "./uploads/avatar")
  },
  filename: function (req, file, cb){
    return cb(null, Date.now() + path.extname(file.originalname));
  }
})

const profileUpload = multer({ storage: profileStorages });

// Profile update route
app.put('/profile', verifyUser, profileUpload.single('image'), (req, res) => {
  const userId = req.userId; // User ID from the verified token
  const { firstname, middlename, lastname, email, gender, phone_number, username } = req.body;

  // Check if a new image has been uploaded
  const newImage = req.file ? req.file.filename : null;

  // Fetch the current image from the database if no new image is uploaded
  const selectSql = `SELECT image FROM users WHERE id = ?`;

  db.query(selectSql, [userId], (selectErr, selectResults) => {
    if (selectErr) {
      console.error('Error fetching current image:', selectErr);
      return res.status(500).json({ message: 'Server error' });
    }

    const currentImage = selectResults[0]?.image;
    const imageToUpdate = newImage || currentImage; // Use new image or keep current

    // Prepare the update query
    const updateSql = `
      UPDATE users SET 
        firstname = ?, 
        middlename = ?, 
        lastname = ?, 
        email = ?, 
        gender = ?, 
        phone_number = ?, 
        username = ?, 
        image = ? 
      WHERE id = ?
    `;

    // Execute the update query
    db.query(updateSql, [firstname, middlename, lastname, email, gender, phone_number, username, imageToUpdate, userId], (err, results) => {
      if (err) {
        console.error('Database update error:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      res.json({ message: 'Profile updated successfully' });
    });
  });
});



// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ Message: "Server Side Error" });
    }
    if (data.length > 0) {
      const user = data[0];
      const hashedPassword = user.password;

      // Compare passwords
      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) {
          console.error("Password comparison error:", err);
          return res.status(500).json({ Message: "Error comparing passwords" });
        }
        if (isMatch) {
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
              currentPassword:user.currentPassword, 
              newPassword:user.newPassword, 
              confirmPassword: user.confirmPassword,
            },
            "jsonwebtoken-secret-key",
            { expiresIn: "30d" }
          );

          // Set the JWT token in a cookie
          res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" });
          return res.json({
            Status: "Success",
            status: user.status,
            firstname: user.firstname,
            middlename: user.middlename,
            lastname: user.lastname,
            phone_number: user.phone_number,
            gender: user.gender,
            image: user.image,
            email: user.email,
            currentPassword:user.currentPassword, 
            newPassword:user.newPassword, 
            confirmPassword: user.confirmPassword,
            
          });
        } else {
          return res.status(401).json({ Message: "Incorrect Password" });
        }
      });
    } else {
      return res.status(404).json({ Message: "No Records Existed" });
    }
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
      status: req.status,
      currentPassword:req.currentPassword, 
      newPassword:req.newPassword, 
      confirmPassword: req.confirmPassword
    },
  });
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
      currentPassword:req.currentPassword, 
      newPassword:req.newPassword, 
      confirmPassword: req.confirmPassword
    },
  });
});

// Protected route to get user profile
app.get("/myprofile", verifyUser, (req, res) => {
  return res.json({
    message: "Profile retrieved successfully",
    user: {
      id: req.userId,
      username: req.username,
      firstname: req.firstname,
      gender:req.gender,
      middlename: req.middlename,
      lastname: req.lastname,
      phone_number: req.phone_number,
      email: req.email,
      image: req.image,
      status: req.status,
      currentPassword:req.currentPassword, 
      newPassword:req.newPassword, 
      confirmPassword: req.confirmPassword
    },
  });
});

// Protected route to get user profile
app.get("/cmyprofile", verifyUser, (req, res) => {
  return res.json({
    message: "Profile retrieved successfully",
    user: {
      id: req.userId,
      username: req.username,
      firstname: req.firstname,
      gender:req.gender,
      middlename: req.middlename,
      lastname: req.lastname,
      phone_number: req.phone_number,
      email: req.email,
      image: req.image,
      status: req.status,
      currentPassword:req.currentPassword, 
      newPassword:req.newPassword, 
      confirmPassword: req.confirmPassword
    },
  });
});

// Register endpoint
app.post('/register', (req, res) => {
  const {
    username, firstname, middlename, lastname,
    phone_number, email, gender, status, password, confirmPassword
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  const checkUserSql = "SELECT * FROM users WHERE username = ? OR email = ?";
  db.query(checkUserSql, [username, email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Server error." });
    }
    if (results.length > 0) {
      return res.status(409).json({ error: "Username or email already exists." });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Hashing error:", err);
        return res.status(500).json({ error: "Server error." });
      }

      const insertUserSql = `
        INSERT INTO users (username, firstname, middlename, lastname, phone_number, email, gender, status, password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(insertUserSql, [
        username, firstname, middlename, lastname,
        phone_number, email, gender, status, hashedPassword
      ], (err, result) => {
        if (err) {
          console.error("Database insertion error:", err);
          return res.status(500).json({ error: "Server error." });
        }

        const token = jwt.sign(
          {
            id: result.insertId,
            username,
            firstname,
            middlename,
            lastname,
            phone_number,
            email,
            gender,
            status,
          },
          "jsonwebtoken-secret-key",
          { expiresIn: "30d" }
        );

        res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" });
        
        return res.json({
          status: "Success",
          user: {
            id: result.insertId,
            username,
            firstname,
            middlename,
            lastname,
            phone_number,
            gender,
            status, // Return the status to the frontend
            email,
          }
        });
      });
    });
  });
});

// Password change endpoint (Protected by JWT middleware)
app.post('/password-changes', verifyUser, async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'New passwords do not match' });
  }

  // Retrieve the user's current password from the database using the user ID from JWT
  db.query('SELECT password FROM users WHERE id = ?', [req.userId], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hashedPassword = results[0].password;

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    db.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, req.userId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error updating password' });
      }
      res.status(200).json({ message: 'Password changed successfully' });
    });
  });
});



// logout route
app.get('/logout', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});

// logout route
app.get('/contributor-request', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});

// logout route
app.get('/registerpage', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});

// myprofile  route   
app.get('/profile', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});

// edit-profile  route
app.get('/edit-profile', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});

// change-password  route
app.get('/change-password', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});

// change-password  route
app.get('/email', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});

// species directory route
app.get('/speciesDirectory', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});

// add species  route
app.get('/addSpecies', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});

// list species  route
app.get('/list', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});

// mammals  route
app.get('/mammalsTable', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});

// birds  route
app.get('/birdsTable', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});

// reptiles  route
app.get('/reptilesTable', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});

// invertebrates  route
app.get('/invertebratesTable', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});

// fish  route
app.get('/fishTable', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});

// analytics  route
app.get('/analytics', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});

// amphibians route
app.get('/amphibiansTable', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});

// critically endangered  route
app.get('/criticallyTable', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});

// endangered  route
app.get('/endangeredTable', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});

// vulnerable  route
app.get('/vulnerableTable', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});

// Near Threatend  route
app.get('/near-threatendTable', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});

// least concern route
app.get('/least-concernTable', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});

// gallery  route
app.get('/gallery', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});

// Search  route
app.get('/searchpage', (req, res) => {
  res.clearCookie('authToken');  
  res.json({ Message: 'Success' });
});


// Endpoint to fetch categories
app.get('/categories', (req, res) => {
  const query = 'SELECT id, name FROM species_categories';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json(results);
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "./uploads/images")
  },
  filename: function (req, file, cb){
    return cb(null, Date.now() + path.extname(file.originalname));
  }
})
const upload = multer({ storage: storage });

// POST route to handle species creation
app.post("/create", upload.single("file"), (req, res) => {
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

  const uploadimage = req.file ? req.file.filename : null;

  // Perform your database logic to save species data
  // You can use your MySQL connection here
  const query = `INSERT INTO species (specificname, scientificname, commonname, habitat, population, threats, speciescategory, location, conservationstatus, conservationeffort, description, uploadimage)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [
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
      uploadimage,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting species data:", err);
        return res.status(500).send("Server error. Failed to add species.");
      }
      res.status(201).send("Species added successfully!");
    }
  );
});


// Endpoint to get species from a specific category
app.get('/species/:categoryId', (req, res) => {
  const { categoryId } = req.params;

  const categoryTableMapping = {
    '1': 'mammals',
    '2': 'birds',
    '3': 'reptiles',
    '4': 'amphibians',
    '5': 'invertebrates',
    '6': 'fish'
  };

  const categoryTable = categoryTableMapping[categoryId];
  if (categoryTable) {
    const query = `SELECT * FROM ${categoryTable}`;
    db.query(query, (err, results) => {
      if (err) {
        console.error(`Error fetching data from ${categoryTable}:`, err);
        return res.status(500).json({ message: 'Database error', error: err });
      }
      res.json(results);
    });
  } else {
    res.status(400).json({ message: 'Invalid category ID' });
  }
});

//end point to get the species table
app.get('/listspecies', (req, res) => {
  const sql = "SELECT * FROM species";
  db.query(sql, (err, data) => {
    if (err) return res.json({ Message: "Error retrieving data" });
    // Adjust path for images in 'uploads/images' directory
    const result = data.map(item => ({
      ...item,
      uploadimage: `http://localhost:8080/uploads/images/${item.uploadimage}`
    }));
    return res.json(result);
  });
});

// Endpoint to get mammals species
app.get("/getMammals", (req, res) => {
  const query = "SELECT * FROM species WHERE speciescategory = 'mammals'";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching mammals data:", err);
      return res.status(500).send("Server error. Failed to fetch mammals.");
    }

    res.status(200).json(result);  // Send back the list of mammals
  });
});

// Endpoint to get birds species
app.get("/getBirds", (req, res) => {
  const query = "SELECT * FROM species WHERE speciescategory = 'birds'";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching birds data:", err);
      return res.status(500).send("Server error. Failed to fetch birds.");
    }

    res.status(200).json(result);  // Send back the list of birds
  });
});

// Endpoint to get reptiles species
app.get("/getReptiles", (req, res) => {
  const query = "SELECT * FROM species WHERE speciescategory = 'reptiles'";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching reptiles data:", err);
      return res.status(500).send("Server error. Failed to fetch reptiles.");
    }

    res.status(200).json(result);  // Send back the list of reptiles
  });
});

// Endpoint to get amphibians species
app.get("/getAmphibians", (req, res) => {
  const query = "SELECT * FROM species WHERE speciescategory = 'amphibians'";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching amphibians data:", err);
      return res.status(500).send("Server error. Failed to fetch amphibians.");
    }

    res.status(200).json(result);  // Send back the list of amphibians
  });
});


// Endpoint to get invertebrates species
app.get("/getInvertebrates", (req, res) => {
  const query = "SELECT * FROM species WHERE speciescategory = 'invertebrates'";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching invertebrates data:", err);
      return res.status(500).send("Server error. Failed to fetch invertebrates.");
    }

    res.status(200).json(result);  // Send back the list of invertebrates
  });
});

// Endpoint to get vertebrates species
app.get("/getvertebrates", (req, res) => {
  const query = "SELECT * FROM species WHERE speciescategory = 'vertebrates'";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching vertebrates data:", err);
      return res.status(500).send("Server error. Failed to fetch vertebrates.");
    }

    res.status(200).json(result);  // Send back the list of vertebrates
  });
});

// Endpoint to get fish species
app.get("/getFish", (req, res) => {
  const query = "SELECT * FROM species WHERE speciescategory = 'fish'";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching fish data:", err);
      return res.status(500).send("Server error. Failed to fetch fish.");
    }

    res.status(200).json(result);  // Send back the list of fish
  });
});

// Endpoint to get Critically-endangered species
app.get("/getCritically-endangered", (req, res) => {
  const query = "SELECT * FROM species WHERE conservationstatus = 'critically-endangered'";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching critically endangered data:", err);
      return res.status(500).send("Server error. Failed to fetch critically endangered species.");
    }

    res.status(200).json(result);  // Send back the list of critically endangered species
  });
});


// Endpoint to get endangered species
app.get("/getEndangered", (req, res) => {
  const query = "SELECT * FROM species WHERE conservationstatus = 'endangered'";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching endangered species data:", err);
      return res.status(500).send("Server error. Failed to fetch endangered species.");
    }

    res.status(200).json(result);  // Send back the list of endangered species
  });
});

// Endpoint to get vulnerable species
app.get("/getVulnerable", (req, res) => {
  const query = "SELECT * FROM species WHERE conservationstatus = 'vulnerable'";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching vulnerable species data:", err);  // Updated error message
      return res.status(500).send("Server error. Failed to fetch vulnerable species.");  // Updated error message
    }

    res.status(200).json(result);  // Send back the list of vulnerable species
  });
});


// Endpoint to get Near-threatened species
app.get("/getNear-threatened", (req, res) => {
  const query = "SELECT * FROM species WHERE conservationstatus = 'near-threatened'";  // Correct status

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching near-threatened species data:", err);  // Updated error message
      return res.status(500).send("Server error. Failed to fetch near-threatened species.");  // Updated error message
    }

    res.status(200).json(result);  // Send back the list of near-threatened species
  });
});

// Endpoint to get Least-concerned species
app.get("/getLeast-concerned", (req, res) => {
  const query = "SELECT * FROM species WHERE conservationstatus = 'least-concern'";  // Correct status

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching least-concerned species data:", err);  // Updated error message
      return res.status(500).send("Server error. Failed to fetch least-concerned species.");  // Updated error message
    }

    res.status(200).json(result);  // Send back the list of least-concerned species
  });
});

// Endpoint to get the total count of all species
app.get("/countSpecies", (req, res) => {
  const query = "SELECT COUNT(*) AS totalSpecies FROM species";  // SQL query to count all species

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching total species count:", err);
      return res.status(500).send("Server error. Failed to fetch total species count.");
    }
     // Send back the total count
    res.status(200).json(result[0]);
  });
});

// Endpoint to get the count of mammals
app.get("/countmammals", (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'mammals'"; // Adjust the field name if necessary

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching mammals count:", err);
      return res.status(500).send("Server error. Failed to fetch mammals count.");
    }

    res.status(200).json(result[0]); // Send back the count
  });
});

// Endpoint to get the count of birds
app.get("/countbirds", (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'birds'"; // Adjust the field name if necessary

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching birds count:", err);
      return res.status(500).send("Server error. Failed to fetch birds count.");
    }

    res.status(200).json(result[0]); // Send back the count
  });
});

// Endpoint to get the count of reptiles
app.get("/countReptiles", (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'reptiles'"; // Adjust the field name if necessary

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching reptiles count:", err);
      return res.status(500).send("Server error. Failed to fetch reptiles count.");
    }

    res.status(200).json(result[0]); // Send back the count
  });
});

// Endpoint to get the count of amphibians
app.get("/countAmphibians", (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'amphibians'"; // Adjust the field name if necessary

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching reptiles count:", err);
      return res.status(500).send("Server error. Failed to fetch reptiles count.");
    }

    res.status(200).json(result[0]); // Send back the count
  });
});

// Endpoint to get the count of Invertebrates
app.get("/countInvertebrates", (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'invertebrates'"; // Ensure the field name is correct

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching invertebrates count:", err); // Updated error message
      return res.status(500).send("Server error. Failed to fetch invertebrates count."); // Updated error message
    }

    res.status(200).json(result[0]); // Send back the count
  });
});

// Endpoint to get the count of Invertebrates
app.get("/countvertebrates", (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'vertebrates'"; // Ensure the field name is correct

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching vertebrates count:", err); // Updated error message
      return res.status(500).send("Server error. Failed to fetch vertebrates count."); // Updated error message
    }

    res.status(200).json(result[0]); // Send back the count
  });
});


// Endpoint to get the count of Fish
app.get("/countFish", (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'fish'"; // Ensure the field name is correct

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching fish count:", err); // Updated error message
      return res.status(500).send("Server error. Failed to fetch fish count."); // Updated error message
    }

    res.status(200).json(result[0]); // Send back the count
  });
});


// Define the endpoint to get species counts for each category in bar graph
app.get('/speciesCounts', (req, res) => {
  const queries = [
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'mammals'",
   "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'birds'",
   "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'reptiles'",
   "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'amphibians'",
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'invertebrates'",
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'vertebrates'",
    "SELECT COUNT(*) AS count FROM species WHERE speciescategory = 'fish'",
  ];

  Promise.all(queries.map(query => new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) reject(err);
      resolve(results[0].count);
    });
  })))
    .then(counts => {
      res.json({
        mammals: counts[0],
        birds: counts[1],
        reptiles: counts[2],
        amphibians: counts[3],
        invertebrates: counts[4],
        vertebrates: counts[5],
        fish: counts[6],
      });
    })
    .catch(err => {
      console.error('Error fetching species counts:', err);
      res.status(500).json({ error: 'Failed to fetch species counts' });
    });
  });

   // Route to get the count of each conservation status
app.get('/api/conservation-status-count', (req, res) => {
  const conservationStatuses = [
    'critically-endangered',
    'endangered',
    'vulnerable',
    'near-threatened',
    'least-concern'
  ];

  // Construct the query to count each conservation status from the 'species' table
  const queries = conservationStatuses.map(status => 
    `SELECT '${status}' AS conservationstatus, COUNT(*) AS count FROM species WHERE conservationstatus = '${status}'`
  );

  const combinedQuery = queries.join(' UNION ALL ');

  // Execute the combined query
  db.query(combinedQuery, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    // Return the result as JSON
    res.json(results);
  });
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.put('/listspecies/:id', upload.single('uploadimage'), (req, res) => {
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
    speciescategory,
    description,
    existingimage // Include the existing image file name from the request body
  } = req.body;

  // Use the uploaded image if a new one is provided; otherwise, use the existing image
  const uploadimage = req.file ? req.file.filename : existingimage;

  const updateListsSpeciesQuery = `
    UPDATE species SET
      specificname = ?, 
      scientificname = ?, 
      commonname = ?, 
      habitat = ?, 
      population = ?, 
      location = ?, 
      conservationstatus = ?, 
      threats = ?, 
      conservationeffort = ?, 
      speciescategory = ?, 
      description = ?, 
      uploadimage = ?
    WHERE id = ?
  `;

  const updateListsSpeciesValues = [
    specificname,
    scientificname,
    commonname,
    habitat,
    population,
    location,
    conservationstatus,
    threats,
    conservationeffort,
    speciescategory,
    description,
    uploadimage, // Store only the file name
    req.params.id
  ];

  db.query(updateListsSpeciesQuery, updateListsSpeciesValues, (err, result) => {
    if (err) {
      console.error('Error updating species:', err);
      return res.status(500).json({ error: 'Error updating species' });
    }

    res.status(200).json({ message: 'Species updated successfully' });
  });
});



app.delete('/delete-species/:id', (req, res) => {
  const deleteSpeciesQuery = 'DELETE FROM species WHERE id = ?';

  db.query(deleteSpeciesQuery, [req.params.id], (err) => {
    if (err) {
      console.error('Error deleting species:', err);
      return res.status(500).json({ error: 'Error deleting species' });
    }

    res.status(200).json({ message: 'Species deleted successfully' });
  });
});

// Middleware to serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/images', (req, res) => {
  const sql = 'SELECT id, commonname, uploadimage FROM species';
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch images' });
    }
    res.json(result);
  });
});


// Route to add species to pending request
app.post('/species/pending', upload.single("file"), (req, res) => {
  const {
    specificname, scientificname, commonname, habitat, population, threats,
    location, conservationstatus, speciescategory, conservationeffort, description,
    contributor_firstname, contributor_lastname, contributor_email
  } = req.body;

  // Check for required fields
  if (!specificname || !scientificname || !commonname || !contributor_firstname || !contributor_lastname || !contributor_email)  {
    return res.status(400).json({ message: 'Specific name, scientific name, common name, contributor first name, and contributor last name are required.' });
  }

  // Get the uploaded file's path
  const uploadimage = req.file ? req.file.filename : null;

  // Check if file upload was successful
  if (!uploadimage) {
    return res.status(400).json({ message: 'File upload failed or no file provided.' });
  }

  const sql = `
    INSERT INTO pending_request
    (specificname, scientificname, commonname, habitat, population, threats, 
     location, speciescategory, conservationstatus, conservationeffort, description, uploadimage, 
     contributor_firstname, contributor_lastname, contributor_email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [specificname, scientificname, commonname, habitat, population, threats, location, speciescategory, conservationstatus, conservationeffort, description, uploadimage, contributor_firstname, contributor_lastname,contributor_email],
    (err, result) => {
      if (err) {
        console.error('Error adding species to pending_request:', err);
        return res.status(500).json({ message: 'Failed to submit species request' });
      } else {
        res.status(200).json({ message: 'Species request submitted successfully' });
      }
    }
  );
});





//Endpoint of contributor Request table
app.get('/request-table', (req, res) => {
  const sql = "SELECT * FROM pending_request";
  db.query(sql, (err, data) => {
    if (err) return res.json({ Message: "Error retrieving data" });
    // Adjust path for images in 'uploads/images' directory
    const result = data.map(item => ({
      ...item,
      uploadimage: `http://localhost:8080/uploads/images/${item.uploadimage}`
    }));
    return res.json(result);
  });
});



//Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new socketIo(server);

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "michaeljohnmargate11@gmail.com", // Your dedicated email
    pass: "ghcp yguc opnc kgwg", // Your email password or app password
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
    from: "michaeljohnmargate11@gmail.com", // Sender's email (your dedicated email)
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
app.put("/species/approve/:id", (req, res) => {
  const speciesId = req.params.id;

  // Fetch the pending request
  const fetchSql = "SELECT * FROM pending_request WHERE id = ?";
  db.query(fetchSql, [speciesId], (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).json({ message: "Species request not found" });
    }

    const species = result[0];

    // Insert into species table
    const insertSql = `
      INSERT INTO species (specificname, scientificname, commonname, habitat, population, threats, 
      location, conservationstatus, speciescategory, conservationeffort, description, uploadimage)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [
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
      ],
      (insertErr) => {
        if (insertErr) {
          console.error("Error approving species with ID " + speciesId + ":", insertErr);
          return res.status(500).json({ message: "Failed to approve species" });
        }

        // Delete from pending_request after approval
        const deleteSql = "DELETE FROM pending_request WHERE id = ?";
        db.query(deleteSql, [speciesId], (deleteErr) => {
          if (deleteErr) {
            console.error("Error deleting pending request with ID " + speciesId + ":", deleteErr);
            return res.status(500).json({ message: "Failed to remove from pending_request" });
          }

          // Send email notification to the contributor
          if (species.contributor_email) {
            sendEmailNotification(species.contributor_email, species.specificname); // Use the email from the request
          }

          // Emit a WebSocket notification to the contributor
          if (species.contributor_id) {
            console.log(`Notifying contributor ${species.contributor_id}`);
            io.emit(`notify-contributor-${species.contributor_id}`, {
              message: "Your species has been approved!",
            });
          }

          res.status(200).json({ message: "No Request" });
        });
      }
    );
  });
});


// Endpoint to get the count of pending requests
app.get('/pending-request-count', (req, res) => {
  const sql = 'SELECT COUNT(*) AS count FROM pending_request';
  
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching pending request count:', err);
      return res.status(500).json({ message: 'Failed to fetch request count' });
    }
    res.status(200).json({ count: result[0].count });
  });
});



app.delete('/species/reject/:id', (req, res) => {
  const speciesId = req.params.id;

  // SQL query to get the contributor email and the common name
  const sqlSelect = 'SELECT contributor_email, commonname FROM pending_request WHERE id = ?';
  
  // Fetch the email and common name of the contributor
  db.query(sqlSelect, [speciesId], (err, results) => {
    if (err) {
      console.error('Error fetching contributor email and common name:', err);
      return res.status(500).json({ message: 'Failed to fetch contributor information' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Species request not found' });
    }

    const contributorEmail = results[0].contributor_email; // Get the contributor's email
    const commonName = results[0].commonname; // Get the common name

    // SQL query to delete the species request from the pending_request table
    const sqlDelete = 'DELETE FROM pending_request WHERE id = ?';

    // Execute the SQL query to delete the request
    db.query(sqlDelete, [speciesId], (err, result) => {
      if (err) {
        console.error('Error rejecting species:', err);
        return res.status(500).json({ message: 'Failed to reject species' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Species request not found' });
      }

      // Send email notification to the contributor
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service provider
        auth: {
          user: 'michaeljohnmargate11@gmail.com', // Your email address
          pass: 'ghcp yguc opnc kgwg' // Your email password or app-specific password
        }
      });

      const mailOptions = {
        from: 'michaeljohnmargate11@gmail.comm', // Sender address
        to: contributorEmail, // Recipient email
        subject: 'Species Request Rejected',
        text: `Your species request with the common name "${commonName}" has been rejected.` // Include the common name in the message
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ message: 'Failed to send email notification' });
        }
        
        // Respond with success message
        res.status(200).json({
          message: 'No Request.',
          speciesId: speciesId // Optional: Return the deleted species ID
        });
      });
    });
  });
});


// In-memory storage for OTPs
const otpStore = {};

// Function to send email using Nodemailer
const sendOTPEmail = (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'michaeljohnmargate11@gmail.com', // Your Gmail address
      pass: 'ghcp yguc opnc kgwg', // Your Gmail password or app password
    },
  });

  const mailOptions = {
    from: 'michaeljohnmargate11@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  return transporter.sendMail(mailOptions);
};

// Generate a 6-digit OTP code
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString(); // Generates a number between 100000 and 999999
};

// Endpoint to handle OTP email sending
app.post('/send-otp', (req, res) => {
  const { email } = req.body;

  // Generate an OTP and store it in memory
  const otp = generateOTP();
  otpStore[email] = otp; // Store OTP for the email

  sendOTPEmail(email, otp)
    .then(() => {
      res.status(200).send('OTP sent to your email');
    })
    .catch((error) => {
      console.error('Error sending email:', error); // Log the error
      res.status(500).send('Error sending email');
    });
});

// Endpoint to verify OTP
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  // Check if the email exists in the OTP store
  if (!otpStore[email]) {
    return res.status(400).json({ success: false, message: 'No OTP found for this email.' });
  }

  // Check if the OTP matches
  if (otpStore[email] === otp) {
    // OTP verified successfully
    delete otpStore[email]; // Remove OTP from store after successful verification
    return res.json({ success: true, message: 'OTP verified successfully!' });
  } else {
    // Invalid OTP
    return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
  }
});


app.post('/reset-password', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) {
      return res.status(500).send('Server error');
    }

    if (result.length > 0) {
      // User found, proceed to hash and update the password
      bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          return res.status(500).send('Error hashing password');
        }

        db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email], (updateErr) => {
          if (updateErr) {
            return res.status(500).send('Error updating password');
          }

          res.json({ success: true, message: 'Password reset successfully!' });
        });
      });
    } else {
      res.status(404).json({ success: false, message: 'Email not registered' });
    }
  });
});

// Endpoint to add a multiple-choice question
app.post("/api/questions", (req, res) => {
  const { question, optionA, optionB, optionC, optionD, correctAnswer } = req.body;

  const query = `
    INSERT INTO questions (question, optionA, optionB, optionC, optionD, correctAnswer)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [question, optionA, optionB, optionC, optionD, correctAnswer],
    (err, result) => {
      if (err) {
        console.error("Error saving question:", err);
        return res.status(500).json({ error: "Failed to save question." });
      }
      // Successful response
      res.status(201).json({ message: "Question saved successfully." });
    }
  );
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
})



