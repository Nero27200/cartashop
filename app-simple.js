// CartaShop v2.0 - Script d'initialisation simple et efficace
// Compatible avec le HTML existant

document.addEventListener('DOMContentLoaded', async function() {
  console.log('[CartaShop] Initialisation...');
  
  // Charger les cartes
  try {
    const response = await fetch('./cards.json');
    if (!response.ok) throw new Error('Erreur HTTP: ' + response.status);
    
    const cards = await response.json();
    console.log(`[CartaShop] ${cards.length} cartes chargees`);
    
    // Initialiser l'interface
    initializeUI(cards);
    
  } catch (error) {
    console.error('[CartaShop] Erreur:', error);
    displayError(error.message);
  }
});

function initializeUI(cards) {
  // Afficher les cartes dans la boutique
  displayCards(cards, 'shop');
  
  // Configuration des filtres
  setupFilters(cards);
  
  // Configuration de la recherche
  setupSearch(cards);
  
  // Configuration de la barre de panier
  setupCart();
}

function displayCards(cards, section = 'shop') {
  const grid = document.getElementById('cardsGrid');
  if (!grid) {
    console.error('[CartaShop] Element #cardsGrid non trouve');
    return;
  }
  
  grid.innerHTML = cards.slice(0, 50).map(card => `
    <div class="card" data-id="${card.id}">
      <div class="card-image">
        ${card.image ? `<img src="${card.image}" alt="${card.name}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22280%22%3E%3Crect fill=%22%23333%22 width=%22200%22 height=%22280%22/%3E%3C/svg%3E'">` : '<div style="background:#444; width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#999;">No Image</div>'}
      </div>
      <div class="card-details">
        <h4>${card.name || 'Unknown'}</h4>
        <p>${card.club || ''}</p>
        <span class="price">€${(card.price || 0).toFixed(2)}</span>
      </div>
      <div class="card-actions">
        <button onclick="addToCart(${card.id}, '${card.name}')">🛒 Ajouter</button>
      </div>
    </div>
  `).join('');
  
  updateStats(cards);
}

function setupFilters(cards) {
  const clubFilter = document.getElementById('clubFilter');
  const typeFilter = document.getElementById('typeFilter');
  
  if (clubFilter) {
    const clubs = [...new Set(cards.map(c => c.club).filter(Boolean))];
    clubFilter.innerHTML = '<option value="">Tous les clubs</option>' + 
      clubs.map(club => `<option value="${club}">${club}</option>`).join('');
    clubFilter.addEventListener('change', () => applyFilters(cards));
  }
  
  if (typeFilter) {
    typeFilter.addEventListener('change', () => applyFilters(cards));
  }
}

function setupSearch(cards) {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      if (!query) {
        displayCards(cards);
        return;
      }
      
      const filtered = cards.filter(card => 
        card.name.toLowerCase().includes(query) ||
        (card.club && card.club.toLowerCase().includes(query))
      );
      displayCards(filtered);
    });
  }
}

function applyFilters(cards) {
  let filtered = [...cards];
  
  const clubFilter = document.getElementById('clubFilter')?.value;
  if (clubFilter) {
    filtered = filtered.filter(c => c.club === clubFilter);
  }
  
  displayCards(filtered);
}

function setupCart() {
  const cartBtn = document.querySelector('[aria-label="Ouvrir le panier"]');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => openCart());
  }
}

let cartItems = [];

function addToCart(cardId, cardName) {
  cartItems.push({id: cardId, name: cardName});
  updateCartCount();
  showNotification(`${cardName} ajoutee au panier`);
}

function updateCartCount() {
  const badge = document.getElementById('cartCount');
  if (badge) {
    badge.textContent = cartItems.length;
    badge.style.display = cartItems.length > 0 ? 'block' : 'none';
  }
}

function openCart() {
  const modal = document.getElementById('cartModal');
  if (!modal) return;
  
  const cartItemsDiv = document.getElementById('cartItems');
  if (cartItemsDiv) {
    cartItemsDiv.innerHTML = cartItems.length ? 
      cartItems.map((item, idx) => 
        `<div style="padding: 0.5rem; border-bottom: 1px solid #ccc;">${item.name} <button onclick="removeFromCart(${idx})">Supprimer</button></div>`
      ).join('') : 
      '<p>Panier vide</p>';
  }
  
  modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
}

function removeFromCart(index) {
  cartItems.splice(index, 1);
  updateCartCount();
  openCart();
}

function updateStats(cards) {
  const shopTotal = document.getElementById('shopTotal');
  if (shopTotal) {
    shopTotal.textContent = cards.length;
  }
  
  const avgPrice = document.getElementById('avgPrice');
  if (avgPrice && cards.length > 0) {
    const avg = cards.reduce((sum, c) => sum + (c.price || 0), 0) / cards.length;
    avgPrice.textContent = avg.toFixed(2) + '€';
  }
}

function showNotification(message) {
  const notif = document.createElement('div');
  notif.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4caf50;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    z-index: 9999;
    animation: slideIn 0.3s ease-out;
  `;
  notif.textContent = message;
  document.body.appendChild(notif);
  
  setTimeout(() => notif.remove(), 3000);
}

function displayError(message) {
  const grid = document.getElementById('cardsGrid');
  if (grid) {
    grid.innerHTML = `<div style="padding: 2rem; text-align: center; color: #d32f2f;">
      <h3>⚠️ Erreur</h3>
      <p>${message}</p>
      <p style="font-size: 0.9rem; color: #999;">Assurez-vous que le fichier cards.json existe dans le meme dossier.</p>
    </div>`;
  }
}

// Ajouter l'animation CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  .card {
    background: #1a1a2e;
    border: 1px solid #16213e;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.3);
  }
  
  .card-image {
    width: 100%;
    aspect-ratio: 3/4;
    background: linear-gradient(135deg, #16213e, #0f3460);
    overflow: hidden;
  }
  
  .card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .card-details {
    padding: 1rem;
    border-bottom: 1px solid #16213e;
  }
  
  .card-details h4 {
    margin: 0 0 0.5rem 0;
    color: #fff;
  }
  
  .card-details p {
    margin: 0.25rem 0;
    color: #999;
    font-size: 0.9rem;
  }
  
  .price {
    color: #4caf50;
    font-weight: bold;
  }
  
  .card-actions button {
    width: 100%;
    padding: 0.75rem;
    background: #0f3460;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.2s;
  }
  
  .card-actions button:hover {
    background: #16213e;
  }
`;
document.head.appendChild(style);

console.log('[CartaShop] Script carge avec succes');
