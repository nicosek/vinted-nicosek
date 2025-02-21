const cloudinary = require("../config/cloudinary");

const uploadImage = async (file, folder) => {
  if (!file || !file.tempFilePath) {
    throw new Error("No file provided or invalid file path");
  }

  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder,
      use_filename: true, // Utilise le nom du fichier comme `public_id`
    });

    return result;
  } catch (error) {
    console.error("⚠️ Cloudinary upload failed:", error.message);
    throw new Error(error.message);
  }
};

const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("❌ Error deleting image from Cloudinary:", error);
  }
};

module.exports = { uploadImage, deleteImage };
