import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("✓ App initialized");
console.log("✓ RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);

app.get("/", (req, res) => {
  console.log("✓ GET / called");
  res.json({ status: "OK", message: "Server is running" });
});

app.post("/payment/create-order", (req, res) => {
  console.log("✓ POST /payment/create-order called");
  console.log("  Body:", req.body);
  res.json({ 
    id: "order_test_123",
    amount: req.body.amount * 100,
    currency: req.body.currency,
    status: "created"
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`✓ Server listening on port ${PORT}`);
  console.log(`✓ Try: http://127.0.0.1:${PORT}/`);
});

server.on('error', (err) => {
  console.error("Server error:", err);
});

process.on('uncaughtException', (err) => {
  console.error("Uncaught exception:", err);
});
