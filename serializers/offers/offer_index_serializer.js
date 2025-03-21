const BaseOfferSerializer = require("./base_offer_serializer");

class OfferIndexSerializer extends BaseOfferSerializer {
  serialize() {
    const serialized = super.serialize();
    serialized.status = this.determineStatus();

    delete serialized.transaction;
    delete serialized.transaction_status;

    return serialized;
  }

  determineStatus() {
    return this.offer.transactionStatus === "succeeded" ? "sold" : "available";
  }
}

module.exports = OfferIndexSerializer;
