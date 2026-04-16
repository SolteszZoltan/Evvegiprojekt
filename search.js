// search.js - Kereső funkció a Prónyó Kicks oldalhoz

document.addEventListener('DOMContentLoaded', function () {

    const searchInput = document.querySelector('.search');
    if (!searchInput) return;

    // Kereső konténer - eredmények megjelenítéséhez
    const searchWrapper = searchInput.closest('form') || searchInput.parentElement;

    // Eredmény számláló elem létrehozása
    const resultBadge = document.createElement('div');
    resultBadge.id = 'search-result-badge';
    resultBadge.style.cssText = `
        display: none;
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translateY(-50%);
        background: #F8D800;
        color: #000;
        font-size: 11px;
        font-weight: 700;
        font-family: 'IBM Plex Mono', monospace;
        padding: 3px 9px;
        border-radius: 20px;
        white-space: nowrap;
        pointer-events: none;
    `;

    // Üres állapot üzenet
    const noResults = document.createElement('div');
    noResults.id = 'no-results-msg';
    noResults.style.cssText = `
        display: none;
        width: 100%;
        padding: 40px 20px;
        text-align: center;
        color: rgba(255,255,255,0.6);
        font-family: 'IBM Plex Mono', monospace;
        font-size: 1rem;
    `;
    noResults.innerHTML = `
        <div style="font-size:2.5rem;margin-bottom:12px;">👟</div>
        <div style="font-weight:700;color:#fff;margin-bottom:6px;">Nincs találat</div>
        <div id="no-results-term" style="font-size:0.85rem;"></div>
    `;

    // Pozicionálás beállítása a form-on
    searchWrapper.style.position = 'relative';
    searchWrapper.appendChild(resultBadge);

    // Products container után adjuk hozzá a no-results üzenetet
    const productsContainer = document.querySelector('.products-container');
    if (productsContainer) {
        productsContainer.parentElement.insertBefore(noResults, productsContainer.nextSibling);
        // Hogy a products-container alatt jelenjen meg
        noResults.style.gridColumn = productsContainer.style.gridColumn || '';
        productsContainer.parentElement.insertBefore(noResults, productsContainer.nextSibling);
    }

    // ─── FŐ KERESÉSI LOGIKA ───────────────────────────────────────

    function performSearch(query) {
        const cards = document.querySelectorAll('.shop-card');
        query = query.trim().toLowerCase();

        if (query === '') {
            // Üres keresés: minden kártya visszajelenik
            // DE csak ha nincs aktív márka szűrő
            const activeBrand = getActiveBrand();

            cards.forEach(card => {
                if (activeBrand) {
                    card.style.display = card.getAttribute('data-cat') === activeBrand ? 'flex' : 'none';
                } else {
                    card.style.display = 'flex';
                }
            });

            resultBadge.style.display = 'none';
            noResults.style.display = 'none';
            return;
        }

        let visibleCount = 0;
        const activeBrand = getActiveBrand();

        cards.forEach(card => {
            const title = (card.querySelector('.title')?.textContent || '').toLowerCase();
            const desc = (card.querySelector('.desc')?.textContent || '').toLowerCase();
            const brand = (card.getAttribute('data-cat') || '').toLowerCase();
            const sizes = (card.getAttribute('data-sizes') || '').toLowerCase();

            const matches = title.includes(query) || desc.includes(query) || brand.includes(query) || sizes.includes(query);

            // Ha van aktív márka szűrő, azon belül keresünk
            const brandMatch = activeBrand ? card.getAttribute('data-cat') === activeBrand : true;

            if (matches && brandMatch) {
                card.style.display = 'flex';
                // Kiemelés
                highlightCard(card, query);
                visibleCount++;
            } else {
                card.style.display = 'none';
                removeHighlight(card);
            }
        });

        // Eredmény badge
        resultBadge.style.display = 'block';
        resultBadge.textContent = visibleCount + ' találat';

        // Üres állapot
        if (visibleCount === 0) {
            noResults.style.display = 'block';
            noResults.style.width = '100%';
            document.getElementById('no-results-term').textContent = '"' + query + '" - próbálj más kulcsszót!';
            if (productsContainer) productsContainer.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            if (productsContainer) productsContainer.style.display = '';
        }
    }

    // ─── KIEMELÉS ─────────────────────────────────────────────────

    function highlightCard(card, query) {
        const titleEl = card.querySelector('.title');
        const descEl = card.querySelector('.desc');
        if (!titleEl || !descEl) return;

        // Eredeti szöveg visszaállítása és újra kiemelés
        const origTitle = titleEl.getAttribute('data-orig') || titleEl.textContent;
        const origDesc = descEl.getAttribute('data-orig') || descEl.textContent;

        titleEl.setAttribute('data-orig', origTitle);
        descEl.setAttribute('data-orig', origDesc);

        titleEl.innerHTML = highlightText(origTitle, query);
        descEl.innerHTML = highlightText(origDesc, query);
    }

    function removeHighlight(card) {
        const titleEl = card.querySelector('.title');
        const descEl = card.querySelector('.desc');
        if (titleEl && titleEl.getAttribute('data-orig')) {
            titleEl.textContent = titleEl.getAttribute('data-orig');
        }
        if (descEl && descEl.getAttribute('data-orig')) {
            descEl.textContent = descEl.getAttribute('data-orig');
        }
    }

    function highlightText(text, query) {
        if (!query) return text;
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp('(' + escaped + ')', 'gi');
        return text.replace(regex, '<mark style="background:#F8D800;color:#000;border-radius:2px;padding:0 2px;">$1</mark>');
    }

    // ─── AKTÍV MÁRKA LEKÉRÉSE ─────────────────────────────────────

    function getActiveBrand() {
        // URL-ből olvassuk ki
        const params = new URLSearchParams(window.location.search);
        return params.get('brand') || null;
    }

    // ─── ESEMÉNYKEZELŐK ───────────────────────────────────────────

    // Valós idejű keresés gépelés közben
    let debounceTimer;
    searchInput.addEventListener('input', function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            performSearch(this.value);
        }, 200);
    });

    // Enter megakadályozza az oldal újratöltését
    searchInput.closest('form')?.addEventListener('submit', function (e) {
        e.preventDefault();
        performSearch(searchInput.value);
    });

    // ESC törli a keresőt
    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            this.value = '';
            performSearch('');
            this.blur();
        }
    });

    // Kereső stílus finomítás
    searchInput.style.transition = 'background 0.2s ease';
    searchInput.addEventListener('focus', () => {
        searchInput.style.background = 'rgba(255,255,255,0.15)';
    });
    searchInput.addEventListener('blur', () => {
        searchInput.style.background = '';
    });

    console.log('🔍 Kereső betöltve!');
});
