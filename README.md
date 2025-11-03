# Projet Site Vitrine – Traiteur & Ateliers de cuisine

Ce dossier contient la base du site vitrine responsive destiné à l'entreprise de Magali et Ghislain Chamonard.

## Structure prévue

- `index.html` – Accueil, présentation du duo fondateur et de leur univers gourmand.
- `activite-pro-ateliers.html` – Ateliers de cuisine participatifs pour entreprises.
- `activite-pro-traiteur.html` – Offres traiteur / cocktail.
- `activite-particulier-plats.html` - Plat de la semaine avec inscription newsletter « plat de la semaine ».
- `activite-particulier-evenements.html` – Événements Sport & Cocktail healthy.
- `galerie.html` – Galerie photo alimentée depuis un fichier de données.
- `contact.html` – Formulaire de contact (nom, prénom, email, téléphone, activités, message).
- `mentions-legales.html`, `politique-confidentialite.html`, `gestion-cookies.html` – Pages légales à compléter.
- `assets/css/style.css` – Feuille de style globale.
- `assets/js/main.js` – Scripts d’interaction (menu, cookies, formulaires, galerie).
- `assets/js/gallery-data.js` – Liste des photos affichées dans la galerie.
- `assets/images/` – Espace pour vos visuels libres de droits.

## Points clés en place

- Navigation cohérente et réutilisable sur toutes les pages.
- Footer avec mentions légales, politique de confidentialité, gestion des cookies.
- Design responsive (mobile, tablette, desktop) et menu burger.
- Popup newsletter sur la page Plat de la semaine.
- Meta-données SEO de base (title, description, Open Graph).
- Bannière cookies avec stockage du consentement dans `localStorage`.
- Galerie générée dynamiquement à partir de `assets/js/gallery-data.js`.

## Personnalisation rapide

- Remplacez les textes d’introduction par votre storytelling dans chaque `<section>`.
- Ajoutez vos photos dans `assets/images` puis mettez à jour `assets/js/gallery-data.js` (chemin du fichier, titre, description) pour alimenter automatiquement la galerie.
- Complétez les pages `mentions-legales.html`, `politique-confidentialite.html` et `gestion-cookies.html` avec vos informations officielles (raison sociale, SIRET, hébergeur, etc.).
- Dans `assets/js/main.js`, le formulaire de contact envoie désormais les données vers l’API `/api/contact` qui transmet un email via Nodemailer (SMTP). Les formulaires newsletter utilisent toujours un message d’alerte.
- Ajoutez vos identifiants de réseaux sociaux dans le header/footer si besoin.
- Remplacez l’URL `https://www.votredomaine.fr/` et l’image Open Graph dans `index.html`.

## Envoi d'e-mails

Le formulaire de contact s’appuie sur l’API `/api/contact` qui utilise Nodemailer et un relais SMTP.

1. Copiez `api/.env.example` vers `api/.env`.
2. Renseignez vos identifiants SMTP : `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` (et éventuellement `SMTP_SECURE`, `SMTP_FROM`, `CONTACT_RECIPIENT`).
3. Déployez en exposant les mêmes variables d’environnement sur votre hébergeur (Vercel → Project Settings → Environment Variables).
4. Après installation (`npm install`), vous pouvez tester en local avec `vercel dev` ou tout autre runner serverless compatible.

## SEO & RGPD

- Chaque page possède un `<title>` et une `meta description` à personnaliser avec vos mots-clés.
- Ajoutez des balises Open Graph / Twitter supplémentaires selon vos réseaux.
- La bannière cookies mémorise un consentement minimal. Branchez-la sur votre CMP (Axeptio, Tarteaucitron…) avant mise en ligne.
- Conservez la preuve des consentements newsletter (export CSV, logs).
- Générez un `sitemap.xml` et soumettez-le à Google Search Console une fois le site hébergé.

## Vers une intégration WordPress

1. Créez vos Custom Post Types (ex. `activites`, `galerie`) ou utilisez des pages classiques avec un constructeur.
2. Reprenez la navigation et les sections dans des blocs (Gutenberg, ACF Blocks, Elementor…).
3. Transformez la feuille de style en thème enfant (`style.css`, `header.php`, `footer.php`, `page-accueil.php`, etc.).
4. Utilisez un plugin de formulaires (Gravity Forms, Contact Form 7) relié à votre CRM / outil newsletter.
5. Installez une extension RGPD pour gérer la bannière cookies et les consentements.
