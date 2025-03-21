const { snakeCaseKeys } = require("../../utils/format");
const Offer = require("../../models/Offer");

class BaseOfferSerializer {
  constructor(offer) {
    this.offer = offer;
  }

  // ✅ Supprime les champs indésirables de l'offre
  cleanOffer() {
    const fieldsToRemove = ["v", "created_at", "updated_at"];
    fieldsToRemove.forEach((field) => delete this.offer[field]);
  }

  serialize() {
    this.offer = {
      ...snakeCaseKeys(this.offer),
      product_details: this.formatProductDetails(),
      owner: this.formatOwner(),
      status: Offer.status(this.offer.transaction?.status),
    };
    this.cleanOffer();
    return this.offer;
  }

  formatProductDetails() {
    return this.offer.productDetails.reduce((acc, detail) => {
      acc[detail.key] = detail.value;
      return acc;
    }, {});
  }

  formatOwner() {
    const owner = this.offer.owner;
    return owner
      ? {
          id: owner._id,
          owner: { username: owner.account.username },
        }
      : null;
  }
}

module.exports = BaseOfferSerializer;
