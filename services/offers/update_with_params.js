const { uploadImage, deleteImage } = require("../../utils/cloudinary");
const formatOffer = require("../../utils/format_offer");
const { mapProductDetails } = require("../../utils/offer_helpers");
const { mergeProductDetails } = require("../../utils/product_helpers");

const updateWithParams = async (offer, filteredBody, req) => {
  const mappedDetails = mapProductDetails(filteredBody);
  const pictureUploadErrorMessage = null;

  if (mappedDetails.length > 0) {
    offer.productDetails = mergeProductDetails(
      offer.productDetails,
      mappedDetails
    );
  }

  if (filteredBody.title) offer.productName = filteredBody.title;
  if (filteredBody.description)
    offer.productDescription = filteredBody.description;
  if (filteredBody.price) offer.productPrice = filteredBody.price;

  if (req.files?.picture) {
    if (offer.productImage?.public_id) {
      await deleteImage(offer.productImage.public_id);
    }
    try {
      offer.productImage = await uploadImage(
        req.files.picture,
        `vinted/offers/${offer._id}`
      );
    } catch (error) {
      pictureUploadErrorMessage = error.message;
    }
  }

  await offer.save();
  const response = formatOffer(offer);
  if (pictureUploadErrorMessage)
    response.picture_upload_error = pictureUploadErrorMessage;

  return response;
};

module.exports = updateWithParams;
