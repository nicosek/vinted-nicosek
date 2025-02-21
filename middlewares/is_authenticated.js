const asyncHandler = require("./async_handler");
const { UnauthorizedError } = require("../utils/errors");
const User = require("../models/User");

const isAuthenticated = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization)
    throw new UnauthorizedError("Unauthorized : Missing token");

  const token = req.headers.authorization.replace("Bearer ", "");
  const user = await User.findOne({ token });

  if (!user) throw new UnauthorizedError("Unauthorized : Invalid token");

  req.user = user; // 🔥 Stocke l'utilisateur dans `req.user` pour les routes protégées
  next(); // 🔥 Passe à la suite
});

module.exports = isAuthenticated;
