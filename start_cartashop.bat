@echo off
setlocal ENABLEDELAYEDEXPANSION

rem ==========================================
rem  Lancement securise de CataShop en local
rem  - Port configurable (defaut 8000)
rem  - Bind 127.0.0.1 uniquement (pas d'acces externe)
rem ==========================================

set "PORT=%~1"
if "%PORT%"=="" set "PORT=8000"

rem === Aller dans le dossier du projet ===
cd /d "%~dp0"

rem === Vérifier les fichiers requis ===
if not exist "cartashop.html" (    echo [ERREUR] Fichier CataShop.html introuvable dans %cd%.
    pause
    exit /b 1
)
if not exist "cards.json" (
    echo [ERREUR] Fichier cards.json introuvable dans %cd%.
    pause
    exit /b 1
)

rem === Vérifier que Python est installé ===
where python >nul 2>nul
if errorlevel 1 (
    echo [ERREUR] Python n'est pas installe ou n'est pas dans le PATH.
    echo Installe Python depuis https://www.python.org/ puis relance ce script.
    pause
    exit /b 1
)

rem === Lancer un serveur HTTP local securise (loopback uniquement) ===
echo Lancement du serveur local sur http://localhost:%PORT% ...
start "CataShop Server" /B python -m http.server %PORT% --bind 127.0.0.1

rem === Petite pause pour laisser le serveur demarrer ===
timeout /t 2 /nobreak >nul

rem === Ouvrir automatiquement l'application dans le navigateur par defaut ===
start "" "http://localhost:%PORT%/cartashop.html"
echo.
echo CartaShop est lancé dans ton navigateur sur http://localhost:%PORT%/cartashop.htmlecho Le serveur est lie a 127.0.0.1 uniquement (pas accessible depuis l'exterieur).
echo Laisse cette fenetre ouverte si tu veux garder le message; le serveur tourne en tache de fond.
echo Pour changer de port: start_cartashop.bat 8001
pause >nul

endlocal

