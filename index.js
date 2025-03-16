const express = require("express");
const errorHandler = require("./middlewares/error-handler");
const { NotFoundError } = require("./utils/errors");
const UserController = require("./controllers/user_controller");
const asyncHandler = require("./middlewares/async_handler");
const connectToDatabase = require("./config/database");
const cors = require("cors");

// Import des routes
const userRoutes = require("./routes/user");
const offerRoutes = require("./routes/offer");

// Création de l'application Express
const app = express();
app.use(express.json());
app.use(cors());

// Gestion des routes
app.use("/users", userRoutes);
app.post("/user/signup", asyncHandler(UserController.signup));
app.post("/user/login", asyncHandler(UserController.login));

app.use("/offers", offerRoutes);

// Gestion des routes inconnues avec `NotFoundError`
app.all("*", (req, res, next) => {
  next(new NotFoundError("This route does not exist"));
});

// Middleware global de gestion des erreurs (Doit être après les routes)
app.use(errorHandler);

// ✅ Fonction pour démarrer le serveur
const startServer = async () => {
  await connectToDatabase(); // 📌 Assurer que MongoDB est prêt

  try {
    app.listen(process.env.PORT, () => {
      console.log("🚀 Server started on port", process.env.PORT);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1); // ⛔ Stopper l'application en cas d'échec
  }
};

// 🔥 Lancer le serveur
startServer();
