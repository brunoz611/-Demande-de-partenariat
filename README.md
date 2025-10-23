# Projet Site Vitrine – Traiteur & Ateliers de cuisine

Ce dossier contient le travail préparatoire pour créer un site vitrine responsive présentant les activités de Magali et Ghislain Chamonard.

## Structure prévue

- `index.html` – Accueil, présentation du couple fondateur et de l’univers culinaire.
- `activite-pro-ateliers.html` – Ateliers de cuisine participatifs pour entreprises.
- `activite-pro-traiteur.html` – Offres traiteur / cocktail.
- `activite-particulier-plats.html` – Plats à emporter avec inscription newsletter « plat de la semaine ».
- `activite-particulier-evenements.html` – Évènements Sport & Cocktail healthy.
- `galerie.html` – Galerie photo modulable.
- `contact.html` – Formulaire de contact (nom, prénom, email, téléphone, sélection d’activités, message).
- `assets/` – Ressources partagées (CSS, JS, images libres de droits à ajouter, polices).

## Points clés à traiter

- Navigation cohérente et réutilisable sur toutes les pages.
- Footer avec mentions légales, lien politique de confidentialité, crédits.
- Responsive design (mobile, tablette, desktop) avec menu burger.
- Popup newsletter déployée sur la page Plats à emporter.
- Meta-données SEO de base (titre, description, balises Open Graph).
- Préparation RGPD : bannière cookies (placeholder), liens vers politiques, conservation des consentements à compléter ultérieurement.
- Possibilité de migration future vers WordPress (structure de contenus, composants isolés).

## Étapes restantes

1. Mettre en place les fichiers HTML avec leur structure commune.
2. Créer la feuille de style globale (`assets/css/style.css`) et les scripts (`assets/js/main.js`).
3. Ajouter le contenu statique, les appels à l’action et les formulaires.
4. Documenter la prise en main (personnalisation, intégration WordPress, hébergement).

## Personnalisation rapide

- Remplacez les textes d’introduction par votre storytelling dans chaque section `<section>`.
- Ajoutez vos photos dans `assets/images` et substituez les `<div class="image-placeholder">` par des balises `<img src="assets/images/nom.jpg" alt="Description">`.
- Complétez les pages `mentions-legales.html`, `politique-confidentialite.html` et `gestion-cookies.html` avec vos informations juridiques.
- Dans `assets/js/main.js`, remplacez le message `alert` de la newsletter et du formulaire par l’intégration de votre outil (Brevo, Mailchimp, Formspree, Airtable, etc.).
- Ajoutez vos identifiants de réseaux sociaux dans le header/footer si besoin.

## SEO & RGPD

- Chaque page possède un `<title>` et une `meta description` à ajuster selon vos mots-clés.
- Ajoutez des balises Open Graph / Twitter si vous partagez le site : exemple dans le `<head>` de `index.html`.
- La bannière cookie mémorise un consentement minimal (`localStorage`). Connectez-la à votre CMP (axeptio, tarteaucitron…) avant mise en ligne.
- Conservez la preuve de consentement pour la newsletter (export des inscrits, logs).
- Créez un fichier `sitemap.xml` et soumettez-le à Google Search Console une fois le site hébergé.

## Vers une intégration WordPress

1. Créez les Custom Post Types (ex. `activites`, `galerie`) ou utilisez des pages classiques avec un constructeur.
2. Reprenez la structure de navigation et importez les sections dans des blocs (ACF Blocks, Gutenberg).
3. Transformez la CSS en thème enfant (ex. `theme-name/style.css`) et organisez les templates (`header.php`, `footer.php`, `page-accueil.php`, etc.).
4. Utilisez un plugin de formulaire (Gravity Forms, Contact Form 7) et un plugin newsletter connecté à votre CRM.
5. Configurez un plugin RGPD pour la bannière cookies avant publication.

