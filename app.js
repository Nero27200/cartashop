// CartaShop - Application Professionnelle Complète
// Gestion de Collection Panini Adrenalyn XL Ligue 1 2025-26
// Version 2.0 - Production Ready

class CartaShopApp {
  constructor() {
    this.state = {
      allCards: [],
      myCollection: [],
      forSaleCards: [],
      cart: [],
      currentTab: 'shop',
      filters: { club: '', type: '', position: '' }
    };
    this.init();
  }

  async init() {
    console.log('[CartaShop] Initialisation...');
    await this.loadCards();
    this.setupUI();
    this.loadFromStorage();
  }

  async loadCards() {
    try {
      console.log('[CartaShop] Chargement des cartes...');
      const response = await fetch('cards.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      this.state.allCards = Array.isArray(data.cards) ? data.cards : (Array.isArray(data) ? data : []);
      
      if (this.state.allCards.length === 0) throw new Error('Aucune carte trouvée dans le JSON');
      console.log(`[CartaShop] ${this.state.allCards.length} cartes chargées`);
      
      this.populateFilters();
      this.renderShop();
    } catch (error) {
      console.error('[CartaShop] ERREUR:', error);
      this.showError(`Erreur: ${error.message}`);
    }
  }

  populateFilters() {
    const clubs = [...new Set(this.state.allCards.map(c => c.club).filter(Boolean))];
    const types = [...new Set(this.state.allCards.map(c => c.type).filter(Boolean))];
    const positions = [...new Set(this.state.allCards.map(c => c.position).filter(Boolean))];

    this.updateSelect('clubFilter', clubs);
    this.updateSelect('typeFilter', types);
    this.updateSelect('positionFilter', positions);
  }

  updateSelect(id, options) {
    const select = document.getElementById(id);
    if (!select) return;
    
    options.sort().forEach(opt => {
      if (!Array.from(select.options).find(o => o.value === opt)) {
        select.appendChild(new Option(opt, opt));
      }
    });
  }

  setupUI() {
    document.getElementById('searchInput')?.addEventListener('input', e => this.search(e));
    ['clubFilter', 'typeFilter', 'positionFilter'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', () => this.applyFilters());
    });
  }

  renderShop() {
    this.renderCards(this.state.allCards, 'cardsGrid');
    this.updateStats();
  }

  renderCards(cards, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    if (cards.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;">Aucune carte trouvée</div>';
      return;
    }

    grid.innerHTML = cards.map(card => `
      <div class="card-container" data-id="${card.id || card.number}">
        <div class="card-image">
          ${card.image ? `<img src="${card.image}" alt="${card.name}" loading="lazy">` : '<div class="placeholder">📷</div>'}
        </div>
        <div class="card-info">
          <h3>${card.name || 'Carte'}</h3>
          <p class="club">${card.club || 'N/A'}</p>
          <p class="type">${card.type || 'Base'}</p>
          <p class="position">${card.position || '-'}</p>
          <p class="price">EUR ${(card.price_avg || card.price || 0).toFixed(2)}</p>
        </div>
        <div class="card-actions">
          <button onclick="app.addToCart(${card.id || card.number}, '${(card.name || 'Card').replace(/'/g, "\\'")}')">🛒 Ajouter</button>
          <button onclick="app.addToCollection(${card.id || card.number})">📚 Collecter</button>
        </div>
      </div>
    `).join('');
  }

  search(event) {
    const query = event.target.value.toLowerCase();
    const filtered = this.state.allCards.filter(card =>
      (card.name && card.name.toLowerCase().includes(query)) ||
      (card.club && card.club.toLowerCase().includes(query)) ||
      (card.position && card.position.toLowerCase().includes(query))
    );
    this.renderCards(filtered, 'cardsGrid');
  }

  applyFilters() {
    const club = document.getElementById('clubFilter')?.value || '';
    const type = document.getElementById('typeFilter')?.value || '';
    const position = document.getElementById('positionFilter')?.value || '';

    let filtered = this.state.allCards;
    if (club) filtered = filtered.filter(c => c.club === club);
    if (type) filtered = filtered.filter(c => c.type === type);
    if (position) filtered = filtered.filter(c => c.position === position);

    this.renderCards(filtered, 'cardsGrid');
  }

  addToCart(cardId, cardName) {
    const card = this.state.allCards.find(c => (c.id || c.number) === cardId);
    if (card) {
      this.state.cart.push(card);
      this.updateCart();
      this.showNotification(`${cardName} ajoutée au panier`);
    }
  }

  addToCollection(cardId) {
    const card = this.state.allCards.find(c => (c.id || c.number) === cardId);
    if (card && !this.state.myCollection.find(c => (c.id || c.number) === cardId)) {
      this.state.myCollection.push(card);
      this.saveToStorage();
      this.showNotification('Carte ajoutée à votre collection');
      this.updateStats();
    }
  }

