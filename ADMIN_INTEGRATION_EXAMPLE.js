/**
 * Exemple d'intégration du système admin Délicissime
 * À ajouter à assets/js/main.js
 */

// Configuration globale
let adminConfig = {
  colors: {},
  images: {},
  content: {}
};

/**
 * Charge la configuration admin et applique les changements au site
 */
async function loadAdminConfig() {
  try {
    const response = await fetch("/api/content/config");
    if (!response.ok) throw new Error("Impossible de charger la config");

    adminConfig = await response.json();

    // Appliquer les couleurs
    applyColors();

    // Appliquer les images
    applyImages();

    // Appliquer le contenu
    applyContent();

  } catch (error) {
    console.warn("Admin config non disponible:", error.message);
  }
}

/**
 * Applique les couleurs CSS dynamiquement
 */
function applyColors() {
  if (!adminConfig.colors || Object.keys(adminConfig.colors).length === 0) {
    return;
  }

  const root = document.documentElement;

  if (adminConfig.colors.primary) {
    root.style.setProperty("--primary", adminConfig.colors.primary);
  }

  if (adminConfig.colors.accent) {
    root.style.setProperty("--accent", adminConfig.colors.accent);
  }

  if (adminConfig.colors.background) {
    root.style.setProperty("--background", adminConfig.colors.background);
  }

  console.log("✓ Couleurs appliquées");
}

/**
 * Applique les images dynamiquement
 */
function applyImages() {
  if (!adminConfig.images || Object.keys(adminConfig.images).length === 0) {
    return;
  }

  const imageMap = {
    hero: "hero-image",
    contact: "contact-image",
    gallery: "gallery-image"
  };

  for (const [configKey, elementId] of Object.entries(imageMap)) {
    if (adminConfig.images[configKey]) {
      const element = document.getElementById(elementId);
      if (element) {
        element.src = adminConfig.images[configKey];
        console.log(`✓ Image ${configKey} mise à jour`);
      }
    }
  }
}

/**
 * Applique le contenu dynamiquement
 */
function applyContent() {
  if (!adminConfig.content || Object.keys(adminConfig.content).length === 0) {
    return;
  }

  const contentMap = {
    title: "site-title",
    tagline: "site-tagline",
    about: "about-text"
  };

  for (const [configKey, elementId] of Object.entries(contentMap)) {
    if (adminConfig.content[configKey]) {
      const element = document.getElementById(elementId);
      if (element) {
        element.textContent = adminConfig.content[configKey];
        console.log(`✓ Contenu ${configKey} mis à jour`);
      }
    }
  }
}

/**
 * Recharge la config tous les X millisecondes
 * Utile pour avoir les changements en temps quasi-réel
 */
function enableLiveUpdates(interval = 30000) {
  setInterval(() => {
    loadAdminConfig();
  }, interval);
}

/**
 * Point d'entrée - À appeler au chargement de la page
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Chargement de la configuration admin...");
  loadAdminConfig();

  // Optionnel: mettre à jour la config toutes les 30 secondes
  // enableLiveUpdates(30000);
});

// Export pour utilisation dans d'autres modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    loadAdminConfig,
    applyColors,
    applyImages,
    applyContent,
    enableLiveUpdates
  };
}
