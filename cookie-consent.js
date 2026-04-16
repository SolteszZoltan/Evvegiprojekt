// cookie-consent.js - Pronyo cookie felugró értesítés

(function () {
    // Ha már döntött, ne mutassuk újra
    if (localStorage.getItem('pronyo_cookie_consent')) return;

    function createBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.innerHTML = `
            <div id="cookie-inner">
                <div id="cookie-icon">🍪</div>
                <div id="cookie-text">
                    <strong>Sütiket használunk</strong>
                    <span>Az oldal sütiket (cookie-kat) használ a jobb felhasználói élmény és a kosár funkció biztosításához. A folytatással elfogadod az <a href="#" id="cookie-policy-link">adatkezelési tájékoztatót</a>.</span>
                </div>
                <div id="cookie-buttons">
                    <button id="cookie-reject">Elutasítás</button>
                    <button id="cookie-accept">Elfogadás</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);

        const style = document.createElement('style');
        style.textContent = `
            #cookie-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 99998;
                padding: 0 20px 20px;
                animation: cookieSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            @keyframes cookieSlideUp {
                from { transform: translateY(120%); opacity: 0; }
                to   { transform: translateY(0);    opacity: 1; }
            }
            @keyframes cookieSlideDown {
                from { transform: translateY(0);    opacity: 1; }
                to   { transform: translateY(120%); opacity: 0; }
            }
            #cookie-inner {
                max-width: 860px;
                margin: 0 auto;
                background: #1a2535;
                border: 1px solid rgba(248,216,0,0.3);
                border-radius: 14px;
                padding: 18px 22px;
                display: flex;
                align-items: center;
                gap: 16px;
                box-shadow: 0 -4px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(248,216,0,0.08);
            }
            #cookie-icon {
                font-size: 28px;
                flex-shrink: 0;
                line-height: 1;
            }
            #cookie-text {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 3px;
            }
            #cookie-text strong {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 13.5px;
                color: #F8D800;
                letter-spacing: 0.3px;
            }
            #cookie-text span {
                font-family: 'Open Sans', sans-serif;
                font-size: 12.5px;
                color: rgba(255,255,255,0.55);
                line-height: 1.5;
            }
            #cookie-policy-link {
                color: rgba(248,216,0,0.7);
                text-decoration: underline;
                text-underline-offset: 2px;
            }
            #cookie-policy-link:hover {
                color: #F8D800;
            }
            #cookie-buttons {
                display: flex;
                gap: 10px;
                flex-shrink: 0;
            }
            #cookie-reject {
                padding: 9px 18px;
                border-radius: 8px;
                border: 1px solid rgba(255,255,255,0.15);
                background: transparent;
                color: rgba(255,255,255,0.5);
                font-size: 13px;
                font-family: 'Open Sans', sans-serif;
                cursor: pointer;
                transition: all 0.2s;
                white-space: nowrap;
            }
            #cookie-reject:hover {
                border-color: rgba(255,255,255,0.35);
                color: rgba(255,255,255,0.85);
                background: rgba(255,255,255,0.05);
            }
            #cookie-accept {
                padding: 9px 20px;
                border-radius: 8px;
                border: none;
                background: linear-gradient(135deg, #F8D800, #e6c800);
                color: #000;
                font-size: 13px;
                font-weight: 700;
                font-family: 'Open Sans', sans-serif;
                cursor: pointer;
                transition: all 0.2s;
                white-space: nowrap;
            }
            #cookie-accept:hover {
                transform: scale(1.04);
                box-shadow: 0 4px 14px rgba(248,216,0,0.4);
            }

            @media (max-width: 600px) {
                #cookie-inner {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 12px;
                }
                #cookie-buttons {
                    width: 100%;
                }
                #cookie-reject, #cookie-accept {
                    flex: 1;
                    text-align: center;
                }
            }
        `;
        document.head.appendChild(style);

        document.getElementById('cookie-accept').addEventListener('click', () => {
            localStorage.setItem('pronyo_cookie_consent', 'accepted');
            dismissBanner();
        });

        document.getElementById('cookie-reject').addEventListener('click', () => {
            localStorage.setItem('pronyo_cookie_consent', 'rejected');
            dismissBanner();
        });
    }

    function dismissBanner() {
        const banner = document.getElementById('cookie-banner');
        if (!banner) return;
        banner.style.animation = 'cookieSlideDown 0.3s ease forwards';
        setTimeout(() => banner.remove(), 300);
    }

    // Kis késleltetéssel jelenik meg, hogy az oldal betöltése után látványos legyen
    setTimeout(createBanner, 800);
})();
