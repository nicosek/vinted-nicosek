const Offer = require("../models/Offer");
const { deleteImage } = require("../utils/cloudinary");
const formatOffer = require("../utils/format_offer");
const _ = require("lodash");
const { NotFoundError, ForbiddenError } = require("../utils/errors");
const createWithParams = require("../services/offers/create_with_params");
const updateWithParams = require("../services/offers/update_with_params");
const fetchFilteredOffers = require("../services/offers/fetch_filtered_offers");

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
    const offersData = await fetchFilteredOffers(req.query);
    res.status(200).json(offersData);
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
      .select("-__v -createdAt -updatedAt");

    if (!offer) throw new NotFoundError(null, { modelName: "Offer" });

    res.status(200).json(formatOffer(offer));
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
};

module.exports = OfferController;
