const mongoose = require("mongoose");
const { baseSchemaOptions } = require("./base_schema");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    account: {
      username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
      },
      avatar: {
        type: Object, // Peut être précisé avec un sous-schema si besoin
        default: {},
      },
    },
    newsletter: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      sparse: true,
      unique: true,
    },
    hash: {
      type: String,
      required: true,
      select: false, // 🔥 Empêche d'afficher ce champ par défaut dans les requêtes
    },
    salt: {
      type: String,
      required: true,
      select: false,
    },
  },
  baseSchemaOptions
);

// Création du modèle User
const User = mongoose.model("User", UserSchema);
module.exports = User;
