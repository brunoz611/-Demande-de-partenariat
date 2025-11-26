#!/bin/bash

# Checklist de vérification du système Délicissime Admin
# Exécutez ce fichier pour vérifier que tout est en place

echo ""
echo "🔍 Vérification du système Délicissime Admin..."
echo ""

# Compteur
TOTAL=0
OK=0

check_file() {
  TOTAL=$((TOTAL + 1))
  if [ -f "$1" ]; then
    echo "✅ $1"
    OK=$((OK + 1))
  else
    echo "❌ $1 (MANQUANT)"
  fi
}

check_dir() {
  TOTAL=$((TOTAL + 1))
  if [ -d "$1" ]; then
    echo "✅ $1/"
    OK=$((OK + 1))
  else
    echo "❌ $1/ (MANQUANT)"
  fi
}

echo "═══════════════════════════════════════════════════════════"
echo "FICHIERS BACKEND"
echo "═══════════════════════════════════════════════════════════"
check_file "server.js"
check_file "api/routes/auth.js"
check_file "api/routes/content.js"
check_file "api/contact.js"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "FICHIERS FRONTEND"
echo "═══════════════════════════════════════════════════════════"
check_file "login.html"
check_file "admin-dashboard.html"
check_file "ADMIN_INTEGRATION_EXAMPLE.js"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "FICHIERS DE CONFIGURATION"
echo "═══════════════════════════════════════════════════════════"
check_file "package.json"
check_file ".env.example"
check_file "vercel.json"
check_file ".gitignore"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "FICHIERS DE DOCUMENTATION"
echo "═══════════════════════════════════════════════════════════"
check_file "WELCOME.md"
check_file "QUICKSTART.md"
check_file "ADMIN_README.md"
check_file "INTEGRATION_GUIDE.md"
check_file "SYSTEM_SUMMARY.md"
check_file "CSS_VARIABLES_GUIDE.css"
check_file "CHANGELOG.md"
check_file "README.md"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "SCRIPTS UTILES"
echo "═══════════════════════════════════════════════════════════"
check_file "init-admin.js"
check_file "test-admin.js"
check_file "START.bat"
check_file "DEMO.sh"
check_file "COMMANDS.sh"
check_file "SETUP_COMPLETE.js"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "RÉPERTOIRES"
echo "═══════════════════════════════════════════════════════════"
check_dir "api/routes"
check_dir "docs"
check_dir "assets"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "RÉSULTAT: $OK/$TOTAL fichiers vérifiés"
echo "═══════════════════════════════════════════════════════════"
echo ""

if [ $OK -eq $TOTAL ]; then
  echo "✨ Tous les fichiers sont en place!"
  echo ""
  echo "🚀 Prochaines étapes:"
  echo "  1. npm install"
  echo "  2. npm run init"
  echo "  3. npm start"
  echo ""
  echo "📖 Lire WELCOME.md pour commencer"
  echo ""
else
  echo "⚠️  Il manque $((TOTAL - OK)) fichier(s)!"
  echo "Veuillez vérifier l'installation."
fi

echo ""
