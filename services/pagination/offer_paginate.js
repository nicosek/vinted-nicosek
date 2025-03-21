const BasePaginate = require("./base_paginate");
const Offer = require("../../models/Offer");
const { offerTransactionAggregation } = require("../offers/aggregation");

class OfferPaginate extends BasePaginate {
  constructor(data, query) {
    super(Offer, data, query);
  }

  async getTotal() {
    return await Offer.aggregate([
      ...offerTransactionAggregation,
      { $match: this.filters },
      { $count: "total" },
    ]).then((res) => (res.length > 0 ? res[0].total : 0));
  }
}

module.exports = OfferPaginate;
