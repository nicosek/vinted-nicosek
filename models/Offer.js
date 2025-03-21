const mongoose = require("mongoose");
const { baseSchemaOptions } = require("./base_schema");

const OfferSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    productDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    productPrice: {
      type: Number,
      required: true,
      min: 0,
      max: 100_000,
    },
    productDetails: [
      {
        key: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true },
      },
      { _id: false },
    ],
    productImage: {
      type: Object,
      default: {},
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transaction: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }, // ✅ Active les virtuals dans les JSON
  baseSchemaOptions
);

OfferSchema.statics.status = function (transactionStatus) {
  return transactionStatus === "succeeded" ? "sold" : "available";
};

const Offer = mongoose.model("Offer", OfferSchema);
module.exports = Offer;
