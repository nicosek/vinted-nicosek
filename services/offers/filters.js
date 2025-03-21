const buildFilters = ({ title, priceMin, priceMax, status }) => {
  const filters = {};
  if (title) filters.productName = new RegExp(title, "i");
  if (priceMin) filters.productPrice = { $gte: Number(priceMin) };
  if (priceMax)
    filters.productPrice = { ...filters.productPrice, $lte: Number(priceMax) };
  if (status) {
    if (status === "available") {
      filters.$or = [
        { transaction: null }, // ✅ Cas où l'offre n'a jamais eu de transaction
        { "transaction.status": { $ne: "succeeded" } }, // ✅ Cas où la transaction existe mais n'est pas "succeeded"
      ];
    } else if (status === "sold") {
      filters["transaction.status"] = "succeeded";
    }
  }

  return filters;
};

const buildSortOptions = (sort) => {
  if (!sort) return { createdAt: -1 };
  const sortFields = {
    "price-asc": { productPrice: 1 },
    "price-desc": { productPrice: -1 },
    "date-asc": { createdAt: 1 },
    "date-desc": { createdAt: -1 },
  };
  return sortFields[sort] || { createdAt: -1 };
};

module.exports = { buildFilters, buildSortOptions };
