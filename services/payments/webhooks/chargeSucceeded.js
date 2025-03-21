const Transaction = require("../../../models/Transaction");

const chargeSucceeded = async (charge, messageWrapper) => {
  const paymentIntentId = charge.payment_intent;
  const transaction = await Transaction.findOne({ paymentIntentId });

  if (!transaction) {
    console.warn(
      `⚠️ Aucune transaction trouvée pour PaymentIntent ID: ${paymentIntentId}.`
    );
    messageWrapper.value = `Aucune transaction correspondante trouvée pour PaymentIntent ID: ${paymentIntentId}. Webhook traité sans action.`;
    return;
  }

  transaction.status = "succeeded";
  transaction.paymentMethod = `${
    charge.payment_method_details?.type || "unknown"
  } (${charge.payment_method_details?.card?.brand || "unknown"})`;
  transaction.receiptUrl = charge.receipt_url || transaction.receiptUrl;

  await transaction.save();
};

module.exports = chargeSucceeded;
