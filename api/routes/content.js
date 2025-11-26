const express = require("express");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const CONFIG_FILE = path.join(__dirname, "../../data/admin-config.json");

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token invalide ou expiré" });
  }
};

// GET /api/content/config - Obtenir la configuration
router.get("/config", (req, res) => {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      return res.json({
        colors: {},
        images: {},
        content: {}
      });
    }
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: "Impossible de charger la configuration" });
  }
});

// POST /api/content/colors - Mettre à jour les couleurs
router.post("/colors", verifyToken, (req, res) => {
  try {
    const { colors } = req.body;

    if (!colors || typeof colors !== "object") {
      return res.status(400).json({ error: "Données de couleurs invalides" });
    }

    let config = {};
    if (fs.existsSync(CONFIG_FILE)) {
      config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
    }

    config.colors = { ...config.colors, ...colors };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));

    res.json({
      ok: true,
      message: "Couleurs mises à jour",
      colors: config.colors
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des couleurs:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /api/content/content - Mettre à jour le contenu
router.post("/content", verifyToken, (req, res) => {
  try {
    const { content } = req.body;

    if (!content || typeof content !== "object") {
      return res.status(400).json({ error: "Données de contenu invalides" });
    }

    let config = {};
    if (fs.existsSync(CONFIG_FILE)) {
      config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
    }

    config.content = { ...config.content, ...content };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));

    res.json({
      ok: true,
      message: "Contenu mis à jour",
      content: config.content
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du contenu:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /api/content/image - Mettre à jour les images (URL)
router.post("/image", verifyToken, (req, res) => {
  try {
    const { pageKey, imageUrl } = req.body;

    if (!pageKey || !imageUrl) {
      return res.status(400).json({ error: "Clé de page ou URL manquante" });
    }

    let config = {};
    if (fs.existsSync(CONFIG_FILE)) {
      config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
    }

    if (!config.images) config.images = {};
    config.images[pageKey] = imageUrl;

    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));

    res.json({
      ok: true,
      message: "Image mise à jour",
      images: config.images
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'image:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
