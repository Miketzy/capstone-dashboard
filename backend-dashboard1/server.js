import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import path from "path";
import multer from "multer";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import fs from "fs";
import nodemailer from "nodemailer";
import crypto from "crypto"; // For OTP generation
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv"; // ES module syntax
import pkg from 'pg';

dotenv.config(); // Load environment variables from .env

// Determine the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const server = http.createServer(app);

app.use(
  cors({
    origin: "https://davor-bioexplorer-admin.vercel.app", // Allow requests from this origin
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"], // Allow these methods
    credentials: true, // Allow cookies, if needed
  })
);

const { Pool } = pkg;
const pool = new Pool({
  connectionString: "postgresql://reposatory:71YyyVsRMV2544ho7UjtQcGw3UcHXUSg@dpg-cvemttd2ng1s73ci1oag-a.oregon-postgres.render.com/reposatory",
  ssl: { rejectUnauthorized: false }, // Required for cloud databases like Render
});

// Database Keep-Alive - Make sure the database connection remains active
setInterval(() => {
  pool.query("SELECT 1", (err, results) => {
    if (err) console.error("Database Keep-Alive error:", err);
    else console.log("✅ Database is alive");
  });
}, 5 * 60 * 1000); // Keeps the connection alive every 5 minutes



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
