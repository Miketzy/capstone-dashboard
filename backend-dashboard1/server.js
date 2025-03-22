import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import client from "./src/config/db.js"; // ✅ Updated path
import loginroutes from "./src/routes/login-routes/LoginRoutes.js";


dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 8080; // ✅ Now using PORT from .env

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Database Keep-Alive
setInterval(() => {
  client.query("SELECT 1", (err, results) => {
    if (err) console.error("Database Keep-Alive error:", err);
    else console.log("✅ Database is alive");
  });
}, 5 * 60 * 1000);

// Register Protected Routes
app.use("/login", loginroutes); // ✅ Now `/protected` will use routes from protectedRoutes.js

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
