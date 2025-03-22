import cors from "cors";

const corsConfig = cors({
  origin: "https://davor-bioexplorer-admin.vercel.app", // ✅ Allowed frontend URL
  methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"], // ✅ Allowed methods
  credentials: true, // ✅ Allow cookies & credentials
});

export default corsConfig;
