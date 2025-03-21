const express = require("express");
const PaymentController = require("../controllers/payment_controller");
const asyncHandler = require("../middlewares/async_handler");

const router = express.Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  asyncHandler(PaymentController.handleWebhook)
);

module.exports = router;
