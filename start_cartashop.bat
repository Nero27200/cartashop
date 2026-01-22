@echo off
REM CartaShop - Lanceur Application Web
REM =====================================

echo.
echo Demarrage de CartaShop...
echo.

REM Verification fichiers requis
if not exist "index.html" (
    echo [ERREUR] Fichier 'index.html' introuvable!
    pause
    exit /b 1
)

if not exist "app-simple.js" (
    echo [ERREUR] Fichier 'app-simple.js' introuvable!
    pause
    exit /b 1
)

if not exist "cards.json" (
    echo [ERREUR] Fichier 'cards.json' introuvable!
    pause
    exit /b 1
)

echo [OK] Tous les fichiers requis sont presents.
echo.

REM Essayer avec http-server (Node.js)
where http-server >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Lancement du serveur HTTP...
    echo Ouvrez votre navigateur sur: http://localhost:8080
    echo Appuyez sur CTRL+C pour arreter le serveur.
    echo.
    http-server . -p 8080
) else (
    REM Fallback: Ouvrir directement le fichier en mode offline
    echo [ATTENTION] Aucun serveur HTTP detectable.
    echo Ouverture du fichier en mode offline...
    echo.
    echo REMARQUE: le localStorage et certaines fonctionnalites avancees
    echo pourraient ne pas fonctionner en mode offline.
    echo.
    start "" "file:///%cd%/index.html"
)

pause
