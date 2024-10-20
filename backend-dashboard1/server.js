import express from 'express'
import mysql2 from 'mysql2'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import path from 'path';
import multer from 'multer';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Determine the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // Replace this with your frontend URL
  method: ["POST,GET"],
  credentials: true, // Allows cookies to be sent from the client
}));

const db = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'reposatory'
});

// Make sure to use cookieParser before any route handling
app.use(cookieParser());

// Your routes and middleware
const verifyUser = (req, res, next) => {
  const token = req.cookies.token; // Access token from cookies
  if (!token) {
    return res.json({ Message: "We need token please provide it." });
  } else {
    jwt.verify(token, "our-jsonwebtoken-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Message: "Authentication Error." });
      } else {
        req.firstname = decoded.firstname;
        req.middlename = decoded.middlename;
        req.lastname = decoded.lastname;
        req.email = decoded.email;
        req.gender = decoded.gender;
        req.phone_number = decoded.phone_number;
        req.username = decoded.username;
        req.image = decoded.image;
        next();
      }
    });
  }
};

//specific data filtering in novbar, myprofile,edit profile
app.get('/', verifyUser, (req, res) => {
  return res.json({ Status: "Success", firstname: req.firstname,middlename:req.middlename,lastname:req.lastname,email: req.email,gender: req.gender,phone_number:req.phone_number,image: req.image,username:req.username});
});

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


