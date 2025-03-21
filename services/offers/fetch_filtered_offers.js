const Offer = require("../../models/Offer");
const { buildFilters, buildSortOptions } = require("./filters");
const {
  offerTransactionAggregation,
  offerOwnerAggregation,
} = require("./aggregation");
const { getPage, getLimit } = require("../../utils/pagination_helpers");

const fetchFilteredOffers = async (query) => {
  const filters = buildFilters(query);
  const sortQuery = buildSortOptions(query.sort);

  // ✅ Utilisation directe des helpers pour `page` et `limit`
  const page = getPage(query);
  const limit = getLimit(query);

  const offers = await Offer.aggregate([
    ...offerTransactionAggregation,
    ...offerOwnerAggregation,
    { $match: filters },
    { $sort: sortQuery },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ]);

  return offers;
};

module.exports = fetchFilteredOffers;
