// CartaShop - Application complete et optimisee
// Gestion de collection de cartes Panini Adrenalyn XL Ligue 1 2025-26
const AppState = {
  allCards: [],
  myCollection: [],
  forSaleCards: [],
  cart: [],
  currentTab: 'shop',
  currentSort: 'name',
  filters: { club: '', type: '', position: '' }
};

// Chargement des donnees au demarrage
async function loadCards() {
  try {
    const response = await fetch('cards.json');
    if (!response.ok) throw new Error('Erreur HTTP: ' + response.status);
    
    const data = await response.json();
    AppState.allCards = data.cards || data; // Support nested or flat JSON
    console.log(`[CartaShop] ${AppState.allCards.length} cartes chargees`);
    
    initializeApp();
  } catch (error) {
    console.error('[CartaShop] Erreur:', error);
    displayError(error.message);
  }
}

function initializeApp() {
  renderCards();
  updateStats();
  setupEventListeners();
  loadFromStorage();
}

function setupEventListeners() {
  document.getElementById('searchInput')?.addEventListener('input', debounce(search, 300));
  document.getElementById('clubFilter')?.addEventListener('change', applyFilters);
  document.getElementById('typeFilter')?.addEventListener('change', applyFilters);
  document.getElementById('positionFilter')?.addEventListener('change', applyFilters);
}

// Debounce pour optimiser la recherche
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

function search(e) {
  const query = e.target.value.toLowerCase();
  const filtered = AppState.allCards.filter(card => 
    (card.name && card.name.toLowerCase().includes(query)) || 
    (card.club && card.club.toLowerCase().includes(query)) || 
    (card.position && card.position.toLowerCase().includes(query))
  );
  displayCards(filtered, 'cardsGrid');
}

function applyFilters() {
  const club = document.getElementById('clubFilter')?.value || '';
  const type = document.getElementById('typeFilter')?.value || '';
  const position = document.getElementById('positionFilter')?.value || '';
  
  let filtered = AppState.allCards;
  if (club) filtered = filtered.filter(c => c.club === club);
  if (type) filtered = filtered.filter(c => c.type === type);
  if (position) filtered = filtered.filter(c => c.position === position);
  
  displayCards(filtered, 'cardsGrid');
}

function renderCards() {
  const cardsGrid = document.getElementById('cardsGrid');
  if (!cardsGrid) return;
  
  const html = AppState.allCards.map(card => `
    <div class="card-container" data-id="${card.id || card.number}">
      <div class="card-image">${card.image ? `<img src="${card.image}" alt="${card.name}" loading="lazy">` : '<div class="placeholder">No Image</div>'}</div>
      <div class="card-info">
        <h3>${card.name}</h3>
        <p class="club">${card.club || 'N/A'}</p>
        <p class="type">${card.type || 'Base'}</p>
        <p class="price">EUR ${(card.price_avg || card.price || 0).toFixed(2)}</p>
      </div>
      <div class="card-actions">
        <button onclick="addToCart(${card.id || card.number}, '${card.name}')" class="btn-cart">Ajouter au panier</button>
        <button onclick="addToCollection(${card.id || card.number})" class="btn-collect">Ajouter collection</button>
      </div>
    </div>
  `).join('');
  
  cardsGrid.innerHTML = html || '<p>Aucune carte trouvee</p>';
}

function displayCards(cards, elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  element.innerHTML = cards.length ? cards.slice(0, 100).map(card => `
    <div class="card-container" data-id="${card.id || card.number}">
      <div class="card-image">${card.image ? `<img src="${card.image}" loading="lazy">` : '<div class="placeholder"></div>'}</div>
      <div class="card-info">
        <h3>${card.name}</h3>
        <p>EUR ${(card.price_avg || card.price || 0).toFixed(2)}</p>
      </div>
      <button onclick="addToCart(${card.id || card.number}, '${card.name}')">Ajouter</button>
    </div>
  `).join('') : '<p>Aucune carte</p>';
}

function addToCart(cardId, cardName) {
  const card = AppState.allCards.find(c => (c.id || c.number) === cardId);
  if (card) {
    AppState.cart.push(card);
    updateCart();
    showNotification(cardName + ' ajoutee au panier');
  }
}

function addToCollection(cardId) {
  const card = AppState.allCards.find(c => (c.id || c.number) === cardId);
  if (card && !AppState.myCollection.find(c => (c.id || c.number) === cardId)) {
    AppState.myCollection.push(card);
    saveToStorage();
    showNotification('Ajoute a la collection');
    updateStats();
  }
}

function updateCart() {
  const badge = document.getElementById('cartCount');
  if (badge) {
    badge.textContent = AppState.cart.length;
    badge.style.display = AppState.cart.length > 0 ? 'block' : 'none';
  }
  
  const total = AppState.cart.reduce((sum, c) => sum + (c.price_avg || c.price || 0), 0);
  const totalEl = document.getElementById('totalPrice');
  if (totalEl) totalEl.textContent = total.toFixed(2) + 'EUR';
}

