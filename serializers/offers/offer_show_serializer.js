const BaseOfferSerializer = require("./base_offer_serializer");

class OfferShowSerializer extends BaseOfferSerializer {
  serialize() {
    const serialized = super.serialize();
    serialized.is_pending =
      !!this.offer.transaction && this.offer.transaction.status !== "succeeded";

    delete serialized.transaction;

    return serialized;
  }
}

module.exports = OfferShowSerializer;
