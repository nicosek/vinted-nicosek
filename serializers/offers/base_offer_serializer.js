const { snakeCaseKeys } = require("../../utils/format");

class BaseOfferSerializer {
  constructor(offer) {
    this.offer = offer;
  }

  // ✅ Supprime les champs indésirables de l'offre
  cleanOffer() {
    const fieldsToRemove = [
      "__v",
      "createdAt",
      "updatedAt",
      "transactionData",
      "ownerData",
    ];
    fieldsToRemove.forEach((field) => delete this.offer[field]);
  }

  serialize() {
    this.cleanOffer();
    return {
      ...snakeCaseKeys(this.offer),
      product_details: this.formatProductDetails(),
      owner: this.formatOwner(),
    };
  }

  formatProductDetails() {
    return this.offer.productDetails.reduce((acc, detail) => {
      acc[detail.key] = detail.value;
      return acc;
    }, {});
  }

  formatOwner() {
    return this.offer.owner
      ? {
          id: this.offer.owner._id,
          username: this.offer.owner.account.username,
        }
      : null;
  }
}

module.exports = BaseOfferSerializer;
