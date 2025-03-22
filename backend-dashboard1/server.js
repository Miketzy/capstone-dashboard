import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import pool from "./config/db.js"; 
import loginRoutes from "../../routes/login-routes/LoginRoutes.js";



dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 8080; // ✅ Using PORT from .env

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Database Keep-Alive ✅ Fixed pool instead of client
setInterval(() => {
  pool.query("SELECT 1", (err, results) => {
    if (err) console.error("Database Keep-Alive error:", err);
    else console.log("✅ Database is alive");
  });
}, 5 * 60 * 1000);

// Register Protected Routes
app.use("/login", loginRoutes); // ✅ Adjust path if necessary

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
