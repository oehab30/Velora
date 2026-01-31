// ==========================================
// VELORA - Luxury E-Commerce Cart System
// ==========================================

// Cart State Management
class ShoppingCart {
  constructor() {
    this.items = this.loadCart();
    this.wishlist = this.loadWishlist();
    this.init();
  }

  init() {
    this.updateCartBadge();
    this.attachEventListeners();
    if (window.location.pathname.includes('cart.html')) {
      this.renderCart();
    }
  }

  // LocalStorage Management
  loadCart() {
    const saved = localStorage.getItem('veloraCart');
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem('veloraCart', JSON.stringify(this.items));
    this.updateCartBadge();
  }

  loadWishlist() {
    const saved = localStorage.getItem('veloraWishlist');
    return saved ? JSON.parse(saved) : [];
  }

  saveWishlist() {
    localStorage.setItem('veloraWishlist', JSON.stringify(this.wishlist));
  }

  // Add to Cart
  addToCart(product) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        quantity: 1,
        size: product.size || 'M',
        color: product.color || 'Default'
      });
    }
    
    this.saveCart();
    this.showNotification(`${product.name} added to cart!`);
    
    if (window.location.pathname.includes('cart.html')) {
      this.renderCart();
    }
  }

  // Remove from Cart
  removeFromCart(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
    this.renderCart();
    this.showNotification('Item removed from cart');
  }

  // Update Quantity
  updateQuantity(productId, newQuantity) {
    const item = this.items.find(item => item.id === productId);
    if (item && newQuantity > 0 && newQuantity <= 10) {
      item.quantity = newQuantity;
      this.saveCart();
      this.renderCart();
    }
  }

  // Wishlist Management
  toggleWishlist(product) {
    const index = this.wishlist.findIndex(item => item.id === product.id);
    
    if (index > -1) {
      this.wishlist.splice(index, 1);
      this.showNotification('Removed from wishlist');
    } else {
      this.wishlist.push(product);
      this.showNotification('Added to wishlist ♥');
    }
    
    this.saveWishlist();
    this.updateWishlistUI();
  }

  isInWishlist(productId) {
    return this.wishlist.some(item => item.id === productId);
  }

  updateWishlistUI() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      const productCard = btn.closest('.pro');
      if (productCard) {
        const productId = productCard.dataset.productId;
        if (this.isInWishlist(productId)) {
          btn.classList.add('active');
          btn.querySelector('i').classList.replace('fa-regular', 'fa-solid');
        } else {
          btn.classList.remove('active');
          btn.querySelector('i').classList.replace('fa-solid', 'fa-regular');
        }
      }
    });
  }

  // Cart Badge Update
  updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    if (badge) {
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
  }

  // Calculate Totals
  calculateSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  calculateTotal() {
    const subtotal = this.calculateSubtotal();
    const tax = 0; // Add tax calculation if needed
    const shipping = subtotal > 5000 ? 0 : 0; // Free shipping over 5000
    return subtotal + tax + shipping;
  }

  // Render Cart Page
  renderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const summarySubtotal = document.querySelector('.summary-line:nth-child(1) span:last-child');
    const summaryTotal = document.querySelector('.total-price');
    const itemCount = document.querySelector('.cart-section-title');

    if (!cartItemsContainer) return;

    if (this.items.length === 0) {
      cartItemsContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <i class="fa-solid fa-bag-shopping" style="font-size: 60px; color: #ddd; margin-bottom: 20px;"></i>
          <h3 style="color: #999; margin-bottom: 10px;">Your bag is empty</h3>
          <p style="color: #999; margin-bottom: 30px;">Add some luxury pieces to get started</p>
          <a href="shop.html" class="btn-checkout" style="display: inline-block; width: auto;">Continue Shopping</a>
        </div>
      `;
      if (itemCount) itemCount.textContent = 'Your Shopping Bag (0)';
      if (summarySubtotal) summarySubtotal.textContent = 'EGP 0.00';
      if (summaryTotal) summaryTotal.textContent = 'EGP 0.00';
      return;
    }

    // Update item count
    if (itemCount) {
      itemCount.textContent = `Items in Your Bag (${this.items.length})`;
    }

    // Render cart items
    cartItemsContainer.innerHTML = this.items.map(item => `
      <div class="cart-item" data-product-id="${item.id}">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p class="cart-item-brand">${item.brand}</p>
          <div class="cart-item-specs">
            <span>Size: ${item.size}</span>
            <span>Color: ${item.color}</span>
          </div>
          <div class="cart-item-actions">
            <button class="btn-text save-later-btn" data-id="${item.id}">
              <i class="fa-regular fa-heart"></i> Save for Later
            </button>
            <button class="btn-text btn-remove remove-item-btn" data-id="${item.id}">
              <i class="fa-regular fa-trash-can"></i> Remove
            </button>
          </div>
        </div>
        <div class="cart-item-quantity">
          <label>Quantity</label>
          <div class="quantity-selector">
            <button class="qty-btn qty-decrease" data-id="${item.id}">-</button>
            <input type="number" value="${item.quantity}" min="1" max="10" data-id="${item.id}" class="qty-input">
            <button class="qty-btn qty-increase" data-id="${item.id}">+</button>
          </div>
        </div>
        <div class="cart-item-price">
          <p class="price-current">EGP ${(item.price * item.quantity).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
        </div>
      </div>
    `).join('');

    // Update summary
    const subtotal = this.calculateSubtotal();
    const total = this.calculateTotal();
    
    if (summarySubtotal) {
      summarySubtotal.textContent = `EGP ${subtotal.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    }
    if (summaryTotal) {
      summaryTotal.textContent = `EGP ${total.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    }

    // Attach cart page event listeners
    this.attachCartPageListeners();
  }

  // Attach Cart Page Listeners
  attachCartPageListeners() {
    // Remove buttons
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        this.removeFromCart(id);
      });
    });

    // Quantity decrease
    document.querySelectorAll('.qty-decrease').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const item = this.items.find(item => item.id === id);
        if (item && item.quantity > 1) {
          this.updateQuantity(id, item.quantity - 1);
        }
      });
    });

    // Quantity increase
    document.querySelectorAll('.qty-increase').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const item = this.items.find(item => item.id === id);
        if (item && item.quantity < 10) {
          this.updateQuantity(id, item.quantity + 1);
        }
      });
    });

    // Quantity input
    document.querySelectorAll('.qty-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const id = e.currentTarget.dataset.id;
        const newQty = parseInt(e.currentTarget.value);
        this.updateQuantity(id, newQty);
      });
    });

    // Save for later
    document.querySelectorAll('.save-later-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const item = this.items.find(item => item.id === id);
        if (item) {
          this.toggleWishlist(item);
          this.removeFromCart(id);
        }
      });
    });
  }

  // Attach Event Listeners
  attachEventListeners() {
    // Add to Cart buttons
    document.querySelectorAll('.pro-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = e.currentTarget.closest('.pro');
        const product = this.extractProductData(productCard);
        this.addToCart(product);
      });
    });

    // Wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = e.currentTarget.closest('.pro');
        const product = this.extractProductData(productCard);
        this.toggleWishlist(product);
      });
    });

    // Update wishlist UI on page load
    this.updateWishlistUI();
  }

  // Extract Product Data from Card
  extractProductData(card) {
    if (!card) return null;

    // Generate unique ID if not present
    if (!card.dataset.productId) {
      card.dataset.productId = 'prod-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    const img = card.querySelector('.pro-img-primary') || card.querySelector('img');
    const brand = card.querySelector('.description span');
    const name = card.querySelector('.description h5');
    const price = card.querySelector('.description h4');

    return {
      id: card.dataset.productId,
      name: name ? name.textContent.trim() : 'Luxury Item',
      brand: brand ? brand.textContent.trim() : 'Atelier Velora',
      price: price ? parseFloat(price.textContent.replace(/[^0-9.]/g, '')) : 0,
      image: img ? img.src : '',
      size: 'M',
      color: 'Default'
    };
  }

  // Show Notification
  showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.velora-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'velora-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// ==========================================
// Initialize on DOM Load
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Shopping Cart
  window.veloraCart = new ShoppingCart();

  // Header & Navigation
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const navLeft = document.querySelector(".nav-left");

  if (toggle && navLeft) {
    toggle.addEventListener("click", () => {
      navLeft.classList.toggle("active");
      const isOpen = navLeft.classList.contains("active");
      toggle.setAttribute("aria-expanded", isOpen);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLeft.contains(e.target) && !toggle.contains(e.target) && navLeft.classList.contains('active')) {
        navLeft.classList.remove('active');
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Checkout button
  const checkoutBtn = document.querySelector('.btn-checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
      if (!window.location.pathname.includes('cart.html')) return;
      
      e.preventDefault();
      if (window.veloraCart.items.length === 0) {
        window.veloraCart.showNotification('Your cart is empty!');
        return;
      }
      window.veloraCart.showNotification('Proceeding to checkout... (Demo)');
      // In production, redirect to checkout page
      // window.location.href = 'checkout.html';
    });
  }

  // Promo code application
  const applyPromoBtn = document.querySelector('.btn-apply');
  if (applyPromoBtn) {
    applyPromoBtn.addEventListener('click', () => {
      const promoInput = document.querySelector('.promo-code input');
      const code = promoInput ? promoInput.value.trim().toUpperCase() : '';
      
      if (code === 'VELORA10') {
        window.veloraCart.showNotification('Promo code applied! 10% discount');
      } else if (code) {
        window.veloraCart.showNotification('Invalid promo code');
      }
    });
  }
});
