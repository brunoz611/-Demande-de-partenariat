document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

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
