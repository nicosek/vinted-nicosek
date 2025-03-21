const mongoose = require("mongoose");
const { baseSchemaOptions } = require("./base_schema");

const TransactionSchema = new mongoose.Schema(
  {
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: { type: Number, required: true },
    paymentIntentId: { type: String, required: true }, // ID Stripe
    clientSecret: { type: String, required: true }, // Secret à renvoyer au front
    paymentMethod: { type: String, default: null }, // Visa, Mastercard...
    receiptUrl: { type: String, default: null }, // Lien du reçu Stripe
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "canceled"],
      required: true,
      default: "pending",
    },
  },
  baseSchemaOptions
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
