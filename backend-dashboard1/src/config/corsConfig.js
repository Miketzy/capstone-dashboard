import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const corsConfig = cors({
  origin: process.env.CORS_ORIGIN,  // Use the URL from the .env file
  methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"], // Allowed methods
  credentials: true, // Allow cookies & credentials
});

export default corsConfig;
