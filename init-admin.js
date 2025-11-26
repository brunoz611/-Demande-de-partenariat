#!/usr/bin/env node

/**
 * Script d'initialisation du système admin Délicissime
 * Génère les variables d'environnement de base
 * Usage: node init-admin.js
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
};

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

async function init() {
  console.log("\n🎉 Initialisation du système d'administration Délicissime\n");

  const envPath = path.join(__dirname, ".env");

  if (fs.existsSync(envPath)) {
    const overwrite = await question("Le fichier .env existe déjà. Voulez-vous le remplacer? (y/n) ");
    if (overwrite.toLowerCase() !== "y") {
      console.log("❌ Annulation.");
      rl.close();
      return;
    }
  }

  const username = await question("Identifiant admin [admin]: ");
  const password = await question("Mot de passe admin: ");

  if (!username || !password) {
    console.log("❌ Identifiant et mot de passe requis.");
    rl.close();
    return;
  }

  const jwtSecret = generateSecretKey();
  const port = await question("Port du serveur [3000]: ");
  const env = await question("Environnement [development]: ");

  const envContent = `# Variables d'environnement pour Délicissime Admin
# ATTENTION: Ne pas commiter ce fichier en production!

# Serveur
PORT=${port || 3000}
NODE_ENV=${env || "development"}

# JWT Secret (TRÈS IMPORTANT: changer en production!)
JWT_SECRET=${jwtSecret}

# Authentification Admin
ADMIN_USER=${username || "admin"}
ADMIN_PASSWORD=${password}

# Email (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@delicissime.fr
CONTACT_RECIPIENT=gchamonard@yahoo.com
`;

  fs.writeFileSync(envPath, envContent);

  console.log("\n✅ Fichier .env créé avec succès!\n");
  console.log("📋 Informations de connexion:");
  console.log(`   - Utilisateur: ${username || "admin"}`);
  console.log(`   - Mot de passe: ${password}`);
  console.log("\n🔐 JWT Secret généré et sauvegardé.\n");
  console.log("💡 Prochaines étapes:");
  console.log("   1. npm install");
  console.log("   2. npm start");
  console.log("   3. Accédez à http://localhost:3000/login\n");

  rl.close();
}

init().catch(console.error);
