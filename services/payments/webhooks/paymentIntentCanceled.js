const Transaction = require("../../../models/Transaction");
const Offer = require("../../../models/Offer");

const paymentIntentCanceled = async (paymentIntent, messageWrapper) => {
  const paymentIntentId = paymentIntent.id;
  const transaction = await Transaction.findOne({ paymentIntentId });

  if (!transaction) {
    console.warn(
      `⚠️ Aucune transaction trouvée pour PaymentIntent ID: ${paymentIntentId}.`
    );
    messageWrapper.value = `⚠️ Aucune transaction trouvée pour PaymentIntent ID: ${paymentIntentId}. Webhook traité sans action`;
    return;
  }

  // 📌 Récupérer l’offre associée et la rendre disponible
  const offer = await Offer.findOne({ transaction: transaction._id });
  if (offer) {
    offer.transaction = null;
    await offer.save();
  }

  transaction.status = "canceled";
  await transaction.save();
};

module.exports = paymentIntentCanceled;