app.put('/profile', profileUpload.single('image'), (req, res) => {
  const userId = req.query.id; // Get user ID from query params
  const { firstname, middlename, lastname, email, gender, phone_number, username } = req.body;

  // Check if a new image has been uploaded
  const newImage = req.file ? `${req.file.filename}` : null;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  // Fetch the current image from the database if no new image is uploaded
  const selectSql = `SELECT image FROM dashboardregister WHERE id = ?`;

  db.query(selectSql, [userId], (selectErr, selectResults) => {
    if (selectErr) {
      console.error('Error fetching current image:', selectErr);
      return res.status(500).json({ message: 'Server error' });
    }

    const currentImage = selectResults[0]?.image;
    const imageToUpdate = newImage || currentImage; // Use new image if uploaded, otherwise retain current image

    // Prepare the update query
    const updateSql = `
      UPDATE dashboardregister SET 
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

//login form
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM dashboardregister WHERE username = ?";
  db.query(sql, [username], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ Message: "Server Side Error" });
    }
    if (data.length > 0) {
      const user = data[0];
      const hashedPassword = user.password;

      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) {
          console.error("Password comparison error:", err);
          return res.status(500).json({ Message: "Error comparing passwords" });
        }
        if (isMatch) {
          const { firstname, middlename, lastname, email, username,gender,phone_number,image } = user;
          const token = jwt.sign(
            { firstname, middlename, lastname, email, username,gender,phone_number,image },
            "our-jsonwebtoken-secret-key",
            { expiresIn: '1y' }
          );
          
          res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax' });
          return res.json({ Status: "Success" });
        } else {
          return res.status(401).json({ Message: "Incorrect Password" });
        }
      });
    } else {
      return res.status(404).json({ Message: "No Records Existed" });
    }
  });
});

// logout route
app.get('/logout', (req, res) => {
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


//Endpoint para sa registration
app.post("/register", (req, res) => {
  const { firstname, middlename, lastname, birthdate, address, email, gender, password } = req.body;

  // Insert user into the database with plain text password
  db.query(
    "INSERT INTO dashboardregister (firstname, middlename, lastname, birthdate, address, email, gender, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [firstname, middlename, lastname, birthdate, address, email, gender, password],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ error: 'An error occurred during registration.' });
      } else {
        res.status(201).send({ message: 'User registered successfully.' });
      }
    }
  );
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


app.post('/create', upload.single('file'), (req, res) => {
  const {
    specificname,
    scientificname,
    commonname,
    habitat,
    population,
    threats,
    speciescategories,
    date,
    location,
    conservationstatus,
    conservationeffort,
    description
  } = req.body;

  const uploadimage = req.file ? req.file.filename : null;

  if (!specificname || !scientificname || !commonname || !habitat || !population || !threats || !speciescategories || !date || !location || !conservationstatus || !conservationeffort || !description || !uploadimage) {
    return res.status(400).json({ message: 'All fields are required including image' });
  }

  const values = [
    specificname,
    scientificname,
    commonname,
    habitat,
    population,
    threats,
    speciescategories,
    date,
    location,
    conservationstatus,
    conservationeffort,
    description,
    uploadimage
  ];

  const commonSql = `INSERT INTO listspecies (specificname, scientificname, commonname, habitat, population, threats, speciescategories, date, location, conservationstatus, conservationeffort, description, uploadimage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const insertIntoCategoryTable = (tableName, callback) => {
    const categoryQuery = `INSERT INTO ${tableName} (specificname, scientificname, commonname, habitat, population, threats, speciescategories, date, location, conservationstatus, conservationeffort, description, uploadimage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(categoryQuery, values, callback);
  };

  const insertIntoConservationTable = (tableName, callback) => {
    const conservationQuery = `INSERT INTO ${tableName} (specificname, scientificname, commonname, habitat, population, threats, speciescategories, date, location, conservationstatus, conservationeffort, description, uploadimage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(conservationQuery, values, callback);
  };

  db.query(commonSql, values, (err) => {
    if (err) {
      console.error('Error inserting into listspecies:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    // Insert into category table
    const categoryTable = speciescategories.toLowerCase();
    if (['mammals', 'birds', 'reptiles', 'amphibians', 'invertebrates', 'fish'].includes(categoryTable)) {
      insertIntoCategoryTable(categoryTable, (err) => {
        if (err) {
          console.error('Error inserting into category table:', err);
          return res.status(500).json({ message: 'Database error', error: err });
        }

        // Handle conservation status
        const conservationTables = {
          'critical endangered': 'critically_endangered',
          'endangered': 'endangered',
          'vulnerable': 'vulnerable',
          'near threatened': 'near_threatened',
          'least concern': 'least_concern'
        };

        const conservationTable = conservationTables[conservationstatus.toLowerCase()];
        if (conservationTable) {
          insertIntoConservationTable(conservationTable, (err) => {
            if (err) {
              console.error(`Error inserting into ${conservationTable}:`, err);
              return res.status(500).json({ message: 'Database error', error: err });
            }
            res.status(200).json({ message: `Species added successfully to ${categoryTable} and ${conservationTable}` });
          });
        } else {
          res.status(200).json({ message: `Species added successfully to ${categoryTable}` });
        }
      });
    } else {
      res.status(400).json({ message: 'Invalid species category' });
    }
  });
});


/// Serve static files from 'uploads/images' directory
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));

// Endpoint to get species list
app.get('/listspecies', (req, res) => {
  const sql = "SELECT * FROM listspecies";
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

// Endpoint to handle file upload
app.post('/uploads', upload.single('image'), (req, res) => {
  if (!req.file) return res.json({ Message: "No file uploaded" });

  const image = req.file.filename;
  const id = req.body.id;

  const sql = "UPDATE listspecies SET uploadimage = ? WHERE id = ?";
  db.query(sql, [image, id], (err, result) => {
    if (err) return res.json({ Message: "Error updating image" });
    return res.json({ Status: "Success" });
  });
});

 // Create mammals table endpoint
 app.get("/mammal", (req, res) => {
   const sql  = "SELECT *  FROM mammals";
   db.query(sql, (err, data) => {
    if(err) return res.json("Error");
    return res.json(data);
   })
  
  })
 
  // Create birds table endpoint
 app.get("/bird", (req, res) => {
   const sql  = "SELECT *  FROM birds";
   db.query(sql, (err, data) => {
    if(err) return res.json("Error");
    return res.json(data);
   })
  
  })
 
   // Create reptile table endpoint
 app.get("/reptile", (req, res) => {
   const sql  = "SELECT *  FROM reptiles";
   db.query(sql, (err, data) => {
    if(err) return res.json("Error");
    return res.json(data);
   })
  })
 
  // Create amphibians table endpoint
  app.get("/amphibian", (req, res) => {
   const sql  = "SELECT *  FROM amphibians";
   db.query(sql, (err, data) => {
    if(err) return res.json("Error");
    return res.json(data);
   })
  })
 
  // Create invertebrates table endpoint
  app.get("/invertebrate", (req, res) => {
   const sql  = "SELECT *  FROM invertebrates";
   db.query(sql, (err, data) => {
    if(err) return res.json("Error");
    return res.json(data);
   })
  })
 
  // Create fish table endpoint
  app.get("/fish", (req, res) => {
   const sql  = "SELECT *  FROM fish";
   db.query(sql, (err, data) => {
    if(err) return res.json("Error");
    return res.json(data);
   })
  })

  // Create critically endengered table endpoint
  app.get("/critically-endengered", (req, res) => {
    const sql  = "SELECT *  FROM critically_endengered";
    db.query(sql, (err, data) => {
     if(err) return res.json("Error");
     return res.json(data);
    })
   })

   // Create endengered table endpoint
  app.get("/endengered", (req, res) => {
    const sql  = "SELECT *  FROM endangered";
    db.query(sql, (err, data) => {
     if(err) return res.json("Error");
     return res.json(data);
    })
   })

   // Create vulnerable table endpoint
  app.get("/vulnerable", (req, res) => {
    const sql  = "SELECT *  FROM vulnerable";
    db.query(sql, (err, data) => {
     if(err) return res.json("Error");
     return res.json(data);
    })
   })

   // Create Near threatend table endpoint
  app.get("/near-threatend", (req, res) => {
    const sql  = "SELECT *  FROM near_threatened";
    db.query(sql, (err, data) => {
     if(err) return res.json("Error");
     return res.json(data);
    })
   })
 
   // Create Least Concern table endpoint
  app.get("/least-concern", (req, res) => {
    const sql  = "SELECT *  FROM least_concern";
    db.query(sql, (err, data) => {
     if(err) return res.json("Error");
     return res.json(data);
    })
   })
 
  // Define the endpoint to get species count
 app.get('/countSpecies', (req, res) => {
   const sql = 'SELECT COUNT(*) AS totalSpecies FROM listspecies';
   db.query(sql, (err, results) => {
     if (err) {
       console.error('Database query error:', err);
       return res.status(500).json({ error: 'Database query failed' });
     }
     res.json(results[0]); // Send the count as JSON
   });
 });
 
 // Define the endpoint to get mammals count
 app.get('/countmammals', (req, res) => {
   const sql = 'SELECT COUNT(*) AS count FROM mammals';
   db.query(sql, (err, results) => {
     if (err) {
       console.error('Database query error:', err);
       return res.status(500).json({ error: 'Database query failed' });
     }
     res.json(results[0]); // Send the count as JSON
   });
 });
 
 // Define the endpoint to get birds count
 app.get('/countbirds', (req, res) => {
   const sql = 'SELECT COUNT(*) AS count FROM birds';
   db.query(sql, (err, results) => {
     if (err) {
       console.error('Database query error:', err);
       return res.status(500).json({ error: 'Database query failed' });
     }
     res.json(results[0]); // Send the count as JSON
   });
 });
 
 // Define the endpoint to get reptiles count
 app.get('/countReptiles', (req, res) => {
   const sql = 'SELECT COUNT(*) AS count FROM reptiles';
   db.query(sql, (err, results) => {
     if (err) {
       console.error('Database query error:', err);
       return res.status(500).json({ error: 'Database query failed' });
     }
     res.json(results[0]); // Send the count as JSON
   });
 });
 
 // Define the endpoint to get amphibians count
 app.get('/countamphibians', (req, res) => {
   const sql = 'SELECT COUNT(*) AS count FROM amphibians';
   db.query(sql, (err, results) => {
     if (err) {
       console.error('Database query error:', err);
       return res.status(500).json({ error: 'Database query failed' });
     }
     res.json(results[0]); // Send the count as JSON
   });
 });
 
 // Define the endpoint to get invertebrates count
 app.get('/countinvertebrates', (req, res) => {
   const sql = 'SELECT COUNT(*) AS count FROM invertebrates';
   db.query(sql, (err, results) => {
     if (err) {
       console.error('Database query error:', err);
       return res.status(500).json({ error: 'Database query failed' });
     }
     res.json(results[0]); // Send the count as JSON
   });
 });
 
 // Define the endpoint to get invertebrates count
 app.get('/countfish', (req, res) => {
   const sql = 'SELECT COUNT(*) AS count FROM fish';
   db.query(sql, (err, results) => {
     if (err) {
       console.error('Database query error:', err);
       return res.status(500).json({ error: 'Database query failed' });
     }
     res.json(results[0]); // Send the count as JSON
   });
 });
 
 // Define the endpoint to get species counts for each category in bar graph
 app.get('/speciesCounts', (req, res) => {
   const queries = [
     'SELECT COUNT(*) AS count FROM mammals',
     'SELECT COUNT(*) AS count FROM birds',
     'SELECT COUNT(*) AS count FROM reptiles',
     'SELECT COUNT(*) AS count FROM amphibians',
     'SELECT COUNT(*) AS count FROM invertebrates',
     'SELECT COUNT(*) AS count FROM fish'
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
         fish: counts[5],
       });
     })
     .catch(err => {
       console.error('Error fetching species counts:', err);
       res.status(500).json({ error: 'Failed to fetch species counts' });
     });
 });
 

 // Route to get the count of each conservation status
app.get('/api/conservation-status-count', (req, res) => {
  const tables = [
    'critically_endengered',
    'endangered',
    'vulnerable',
    'near_threatened',
    'least_concern'
  ];

  const queries = tables.map(table => `SELECT ' ${table} ' AS conservationstatus, COUNT(*) AS count FROM ${table}`);
  const combinedQuery = queries.join(' UNION ALL ');

  db.query(combinedQuery, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json(results);
  });
});

//Update species
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
    date,
    conservationeffort,
    speciescategories,
    description
  } = req.body;

  const uploadimage = req.file ? `/uploads/images/${req.file.filename}` : null;

  const validCategories = ['mammals', 'birds', 'reptiles', 'amphibians', 'invertebrates', 'fish'];
  const categoryTable = validCategories.includes(speciescategories.toLowerCase()) ? speciescategories.toLowerCase() : null;

  if (!categoryTable) {
    return res.status(400).json({ error: 'Invalid species category' });
  }

  // Begin transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ error: 'Transaction error' });
    }

    // Update listspecies table
    const updateListsSpeciesQuery = `
      UPDATE listspecies SET
        specificname = ?, 
        scientificname = ?, 
        commonname = ?, 
        habitat = ?, 
        population = ?, 
        location = ?, 
        conservationstatus = ?, 
        threats = ?, 
        date = ?,
        conservationeffort = ?, 
        speciescategories = ?, 
        description = ?,
        uploadimage = COALESCE(?, uploadimage)
      WHERE id = ?
    `;

    db.query(updateListsSpeciesQuery, [
      specificname,
      scientificname,
      commonname,
      habitat,
      population,
      location,
      conservationstatus,
      threats,
      date,
      conservationeffort,
      speciescategories,
      description,
      uploadimage,
      req.params.id
    ], (err) => {
      if (err) {
        console.error('Error updating listspecies:', err);
        return db.rollback(() => res.status(500).json({ error: 'Database error' }));
      }

      // Update the relevant category table
      const updateCategoryTableQuery = `
        UPDATE ${db.escapeId(categoryTable)} SET
          specificname = ?, 
          scientificname = ?, 
          commonname = ?, 
          habitat = ?, 
          population = ?, 
          location = ?, 
          conservationstatus = ?, 
          threats = ?, 
          date = ?,
          conservationeffort = ?, 
          description = ?,
          uploadimage = COALESCE(?, uploadimage)
        WHERE id = ?
      `;

      db.query(updateCategoryTableQuery, [
        specificname,
        scientificname,
        commonname,
        habitat,
        population,
        location,
        conservationstatus,
        threats,
        date,
        conservationeffort,
        description,
        uploadimage,
        req.params.id
      ], (err) => {
        if (err) {
          console.error(`Error updating ${categoryTable} table:`, err);
          return db.rollback(() => res.status(500).json({ error: 'Database error' }));
        }

        db.commit((err) => {
          if (err) {
            console.error('Error committing transaction:', err);
            return db.rollback(() => res.status(500).json({ error: 'Transaction error' }));
          }
          res.json({ message: 'Species updated successfully' });
        });
      });
    });
  });
});

