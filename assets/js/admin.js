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

  if (!customizationForm) {
    if (feedback) {
      feedback.hidden = false;
      feedback.textContent = "Formulaire introuvable.";
      feedback.dataset.state = "error";
    }
    return;
  }

  const colorInputs = Array.from(customizationForm.querySelectorAll("[data-color-field]"));
  const fontInputs = Array.from(customizationForm.querySelectorAll("[data-font-field]"));
  const logoInputs = Array.from(customizationForm.querySelectorAll("[data-logo-field]"));

  let draftSettings = customization.mergeWithDefaults(customization.getSettings());

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

  const indicatePreviewUpdated = () => {
    showFeedback("Aperçu mis à jour (non enregistré).", "info");
  };

  const getLogoImage = () =>
    draftSettings.logo && typeof draftSettings.logo.image === "string"
      ? draftSettings.logo.image
      : "";

  const updateLogoPreview = () => {
    if (!logoPreview) return;
    const image = getLogoImage();
    if (image) {
      logoPreview.src = image;
      logoPreview.hidden = false;
    } else {
      logoPreview.src = "";
      logoPreview.hidden = true;
    }
  };

  const updateColorPreview = (key, value) => {
    const preview = customizationForm.querySelector(`[data-color-preview="${key}"]`);
    if (preview instanceof HTMLElement) {
      preview.style.setProperty("--swatch-color", value || "transparent");
    }
    const valueLabel = customizationForm.querySelector(`[data-color-value="${key}"]`);
    if (valueLabel) {
      valueLabel.textContent = value ? value.toUpperCase() : "N/A";
    }
  };

  const applyDraftSettings = () => {
    customization.applySettings(draftSettings);
  };

  const populateForm = () => {
    draftSettings = customization.mergeWithDefaults(customization.getSettings());
    const { colors, fonts, logo } = draftSettings;

    colorInputs.forEach((input) => {
      const key = input.dataset.colorField;
      const value = colors[key] || input.value || "#000000";
      input.value = value;
      updateColorPreview(key, value);
    });

    fontInputs.forEach((input) => {
      const key = input.dataset.fontField;
      input.value = fonts[key] || "";
    });

    logoInputs.forEach((input) => {
      const key = input.dataset.logoField;
      input.value = logo[key] ?? "";
    });

    if (logoFileInput) {
      logoFileInput.value = "";
    }

    updateLogoPreview();
  };

  colorInputs.forEach((input) => {
    const key = input.dataset.colorField;
    input.addEventListener("input", () => {
      const value = input.value;
      draftSettings.colors[key] = value;
      updateColorPreview(key, value);
      applyDraftSettings();
    });
    input.addEventListener("change", indicatePreviewUpdated);
  });

  fontInputs.forEach((input) => {
    const key = input.dataset.fontField;
    input.addEventListener("input", () => {
      draftSettings.fonts[key] = input.value;
      applyDraftSettings();
      indicatePreviewUpdated();
    });
  });

  logoInputs.forEach((input) => {
    const key = input.dataset.logoField;
    input.addEventListener("input", () => {
      draftSettings.logo[key] = input.value;
      applyDraftSettings();
      indicatePreviewUpdated();
    });
  });

  const handleCustomizationSubmit = (event) => {
    event.preventDefault();
    const saved = customization.saveSettings(draftSettings);
    draftSettings = customization.mergeWithDefaults(saved);
    populateForm();
    showFeedback("Paramètres enregistrés et appliqués.", "success");
  };

  const handleLogoFileChange = (event) => {
    const input = event.currentTarget;
    if (!(input instanceof HTMLInputElement) || !input.files || !input.files.length) {
      return;
    }
    const file = input.files[0];
    if (!file.type.startsWith("image/")) {
      showFeedback("Veuillez sélectionner un fichier image (PNG, JPG, SVG...).", "error");
      input.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        if (!draftSettings.logo) {
          draftSettings.logo = {};
        }
        draftSettings.logo.image = result;
        updateLogoPreview();
        applyDraftSettings();
        indicatePreviewUpdated();
      }
    };
    reader.onerror = () => {
      showFeedback("Impossible de lire le fichier sélectionné.", "error");
    };
    reader.readAsDataURL(file);
  };

  const handleClearLogo = () => {
    if (!draftSettings.logo) {
      draftSettings.logo = {};
    }
    draftSettings.logo.image = "";
    updateLogoPreview();
    applyDraftSettings();
    if (logoFileInput) {
      logoFileInput.value = "";
    }
    showFeedback("Logo supprimé. Le texte sera affiché.", "info");
  };

  const handleReset = () => {
    customization.resetSettings();
    populateForm();
    applyDraftSettings();
    showFeedback("Paramètres réinitialisés.", "success");
  };

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
  showFeedback("Paramètres chargés. Vous pouvez personnaliser le site.", "success");
  applyDraftSettings();
  updateLogoPreview();
});
