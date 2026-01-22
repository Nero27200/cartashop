// CartaShop - Application de gestion de collection
// Version fonctionnelle simple

const AppState = {
  allCards: [],
  myCollection: [],
  forSaleCards: [],
  cart: []
};

// Charge les cartes au démarrage
async function loadCards() {
  try {
    console.log('[CartaShop] Chargement des cartes...');
    
    const response = await fetch('cards.json');
    console.log('[CartaShop] Réponse reçue:', response.status);
    
    if (!response.ok) throw new Error('Erreur HTTP: ' + response.status);
    
    const data = await response.json();
    console.log('[CartaShop] JSON parsé, données reçues:', data);
    
    // Extraire les cartes selon la structure du JSON
    if (data.cards && Array.isArray(data.cards)) {
      AppState.allCards = data.cards;
    } else if (Array.isArray(data)) {
      AppState.allCards = data;
    } else {
      throw new Error('Structure JSON invalide');
    }
    
    console.log('[CartaShop] ' + AppState.allCards.length + ' cartes chargées');
    
    // Afficher les cartes
    displayCards();
    updateStats();
    setupEventListeners();
    loadFromStorage();
  } catch (error) {
    console.error('[CartaShop] ERREUR COMPLÈTE:', error);
    showError('[ERREUR] ' + error.message + '<br>Assurez-vous que: 1) Le serveur HTTP est lancé (http-server . -p 8080) 2) Le fichier cards.json existe');
  }
}

// Affiche toutes les cartes
function displayCards() {
  const grid = document.getElementById('cardsGrid');
  if (!grid) {
    console.error('[CartaShop] Element #cardsGrid not found');
    return;
  }
  
  if (AppState.allCards.length === 0) {
    grid.innerHTML = '<p>Aucune carte à afficher</p>';
    return;
  }
  
  grid.innerHTML = AppState.allCards.map(card => `
    <div class="card-container" data-id="${card.id || card.number}">
      <div class="card-image">
        ${card.image ? `<img src="${card.image}" alt="${card.name}" loading="lazy">` : '<div class="placeholder">No Image</div>'}
      </div>
      <div class="card-info">
        <h3>${card.name || 'Unknown'}</h3>
        <p class="club">${card.club || 'N/A'}</p>
        <p class="type">${card.type || 'Base'}</p>
        <p class="price">EUR ${(card.price_avg || card.price || 0).toFixed(2)}</p>
      </div>
      <div class="card-actions">
        <button onclick="addToCart(${card.id || card.number}, '${(card.name || 'Card').replace(/'/g, "\\'")}')">Ajouter au panier</button>
      </div>
    </div>
  `).join('');
}

// Met à jour les statistiques
function updateStats() {
  document.getElementById('shopTotal')?.textContent = AppState.allCards.length;
  document.getElementById('collectionCount')?.textContent = AppState.myCollection.length;
  document.getElementById('forSaleCount')?.textContent = AppState.forSaleCards.length;
  
  const avgPrice = AppState.allCards.length ?
    (AppState.allCards.reduce((sum, c) => sum + (c.price_avg || c.price || 0), 0) / AppState.allCards.length).toFixed(2) : '0.00';
  
  document.getElementById('avgPrice')?.textContent = avgPrice + 'EUR';
}

// Configure les écouteurs d'événements
function setupEventListeners() {
  document.getElementById('searchInput')?.addEventListener('input', debounce(search, 300));
  document.getElementById('clubFilter')?.addEventListener('change', applyFilters);
}

// Fonction debounce
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

// Recherche
function search(e) {
  const query = e.target.value.toLowerCase();
  const filtered = AppState.allCards.filter(card =>
    (card.name && card.name.toLowerCase().includes(query)) ||
    (card.club && card.club.toLowerCase().includes(query))
  );
  
  const grid = document.getElementById('cardsGrid');
  if (grid) {
    grid.innerHTML = filtered.map(card => `
      <div class="card-container" data-id="${card.id || card.number}">
        <div class="card-image">
          ${card.image ? `<img src="${card.image}" alt="${card.name}" loading="lazy">` : '<div class="placeholder">No Image</div>'}
        </div>
        <div class="card-info">
          <h3>${card.name || 'Unknown'}</h3>
          <p class="club">${card.club || 'N/A'}</p>
          <p class="price">EUR ${(card.price_avg || card.price || 0).toFixed(2)}</p>
        </div>
      </div>
    `).join('');
  }
}

// Applique les filtres
function applyFilters() {
  const club = document.getElementById('clubFilter')?.value || '';
  let filtered = AppState.allCards;
  if (club) filtered = filtered.filter(c => c.club === club);
  
  const grid = document.getElementById('cardsGrid');
  if (grid) {
    grid.innerHTML = filtered.map(card => `
      <div class="card-container" data-id="${card.id || card.number}">
        <div class="card-image">
          ${card.image ? `<img src="${card.image}" alt="${card.name}" loading="lazy">` : '<div class="placeholder">No Image</div>'}
        </div>
        <div class="card-info">
          <h3>${card.name || 'Unknown'}</h3>
          <p class="club">${card.club || 'N/A'}</p>
          <p class="price">EUR ${(card.price_avg || card.price || 0).toFixed(2)}</p>
        </div>
      </div>
    `).join('');
  }
}

// Ajoute une carte au panier
function addToCart(cardId, cardName) {
  const card = AppState.allCards.find(c => (c.id || c.number) === cardId);
  if (card) {
    AppState.cart.push(card);
    showNotification(cardName + ' ajoutée au panier');
  }
}

// Affiche une notification
function showNotification(message) {
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.textContent = message;
  notif.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #4caf50; color: white; padding: 1rem; border-radius: 8px; z-index: 9999;';
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

// Affiche une erreur
function showError(message) {
  const grid = document.getElementById('cardsGrid');
  if (grid) {
    grid.innerHTML = '<div style="padding: 2rem; text-align: center; color: #d32f2f;"><h3>Erreur de chargement</h3><p>' + message + '</p></div>';
  }
}

// Charge depuis le localStorage
function loadFromStorage() {
  const collection = localStorage.getItem('cartashop_collection');
  if (collection) AppState.myCollection = JSON.parse(collection);
  updateStats();
}

// Onglets
function switchTab(tab, button) {
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  
  const tabEl = document.getElementById(tab + '-tab');
  if (tabEl) tabEl.style.display = 'block';
  if (button) button.classList.add('active');
}

// Panier
function toggleCart() {
  const modal = document.getElementById('cartModal');
  if (modal) modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

// Lancer le chargement au démarrage
window.addEventListener('load', loadCards);
console.log('[CartaShop] Script chargé avec succès');
