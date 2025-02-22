const { ForbiddenError } = require("../utils/errors");

const authorize = (Model, action) => {
  return async (req, res, next) => {
    // ✅ 1. Récupération du record (s'il y a un `req.params.id`)
    const record = req.params.id ? await Model.findById(req.params.id) : null;

    // ✅ 2. Chargement de la Policy (erreur naturelle si inexistante)
    const PolicyClass = require(`../policies/${Model.modelName.toLowerCase()}_policy`);

    // ✅ 3. Vérification de l'autorisation via la Policy (erreur naturelle si action non définie)
    const policy = new PolicyClass(req.user, record);

    if (!policy[action]()) {
      return next(new ForbiddenError()); // 🔥 Erreur 403
    }

    next(); // 🎯 Tout est validé, on passe à l'action suivante
  };
};

module.exports = authorize;
