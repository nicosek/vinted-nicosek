const _ = require("lodash");

const snakeCaseKeys = (obj, seen = new Set()) => {
  if (
    !obj ||
    typeof obj !== "object" ||
    obj instanceof Date ||
    obj instanceof Buffer
  ) {
    return obj;
  }

  // ✅ Convertir Mongoose Documents en objets JS avant transformation
  if (obj.toObject && typeof obj.toObject === "function") {
    obj = obj.toObject();
  }

  if (seen.has(obj)) {
    return obj; // Évite les références circulaires
  }
  seen.add(obj);

  if (Array.isArray(obj)) {
    return obj.map((item) => snakeCaseKeys(item, seen));
  }

  return Object.keys(obj).reduce((acc, key) => {
    const newKey = _.snakeCase(key);
    let value = obj[key];

    // ✅ Correction ultime : conversion propre des ObjectId
    if (value instanceof require("mongoose").Types.ObjectId) {
      acc[newKey] = value.toString();
    } else {
      acc[newKey] = snakeCaseKeys(value, seen);
    }

    return acc;
  }, {});
};

module.exports = { snakeCaseKeys };
