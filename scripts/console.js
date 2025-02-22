#!/usr/bin/env node
require("dotenv").config();
const connectToDatabase = require("../config/database");
const path = require("path");
const fs = require("fs");
const repl = require("repl");
const mongoose = require("mongoose");

(async () => {
  try {
    // ✅ Attendre que la connexion soit établie
    await connectToDatabase();
    console.log("✅ Connexion MongoDB établie !");
    console.log("🔹 Tape await mongoose.disconnect() pour quitter proprement.");
    console.log("🔹 Utilise [Model].find() pour interroger la base.");

    // 📌 Détection automatique du dossier `models`
    const possiblePaths = ["models", "src/models"];
    let modelsPath = possiblePaths.find((p) =>
      fs.existsSync(path.join(__dirname, "..", p))
    );

    if (!modelsPath) {
      console.error("❌ Aucun dossier 'models' trouvé !");
      process.exit(1);
    }

    // 📌 Chargement dynamique des modèles Mongoose
    const models = {};
    fs.readdirSync(path.join(__dirname, "..", modelsPath))
      .filter((file) => file.endsWith(".js"))
      .forEach((file) => {
        const modelName = path.basename(file, ".js");
        models[modelName] = require(path.join(
          __dirname,
          "..",
          modelsPath,
          file
        ));
      });

    console.log("ℹ️  Modèles disponibles :", Object.keys(models).join(", "));

    // 📌 Démarrage de la console REPL avec les modèles injectés
    const replServer = repl.start("> ");
    replServer.context.mongoose = mongoose;

    Object.entries(models).forEach(([name, model]) => {
      replServer.context[name] = model;
    });

    // 🚀 Gestion propre de CTRL+C
    replServer.on("exit", async () => {
      console.log("\n🛑 Fermeture de la connexion MongoDB...");
      await mongoose.disconnect();
      console.log("✅ Déconnecté proprement.");
      process.exit(0);
    });

    // 🚀 Capture SIGINT pour éviter la répétition
    process.on("SIGINT", async () => {
      replServer.close(); // Déclenche l'événement "exit"
    });
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB :", error);
    process.exit(1);
  }
})();
