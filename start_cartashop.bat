@echo off
REM ====================================================
REM CartaShop - Lanceur Application Web v2.0 Optimisee
REM ====================================================
REM Script d'lancement securise pour Windows
REM - Verifie les fichiers requis
REM - Lance un serveur HTTP local
REM - Ouvre automatiquement dans le navigateur
REM ====================================================

setlocal enabledelayedexpansion

REM Couleurs et affichage
echo.
echo ========================================
echo.  CartaShop v2.0 - Collection Manager
echo ========================================
echo.

REM Configuration du port
set "PORT=8080"
if "%XPORT%"==\"\" set "PORT=8000"

REM === Verification des fichiers necessaires ===
echo [*] Verification des fichiers requis...

if not exist "index.html" (
    echo [ERREUR] Fichier 'index.html' introuvable!
    echo Assurez-vous que vous etes dans le dossier CartaShop.
    pause
    exit /b 1
)

if not exist "cards.json" (
    echo [ERREUR] Fichier 'cards.json' introuvable!
    echo La base de donnees des cartes est requise.
    pause
    exit /b 1
)

if not exist "app-optimized.js" (
    echo [ERREUR] Fichier 'app-optimized.js' introuvable!
    echo Veuillez vous assurer que la version optimisee est presente.
    pause
    exit /b 1
)

if not exist "style.css" (
    echo [ERREUR] Fichier 'style.css' introuvable!
    echo Les styles CSS sont necessaires.
    pause
    exit /b 1
)

echo [OK] Tous les fichiers requis sont presents!
echo.

REM === Lancer le serveur HTTP ===
echo [*] Lancement du serveur HTTP sur le port %PORT%...
echo.

REM Essayer avec Python 3 (priorite)
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python detecte!
    echo.
    echo Serveur CartaShop demarre sur http://localhost:%PORT%
    echo Appuyez sur CTRL+C pour arreter le serveur.
    echo.
    
    start "CartaShop Server" http://localhost:%PORT%/index.html
    python -m http.server %PORT%
    goto END
)

REM Essayer avec PHP
where php >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] PHP detecte!
    echo.
    echo Serveur CartaShop demarre sur http://localhost:%PORT%
    echo Appuyez sur CTRL+C pour arreter le serveur.
    echo.
    
    start "CartaShop Server" http://localhost:%PORT%/index.html
    php -S localhost:%PORT%
    goto END
)

REM Essayer avec Node.js
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js detecte!
    echo Installation du serveur HTTP simple...
    npm list -g http-server >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo Installation de http-server...
        npm install -g http-server
    )
    
    echo.
    echo Serveur CartaShop demarre sur http://localhost:%PORT%
    echo Appuyez sur CTRL+C pour arreter le serveur.
    echo.
    
    start "CartaShop Server" http://localhost:%PORT%/index.html
    http-server -p %PORT%
    goto END
)

REM Fallback: Utiliser le navigateur directement (mode offline)
echo.
echo [ATTENTION] Aucun serveur HTTP detecte!
echo Ouverture du fichier en mode offline...
echo.
echo REMARQUE: Le localStorage et certaines fonctionnalites avancees
echo pourraient ne pas fonctionner en mode offline.
echo.

start "" file:///%cd%\index.html

:END
echo.
echo ========================================
echo Merci d'avoir utilise CartaShop!
echo Version: 2.0 Optimisee
echo ========================================
echo.
pause
