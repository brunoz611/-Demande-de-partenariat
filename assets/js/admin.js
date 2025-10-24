document.addEventListener("DOMContentLoaded", () => {
  const customization = window.siteCustomization;
  if (!customization) {
    console.warn("La personnalisation du site n'est pas disponible.");
    return;
  }

  const customizationForm = document.querySelector("[data-admin-form]");
  const resetButton = document.querySelector('[data-admin-action="reset"]');
  const clearLogoButton = document.querySelector('[data-admin-action="clear-logo"]');
  const feedback = document.querySelector("[data-admin-feedback]");
  const logoPreview = document.querySelector("[data-logo-preview]");
  const logoFileInput = customizationForm
    ? customizationForm.querySelector('input[name="logo-file"]')
    : null;

  let logoImageData = "";

  const showFeedback = (message = "", state = "info") => {
    if (!feedback) return;
    if (!message) {
      feedback.hidden = true;
      feedback.textContent = "";
      feedback.dataset.state = "";
      return;
    }
    feedback.hidden = false;
    feedback.textContent = message;
    feedback.dataset.state = state;
  };

  const updateLogoPreview = () => {
    if (!logoPreview) return;
    if (logoImageData) {
      logoPreview.src = logoImageData;
      logoPreview.hidden = false;
    } else {
      logoPreview.src = "";
      logoPreview.hidden = true;
    }
  };

  const populateForm = () => {
    if (!customizationForm) return;
    const settings = customization.getSettings();
    const { colors, fonts, logo } = settings;

    const assignValue = (selector, value) => {
      const field = customizationForm.querySelector(selector);
      if (field) {
        field.value = value ?? "";
      }
    };

    assignValue('input[name="color-primary"]', colors.primary);
    assignValue('input[name="color-secondary"]', colors.secondary);
    assignValue('input[name="color-accent"]', colors.accent);
    assignValue('input[name="color-background"]', colors.background);
    assignValue('input[name="color-text"]', colors.text);
    assignValue('input[name="color-muted"]', colors.muted);
    assignValue('input[name="font-base"]', fonts.base);
    assignValue('input[name="font-heading"]', fonts.heading);
    assignValue('input[name="logo-text"]', logo.text ?? "");
    assignValue('input[name="logo-alt"]', logo.alt ?? "");

    logoImageData = typeof logo.image === "string" ? logo.image : "";
    if (logoFileInput) {
      logoFileInput.value = "";
    }
    updateLogoPreview();
  };

  const extractColors = (formData) => ({
    primary: String(formData.get("color-primary") || "").trim(),
    secondary: String(formData.get("color-secondary") || "").trim(),
    accent: String(formData.get("color-accent") || "").trim(),
    background: String(formData.get("color-background") || "").trim(),
    text: String(formData.get("color-text") || "").trim(),
    muted: String(formData.get("color-muted") || "").trim()
  });

  const extractFonts = (formData) => ({
    base: String(formData.get("font-base") || "").trim(),
    heading: String(formData.get("font-heading") || "").trim()
  });

  const handleCustomizationSubmit = (event) => {
    event.preventDefault();
    if (!customizationForm) return;
    const formData = new FormData(customizationForm);

    const nextSettings = {
      colors: extractColors(formData),
      fonts: extractFonts(formData),
      logo: {
        text: String(formData.get("logo-text") || ""),
        alt: String(formData.get("logo-alt") || ""),
        image: logoImageData
      }
    };

    customization.saveSettings(nextSettings);
    showFeedback("Param\u00E8tres enregistr\u00E9s et appliqu\u00E9s.", "success");
  };

  const handleLogoFileChange = (event) => {
    const input = event.currentTarget;
    if (!(input instanceof HTMLInputElement) || !input.files || !input.files.length) {
      return;
    }
    const file = input.files[0];
    if (!file.type.startsWith("image/")) {
      showFeedback("Veuillez s\u00E9lectionner un fichier image (PNG, JPG, SVG...).", "error");
      input.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        logoImageData = result;
        updateLogoPreview();
        showFeedback("Logo import\u00E9 avec succ\u00E8s.", "success");
      }
    };
    reader.onerror = () => {
      showFeedback("Impossible de lire le fichier s\u00E9lectionn\u00E9.", "error");
    };
    reader.readAsDataURL(file);
  };

  const handleClearLogo = () => {
    logoImageData = "";
    if (logoFileInput) {
      logoFileInput.value = "";
    }
    updateLogoPreview();
    showFeedback("Logo supprim\u00E9. Le texte sera affich\u00E9.", "info");
  };

  const handleReset = () => {
    const defaults = customization.resetSettings();
    logoImageData = defaults.logo.image;
    populateForm();
    showFeedback("Param\u00E8tres r\u00E9initialis\u00E9s.", "success");
  };

  if (!customizationForm) {
    showFeedback("Formulaire introuvable.", "error");
    return;
  }

  customizationForm.addEventListener("submit", handleCustomizationSubmit);

  if (logoFileInput) {
    logoFileInput.addEventListener("change", handleLogoFileChange);
  }

  if (clearLogoButton) {
    clearLogoButton.addEventListener("click", handleClearLogo);
  }

  if (resetButton) {
    resetButton.addEventListener("click", handleReset);
  }

  populateForm();
  showFeedback("Param\u00E8tres charg\u00E9s. Vous pouvez personnaliser le site.", "success");
});
