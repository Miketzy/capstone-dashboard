import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import pool from "./src/config/db.js";  // ✅ May "src/"
import corsConfig from "./src/config/corsConfig.js"; // ✅ Import CORS config
import loginRoutes from "./src/routes/LoginRoutes.js";  // ✅ May "src/"
import { registerUser } from "./src/controller/RegisterController.js";





dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 8080; // ✅ Using PORT from .env

// Middleware
app.use(express.json());
app.use(corsConfig); // ✅ Apply CORS config
app.use(cookieParser());

// Database Keep-Alive ✅ Fixed pool instead of client
setInterval(() => {
  pool.query("SELECT 1", (err, results) => {
    if (err) console.error("Database Keep-Alive error:", err);
    else console.log("✅ Database is alive");
  });
}, 5 * 60 * 1000);

// Login Protected Routes
app.use("/api-login", loginRoutes); // ✅ Adjust path if necessary

// Register Protected Routes
app.use("/api-register", registerUser); // ✅ Adjust path if necessary

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
