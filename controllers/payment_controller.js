const {
  chargeSucceeded,
  chargeFailed,
  paymentIntentCanceled,
} = require("../services/payments/webhooks");

const PaymentController = {
  handleWebhook: async (req, res, next) => {
    try {
      const event = req.body;

      if (!event.type || !event.data) {
        return res.status(400).json({ message: "Événement Stripe invalide" });
      }

      const messageWrapper = { value: "Webhook traité avec succès" };

      // 📌 Gestion explicite des différents types d'événements Stripe
      switch (event.type) {
        case "charge.succeeded":
          await chargeSucceeded(event.data.object, messageWrapper);
          break;

        case "charge.failed":
          await chargeFailed(event.data.object, messageWrapper);
          break;

        case "payment_intent.canceled":
          await paymentIntentCanceled(event.data.object, messageWrapper);
          break;

        case "payment_intent.payment_failed":
          console.warn(
            `⚠️ Tentative échouée, mais un autre moyen de paiement peut être tenté : ${event.data.object.id}`
          );
          break;

        default:
          console.warn(`⚠️ Webhook non géré : ${event.type}`);
      }

      res.status(200).json({ message: messageWrapper.value }); // ✅ On retourne `messageWrapper.value`
    } catch (err) {
      console.error("🚨 Erreur dans handleWebhook :", err);
      next(err);
    }
  },
};

module.exports = PaymentController;
