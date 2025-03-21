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
      transactionStatus: { $arrayElemAt: ["$transactionData.status", 0] },
    },
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
];

module.exports = {
  offerTransactionAggregation,
  offerOwnerAggregation,
};
