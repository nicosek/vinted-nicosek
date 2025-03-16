class BasePolicy {
  constructor(user, record) {
    this.user = user;
    this.record = record;
  }

  isOwner() {
    return (
      this.user &&
      this.record &&
      this.user._id.toString() === this.record.owner.toString()
    );
  }
}

module.exports = BasePolicy;
