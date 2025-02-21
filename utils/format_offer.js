const { snakeCaseKeys } = require("../utils/format");

const formatOffer = (offer) => {
  const formattedOffer = offer.toObject(); // Convertit en objet JS natif

  // 🔄 Transformation des `product_details` en objet `{ key: value }`
  const formattedDetails = formattedOffer.productDetails.reduce(
    (acc, detail) => {
      acc[detail.key] = detail.value;
      return acc;
    },
    {}
  );

  return {
    ...snakeCaseKeys(formattedOffer),
    product_details: formattedDetails,
  };
};

module.exports = formatOffer;
