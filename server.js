require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
// Support pour IONOS: NODE_PORT est utilisé sur certains hébergeurs
const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Import des routes API
const authRoutes = require("./api/routes/auth");
const contentRoutes = require("./api/routes/content");

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);

// Fichier de configuration admin
const CONFIG_FILE = path.join(__dirname, "data/admin-config.json");

// Créer le dossier data s'il n'existe pas
if (!fs.existsSync(path.join(__dirname, "data"))) {
  fs.mkdirSync(path.join(__dirname, "data"), { recursive: true });
}

// Initialiser le fichier de config s'il n'existe pas
if (!fs.existsSync(CONFIG_FILE)) {
  const defaultConfig = {
    colors: {
      primary: "#667eea",
      accent: "#ff6b6b",
      background: "#ffffff"
    },
    images: {},
    content: {}
  };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
}

// Page de login
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Dashboard admin
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// Route par défaut pour servir les pages statiques
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 404 - Page non trouvée
app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err);
  res.status(500).json({ error: "Erreur serveur interne" });
});

app.listen(PORT, () => {
  console.log(`Serveur Délicissime en écoute sur http://localhost:${PORT}`);
});

