const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user_controller");
const isAuthenticated = require("../middlewares/is_authenticated");
const asyncHandler = require("../middlewares/async_handler");

// ✅ Show - GET /users/:id
router.get("/:id", asyncHandler(UserController.show));
router.get("/", asyncHandler(UserController.index));

module.exports = router;
