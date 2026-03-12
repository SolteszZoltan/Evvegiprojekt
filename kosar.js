document.addEventListener('DOMContentLoaded', function() {
    console.log('🛒 Kosar.js betöltve');
    
    // ✅ DEBUG: Mi van a localStorage-ban?
    const rawCart = localStorage.getItem('pronyo_cart');
    console.log('📦 Nyers localStorage adat:', rawCart);
    
    try {
        const parsed = rawCart ? JSON.parse(rawCart) : [];
        console.log('📦 Parseolt kosár:', parsed);
    } catch (e) {
        console.error('❌ Nem sikerült parseolni a kosarat!', e);
    }
    
    renderCart();
    setupEventListeners();
    updateCartIcon();
});

function setupEventListeners() {
    const cartItems = document.getElementById('cart-items');
    if (cartItems) {
        cartItems.addEventListener('click', function(e) {
            if (e.target.classList.contains('qty-minus') || e.target.classList.contains('qty-plus')) {
                const itemId = e.target.closest('.cart-item')?.dataset.id;
                if (!itemId) return;
                
                const change = e.target.classList.contains('qty-plus') ? 1 : -1;
                updateQuantity(itemId, change);
            }
           
            if (e.target.classList.contains('remove-btn') || e.target.closest('.remove-btn')) {
                const btn = e.target.classList.contains('remove-btn') ? e.target : e.target.closest('.remove-btn');
                const itemId = btn.closest('.cart-item')?.dataset.id;
                if (itemId) {
                    removeFromCart(itemId);
                }
            }
        });
    }
   
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = getCart();
            if (cart.length === 0) {
                alert('A kosarad üres! 🛒');
                return;
            }
            alert('Köszönjük a rendelésed! 🎉\n\nEz egy demó oldal, a fizetés nem valós.');
        });
    }
}

function getCart() {
    try {
        const cartJSON = localStorage.getItem('pronyo_cart');
        return cartJSON ? JSON.parse(cartJSON) : [];
    } catch (e) {
        console.error('❌ Hiba a kosár olvasásakor:', e);
        return [];
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem('pronyo_cart', JSON.stringify(cart));
        console.log('💾 Kosár elmentve:', cart);
    } catch (e) {
        console.error('❌ Hiba a kosár mentésekor:', e);
    }
}

function renderCart() {
    const cart = getCart();
    const cartContainer = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    
    if (!cartContainer) {
        console.error('❌ Nem található #cart-items elem!');
        return;
    }
   
    if (cart.length === 0) {
        console.log('📭 Kosár üres');
        cartContainer.innerHTML = '';
        if (emptyCart) emptyCart.classList.remove('hidden');
        updateSummary(0);
        return;
    }
   
    if (emptyCart) emptyCart.classList.add('hidden');
   
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image || 'http://placehold.it/350x200'}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h3 class="cart-item-title">${item.name || 'Ismeretlen termék'}</h3>
                <p class="cart-item-desc">${item.description || ''}</p>
                <span class="cart-item-price">${(item.price || 0).toLocaleString('hu-HU')} Ft</span>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-control">
                    <button class="qty-minus">−</button>
                    <span>${item.quantity || 1}</span>
                    <button class="qty-plus">+</button>
                </div>
                <button class="remove-btn">✕ Törlés</button>
            </div>
        </div>
    `).join('');
   
    const total = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    updateSummary(total);
}

function updateSummary(subtotal) {
    const shipping = subtotal > 0 ? 0 : 0;
    const total = subtotal + shipping;
   
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = `${subtotal.toLocaleString('hu-HU')} Ft`;
    if (shippingEl) shippingEl.textContent = subtotal > 0 ? 'Ingyenes' : '–';
    if (totalEl) totalEl.textContent = `${total.toLocaleString('hu-HU')} Ft`;
}

function updateQuantity(itemId, change) {
    let cart = getCart();
    const item = cart.find(i => i.id === itemId);
   
    if (item) {
        item.quantity = (item.quantity || 1) + change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== itemId);
        }
        saveCart(cart);
        renderCart();
        updateCartIcon();
    }
}

function removeFromCart(itemId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== itemId);
    saveCart(cart);
    renderCart();
    updateCartIcon();
}

function updateCartIcon() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = count;
    }
}