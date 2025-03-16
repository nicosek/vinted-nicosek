const BasePolicy = require("./base_policy");

class OfferPolicy extends BasePolicy {
  update() {
    return this.isOwner();
  }

  delete() {
    return this.update();
  }
}

module.exports = OfferPolicy;
