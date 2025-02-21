const Offer = require("../../models/Offer");
const formatOffer = require("../../utils/format_offer");
const {
  buildFilters,
  buildSortOptions,
  getPaginationParams,
} = require("../../utils/offer_filters");

const fetchFiltered = async (query) => {
  const filters = buildFilters(query);
  const sortQuery = buildSortOptions(query.sort);
  const { resultsPerPage, currentPage, skip } = getPaginationParams(
    query.page,
    query.limit
  );

  // Exécuter `find()` et `countDocuments()` en parallèle
  const [offers, totalOffers] = await Promise.all([
    Offer.find(filters)
      .populate("owner", "account.username account.avatar _id")
      .sort(sortQuery)
      .skip(skip)
      .limit(resultsPerPage)
      .select("-__v -createdAt -updatedAt"),
    Offer.countDocuments(filters),
  ]);

  return {
    total: totalOffers,
    count: offers.length,
    page: currentPage,
    totalPages: Math.ceil(totalOffers / resultsPerPage),
    offers: offers.map(formatOffer), // Convertit les modèles Mongoose en objets JS purs
  };
};

module.exports = fetchFiltered;
