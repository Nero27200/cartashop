#!/bin/bash
# ====================================================
# CartaShop - Lanceur Application Web v2.0 Optimisee
# ====================================================
# Script de lancement pour macOS et Linux
# - Verifie les fichiers requis
# - Lance un serveur HTTP local
# - Ouvre automatiquement dans le navigateur
# ====================================================

clear
echo ""
echo "========================================"
echo "  CartaShop v2.0 - Collection Manager"
echo "========================================"
echo ""

# Configuration du port
PORT=${PORT:-8080}
if [ ! -z "$XPORT" ]; then
    PORT="8000"
fi

# === Verification des fichiers necessaires ===
echo "[*] Verification des fichiers requis..."
echo ""

FILES_OK=true

if [ ! -f "index.html" ]; then
    echo "[ERREUR] Fichier 'index.html' introuvable!"
    echo "Assurez-vous que vous etes dans le dossier CartaShop."
    FILES_OK=false
fi

if [ ! -f "cards.json" ]; then
    echo "[ERREUR] Fichier 'cards.json' introuvable!"
    echo "La base de donnees des cartes est requise."
    FILES_OK=false
fi

if [ ! -f "app-optimized.js" ]; then
    echo "[ERREUR] Fichier 'app-optimized.js' introuvable!"
    echo "Veuillez vous assurer que la version optimisee est presente."
    FILES_OK=false
fi

if [ ! -f "style.css" ]; then
    echo "[ERREUR] Fichier 'style.css' introuvable!"
    echo "Les styles CSS sont necessaires."
    FILES_OK=false
fi

if [ "$FILES_OK" = false ]; then
    read -p "Appuyez sur ENTREE pour quitter..."
    exit 1
fi

echo "[OK] Tous les fichiers requis sont presents!"
echo ""

# === Lancer le serveur HTTP ===
echo "[*] Lancement du serveur HTTP sur le port $PORT..."
echo ""

# Essayer avec Python 3 (priorite)
if command -v python3 &> /dev/null; then
    echo "[OK] Python 3 detecte!"
    echo ""
    echo "Serveur CartaShop demarre sur http://localhost:$PORT"
    echo "Appuyez sur CTRL+C pour arreter le serveur."
    echo ""
    
    # Ouvrir dans le navigateur
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "http://localhost:$PORT/index.html"
    else
        xdg-open "http://localhost:$PORT/index.html" 2>/dev/null &
    fi
    
    python3 -m http.server $PORT
    exit 0
fi

# Essayer avec Python 2 (fallback)
if command -v python &> /dev/null; then
    echo "[OK] Python detecte!"
    echo ""
    echo "Serveur CartaShop demarre sur http://localhost:$PORT"
    echo "Appuyez sur CTRL+C pour arreter le serveur."
    echo ""
    
    # Ouvrir dans le navigateur
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "http://localhost:$PORT/index.html"
    else
        xdg-open "http://localhost:$PORT/index.html" 2>/dev/null &
    fi
    
    python -m SimpleHTTPServer $PORT
    exit 0
fi

# Essayer avec PHP
if command -v php &> /dev/null; then
    echo "[OK] PHP detecte!"
    echo ""
    echo "Serveur CartaShop demarre sur http://localhost:$PORT"
    echo "Appuyez sur CTRL+C pour arreter le serveur."
    echo ""
    
    # Ouvrir dans le navigateur
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "http://localhost:$PORT/index.html"
    else
        xdg-open "http://localhost:$PORT/index.html" 2>/dev/null &
    fi
    
    php -S localhost:$PORT
    exit 0
fi

# Essayer avec Node.js
if command -v node &> /dev/null; then
    echo "[OK] Node.js detecte!"
    
    # Installer http-server si necessaire
    if ! npm list -g http-server &> /dev/null; then
        echo "Installation de http-server..."
        npm install -g http-server
    fi
    
    echo ""
    echo "Serveur CartaShop demarre sur http://localhost:$PORT"
    echo "Appuyez sur CTRL+C pour arreter le serveur."
    echo ""
    
    # Ouvrir dans le navigateur
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "http://localhost:$PORT/index.html"
    else
        xdg-open "http://localhost:$PORT/index.html" 2>/dev/null &
    fi
    
    http-server -p $PORT
    exit 0
fi

# Fallback: Utiliser le navigateur directement (mode offline)
echo ""
echo "[ATTENTION] Aucun serveur HTTP detecte!"
echo "Ouverture du fichier en mode offline..."
echo ""
echo "REMARQUE: Le localStorage et certaines fonctionnalites avancees"
echo "pourraient ne pas fonctionner en mode offline."
echo ""

if [[ "$OSTYPE" == "darwin"* ]]; then
    open "file://$(pwd)/index.html"
else
    xdg-open "file://$(pwd)/index.html" 2>/dev/null &
fi

echo ""
echo "========================================"
echo "Merci d'avoir utilise CartaShop!"
echo "Version: 2.0 Optimisee"
echo "========================================"
echo ""

read -p "Appuyez sur ENTREE pour quitter..."
