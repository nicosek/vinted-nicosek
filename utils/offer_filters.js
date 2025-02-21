// 📌 Valeurs par défaut pour la pagination
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

// 🔎 Génère les filtres MongoDB
const buildFilters = ({ title, priceMin, priceMax }) => {
  const filters = {};
  if (title) filters.productName = new RegExp(title, "i");
  if (priceMin) filters.productPrice = { $gte: Number(priceMin) };
  if (priceMax)
    filters.productPrice = { ...filters.productPrice, $lte: Number(priceMax) };
  return filters;
};

// 🔄 Génère les options de tri MongoDB
const buildSortOptions = (sort) => {
  if (sort === "price-desc") return { productPrice: -1 };
  if (sort === "price-asc") return { productPrice: 1 };
  return {};
};

// 📊 Calcule les paramètres de pagination
const getPaginationParams = (page, limit) => {
  const resultsPerPage = Math.max(
    1,
    Math.min(parseInt(limit) || DEFAULT_LIMIT, MAX_LIMIT)
  );
  const currentPage = Math.max(1, parseInt(page) || DEFAULT_PAGE);
  const skip = (currentPage - 1) * resultsPerPage;
  return { resultsPerPage, currentPage, skip };
};

module.exports = { buildFilters, buildSortOptions, getPaginationParams };
