require("dotenv").config(); // Charger les variables d'environnement
const mongoose = require("mongoose");
const connectToDatabase = require("../config/database");
const Offer = require("../models/Offer");
const User = require("../models/User"); // ✅ Import du modèle User
const sampleOffers = require("../data/sample_offers");

const seedDatabase = async () => {
  try {
    console.log("🔥 Lancement du script seed...");

    await connectToDatabase(); // ✅ Connexion à MongoDB

    // 🔍 Récupération d'un utilisateur existant pour associer les offres
    const user = await User.findOne();
    if (!user) {
      throw new Error(
        "❌ Aucun utilisateur trouvé en base. Impossible de créer des offres."
      );
    }

    console.log(`👤 Utilisateur trouvé : ${user._id}`);

    // 🛠️ Associer chaque offre au même utilisateur
    const offersToInsert = sampleOffers.map((offer) => ({
      ...offer,
      owner: user._id, // ✅ Association au premier utilisateur trouvé
    }));

    console.log(`📋 Ajout de ${offersToInsert.length} nouvelles offres...`);

    await Offer.insertMany(offersToInsert);
    console.log("✅ Seed terminé avec succès !");

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors du seed :", error);
    process.exit(1);
  }
};

seedDatabase();