//Update species
app.get('/edit/:id',  (req,res) => {
  const sql ="SELECT * FROM listspecies WHERE id = ?";
  const id = req.params.id;
  db.query(sql,[id], (err,result) => {
    if (err) return res.json({Error: err});
    return res.json(result)
  })
})

// Delete species route
app.delete('/delete-species/:id', (req, res) => {
  const speciesId = req.params.id;

  // Query to find the species category before deletion
  const findSpeciesQuery = `
    SELECT speciescategories FROM listspecies WHERE id = ?
  `;

  db.query(findSpeciesQuery, [speciesId], (err, result) => {
    if (err) {
      return res.status(500).send('Error finding species category');
    }

    // If species found
    if (result.length > 0) {
      const speciesCategory = result[0].speciescategories;

      // Query to delete species from the listspecies table
      const deleteSpeciesQuery = `DELETE FROM listspecies WHERE id = ?`;
      
      db.query(deleteSpeciesQuery, [speciesId], (err, result) => {
        if (err) {
          return res.status(500).send('Error deleting species');
        }

        // If species category is mammals, delete from the mammals table as well
        if (speciesCategory === 'mammals') {
          const deleteMammalsQuery = `DELETE FROM mammals WHERE id = ?`;

          db.query(deleteMammalsQuery, [speciesId], (err, result) => {
            if (err) {
              return res.status(500).send('Error deleting from mammals table');
            }
            return res.send('Species and related mammals data deleted successfully');
          });
        } else {
          return res.send('Species deleted successfully');
        }
      });
    } else {
      return res.status(404).send('Species not found');
    }
  });
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
})

