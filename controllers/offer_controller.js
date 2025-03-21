const Offer = require("../models/Offer");
const { deleteImage } = require("../utils/cloudinary");
const formatOffer = require("../utils/format_offer");
const _ = require("lodash");
const { NotFoundError, ForbiddenError } = require("../utils/errors");
const createWithParams = require("../services/offers/create_with_params");
const updateWithParams = require("../services/offers/update_with_params");
const fetchFilteredOffers = require("../services/offers/fetch_filtered_offers");
const initiatePaymentForOffer = require("../services/payments/initiate_payment_for_offer");
const OfferIndexSerializer = require("../serializers/offers/offer_index_serializer");
const OfferShowSerializer = require("../serializers/offers/offer_show_serializer");
const OfferPaginate = require("../services/pagination/offer_paginate");

// Champs envoyés par le front
const allowedFieldsForCreate = [
  "title",
  "description",
  "price",
  "condition",
  "city",
  "brand",
  "size",
  "color",
];

const allowedFieldsForUpdate = allowedFieldsForCreate;

const OfferController = {
  // ** Create (POST /offers)**
  create: async (req, res) => {
    const filteredBody = _.pick(req.body, allowedFieldsForCreate);
    const response = await createWithParams(filteredBody, req);
    res.status(201).json(response);
  },

  // ** Index (GET /offers)**
  index: async (req, res) => {
    const offers = await fetchFilteredOffers(req.query);
    const paginationData = await new OfferPaginate(offers, req.query).call();

    res.status(200).json({
      ...paginationData,
      offers: offers.map((offer) =>
        new OfferIndexSerializer(offer).serialize()
      ),
    });
  },

  // ** Delete (DELETE /offers/:id)**
  delete: async (req, res) => {
    const offer = await Offer.findById(req.params.id);
    if (!offer) throw new NotFoundError(null, { modelName: "Offer" });
    if (!offer.owner.equals(req.user._id)) {
      throw new ForbiddenError("You are not allowed to modify this offer");
    }

    // 📌 Vérifier si une image est associée et la supprimer
    if (offer.productImage && offer.productImage.public_id) {
      deleteImage(offer.productImage.public_id);
    }

    // 📌 Supprimer l'offre en DB après suppression de l'image
    await Offer.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Offer deleted successfully" });
  },

  // **🔍 Show (GET /offers/:id)**
  show: async (req, res) => {
    const offer = await Offer.findById(req.params.id)
      .populate("owner", "account.username account.avatar _id")
      .populate("transaction", "status");

    if (!offer) throw new NotFoundError(null, { modelName: "Offer" });

    res.status(200).json(new OfferShowSerializer(offer).serialize());
  },

  // ** Update (PUT /offers/:id)**
  update: async (req, res) => {
    const offer = await Offer.findById(req.params.id);
    if (!offer) throw new NotFoundError("Offer");
    if (!offer.owner.equals(req.user._id)) {
      throw new ForbiddenError("You are not allowed to modify this offer");
    }

    const filteredBody = _.pick(req.body, allowedFieldsForUpdate);
    const response = await updateWithParams(offer, filteredBody, req);
    res.status(200).json(response);
  },

  initiatePayment: async (req, res) => {
    const response = await initiatePaymentForOffer(req.params.id, req.user._id);
    res.json(response);
  },
};

module.exports = OfferController;
