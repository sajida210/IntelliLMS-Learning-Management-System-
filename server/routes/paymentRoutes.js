const express = require("express");
const Razorpay = require("razorpay");
const { authMiddleware } = require("../middleware/authMiddleware");
require("dotenv").config();

const router = express.Router();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // amount in paisa
      currency: "INR",
      receipt: `dummy_receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({ order });
  } catch (error) {
    console.error("Error creating dummy payment order:", error.message);
    res.status(500).json({ message: "Failed to create dummy order" });
  }
});

module.exports = router;
