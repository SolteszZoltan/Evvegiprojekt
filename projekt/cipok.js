// ========================================
// 🛒 PRÓNYÓ KICKS - TELJES JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🛒 Cipok.js betöltve');
    
    // ========================================
    // 📦 KOSÁR FUNKCIÓK
    // ========================================
    
    // Kosárba rakás
    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Ne váltson képet kattintáskor
            
            const card = this.closest('.shop-card');
            const uniqueId = 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            const priceText = card.querySelector('.price').textContent.trim().replace('$', '').replace(',', '');
            const priceInFt = parseInt(priceText) * 350;
            
            // Kép URL lekérése (az éppen látható kép)
            const activeImg = card.querySelector('.sneaker_img.active') || card.querySelector('.sneaker_img:first-child');
            const imageSrc = activeImg ? activeImg.src : 'http://placehold.it/350x200';
            
            const product = {
                id: uniqueId,
                name: card.querySelector('.title').textContent.trim(),
                description: card.querySelector('.desc').textContent.trim(),
                price: priceInFt,
                image: imageSrc,
                quantity: 1
            };

            console.log('➕ Hozzáadás:', product);

            try {
                let cart = JSON.parse(localStorage.getItem('pronyo_cart') || '[]');
                
                const existingItem = cart.find(item => item.name === product.name);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push(product);
                }
                
                localStorage.setItem('pronyo_cart', JSON.stringify(cart));
                console.log('💾 Kosár mentve:', cart);

                alert('✅ ' + product.name + ' hozzáadva a kosárhoz!');
                updateCartIcon();
                
            } catch (error) {
                console.error('❌ Hiba a kosár mentésekor:', error);
                alert('Hiba történt a kosár frissítésekor!');
            }
        });
    });

    // Kosár ikon frissítése
    function updateCartIcon() {
        try {
            const cart = JSON.parse(localStorage.getItem('pronyo_cart') || '[]');
            const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            const cartCountEl = document.getElementById('cart-count');
            if (cartCountEl) {
                cartCountEl.textContent = count;
            }
            console.log('🔄 Kosár ikon frissítve:', count);
        } catch (e) {
            console.error('Hiba a kosár ikon frissítésénél:', e);
        }
    }

    // Induláskor frissítés
    updateCartIcon();

    // ========================================
    // 🔍 SZŰRÉS FUNKCIÓ
    // ========================================
    
    document.querySelectorAll('.menu-item').forEach(menuItem => {
        menuItem.addEventListener('click', function() {
            const category = this.querySelector('.menu-item-title').textContent.trim();
            const allCards = document.querySelectorAll('.shop-card');
            
            allCards.forEach(card => {
                const cardCat = card.getAttribute('data-cat');
                if (cardCat === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ========================================
    // 🖼️ PRODUCT SLIDER LOGIKA
    // ========================================
    
    const productSlides = document.querySelectorAll('.product .slides');
    
    productSlides.forEach(slideArea => {
        const images = slideArea.querySelectorAll('.sneaker_img');
        if (images.length === 0) return;
        
        let currentSlide = 0;
        let zCounter = 10;
        
        // Inicializálás - első kép látható
        images.forEach((img, index) => {
            if (index === 0) {
                img.classList.add('active');
                img.style.opacity = '1';
                img.style.zIndex = '10';
            } else {
                img.style.opacity = '0';
                img.style.zIndex = '1';
            }
        });
        
        // Kattintásra kép váltás
        slideArea.addEventListener('click', function(e) {
            // Ne váltson, ha a "Add to cart" gombra kattintottak
            if (e.target.closest('.button')) return;
            
            // Jelenlegi kép elrejtése
            images[currentSlide].classList.remove('active');
            images[currentSlide].style.opacity = '0';
            images[currentSlide].style.zIndex = '1';
            
            // Következő kép kiszámítása
            currentSlide = (currentSlide + 1) % images.length;
            zCounter++;
            
            // Új kép megjelenítése
            images[currentSlide].classList.add('active');
            images[currentSlide].style.zIndex = zCounter;
            images[currentSlide].style.opacity = '1';
            images[currentSlide].style.animation = 'fade 0.3s ease forwards';
            
            // Animáció törlése után
            setTimeout(() => {
                images[currentSlide].style.animation = '';
            }, 300);
        });
        
        // Hover: random "lebegő" effekt (csak az aktív képen)
        slideArea.addEventListener('mouseover', function() {
            const activeImg = images[currentSlide];
            if (activeImg) {
                const x = 8 * (Math.floor(Math.random() * 5) - 2);
                const y = 8 * (Math.floor(Math.random() * 5) - 2);
                // Fontos: a translate(-50%, -50%) megmaradjon!
                activeImg.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
            }
        });
        
        // Mouseout: vissza az eredeti helyre
        slideArea.addEventListener('mouseout', function() {
            const activeImg = images[currentSlide];
            if (activeImg) {
                activeImg.style.transform = 'translate(-50%, -50%)';
            }
        });
    });
    
    console.log('🖼️ Slider inicializálva:', productSlides.length, 'termék');
});