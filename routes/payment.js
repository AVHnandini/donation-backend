import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = express.Router();

// Initialize Razorpay lazily to ensure env vars are loaded
let razorpay;
function getRazorpay() {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
  return razorpay;
}

// --------------------------
// 1) CREATE ORDER
// --------------------------
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const order = await getRazorpay().orders.create({
      amount: amount * 100, // amount in paise
      currency: currency || "INR",
      payment_capture: 1
    });

    res.json(order);

  } catch (error) {
    console.log("Order Error:", error);
    res.status(500).json({ error: "Order creation failed" });
  }
});

// --------------------------
// 2) VERIFY PAYMENT SIGNATURE
// --------------------------
router.post("/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSign === razorpay_signature) {
    return res.json({ success: true, message: "Payment Verified Successfully" });
  }

  res.json({ success: false, message: "Invalid Payment Signature" });
});

export default router;
