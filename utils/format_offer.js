const { snakeCaseKeys } = require("../utils/format");

const formatOffer = (offer) => {
  // 🔄 Transformation des `product_details` en objet `{ key: value }`
  const formattedDetails = offer.productDetails.reduce((acc, detail) => {
    acc[detail.key] = detail.value;
    return acc;
  }, {});

  // 🔥 Définition du champ `status`
  const status = offer.transactionStatus
    ? offer.transactionStatus === "succeeded"
      ? "sold"
      : "available"
    : "unknown";

  // ❌ Supprime les champs inutiles
  delete offer.transaction;
  delete offer.transactionStatus;

  return {
    ...snakeCaseKeys(offer),
    product_details: formattedDetails,
    status, // ✅ Ajoute `status` directement
  };
};

module.exports = formatOffer;
