const express = require("express");
const router = express.Router();
const OfferController = require("../controllers/offer_controller");
const Offer = require("../models/Offer");
const isAuthenticated = require("../middlewares/is_authenticated");
const authorize = require("../middlewares/authorize");
const asyncHandler = require("../middlewares/async_handler");
const fileUpload = require("express-fileupload")({
  useTempFiles: true,
  tempFileDir: "/tmp/",
});

router.get("/:id", asyncHandler(OfferController.show));
router.get("/", asyncHandler(OfferController.index));
router.post(
  "/",
  isAuthenticated,
  fileUpload,
  asyncHandler(OfferController.create)
);
router.put(
  "/:id",
  isAuthenticated,
  authorize(Offer, "update"),
  fileUpload,
  asyncHandler(OfferController.update)
);
router.delete(
  "/:id",
  isAuthenticated,
  authorize(Offer, "delete"),
  asyncHandler(OfferController.delete)
);
router.post(
  "/:id/initiate_payment",
  isAuthenticated,
  asyncHandler(OfferController.initiatePayment)
);

module.exports = router;
