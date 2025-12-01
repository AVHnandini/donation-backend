const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get environment variables
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_5Fy7UkEjIgAlZ8";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "your_secret";

// Razorpay instance
const Razorpay = require("razorpay");
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
});

// Routes
app.get("/", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Donation Platform API (Firebase Cloud Functions)",
    timestamp: new Date().toISOString()
  });
});

// Create order
app.post("/payment/create-order", async (req, res) => {
  try {
    const { amount, currency } = req.body;
    
    if (!amount || !currency) {
      return res.status(400).json({ error: "Amount and currency required" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: currency,
      receipt: `receipt_${Date.now()}`
    });

    res.json(order);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Verify payment
app.post("/payment/verify", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment details" });
    }

    const crypto = require("crypto");
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.json({ 
        success: true, 
        message: "Payment verified",
        payment_id: razorpay_payment_id 
      });
    } else {
      res.status(400).json({ error: "Invalid signature" });
    }
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Export as Cloud Function
exports.api = functions.https.onRequest(app);
