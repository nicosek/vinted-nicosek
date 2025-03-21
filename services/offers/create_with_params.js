const Offer = require("../../models/Offer");
const { uploadImage } = require("../../utils/cloudinary");
const { mapProductDetails } = require("../../utils/offer_helpers");
const OfferShowSerializer = require("../../serializers/offers/offer_show_serializer");

const createWithParams = async (filteredBody, req) => {
  // On crée l'offer sans l'image à partir des infos du body filtrées par le controller
  const offerData = {
    productName: filteredBody.title,
    productDescription: filteredBody.description,
    productPrice: filteredBody.price,
    productDetails: mapProductDetails(filteredBody),
    owner: req.user._id,
  };

  const newOffer = await Offer.create(offerData);

  // On uploade l'image sur cloudinary s'il y en a une dans la requête et on la stocke dans le document
  let uploadedImage = null;
  let pictureUploadErrorMessage = null;

  if (req.files?.picture) {
    try {
      uploadedImage = await uploadImage(
        req.files.picture,
        `vinted/offers/${newOffer._id}`
      );
      await Offer.findByIdAndUpdate(newOffer._id, {
        productImage: uploadedImage,
      });
    } catch (error) {
      // Pas besoin de lever une erreur, on stocke l'erreur pour la mettre plus tard dans la response
      pictureUploadErrorMessage = error.message;
    }
  }

  // On formate une réponse json à retourner
  const populatedOffer = await Offer.findById(newOffer._id)
    .populate("owner", "account.username account.avatar _id")
    .select("-__v");

  const response = new OfferShowSerializer(populatedOffer).serialize();
  if (pictureUploadErrorMessage)
    response.picture_upload_error = pictureUploadErrorMessage;

  return response;
};

module.exports = createWithParams;
