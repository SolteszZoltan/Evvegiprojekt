document.addEventListener('DOMContentLoaded', function() {
    console.log('🛒 Cipok.js betöltve - Méret szűréssel');
    
    // 🔍 URL PARAMÉTER OLVASÁS
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
    
    // ✅ ÖSSZES EGYEDI MÉRET GYŰJTÉSE MÁRKA SZERINT
    function getAvailableSizesByBrand(brand) {
        const cards = document.querySelectorAll('.shop-card');
        const sizes = new Set();
        
        cards.forEach(card => {
            if (card.getAttribute('data-cat') === brand) {
                const sizesAttr = card.getAttribute('data-sizes');
                if (sizesAttr) {
                    sizesAttr.split(',').forEach(size => sizes.add(size.trim()));
                }
            }
        });
        
        return Array.from(sizes).sort((a, b) => parseFloat(a) - parseFloat(b));
    }
    
    // ✅ MÉRET GOMBOK LÉTREHOZÁSA
    function createSizeButtons(brand, selectedSize) {
        const sizes = getAvailableSizesByBrand(brand);
        const sizeFilterDiv = document.querySelector('.size-filter');
        
        if (!sizeFilterDiv) return;
        
        sizeFilterDiv.innerHTML = `
            <div class="size-filter-title">Elérhető méretek:</div>
            <div class="size-buttons">
                ${sizes.map(size => `
                    <button class="size-btn ${selectedSize === size ? 'active' : ''}" 
                            data-size="${size}" 
                            onclick="selectSize('${brand}', '${size}')">
                        ${size}
                    </button>
                `).join('')}
            </div>
        `;
        
        sizeFilterDiv.classList.add('active');
    }
    
    // ✅ MÉRET KIVÁLASZTÁSA
    window.selectSize = function(brand, size) {
        console.log('📏 Méret kiválasztva:', brand, size);
        
        // URL frissítése
        const newUrl = `cipok.html?brand=${encodeURIComponent(brand)}&size=${encodeURIComponent(size)}`;
        window.history.pushState({brand, size}, '', newUrl);
        
        // Szűrés alkalmazása
        applyFilters(brand, size);
        
        // Aktív gomb frissítése
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-size') === size) {
                btn.classList.add('active');
            }
        });
    };
    
    // ✅ SZŰRÉS ALKALMAZÁSA (MÁRKA + MÉRET)
    function applyFilters(brand, size) {
        const cards = document.querySelectorAll('.shop-card');
        let visibleCount = 0;
        
        cards.forEach(card => {
            const cardBrand = card.getAttribute('data-cat');
            const cardSizes = card.getAttribute('data-sizes') ? card.getAttribute('data-sizes').split(',').map(s => s.trim()) : [];
            
            let showCard = false;
            
            if (brand && size) {
                // Mindkét szűrő aktív
                showCard = (cardBrand === brand) && cardSizes.includes(size);
            } else if (brand) {
                // Csak márka szűrő
                showCard = (cardBrand === brand);
            } else {
                // Nincs szűrő
                showCard = true;
            }
            
            if (showCard) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        console.log(`✅ Megjelenítve: ${visibleCount} cipő`);
        
        // Oldalcím frissítése
        if (brand && size) {
            document.title = `${brand} - ${size} méret - Prónyó Kicks`;
        } else if (brand) {
            document.title = `${brand} - Prónyó Kicks`;
        } else {
            document.title = 'Cipők - Prónyó Kicks';
        }
    }
    
    // ✅ MENÜ KATTINTÁS KEZELÉSE
    document.querySelectorAll('.menu-item').forEach(menuItem => {
        menuItem.addEventListener('click', function(e) {
            // Ha size gombra kattintottak, ne csináljon semmit
            if (e.target.classList.contains('size-btn')) return;
            
            const href = this.getAttribute('href');
            if (!href || href === 'cipok.html') {
                // "Összes" gomb
                e.preventDefault();
                window.history.pushState({}, '', 'cipok.html');
                location.reload();
                return;
            }
            
            const urlParams = new URLSearchParams(href.split('?')[1]);
            const brand = urlParams.get('brand');
            
            if (brand) {
                e.preventDefault();
                
                // URL frissítése
                window.history.pushState({brand}, '', href);
                
                // Méret gombok megjelenítése
                createSizeButtons(brand, null);
                
                // Csak márka szerinti szűrés
                applyFilters(brand, null);
                
                // Aktív menüelem
                document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // 🚀 OLDAL BETÖLTÉSEKOR
    const brandParam = getUrlParameter('brand');
    const sizeParam = getUrlParameter('size');
    
    console.log('🔍 URL paraméterek:', brandParam, sizeParam);
    
    if (brandParam) {
        // Márka kiválasztása a menüben
        document.querySelectorAll('.menu-item').forEach(item => {
            const href = item.getAttribute('href');
            if (href && href.includes('brand=' + brandParam)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Méret gombok létrehozása
        createSizeButtons(brandParam, sizeParam);
        
        // Szűrés alkalmazása
        applyFilters(brandParam, sizeParam);
    }
    
    // 📦 KOSÁR FUNKCIÓK
    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.shop-card');
            const uniqueId = 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            const priceText = card.querySelector('.price').textContent.trim().replace('$', '').replace(',', '');
            const priceInFt = parseInt(priceText) * 350;
            const activeImg = card.querySelector('.sneaker_img.active') || card.querySelector('.sneaker_img:first-child');
            const imageSrc = activeImg ? activeImg.src : 'images/placeholder.jpg';
            const sizes = card.getAttribute('data-sizes');
            
            const product = {
                id: uniqueId,
                name: card.querySelector('.title').textContent.trim(),
                description: card.querySelector('.desc').textContent.trim(),
                price: priceInFt,
                image: imageSrc,
                sizes: sizes,
                quantity: 1
            };

            try {
                let cart = JSON.parse(localStorage.getItem('pronyo_cart') || '[]');
                const existingItem = cart.find(item => item.name === product.name);
                if (existingItem) { existingItem.quantity += 1; } 
                else { cart.push(product); }
                localStorage.setItem('pronyo_cart', JSON.stringify(cart));
                alert('✅ ' + product.name + ' hozzáadva a kosárhoz!\nElérhető méretek: ' + sizes);
                updateCartIcon();
            } catch (error) {
                console.error('❌ Hiba:', error);
            }
        });
    });

    function updateCartIcon() {
        try {
            const cart = JSON.parse(localStorage.getItem('pronyo_cart') || '[]');
            const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            const cartCountEl = document.getElementById('cart-count');
            if (cartCountEl) cartCountEl.textContent = count;
        } catch (e) { console.error(e); }
    }
    updateCartIcon();

    // 🖼️ SLIDER
    const productSlides = document.querySelectorAll('.product .slides');
    productSlides.forEach(slideArea => {
        const images = slideArea.querySelectorAll('.sneaker_img');
        if (images.length === 0) return;
        let currentSlide = 0;
        let zCounter = 10;
        
        images.forEach((img, index) => {
            if (index === 0) { img.classList.add('active'); img.style.opacity = '1'; img.style.zIndex = '10'; } 
            else { img.style.opacity = '0'; img.style.zIndex = '1'; }
        });
        
        slideArea.addEventListener('click', function(e) {
            if (e.target.closest('.button')) return;
            images[currentSlide].classList.remove('active');
            images[currentSlide].style.opacity = '0';
            images[currentSlide].style.zIndex = '1';
            currentSlide = (currentSlide + 1) % images.length;
            zCounter++;
            images[currentSlide].classList.add('active');
            images[currentSlide].style.zIndex = zCounter;
            images[currentSlide].style.opacity = '1';
            images[currentSlide].style.animation = 'fade 0.3s ease forwards';
            setTimeout(() => { images[currentSlide].style.animation = ''; }, 300);
        });
    });
    
    console.log('✅ Méret szűrő rendszer betöltve!');
});


document.addEventListener('DOMContentLoaded', function() {
    console.log('🛒 Cipok.js betöltve - Modalos méretválasztóval');
    
    let currentProduct = null;
    let selectedSize = null;
    
    // 🔍 URL PARAMÉTER OLVASÁS
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
    
    // ✅ MÉRET VÁLASZTÓ MODAL MEGNYITÁSA
    function openSizeModal(product) {
        currentProduct = product;
        selectedSize = null;
        
        const sizes = product.sizes.split(',').map(s => s.trim());
        
        const modalHTML = `
            <div class="size-modal-overlay active" id="sizeModal">
                <div class="size-modal">
                    <div class="size-modal-header">
                        <h3 class="size-modal-title">Válassz méretet</h3>
                        <button class="size-modal-close" onclick="closeSizeModal()">×</button>
                    </div>
                    <div class="size-modal-product">
                        <div class="size-modal-product-name">${product.name}</div>
                        <div class="size-modal-product-price">${product.price.toLocaleString('hu-HU')} Ft</div>
                    </div>
                    <label class="size-modal-label">Elérhető méretek:</label>
                    <div class="size-modal-sizes">
                        ${sizes.map(size => `
                            <button class="size-modal-size-btn" data-size="${size}" onclick="selectModalSize('${size}')">
                                ${size}
                            </button>
                        `).join('')}
                    </div>
                    <div class="size-modal-actions">
                        <button class="size-modal-cancel" onclick="closeSizeModal()">Mégse</button>
                        <button class="size-modal-add" id="addToCartBtn" disabled onclick="confirmAddToCart()">Kosárba</button>
                    </div>
                </div>
            </div>
        `;
        
        // Modal hozzáadása a body-hoz
        const existingModal = document.getElementById('sizeModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // ✅ MODAL BEZÁRÁSA
    window.closeSizeModal = function() {
        const modal = document.getElementById('sizeModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
        currentProduct = null;
        selectedSize = null;
    };
    
    // ✅ MÉRET KIVÁLASZTÁSA A MODALBAN
    window.selectModalSize = function(size) {
        selectedSize = size;
        
        // Összes gomb resetelése
        document.querySelectorAll('.size-modal-size-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Kiválasztott gomb kiemelése
        document.querySelector(`.size-modal-size-btn[data-size="${size}"]`).classList.add('selected');
        
        // Kosárba gomb engedélyezése
        document.getElementById('addToCartBtn').disabled = false;
    };
    
    // ✅ KOSÁRBA RAKÁS MEGERŐSÍTÉSE
    window.confirmAddToCart = function() {
        if (!currentProduct || !selectedSize) return;
        
        const uniqueId = 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const cartItem = {
            id: uniqueId,
            name: currentProduct.name,
            description: currentProduct.description,
            price: currentProduct.price,
            image: currentProduct.image,
            size: selectedSize,
            quantity: 1
        };
        
        try {
            let cart = JSON.parse(localStorage.getItem('pronyo_cart') || '[]');
            
            // Ellenőrizzük, hogy van-e már ilyen termék ugyanazzal a mérettel
            const existingItem = cart.find(item => item.name === cartItem.name && item.size === cartItem.size);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push(cartItem);
            }
            
            localStorage.setItem('pronyo_cart', JSON.stringify(cart));
            console.log('💾 Kosár mentve:', cart);
            
            // Modal bezárása
            closeSizeModal();
            
            // Sikeres hozzáadás üzenet
            alert(`✅ ${currentProduct.name}\nMéret: ${selectedSize}\nHozzáadva a kosárhoz!`);
            
            updateCartIcon();
            
        } catch (error) {
            console.error('❌ Hiba a kosár mentésekor:', error);
            alert('Hiba történt a kosár frissítésekor!');
        }
    };
    
    // ✅ KOSÁRBA GOMB KATTINTÁS
    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const card = this.closest('.shop-card');
            const priceText = card.querySelector('.price').textContent.trim().replace('$', '').replace(',', '');
            const priceInFt = parseInt(priceText) * 350;
            const activeImg = card.querySelector('.sneaker_img.active') || card.querySelector('.sneaker_img:first-child');
            const imageSrc = activeImg ? activeImg.src : 'https://placehold.co/500x400';
            const sizes = card.getAttribute('data-sizes');
            
            const product = {
                name: card.querySelector('.title').textContent.trim(),
                description: card.querySelector('.desc').textContent.trim(),
                price: priceInFt,
                image: imageSrc,
                sizes: sizes
            };
            
            // Modal megnyitása
            openSizeModal(product);
        });
    });
    
    // ✅ KOSÁR IKON FRISSÍTÉSE
    function updateCartIcon() {
        try {
            const cart = JSON.parse(localStorage.getItem('pronyo_cart') || '[]');
            const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            const cartCountEl = document.getElementById('cart-count');
            if (cartCountEl) {
                cartCountEl.textContent = count;
            }
        } catch (e) {
            console.error('Hiba a kosár ikon frissítésénél:', e);
        }
    }
    
    // Induláskor frissítés
    updateCartIcon();
    
    // 🔍 MÁRKA SZŰRÉS
    document.querySelectorAll('.menu-item').forEach(menuItem => {
        menuItem.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === 'cipok.html') return;
            
            const urlParams = new URLSearchParams(href.split('?')[1]);
            const brand = urlParams.get('brand');
            
            if (brand) {
                e.preventDefault();
                window.history.pushState({brand}, '', href);
                
                const allCards = document.querySelectorAll('.shop-card');
                let visibleCount = 0;
                
                allCards.forEach(card => {
                    const cardCat = card.getAttribute('data-cat');
                    if (cardCat === brand) {
                        card.style.display = 'flex';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                console.log(`✅ Megjelenítve: ${visibleCount} cipő (${brand})`);
                
                document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
                this.classList.add('active');
                document.title = `${brand} - Prónyó Kicks`;
            }
        });
    });
    
    // 🖼️ SLIDER
    const productSlides = document.querySelectorAll('.product .slides');
    productSlides.forEach(slideArea => {
        const images = slideArea.querySelectorAll('.sneaker_img');
        if (images.length === 0) return;
        let currentSlide = 0;
        let zCounter = 10;
        
        images.forEach((img, index) => {
            if (index === 0) { img.classList.add('active'); img.style.opacity = '1'; img.style.zIndex = '10'; } 
            else { img.style.opacity = '0'; img.style.zIndex = '1'; }
        });
        
        slideArea.addEventListener('click', function(e) {
            if (e.target.closest('.button')) return;
            images[currentSlide].classList.remove('active');
            images[currentSlide].style.opacity = '0';
            images[currentSlide].style.zIndex = '1';
            currentSlide = (currentSlide + 1) % images.length;
            zCounter++;
            images[currentSlide].classList.add('active');
            images[currentSlide].style.zIndex = zCounter;
            images[currentSlide].style.opacity = '1';
            images[currentSlide].style.animation = 'fade 0.3s ease forwards';
            setTimeout(() => { images[currentSlide].style.animation = ''; }, 300);
        });
    });
    
    console.log('✅ Modalos méretválasztó rendszer betöltve!');
});