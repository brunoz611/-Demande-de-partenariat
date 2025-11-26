const express = require("express");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password123";

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

// POST /api/auth/login - Connexion
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Identifiant ou mot de passe manquant" });
    }

    // Vérifier les identifiants
    if (username !== ADMIN_USER) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    // Vérifier le mot de passe (comparaison simple ou bcrypt)
    const isPasswordValid = password === ADMIN_PASSWORD;

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { username, role: "admin" },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      ok: true,
      token,
      user: { username, role: "admin" }
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET /api/auth/verify - Vérifier le token
router.get("/verify", verifyToken, (req, res) => {
  res.json({
    ok: true,
    user: req.user
  });
});

// POST /api/auth/logout - Déconnexion (côté client)
router.post("/logout", verifyToken, (req, res) => {
  // La déconnexion se fait côté client en supprimant le token du localStorage
  res.json({ ok: true, message: "Déconnexion réussie" });
});

module.exports = router;
