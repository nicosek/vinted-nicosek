const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Offer = require("../../models/Offer");
const Transaction = require("../../models/Transaction");
const { ConflictError, BadRequestError } = require("../../utils/errors");

const initiatePaymentForOffer = async (offerId, buyerId) => {
  const offer = await Offer.findById(offerId).populate("transaction");

  if (!offer) {
    throw new NotFoundError("Offre non trouvée.");
  }

  // 📌 Vérification si l'offre est déjà vendue
  if (offer.transaction && offer.transaction.status === "succeeded") {
    throw new BadRequestError("Cette offre a déjà été vendue.");
  }

  // 📌 Vérification si l'offre est en cours d'achat
  if (offer.transaction) {
    throw new ConflictError("Cette offre est déjà en cours d'achat.");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: offer.productPrice * 100,
    currency: "eur",
    description: `Achat de ${offer.productName}`,
  });

  const transaction = await Transaction.create({
    offer: offer._id,
    buyer: buyerId,
    price: offer.productPrice,
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
  });

  await Offer.findByIdAndUpdate(offerId, { transaction: transaction._id });

  return { clientSecret: paymentIntent.client_secret };
};

module.exports = initiatePaymentForOffer;
