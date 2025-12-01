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

console.log("✓ Environment loaded");
console.log("✓ RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);

const app = express();
app.use(cors());
app.use(express.json());

console.log("✓ Middleware configured");

// Routes - import AFTER dotenv is loaded
import("./routes/payment.js")
  .then(module => {
    const paymentRoutes = module.default;
    app.use("/payment", paymentRoutes);
    console.log("✓ Payment routes loaded");
  })
  .catch(err => {
    console.error("✗ Error loading payment routes:", err.message);
  });

app.get("/", (req, res) => {
  res.json({ status: "✓ Backend server is running on port " + PORT });
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✓ Server running on http://0.0.0.0:${PORT}`);
  console.log(`✓ Test endpoint: http://localhost:${PORT}/`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`✗ Port ${PORT} is already in use. Kill the existing process and try again.`);
    process.exit(1);
  }
  throw err;
});
