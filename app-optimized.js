// CartaShop - Application complète et optimisée
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

// Chargement des données au démarrage
async function loadCards() {
  try {
    const response = await fetch('cards.json');
    AppState.allCards = await response.json();
    initializeApp();
  } catch (error) {
    console.error('Erreur de chargement:', error);
    document.getElementById('cardsGrid').innerHTML = '<div class="loading">Erreur de chargement des cartes</div>';
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

// Débounce pour optimiser la recherche
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
    card.name.toLowerCase().includes(query) || 
    card.club?.toLowerCase().includes(query) || 
    card.pos?.toLowerCase().includes(query)
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
  if (position) filtered = filtered.filter(c => c.pos === position);
  
  displayCards(filtered, 'cardsGrid');
}

function renderCards() {
  const cardsGrid = document.getElementById('cardsGrid');
  if (!cardsGrid) return;
  
  const html = AppState.allCards.map(card => `
    <div class="card-container" data-id="${card.id}">
      <div class="card-image">${card.image ? `<img src="${card.image}" alt="${card.name}" loading="lazy">` : '<div class="placeholder">No Image</div>'}</div>
      <div class="card-info">
        <h3>${card.name}</h3>
        <p class="club">${card.club || 'N/A'}</p>
        <p class="type">${card.type || 'Base'}</p>
        <p class="price">€${card.price?.toFixed(2) || '0.00'}</p>
      </div>
      <div class="card-actions">
        <button onclick="addToCart(${card.id})" class="btn-cart"丟🛒</button>
        <button onclick="addToCollection(${card.id})" class="btn-collect"📘</button>
      </div>
    </div>
  `).join('');
  
  cardsGrid.innerHTML = html || '<p>Aucune carte trouvée</p>';
}

function displayCards(cards, elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  element.innerHTML = cards.length ? cards.map(card => `
    <div class="card-container" data-id="${card.id}">
      <div class="card-image">${card.image ? `<img src="${card.image}" loading="lazy">` : '<div class="placeholder"></div>'}</div>
      <div class="card-info">
        <h3>${card.name}</h3>
        <p>€${card.price?.toFixed(2) || '0.00'}</p>
      </div>
      <button onclick="addToCart(${card.id})"丟🛒</button>
    </div>
  `).join('') : '<p>Aucune carte</p>';
}

function addToCart(cardId) {
  const card = AppState.allCards.find(c => c.id === cardId);
  if (card) {
    AppState.cart.push(card);
    updateCart();
    showNotification('Ajouté au panier');
  }
}

function addToCollection(cardId) {
  const card = AppState.allCards.find(c => c.id === cardId);
  if (card && !AppState.myCollection.find(c => c.id === cardId)) {
    AppState.myCollection.push(card);
    saveToStorage();
    showNotification('Ajouté à la collection');
  }
}

function updateCart() {
  document.getElementById('cartCount').textContent = AppState.cart.length;
  const total = AppState.cart.reduce((sum, c) => sum + (c.price || 0), 0);
  document.getElementById('totalPrice').textContent = total.toFixed(2) + '€';
}

function updateStats() {
  document.getElementById('shopTotal').textContent = AppState.allCards.length;
  document.getElementById('collectionCount').textContent = AppState.myCollection.length;
  document.getElementById('forSaleCount').textContent = AppState.forSaleCards.length;
  
  const avgPrice = AppState.allCards.length ? (AppState.allCards.reduce((sum, c) => sum + (c.price || 0), 0) / AppState.allCards.length).toFixed(2) : '0.00';
  document.getElementById('avgPrice').textContent = avgPrice + '€';
}

function switchTab(tab, button) {
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  
  document.getElementById(tab + '-tab').style.display = 'block';
  button.classList.add('active');
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
  if (sortType === 'price-low') sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
  else if (sortType === 'price-high') sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
  
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
      <span>${card.name} - €${card.price?.toFixed(2) || '0.00'}</span>
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
  const total = AppState.cart.reduce((sum, c) => sum + (c.price || 0), 0);
  showNotification(`Commande de ${AppState.cart.length} carte(s) pour €${total.toFixed(2)}`);
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
    pos: document.getElementById('cardPosition')?.value,
    price: parseFloat(document.getElementById('cardPrice')?.value) || 0
  };
  AppState.myCollection.push(newCard);
  saveToStorage();
  showNotification('Carte ajoutée');
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
}

function showNotification(message) {
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.textContent = message;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 2000);
}

function addToMyCollection() {
  const form = document.getElementById('add-tab').querySelector('form');
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
  showNotification('Carte ajoutée à la vente');
}

function openApp() {
  showNotification('Application lancée!');
  switchTab('shop', document.querySelector('.tab-btn'));
}

// Démarrage de l'application au chargement
window.addEventListener('load', loadCards);