  updateCart() {
    const badge = document.getElementById('cartCount');
    if (badge) {
      badge.textContent = this.state.cart.length;
      badge.style.display = this.state.cart.length > 0 ? 'block' : 'none';
    }

    const total = this.state.cart.reduce((sum, c) => sum + (c.price_avg || c.price || 0), 0);
    const totalEl = document.getElementById('totalPrice');
    if (totalEl) totalEl.textContent = total.toFixed(2) + 'EUR';
  }

  updateStats() {
    document.getElementById('shopTotal')?.textContent = this.state.allCards.length;
    document.getElementById('collectionCount')?.textContent = this.state.myCollection.length;
    document.getElementById('forSaleCount')?.textContent = this.state.forSaleCards.length;

    const avgPrice = this.state.allCards.length ?
      (this.state.allCards.reduce((sum, c) => sum + (c.price_avg || c.price || 0), 0) / this.state.allCards.length).toFixed(2) : '0.00';
    document.getElementById('avgPrice')?.textContent = avgPrice + 'EUR';
  }

  switchTab(tab, button) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    const tabEl = document.getElementById(tab + '-tab');
    if (tabEl) tabEl.style.display = 'block';
    if (button) button.classList.add('active');

    if (tab === 'collection') this.renderCards(this.state.myCollection, 'collectionGrid');
    else if (tab === 'forsale') this.renderCards(this.state.forSaleCards, 'forSaleGrid');
  }

  toggleCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
      modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
      this.renderCartItems();
    }
  }

  renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;

    cartItems.innerHTML = this.state.cart.length ? this.state.cart.map((card, idx) => `
      <div class="cart-item">
        <span>${card.name} - EUR${(card.price_avg || card.price || 0).toFixed(2)}</span>
        <button onclick="app.removeFromCart(${idx})">✕</button>
      </div>
    `).join('') : '<p>Panier vide</p>';
  }

  removeFromCart(index) {
    this.state.cart.splice(index, 1);
    this.updateCart();
    this.renderCartItems();
  }

  checkout() {
    if (this.state.cart.length === 0) {
      this.showNotification('Panier vide');
      return;
    }
    const total = this.state.cart.reduce((sum, c) => sum + (c.price_avg || c.price || 0), 0);
    this.showNotification(`Commande validée: ${this.state.cart.length} carte(s) pour EUR${total.toFixed(2)}`);
    this.state.cart = [];
    this.updateCart();
    this.toggleCart();
  }

  addCardToCollection(event) {
    event.preventDefault();
    const newCard = {
      id: this.state.myCollection.length + this.state.allCards.length + 1,
      name: document.getElementById('cardName')?.value || 'Carte',
      club: document.getElementById('cardClub')?.value || 'N/A',
      type: document.getElementById('cardType')?.value || 'Base',
      position: document.getElementById('cardPosition')?.value || '-',
      price: parseFloat(document.getElementById('cardPrice')?.value) || 0
    };
    this.state.myCollection.push(newCard);
    this.saveToStorage();
    this.showNotification('Carte ajoutée à votre collection');
    this.updateStats();
    event.target.reset();
  }

  addAndSell() {
    const newCard = {
      id: this.state.forSaleCards.length + this.state.allCards.length + 1,
      name: document.getElementById('cardName')?.value || 'Carte',
      club: document.getElementById('cardClub')?.value || 'N/A',
      price: parseFloat(document.getElementById('cardPrice')?.value) || 0
    };
    this.state.forSaleCards.push(newCard);
    this.saveToStorage();
    this.showNotification('Carte ajoutée à la vente');
    this.updateStats();
  }

  saveToStorage() {
    localStorage.setItem('cartashop_collection', JSON.stringify(this.state.myCollection));
    localStorage.setItem('cartashop_forsale', JSON.stringify(this.state.forSaleCards));
  }

  loadFromStorage() {
    try {
      const collection = localStorage.getItem('cartashop_collection');
      const forSale = localStorage.getItem('cartashop_forsale');
      if (collection) this.state.myCollection = JSON.parse(collection);
      if (forSale) this.state.forSaleCards = JSON.parse(forSale);
      this.updateStats();
    } catch (error) {
      console.warn('[CartaShop] Erreur localStorage:', error);
    }
  }

  showNotification(message) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    notif.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #4caf50; color: white; padding: 1rem 1.5rem; border-radius: 8px; z-index: 9999; animation: slideIn 0.3s ease-out;';
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
  }

  showError(message) {
    const grid = document.getElementById('cardsGrid');
    if (grid) grid.innerHTML = `<div style="grid-column: 1/-1; padding: 2rem; text-align: center; color: #d32f2f;"><h3>Erreur</h3><p>${message}</p></div>`;
  }
}

let app = null;
window.addEventListener('load', () => {
  app = new CartaShopApp();
  console.log('[CartaShop] Application lancée avec succès');
});
