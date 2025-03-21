const offerTransactionAggregation = [
  {
    $lookup: {
      from: "transactions",
      localField: "transaction",
      foreignField: "_id",
      as: "transactionData",
    },
  },
  {
    $addFields: {
      "transaction.status": { $arrayElemAt: ["$transactionData.status", 0] },
    },
  },
  {
    $unset: "transactionData",
  },
];

const offerOwnerAggregation = [
  {
    $lookup: {
      from: "users",
      localField: "owner",
      foreignField: "_id",
      as: "ownerData",
    },
  },
  {
    $addFields: {
      owner: { $arrayElemAt: ["$ownerData", 0] },
    },
  },
  {
    $unset: "ownerData",
  },
];

module.exports = {
  offerTransactionAggregation,
  offerOwnerAggregation,
};
