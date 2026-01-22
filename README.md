# 🎴 CartaShop - Trading Cards Collection Manager

**Une plateforme web moderne pour gérer, acheter et vendre votre collection de cartes Panini Adrenalyn XL Ligue 1**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-production-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🌟 Caractéristiques Principales

✅ **Gestion de Collection Complète**
- Visualisez votre collection de cartes
- Ajoutez des cartes automatiquement avec numérotation intelligente
- Traitez votre historique d'ajout avec dates de collection
- Classement automatique par numéro de carte

✅ **Boutique Dynamique**
- 471+ cartes Adrenalyn XL Ligue 1 avec images HD
- Filtrage par club, type, et poste
- Tri par prix (croissant/décroissant)
- Recherche en temps réel

✅ **Système de Vente**
- Mettez vos cartes en vente facilement
- Gestion des quantités
- Prix personnalisable par carte
- Historique des ventes

✅ **Panier Intuitif**
- Ajout/suppression rapide
- Calcul automatique du total
- Paiement simplifié
- Synchronisation localStorage

✅ **Interface Moderne**
- Design sombre élégant avec gradients
- Interface responsive (mobile, tablet, desktop)
- Animations fluides
- Navigation intuitive

---

## 📋 Structure du Projet

```
cartashop/
├── index.html           # Application principale (100% HTML/CSS/JS)
├── cards.json          # Base de données 471 cartes Adrenalyn XL
├── start_cartashop.bat # Lancement Windows (optionnel)
└── README.md           # Ce fichier
```

---

## 🚀 Démarrage Rapide

### Option 1: Lancement Direct (Recommandé)

1. **Cloner le repository**
   ```bash
   git clone https://github.com/Nero27200/cartashop.git
   cd cartashop
   ```

2. **Ouvrir dans le navigateur**
   - Double-cliquez sur `index.html`
   - Ou utilisez un serveur local (python/node)

3. **Accéder à l'application**
   - L'app se charge directement
   - Vos données sont sauvegardées en localStorage

### Option 2: Serveur Local (Recommandé pour développement)

**Python 3:**
```bash
python -m http.server 8000
# Puis ouvrez http://localhost:8000
```

**Node.js (Live Server):**
```bash
npm install -g live-server
live-server
```

### Option 3: Windows Batch
```bash
start_cartashop.bat
```

---

## 📱 Fonctionnalités Détaillées

### 1. **Onglet Boutique 🏬**
- Voir les 471 cartes disponibles
- Filtrer par club, type de carte, poste
- Trier par prix
- Ajouter au panier ou à la collection
- Statistiques en temps réel

### 2. **Ma Collection 📚**
- Visualisez toutes vos cartes
- Valeur totale de votre collection
- Nombre de cartes par type
- Déplacez facilement vers "À Vendre"

### 3. **À Vendre 💰**
- Gérez vos cartes en vente
- Modifiez les quantités
- Retirez de la vente
- Historique de prix

### 4. **Ajouter une Carte ➕**
- Formulaire intuitif
- Numérotation automatique
- Types de cartes multiples
- Position du joueur (G, DEF, MIL, ATT)
- Quantité flexible

### 5. **Mon Panier 🛒**
- Vue modale complète
- Total calculé automatiquement
- Paiement simplifié
- Intégration localStorage

---

## 🎨 Types de Cartes Supportés

- **Base** ⚽ - Cartes standards
- **Rare** 💎 - Cartes rares
- **Diamant** 💎 - Premium
- **Ange Gardien** 😇 - Spécial
- **Influenceur** 🌟 - Featured
- **Duo de Choc** 🤝 - Combinaisons
- **Champions** 🏆 - Élite
- **Écusson** 🏁 - Badges
- **Totem** 👑 - Spéciaux

---

## 💾 Persistance des Données

Tous les données sont stockées localement grâce à **localStorage**:
- `myCollection` - Votre collection personnelle
- `myForSale` - Cartes en vente
- `cart` - Panier actuel

**Avantages:**
- Pas de serveur requis
- Données privées sur votre appareil
- Synchronisation instantanée
- Pas de limite de stockage (généralement 5-10MB)

---

## 🛠️ Technologies Utilisées

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Storage:** localStorage API
- **Data Format:** JSON
- **Design:** CSS Grid, Flexbox, Gradients
- **Hosting:** GitHub Pages (gratuit)

---

## 🔒 Sécurité

- ✅ Aucune API externe (complètement autonome)
- ✅ Données stockées localement (pas de serveur)
- ✅ Sanitisation des inputs
- ✅ XSS Protection
- ✅ Pas de cookies de suivi

---

## 📊 Statistiques

- **471+ cartes** avec images et prix
- **100% responsive** mobile-first
- **0 dépendances externes**
- **< 100KB** total size
- **Lancement instant** sans loading

---

## 🚦 Feuille de Route

### ✅ V1.0 (Actuellement)
- Boutique complète
- Gestion de collection
- Système de vente
- Interface responsive

### 🔜 V1.1
- Statistiques avancées (tendances)
- Export CSV de la collection
- Historique d'achat/vente
- Dark/Light mode toggle

### 🔜 V2.0 (Planifié)
- Backend Node.js optionnel
- Base de données MongoDB
- Synchronisation cloud
- Système d'authentification
- API REST

---

## 🤝 Contribution

Les contributions sont bienvenues! Pour contribuer:

1. Fork le repository
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

**Areas for Contribution:**
- Nouvelles cartes pour cards.json
- Améliorations UI/UX
- Performances d'optimisation
- Localisation (multilingue)
- Documentation

---

## 📝 License

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

---

## 👨‍💻 Auteur

**Nero27200** - [GitHub](https://github.com/Nero27200)

---

## 📞 Support

Pour toute question ou problème:
1. Ouvrez une [Issue](https://github.com/Nero27200/cartashop/issues)
2. Consultez la [Discussion](https://github.com/Nero27200/cartashop/discussions)
3. Contactez directement

---

## 🎯 Roadmap Détaillée

### Court Terme (1-2 mois)
- [ ] Système de filtres avancés
- [ ] Export PDF de la collection
- [ ] Statistiques détaillées
- [ ] Undo/Redo fonctionnalité
- [ ] Backup automatique

### Moyen Terme (3-6 mois)
- [ ] Support multilingue (EN, ES, IT)
- [ ] API REST optionnelle
- [ ] Synchronisation iCloud/Google Drive
- [ ] Mode offline complet
- [ ] Progressive Web App (PWA)

### Long Terme (6+ mois)
- [ ] Marketplace intégrée
- [ ] Système d'authentification
- [ ] Trading entre utilisateurs
- [ ] Analytics avancée
- [ ] Version mobile native

---

## 📈 Performance

- ⚡ **Chargement:** < 1 seconde
- 🎯 **Recherche:** Instantanée
- 💾 **Sauvegarde:** Temps réel
- 📱 **Responsive:** 100% fluide

---

## 💡 Tips & Tricks

1. **Sauvegarde Externe:**
   - Exporte ton localStorage en JSON
   - Créé un backup sur cloud

2. **Recherche Rapide:**
   - Utilise Ctrl+F pour chercher une carte
   - La recherche filtre en temps réel

3. **Gestion de Prix:**
   - Consulte les tendances du marché
   - Ajuste tes prix compétitivement

4. **Organisation:**
   - Classer par rareté
   - Trier par valeur

---

**Créé avec ❤️ pour les collectionneurs de cartes Panini Adrenalyn XL**

*Last Updated: Janvier 2026*
