import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

console.log("✓ Environment loaded");
console.log("✓ RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("✓ RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET?.substring(0, 5) + "...");

const app = express();
app.use(cors());
app.use(express.json());

console.log("✓ Middleware configured");

// Test route
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Backend is running" });
});

// Import payment routes
try {
  import("./routes/payment.js").then(module => {
    const paymentRoutes = module.default;
    app.use("/payment", paymentRoutes);
    console.log("✓ Payment routes loaded");
  }).catch(err => {
    console.error("✗ Error loading payment routes:", err.message);
  });
} catch (err) {
  console.error("✗ Error importing payment routes:", err.message);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server listening on port ${PORT}`);
  console.log(`✓ Test: http://127.0.0.1:${PORT}/`);
  console.log(`✓ Create order: POST http://127.0.0.1:${PORT}/payment/create-order`);
});
