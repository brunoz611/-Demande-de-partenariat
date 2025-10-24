const SITE_CUSTOMIZATION_KEY = "siteCustomization.v1";
const SITE_CUSTOMIZATION_DEFAULTS = Object.freeze({
  colors: {
    primary: "#ff6b35",
    primaryDark: "#e35d2d",
    secondary: "#2f4858",
    accent: "#ffbc42",
    background: "#fffdf8",
    text: "#2c2c2c",
    muted: "#5f6c7b"
  },
  fonts: {
    base: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    heading: '"Playfair Display", "Times New Roman", serif'
  },
  logo: {
    text: "Magali & Ghislain",
    alt: "Magali & Ghislain",
    image: ""
  }
});

const mergeCustomizationSettings = (settings = {}) => {
  const result = {
    colors: { ...SITE_CUSTOMIZATION_DEFAULTS.colors },
    fonts: { ...SITE_CUSTOMIZATION_DEFAULTS.fonts },
    logo: { ...SITE_CUSTOMIZATION_DEFAULTS.logo }
  };

  if (settings && typeof settings === "object") {
    if (settings.colors && typeof settings.colors === "object") {
      Object.entries(settings.colors).forEach(([key, value]) => {
        if (key in result.colors && typeof value === "string" && value.trim()) {
          result.colors[key] = value.trim();
        }
      });
    }
    if (settings.fonts && typeof settings.fonts === "object") {
      Object.entries(settings.fonts).forEach(([key, value]) => {
        if (key in result.fonts && typeof value === "string" && value.trim()) {
          result.fonts[key] = value.trim();
        }
      });
    }
    if (settings.logo && typeof settings.logo === "object") {
      if (typeof settings.logo.text === "string") {
        result.logo.text = settings.logo.text;
      }
      if (typeof settings.logo.alt === "string" && settings.logo.alt.trim()) {
        result.logo.alt = settings.logo.alt.trim();
      }
      if (typeof settings.logo.image === "string") {
        result.logo.image = settings.logo.image;
      }
    }
  }

  return result;
};

