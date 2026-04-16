// sizes-display.js - Elérhető méretek megjelenítése minden cipőkártyán

document.addEventListener('DOMContentLoaded', function () {

    const cards = document.querySelectorAll('.shop-card');

    cards.forEach(card => {
        const sizesAttr = card.getAttribute('data-sizes');
        if (!sizesAttr) return;

        const sizes = sizesAttr.split(',').map(s => s.trim()).filter(Boolean);
        if (sizes.length === 0) return;

        // Méret konténer létrehozása
        const sizeContainer = document.createElement('div');
        sizeContainer.className = 'card-sizes';

        const label = document.createElement('span');
        label.className = 'card-sizes-label';
        label.textContent = 'Méretek:';

        const sizeList = document.createElement('div');
        sizeList.className = 'card-sizes-list';

        sizes.forEach(size => {
            const sizeTag = document.createElement('span');
            sizeTag.className = 'card-size-tag';
            sizeTag.textContent = size;
            sizeList.appendChild(sizeTag);
        });

        sizeContainer.appendChild(label);
        sizeContainer.appendChild(sizeList);

        // A .cta div elé szúrjuk be
        const cta = card.querySelector('.cta');
        if (cta) {
            card.insertBefore(sizeContainer, cta);
        } else {
            card.appendChild(sizeContainer);
        }
    });

    console.log('✅ Méretek megjelenítve!');
});