function updateStats() {
  document.getElementById('shopTotal').textContent = AppState.allCards.length;
  document.getElementById('collectionCount').textContent = AppState.myCollection.length;
  document.getElementById('forSaleCount').textContent = AppState.forSaleCards.length;
  
  const avgPrice = AppState.allCards.length ? 
    (AppState.allCards.reduce((sum, c) => sum + (c.price_avg || c.price || 0), 0) / AppState.allCards.length).toFixed(2) : '0.00';
  
  const avgEl = document.getElementById('avgPrice');
  if (avgEl) avgEl.textContent = avgPrice + 'EUR';
}

function switchTab(tab, button) {
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  
  const tabEl = document.getElementById(tab + '-tab');
  if (tabEl) tabEl.style.display = 'block';
  if (button) button.classList.add('active');
  
  AppState.currentTab = tab;
  
  if (tab === 'collection') renderCollection();
  else if (tab === 'forsale') renderForSale();
}

function renderCollection() {
  displayCards(AppState.myCollection, 'collectionGrid');
}

function renderForSale() {
  displayCards(AppState.forSaleCards, 'forSaleGrid');
}

function sortBy(sortType) {
  const sorted = [...AppState.allCards];
  if (sortType === 'price-low') sorted.sort((a, b) => (a.price_avg || a.price || 0) - (b.price_avg || b.price || 0));
  else if (sortType === 'price-high') sorted.sort((a, b) => (b.price_avg || b.price || 0) - (a.price_avg || a.price || 0));
  
  displayCards(sorted, 'cardsGrid');
}

function toggleCart() {
  const modal = document.getElementById('cartModal');
  if (!modal) return;
  modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
  renderCartItems();
}

function renderCartItems() {
  const cartItems = document.getElementById('cartItems');
  if (!cartItems) return;
  
  cartItems.innerHTML = AppState.cart.length ? AppState.cart.map((card, idx) => `
    <div class="cart-item">
      <span>${card.name} - EUR${(card.price_avg || card.price || 0).toFixed(2)}</span>
      <button onclick="removeFromCart(${idx})">Supprimer</button>
    </div>
  `).join('') : '<p>Panier vide</p>';
}

function removeFromCart(index) {
  AppState.cart.splice(index, 1);
  updateCart();
  renderCartItems();
}

function checkout() {
  if (AppState.cart.length === 0) {
    showNotification('Panier vide');
    return;
  }
  const total = AppState.cart.reduce((sum, c) => sum + (c.price_avg || c.price || 0), 0);
  showNotification('Commande de ' + AppState.cart.length + ' carte(s) pour EUR' + total.toFixed(2));
  AppState.cart = [];
  updateCart();
  toggleCart();
}

function handleFormSubmit(event) {
  event.preventDefault();
  const newCard = {
    id: AppState.allCards.length + 1,
    name: document.getElementById('cardName')?.value,
    club: document.getElementById('cardClub')?.value,
    number: document.getElementById('cardNumber')?.value,
    type: document.getElementById('cardType')?.value,
    position: document.getElementById('cardPosition')?.value,
    price: parseFloat(document.getElementById('cardPrice')?.value) || 0
  };
  AppState.myCollection.push(newCard);
  saveToStorage();
  showNotification('Carte ajoutee');
  updateStats();
  event.target.reset();
}

function saveToStorage() {
  localStorage.setItem('cartashop_collection', JSON.stringify(AppState.myCollection));
  localStorage.setItem('cartashop_forSale', JSON.stringify(AppState.forSaleCards));
}

function loadFromStorage() {
  const collection = localStorage.getItem('cartashop_collection');
  const forSale = localStorage.getItem('cartashop_forSale');
  if (collection) AppState.myCollection = JSON.parse(collection);
  if (forSale) AppState.forSaleCards = JSON.parse(forSale);
  updateStats();
}

function showNotification(message) {
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #4caf50; color: white; padding: 1rem 1.5rem; border-radius: 8px; z-index: 9999; animation: slideIn 0.3s ease-out;';
  notif.textContent = message;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

function displayError(message) {
  const grid = document.getElementById('cardsGrid');
  if (grid) {
    grid.innerHTML = '<div style="padding: 2rem; text-align: center; color: #d32f2f;"><h3>Erreur de chargement</h3><p>' + message + '</p></div>';
  }
}

function addToMyCollection() {
  const form = document.getElementById('add-tab')?.querySelector('form');
  if (form) handleFormSubmit({preventDefault: () => {}, target: form});
}

function addAndSell() {
  const card = {
    id: AppState.allCards.length + 1,
    name: document.getElementById('cardName')?.value,
    club: document.getElementById('cardClub')?.value,
    price: parseFloat(document.getElementById('cardPrice')?.value) || 0
  };
  AppState.forSaleCards.push(card);
  saveToStorage();
  showNotification('Carte ajoutee a la vente');
  updateStats();
}

function openApp() {
  showNotification('Application lancee!');
  switchTab('shop', document.querySelector('.tab-btn'));
}

const style = document.createElement('style');
style.textContent = '@keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }';
document.head.appendChild(style);

window.addEventListener('load', loadCards);
console.log('[CartaShop] Script charge avec succes');
