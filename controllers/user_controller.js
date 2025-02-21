const User = require("../models/User");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../utils/errors");
const _ = require("lodash");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

// 🎯 Définition des champs autorisés
const allowedFieldsForCreate = ["email", "newsletter", "account"];
const allowedAccountFieldsForCreate = ["username", "avatar"];

const UserController = {
  // ✅ Signup - POST /user/signup
  signup: async (req, res) => {
    // 🔥 Filtrage des données du body
    const filteredBody = _.pick(req.body, allowedFieldsForCreate);
    filteredBody.account = _.pick(
      req.body.account || {},
      allowedAccountFieldsForCreate
    );

    // Vérification du mot de passe
    if (!req.body.password) throw new BadRequestError("Password is required");

    // 🔑 Génération des données de sécurité
    const salt = uid2(16);
    const hash = SHA256(req.body.password + salt).toString(encBase64);
    const token = uid2(16);

    // 📌 Création du nouvel utilisateur avec les données filtrées + hash sécurisé
    const newUser = await User.create({
      ...filteredBody,
      salt,
      hash,
      token,
    });

    res.status(201).json({
      id: newUser._id,
      email: newUser.email,
      account: newUser.account,
      token: newUser.token, // 🔥 Retourner le token pour l'auth
    });
  },

  // ✅ Login - POST /user/login
  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new UnauthorizedError("Email and password are required");
    }

    // 🔎 Recherche de l'utilisateur
    const user = await User.findOne({ email }).select("+salt +hash");
    if (!user) throw new NotFoundError(null, { modelName: "User" });

    // 🛡️ Vérification du mot de passe
    const hash = SHA256(password + user.salt).toString(encBase64);
    if (hash !== user.hash) throw new UnauthorizedError("Invalid credentials");

    // 🔥 Générer un **nouveau** token
    const newToken = uid2(16);

    // 📌 Mettre à jour le token en base
    user.token = newToken;
    await user.save();

    // ✅ Réponse avec les données requises
    res.status(200).json({
      _id: user._id,
      token: newToken,
      account: {
        username: user.account.username,
      },
    });
  },

  // ✅ Show - GET /users/:id
  show: async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError("User");
    res.status(200).json(user);
  },

  // ✅ Index - GET /users/
  index: async (req, res) => {
    const user = await User.find().select("-token");
    res.status(200).json(user);
  },
};

module.exports = UserController;
