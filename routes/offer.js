const express = require("express");
const router = express.Router();
const OfferController = require("../controllers/offer_controller");
const isAuthenticated = require("../middlewares/is_authenticated");
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
  fileUpload,
  asyncHandler(OfferController.update)
);
router.delete("/:id", isAuthenticated, asyncHandler(OfferController.delete));

module.exports = router;
