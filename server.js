import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env FIRST, before importing routes
dotenv.config({
  path: path.join(__dirname, ".env"),
});

// Test ENV load
console.log("Loaded KEY:", process.env.RAZORPAY_KEY_ID);

const app = express();
app.use(cors());
app.use(express.json());

// Routes - import AFTER dotenv is loaded
import paymentRoutes from "./routes/payment.js";
app.use("/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Donation Platform Backend Running");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
