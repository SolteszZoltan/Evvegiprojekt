// favorites.js - Kedvencek kezelése
// Add hozzá minden HTML fájlhoz: <script src="favorites.js" defer></script>

(function () {
    const STORAGE_KEY = 'pronyo_favorites';

    function getFavorites() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    }

    function saveFavorites(favs) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
    }

    function isFavorite(id) {
        return getFavorites().some(f => f.id === id);
    }

    function toggleFavorite(shoe) {
        let favs = getFavorites();
        const idx = favs.findIndex(f => f.id === shoe.id);
        if (idx === -1) {
            favs.unshift(shoe);
            saveFavorites(favs);
            return true;
        } else {
            favs.splice(idx, 1);
            saveFavorites(favs);
            return false;
        }
    }

    function makeShoeId(title, brand) {
        return (brand + '-' + title).toLowerCase().replace(/[^a-z0-9]/g, '-');
    }

    // Heart button stílusok
    const style = document.createElement('style');
    style.textContent = `
        .fav-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            border: none;
            background: rgba(255,255,255,0.9);
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), background 0.2s, box-shadow 0.2s;
            z-index: 10;
        }
        .fav-btn:hover {
            transform: scale(1.15);
            box-shadow: 0 4px 14px rgba(0,0,0,0.22);
        }
        .fav-btn.active {
            background: #fff0f3;
        }
        .fav-btn .fav-heart {
            transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
            line-height: 1;
            display: block;
        }
        .fav-btn.pop .fav-heart {
            animation: heartPop 0.35s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes heartPop {
            0%   { transform: scale(1); }
            50%  { transform: scale(1.4); }
            100% { transform: scale(1); }
        }
        .shop-card {
            position: relative !important;
        }
        .fav-toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #1a2535;
            color: #fff;
            padding: 12px 20px;
            border-radius: 12px;
            font-family: 'IBM Plex Mono', monospace;
            font-size: 13px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.3);
            z-index: 99999;
            display: flex;
            align-items: center;
            gap: 10px;
            border: 1px solid rgba(248,216,0,0.2);
            animation: toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .fav-toast.out {
            animation: toastOut 0.3s ease forwards;
        }
        @keyframes toastIn {
            from { opacity: 0; transform: translateY(20px) scale(0.9); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toastOut {
            from { opacity: 1; transform: translateY(0) scale(1); }
            to   { opacity: 0; transform: translateY(10px) scale(0.95); }
        }
    `;
    document.head.appendChild(style);

    let toastTimer = null;
    function showToast(msg, icon) {
        const existing = document.querySelector('.fav-toast');
        if (existing) existing.remove();
        if (toastTimer) clearTimeout(toastTimer);

        const toast = document.createElement('div');
        toast.className = 'fav-toast';
        toast.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
        document.body.appendChild(toast);

        toastTimer = setTimeout(() => {
            toast.classList.add('out');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    function addHeartToCard(card) {
        if (card.querySelector('.fav-btn')) return;

        const title = card.querySelector('.title')?.textContent?.trim() || '';
        const brand = card.dataset.cat || '';
        const priceEl = card.querySelector('.price');
        const price = priceEl?.textContent?.trim() || '';
        const img = card.querySelector('.sneaker_img')?.src || '';
        const sizes = card.dataset.sizes || '';
        const id = makeShoeId(title, brand);

        const btn = document.createElement('button');
        btn.className = 'fav-btn' + (isFavorite(id) ? ' active' : '');
        btn.title = isFavorite(id) ? 'Eltávolítás a kedvencekből' : 'Hozzáadás a kedvencekhez';
        btn.innerHTML = `<span class="fav-heart">${isFavorite(id) ? '❤️' : '🤍'}</span>`;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const shoe = { id, title, brand, price, img, sizes };
            const added = toggleFavorite(shoe);
            btn.classList.toggle('active', added);
            btn.querySelector('.fav-heart').textContent = added ? '❤️' : '🤍';
            btn.title = added ? 'Eltávolítás a kedvencekből' : 'Hozzáadás a kedvencekhez';

            // Pop animation
            btn.classList.remove('pop');
            void btn.offsetWidth;
            btn.classList.add('pop');
            setTimeout(() => btn.classList.remove('pop'), 350);

            showToast(
                added ? `"${title}" hozzáadva a kedvencekhez` : `"${title}" eltávolítva`,
                added ? '❤️' : '🗑️'
            );
        });

        card.appendChild(btn);
    }

    function initHearts() {
        document.querySelectorAll('.shop-card').forEach(addHeartToCard);
    }

    // MutationObserver for dynamically added cards (filters, etc.)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.classList?.contains('shop-card')) addHeartToCard(node);
                    node.querySelectorAll?.('.shop-card').forEach(addHeartToCard);
                }
            });
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        initHearts();
        observer.observe(document.body, { childList: true, subtree: true });
    });

    // Re-run after a short delay (for dynamically rendered cards)
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initHearts, 500);
        setTimeout(initHearts, 1500);
    });

    // Expose globally
    window.proFavorites = { getFavorites, saveFavorites, isFavorite, toggleFavorite };
})();
