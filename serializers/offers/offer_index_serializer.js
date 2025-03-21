const BaseOfferSerializer = require("./base_offer_serializer");

class OfferIndexSerializer extends BaseOfferSerializer {
  serialize() {
    const serialized = super.serialize();
    delete serialized.transaction;
    return serialized;
  }
}

module.exports = OfferIndexSerializer;
