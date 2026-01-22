// CartaShop - Application de gestion de collection de cartes
// Module principal de l'application

class CartaShopApp {
  constructor() {
    this.cards = [];
    this.filteredCards = [];
    this.selectedCards = [];
    this.init();
  }

  async init() {
    await this.loadCards();
    this.setupEventListeners();
    this.renderCards();
  }

  // Charger les cartes depuis le fichier JSON
  async loadCards() {
    try {
      const response = await fetch('cards.json');
      if (!response.ok) throw new Error('Erreur lors du chargement des cartes');
      this.cards = await response.json();
      this.filteredCards = [...this.cards];
      console.log(`${this.cards.length} cartes chargées`);
    } catch (error) {
      console.error('Erreur:', error);
      this.showNotification('Erreur lors du chargement des cartes', 'error');
    }
  }

  // Configuration des écouteurs d'événements
  setupEventListeners() {
    // Recherche
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    }

    // Filtres
    const filterInputs = document.querySelectorAll('.filter-input');
    filterInputs.forEach(input => {
      input.addEventListener('change', () => this.applyFilters());
    });

    // Tri
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => this.sortCards(e.target.value));
    }
  }

  // Recherche de cartes
  handleSearch(query) {
    query = query.toLowerCase().trim();
    if (!query) {
      this.filteredCards = [...this.cards];
    } else {
      this.filteredCards = this.cards.filter(card => 
        card.name.toLowerCase().includes(query) ||
        (card.team && card.team.toLowerCase().includes(query)) ||
        (card.position && card.position.toLowerCase().includes(query))
      );
    }
    this.applyFilters();
  }

  // Appliquer les filtres
  applyFilters() {
    let filtered = [...this.filteredCards];

    // Filtre par rareté
    const rarityFilter = document.getElementById('rarityFilter')?.value;
    if (rarityFilter && rarityFilter !== 'all') {
      filtered = filtered.filter(card => card.rarity === rarityFilter);
    }

    // Filtre par équipe
    const teamFilter = document.getElementById('teamFilter')?.value;
    if (teamFilter && teamFilter !== 'all') {
      filtered = filtered.filter(card => card.team === teamFilter);
    }

    this.filteredCards = filtered;
    this.renderCards();
  }

  // Tri des cartes
  sortCards(sortBy) {
    const sorted = [...this.filteredCards];
    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rarity':
        const rarityOrder = { 'common': 1, 'uncommon': 2, 'rare': 3, 'epic': 4, 'legendary': 5 };
        sorted.sort((a, b) => (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0));
        break;
    }
    this.filteredCards = sorted;
    this.renderCards();
  }

  // Afficher les cartes
  renderCards() {
    const container = document.getElementById('cardsContainer');
    if (!container) return;

    if (this.filteredCards.length === 0) {
      container.innerHTML = '<p class="no-results">Aucune carte trouvée</p>';
      this.updateStats();
      return;
    }

    container.innerHTML = this.filteredCards.map(card => this.createCardElement(card)).join('');
    this.attachCardListeners();
    this.updateStats();
  }

  // Créer l'élément HTML d'une carte
  createCardElement(card) {
    return `
      <div class="card-item" data-card-id="${card.id}">
        <div class="card-image">
          ${card.image ? `<img src="${card.image}" alt="${card.name}" loading="lazy">` : '<div class="no-image">Image</div>'}
        </div>
        <div class="card-info">
          <h3>${card.name}</h3>
          ${card.team ? `<p class="team">${card.team}</p>` : ''}
          ${card.position ? `<p class="position">${card.position}</p>` : ''}
          <p class="rarity">${this.getRarityLabel(card.rarity)}</p>
          ${card.price ? `<p class="price">${card.price}€</p>` : ''}
        </div>
        <div class="card-actions">
          <button class="btn-select" data-card-id="${card.id}">Sélectionner</button>
          <button class="btn-details" data-card-id="${card.id}">Détails</button>
        </div>
      </div>
    `;
  }

  // Attacher les écouteurs aux cartes
  attachCardListeners() {
    document.querySelectorAll('.btn-select').forEach(btn => {
      btn.addEventListener('click', (e) => this.toggleCardSelection(e.target.dataset.cardId));
    });

    document.querySelectorAll('.btn-details').forEach(btn => {
      btn.addEventListener('click', (e) => this.showCardDetails(e.target.dataset.cardId));
    });
  }

  // Basculer la sélection d'une carte
  toggleCardSelection(cardId) {
    const index = this.selectedCards.findIndex(id => id === cardId);
    if (index > -1) {
      this.selectedCards.splice(index, 1);
    } else {
      this.selectedCards.push(cardId);
    }
    this.updateSelectedCardsDisplay();
  }

  // Afficher les détails d'une carte
  showCardDetails(cardId) {
    const card = this.cards.find(c => c.id == cardId);
    if (card) {
      const details = `
        Nom: ${card.name}
        Équipe: ${card.team || 'N/A'}
        Position: ${card.position || 'N/A'}
        Rareté: ${this.getRarityLabel(card.rarity)}
        Prix: ${card.price ? card.price + '€' : 'N/A'}
      `;
      alert(details);
    }
  }

  // Mettre à jour l'affichage des cartes sélectionnées
  updateSelectedCardsDisplay() {
    const selectedCount = this.selectedCards.length;
    document.querySelectorAll('.card-item').forEach(item => {
      const cardId = item.dataset.cardId;
      if (this.selectedCards.includes(cardId)) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    });

    const selectedDisplay = document.getElementById('selectedCount');
    if (selectedDisplay) {
      selectedDisplay.textContent = `${selectedCount} carte(s) sélectionnée(s)`;
    }
  }

  // Mettre à jour les statistiques
  updateStats() {
    const statsContainer = document.getElementById('statsContainer');
    if (statsContainer) {
      const totalPrice = this.filteredCards.reduce((sum, card) => sum + (card.price || 0), 0);
      statsContainer.innerHTML = `
        <p>Cartes affichées: ${this.filteredCards.length}</p>
        <p>Valeur totale: ${totalPrice.toFixed(2)}€</p>
      `;
    }
  }

  // Obtenir le label de rareté
  getRarityLabel(rarity) {
    const labels = {
      'common': 'Commune',
      'uncommon': 'Peu courante',
      'rare': 'Rare',
      'epic': 'Épique',
      'legendary': 'Légendaire'
    };
    return labels[rarity] || rarity;
  }

  // Afficher une notification
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  // Exporter les cartes sélectionnées
  exportSelectedCards() {
    const selected = this.cards.filter(card => this.selectedCards.includes(String(card.id)));
    if (selected.length === 0) {
      this.showNotification('Aucune carte sélectionnée', 'warning');
      return;
    }
    const csv = this.convertToCSV(selected);
    this.downloadCSV(csv, 'cartes-selectionnees.csv');
  }

  // Convertir en CSV
  convertToCSV(data) {
    const headers = ['ID', 'Nom', 'Équipe', 'Position', 'Rareté', 'Prix'];
    const rows = data.map(card => [
      card.id,
      card.name,
      card.team || '',
      card.position || '',
      this.getRarityLabel(card.rarity),
      card.price || ''
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  // Télécharger un CSV
  downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Initialiser l'application au chargement du DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new CartaShopApp();
  });
} else {
  window.app = new CartaShopApp();
}