const readStoredCustomization = () => {
  try {
    const raw = localStorage.getItem(SITE_CUSTOMIZATION_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    console.warn("Impossible de lire les pr\u00E9f\u00E9rences de personnalisation :", error);
    return {};
  }
};

const deriveDarkerColor = (hex) => {
  if (typeof hex !== "string") return hex;
  const cleaned = hex.trim();
  const match = /^#?([0-9a-f]{6})$/i.exec(cleaned);
  if (!match) return cleaned;
  const value = parseInt(match[1], 16);
  const factor = 0.85;
  const r = Math.max(0, Math.min(255, Math.round(((value >> 16) & 0xff) * factor)));
  const g = Math.max(0, Math.min(255, Math.round(((value >> 8) & 0xff) * factor)));
  const b = Math.max(0, Math.min(255, Math.round((value & 0xff) * factor)));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
    .toString(16)
    .padStart(2, "0")}`;
};

const applyCustomizationToDom = (settings) => {
  const resolved = mergeCustomizationSettings(
    settings === undefined ? readStoredCustomization() : settings
  );

  const root = document.documentElement;
  const { colors, fonts, logo } = resolved;

  try {
    root.style.setProperty("--color-primary", colors.primary);
    root.style.setProperty(
      "--color-primary-dark",
      colors.primaryDark || deriveDarkerColor(colors.primary)
    );
    root.style.setProperty("--color-secondary", colors.secondary);
    root.style.setProperty("--color-accent", colors.accent);
    root.style.setProperty("--color-bg", colors.background);
    root.style.setProperty("--color-text", colors.text);
    root.style.setProperty("--color-muted", colors.muted);
    root.style.setProperty("--font-base", fonts.base);
    root.style.setProperty("--font-heading", fonts.heading);
  } catch (error) {
    console.warn("Impossible d'appliquer les couleurs personnalis\u00E9es :", error);
  }

  document.querySelectorAll(".logo").forEach((logoElement) => {
    if (!(logoElement instanceof HTMLElement)) return;
    if (!logoElement.dataset.defaultText) {
      logoElement.dataset.defaultText = logoElement.textContent
        ? logoElement.textContent.trim()
        : SITE_CUSTOMIZATION_DEFAULTS.logo.text;
    }
    const defaultText =
      logoElement.dataset.defaultText || SITE_CUSTOMIZATION_DEFAULTS.logo.text;
    const displayText =
      typeof logo.text === "string" && logo.text.trim() ? logo.text.trim() : defaultText;
    const imageSource = typeof logo.image === "string" && logo.image ? logo.image : "";
    const imageAlt =
      typeof logo.alt === "string" && logo.alt.trim() ? logo.alt.trim() : displayText;

    if (imageSource) {
      logoElement.classList.add("has-image");
      logoElement.innerHTML = "";
      const img = document.createElement("img");
      img.className = "logo-image";
      img.src = imageSource;
      img.alt = imageAlt || displayText || defaultText;
      logoElement.appendChild(img);

      if (displayText) {
        const span = document.createElement("span");
        span.className = "logo-text";
        span.textContent = displayText;
        logoElement.appendChild(span);
      }
    } else {
      logoElement.classList.remove("has-image");
      logoElement.textContent = displayText || defaultText;
    }
  });

  return resolved;
};

const saveCustomizationSettings = (settings) => {
  const prepared = mergeCustomizationSettings(settings);
  try {
    localStorage.setItem(SITE_CUSTOMIZATION_KEY, JSON.stringify(prepared));
  } catch (error) {
    console.warn("Impossible d'enregistrer les pr\u00E9f\u00E9rences de personnalisation :", error);
  }
  return applyCustomizationToDom(prepared);
};

const resetCustomizationSettings = () => {
  try {
    localStorage.removeItem(SITE_CUSTOMIZATION_KEY);
  } catch (error) {
    console.warn("Impossible de r\u00E9initialiser les pr\u00E9f\u00E9rences de personnalisation :", error);
  }
  return applyCustomizationToDom(SITE_CUSTOMIZATION_DEFAULTS);
};

const getCustomizationSettings = () => mergeCustomizationSettings(readStoredCustomization());

window.siteCustomization = window.siteCustomization || {};
Object.assign(window.siteCustomization, {
  key: SITE_CUSTOMIZATION_KEY,
  defaultSettings: SITE_CUSTOMIZATION_DEFAULTS,
  getSettings: getCustomizationSettings,
  mergeWithDefaults: mergeCustomizationSettings,
  applySettings: applyCustomizationToDom,
  saveSettings: saveCustomizationSettings,
  resetSettings: resetCustomizationSettings,
  readStoredSettings: readStoredCustomization
});

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  applyCustomizationToDom();

  // Navigation burger toggle for mobile
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      siteNav.classList.toggle("open");
    });

    // Close navigation when clicking a link (mobile)
    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        siteNav.classList.remove("open");
      });
    });
  }

  // Current year in footer
  const yearSpan = document.querySelector(".current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Cookie banner management
  const cookieBanner = document.querySelector(".cookie-banner");
  const consentKey = "cookieConsent";
  if (cookieBanner) {
    const storedConsent = localStorage.getItem(consentKey);
    if (!storedConsent) {
      cookieBanner.classList.add("visible");
    }

    cookieBanner.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const action = target.dataset.cookieAction;
      if (!action) return;

      if (action === "accept") {
        localStorage.setItem(consentKey, "accepted");
        cookieBanner.classList.remove("visible");
      } else if (action === "preferences") {
        alert("Espace préférences à personnaliser (RGPD) avant mise en production.");
      }
    });
  }

  const cookieResetButton = document.querySelector("[data-cookie-reset]");
  if (cookieResetButton) {
    cookieResetButton.addEventListener("click", () => {
      localStorage.removeItem(consentKey);
      alert("Vos préférences cookies ont été réinitialisées.");
      if (cookieBanner) {
        cookieBanner.classList.add("visible");
      }
    });
  }

  // Newsletter modal interactions
  const newsletterModal = document.querySelector(".newsletter-modal");
  let closeNewsletterModal = null;
  if (newsletterModal) {
    newsletterModal.setAttribute("tabindex", "-1");
    const openButtons = document.querySelectorAll("[data-open-newsletter]");
    const closeButton = newsletterModal.querySelector("[data-close-newsletter]");
    const focusableSelectors = [
      "a[href]",
      "button:not([disabled])",
      "textarea:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      '[tabindex]:not([tabindex="-1"])'
    ];

    const trapFocus = (event) => {
      if (event.key !== "Tab") return;
      const focusableElements = newsletterModal.querySelectorAll(focusableSelectors.join(", "));
      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      } else {
        trapFocus(event);
      }
    };

    const openModal = () => {
      if (!newsletterModal.hasAttribute("hidden")) return;
      newsletterModal.removeAttribute("hidden");
      body.classList.add("no-scroll");
      const firstInput = newsletterModal.querySelector("input, button, select, textarea");
      setTimeout(() => {
        (firstInput instanceof HTMLElement ? firstInput : newsletterModal).focus();
      }, 10);
      document.addEventListener("keydown", handleKeyDown);
    };

    const closeModal = () => {
      if (newsletterModal.hasAttribute("hidden")) return;
      newsletterModal.setAttribute("hidden", "");
      body.classList.remove("no-scroll");
      document.removeEventListener("keydown", handleKeyDown);
    };

    closeNewsletterModal = closeModal;

    openButtons.forEach((button) => {
      button.addEventListener("click", () => {
        openModal();
      });
    });

    if (closeButton) {
      closeButton.addEventListener("click", () => {
        closeModal();
      });
    }

    newsletterModal.addEventListener("click", (event) => {
      if (event.target === newsletterModal) {
        closeModal();
      }
    });
  }

  // Gallery rendering from external data file
  const galleryContainer = document.querySelector("[data-gallery]");
  if (galleryContainer) {
    const emptyMessage = document.querySelector(".gallery-empty");
    const galleryItems = Array.isArray(window.galleryData) ? window.galleryData : [];

    if (!galleryItems.length) {
      if (emptyMessage) {
        emptyMessage.hidden = false;
      }
    } else {
      galleryItems.forEach((item) => {
        const figure = document.createElement("figure");
        figure.className = "gallery-item";

        if (item.image) {
          const img = document.createElement("img");
          img.src = item.image;
          img.alt = item.title || "Photo de la galerie";
          figure.appendChild(img);
        } else {
          const placeholder = document.createElement("div");
          placeholder.className = "image-placeholder";
          placeholder.textContent = "Image manquante";
          figure.appendChild(placeholder);
        }

        const caption = document.createElement("figcaption");
        caption.textContent = item.description || item.title || "Visuel de la galerie";
        figure.appendChild(caption);

        galleryContainer.appendChild(figure);
      });
    }
  }

  // Simple form handling (placeholder until back-end integration)
  const forms = document.querySelectorAll("form[data-form]");
  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        // Trigger native validation UI
        form.reportValidity();
        event.preventDefault();
        return;
      }

      event.preventDefault();
      const formType = form.dataset.form;
      if (formType === "newsletter") {
        alert("Merci ! Vous recevrez bientôt le plat de la semaine.");
        form.reset();
        if (typeof closeNewsletterModal === "function") {
          closeNewsletterModal();
        }
      } else if (formType === "contact") {
        alert("Merci pour votre message ! Nous reviendrons vers vous sous 48h ouvrées.");
        form.reset();
      }
    });
  });
});
