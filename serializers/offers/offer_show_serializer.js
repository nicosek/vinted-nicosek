const BaseOfferSerializer = require("./base_offer_serializer");

class OfferShowSerializer extends BaseOfferSerializer {
  serialize() {
    const serialized = super.serialize();
    serialized.status = this.determineStatus();
    serialized.is_pending =
      this.offer.transaction && this.offer.transaction.status !== "succeeded";

    delete serialized.transaction;

    return serialized;
  }

  determineStatus() {
    return this.offer.transaction?.status === "succeeded"
      ? "sold"
      : "available";
  }
}

module.exports = OfferShowSerializer;
