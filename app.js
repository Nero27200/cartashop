// CartaShop - Application Complète et Fonctionnelle
// Version Optimisée - Gestion Complète des Cartes

const app = window.app || {};
window.app = app;

app.state = {
  allCards: [],
  cart: [],
  currentTab: 'accueil'
};

// ===== INITIALISATION =====
app.init = async function() {
  console.log('[CartaShop] Démarrage de l\'application...');
  try {
    await app.loadCards();
    app.setupEventListeners();
    app.switchTab('accueil', null);
    console.log('[CartaShop] Application initialisée avec succès');
  } catch (e) {
    console.error('[CartaShop] Erreur lors de l\'initialisation:', e);
  }
};

// ===== CHARGEMENT DES CARTES =====
app.loadCards = async function() {
  try {
    console.log('[CartaShop] Chargement des cartes...');
    const response = await fetch('cards.json');
    
    if (!response.ok) {
      throw new Error('Impossible de charger cards.json');
    }
    
    const data = await response.json();
    
    // Gestion flexible du structure JSON
    app.state.allCards = Array.isArray(data) ? data : (data.cards || []);
    
    if (app.state.allCards.length === 0) {
      console.warn('[CartaShop] Aucune carte trouvée dans le JSON');
    }
    
    console.log('[CartaShop] ' + app.state.allCards.length + ' cartes chargées');
    app.renderCards();
  } catch (error) {
    console.error('[CartaShop] Erreur chargement cartes:', error);
    app.showError('Erreur de chargement: ' + error.message);
  }
};

// ===== AFFICHAGE DES CARTES =====
app.renderCards = function() {
  const grid = document.getElementById('cardsGrid');
  if (!grid) return;
  
  if (app.state.allCards.length === 0) {
    grid.innerHTML = '<p class="empty-message">Aucune carte disponible</p>';
    return;
  }
  
  grid.innerHTML = app.state.allCards.map(card => `
    <div class="card-container" data-card-id="${card.id || card.number || ''}">
      <div class="card-image">
        ${card.image ? `<img src="${card.image}" alt="${card.name || 'Carte'}" loading="lazy" />` : '<div class="placeholder">📷</div>'}
      </div>
      <div class="card-info">
        <h3>${card.name || 'Carte'}</h3>
        <p class="club">${card.club || 'N/A'}</p>
        <p class="price">€${(card.price_avg || card.price || 0).toFixed(2)}</p>
        <p class="rarity">${card.rarity || 'Commune'}</p>
      </div>
      <div class="card-actions">
        <button class="btn-add-cart" onclick="app.addToCart('${card.id || card.number || ''}', '${(card.name || 'Carte').replace(/'/g, "\\'")}')">Ajouter</button>
      </div>
    </div>
  `).join('');
  
  app.updateStats();
};

// ===== GESTION DU PANIER =====
app.addToCart = function(cardId, cardName) {
  if (!cardId) {
    alert('Erreur: ID de carte invalide');
    return;
  }
  
  const card = app.state.allCards.find(c => (c.id || c.number || '') === cardId);
  if (card) {
    app.state.cart.push({...card});
    alert(cardName + ' ajouté au panier');
    app.renderCart();
    app.updateStats();
  }
};

app.removeFromCart = function(index) {
  if (index >= 0 && index < app.state.cart.length) {
    const card = app.state.cart[index];
    app.state.cart.splice(index, 1);
    alert(card.name + ' supprimé du panier');
    app.renderCart();
    app.updateStats();
  }
};

app.renderCart = function() {
  const cartContent = document.getElementById('cartItems');
  if (!cartContent) return;
  
  if (app.state.cart.length === 0) {
    cartContent.innerHTML = '<p>Panier vide</p>';
    return;
  }
  
  cartContent.innerHTML = app.state.cart.map((card, index) => `
    <div class="cart-item">
      <span>${card.name || 'Carte'}</span>
      <span>€${(card.price_avg || card.price || 0).toFixed(2)}</span>
      <button onclick="app.removeFromCart(${index})" class="btn-remove">Retirer</button>
    </div>
  `).join('');
};

// ===== STATISTIQUES =====
app.updateStats = function() {
  // Total de cartes
  const totalEl = document.getElementById('shopTotal');
  if (totalEl) {
    totalEl.textContent = app.state.allCards.length;
  }
  
  // Prix moyen
  const avgEl = document.getElementById('avgPrice');
  if (avgEl) {
    if (app.state.allCards.length > 0) {
      const total = app.state.allCards.reduce((sum, c) => sum + (c.price_avg || c.price || 0), 0);
      const avg = (total / app.state.allCards.length).toFixed(2);
      avgEl.textContent = avg + ' €';
    } else {
      avgEl.textContent = '0.00 €';
    }
  }
  
  // Total panier
  const cartTotalEl = document.getElementById('cartTotal');
  if (cartTotalEl) {
    const cartSum = app.state.cart.reduce((sum, c) => sum + (c.price_avg || c.price || 0), 0);
    cartTotalEl.textContent = cartSum.toFixed(2) + ' €';
  }
  
  // Nombre de cartes panier
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) {
    cartCountEl.textContent = app.state.cart.length;
  }
};

// ===== NAVIGATION ONGLETS =====
app.switchTab = function(tabName, event) {
  if (event) event.preventDefault();
  
  // Masquer tous les onglets
  document.querySelectorAll('.tab-content').forEach(el => {
    el.style.display = 'none';
  });
  
  // Retirer la classe active de tous les boutons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Afficher l'onglet sélectionné
  const tabEl = document.getElementById(tabName + '-tab');
  if (tabEl) {
    tabEl.style.display = 'block';
  }
  
  // Activer le bouton correspondant
  const activeBtn = document.querySelector('[data-tab="' + tabName + '"]');
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
  
  app.state.currentTab = tabName;
  console.log('[CartaShop] Onglet changé: ' + tabName);
};

// ===== PANIER MODAL =====
app.toggleCart = function() {
  const modal = document.getElementById('cartModal');
  if (modal) {
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
  }
};

app.closeCart = function() {
  const modal = document.getElementById('cartModal');
  if (modal) {
    modal.style.display = 'none';
  }
};

// ===== GESTION DES ERREURS =====
app.showError = function(message) {
  const grid = document.getElementById('cardsGrid');
  if (grid) {
    grid.innerHTML = '<p class="error-message">❌ ' + message + '</p>';
  }
};

// ===== ÉVÉNEMENTS =====
app.setupEventListeners = function() {
  // Fermer modal avec Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      app.closeCart();
    }
  });
  
  // Fermer modal en cliquant dehors
  const modal = document.getElementById('cartModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        app.closeCart();
      }
    });
  }
  
  console.log('[CartaShop] Événements configurés');
};

// ===== DÉMARRAGE =====
window.addEventListener('DOMContentLoaded', () => {
  app.init();
});

console.log('[CartaShop] Script chargé et prêt');
