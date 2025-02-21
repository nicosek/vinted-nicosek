const { DuplicateKeyError, BadRequestError } = require("./errors");

const MONGO_ERROR_MAP = {
  ValidationError: BadRequestError, // 📌 Erreur de validation Mongoose
  CastError: BadRequestError, // Ajout pour gérer les IDs malformés
  11000: DuplicateKeyError, // 📌 Contrainte d'unicité MongoDB
};

module.exports = { MONGO_ERROR_MAP };
