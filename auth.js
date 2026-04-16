// auth.js - Bejelentkezés kezelése minden oldalon
// Ezt add hozzá minden HTML fájlhoz: <script src="auth.js" defer></script>

document.addEventListener('DOMContentLoaded', function () {

    function getCurrentUser() {
        return JSON.parse(localStorage.getItem('pronyo_current_user') || 'null');
    }

    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (document.getElementById('auth-nav-btn')) return;

    const user = getCurrentUser();

    // ── Dropdown stílusok ──────────────────────────────────────────────────
    const dropdownStyle = document.createElement('style');
    dropdownStyle.textContent = `
        #auth-nav-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            margin-right: 10px;
        }
        #auth-nav-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
            color: #fff;
            font-family: 'IBM Plex Mono', 'Open Sans', sans-serif;
            font-size: 13px;
            font-weight: 600;
            padding: 7px 16px;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.3);
            transition: all 0.25s ease;
            white-space: nowrap;
            background: rgba(255,255,255,0.05);
            cursor: pointer;
            user-select: none;
        }
        #auth-nav-btn:hover, #auth-nav-btn.open {
            background: rgba(248,216,0,0.15);
            border-color: #F8D800;
            color: #F8D800;
        }
        #auth-dropdown {
            position: absolute;
            top: calc(100% + 10px);
            right: 0;
            width: 240px;
            background: #1a2535;
            border: 1px solid rgba(248,216,0,0.25);
            border-radius: 14px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            overflow: hidden;
            z-index: 9999;
            transform-origin: top right;
            animation: dropdownIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes dropdownIn {
            from { opacity: 0; transform: scale(0.9) translateY(-8px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        #auth-dropdown.hidden { display: none; }
        .auth-dd-header {
            padding: 14px 16px 10px;
            border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .auth-dd-name {
            font-family: 'IBM Plex Mono', monospace;
            font-weight: 700;
            font-size: 13px;
            color: #fff;
        }
        .auth-dd-email {
            font-size: 11px;
            color: rgba(255,255,255,0.4);
            margin-top: 2px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .auth-dd-items { padding: 6px 0; }
        .auth-dd-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 16px;
            color: rgba(255,255,255,0.8);
            font-size: 13px;
            font-family: 'Open Sans', sans-serif;
            cursor: pointer;
            transition: all 0.15s;
            border: none;
            background: none;
            width: 100%;
            text-align: left;
            text-decoration: none;
        }
        .auth-dd-item:hover {
            background: rgba(248,216,0,0.1);
            color: #F8D800;
        }
        .auth-dd-item .dd-icon {
            width: 28px; height: 28px;
            border-radius: 8px;
            background: rgba(255,255,255,0.07);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            flex-shrink: 0;
            transition: background 0.15s;
        }
        .auth-dd-item:hover .dd-icon { background: rgba(248,216,0,0.15); }
        .auth-dd-item.ai-item .dd-icon {
            background: linear-gradient(135deg, rgba(248,216,0,0.25), rgba(248,216,0,0.1));
            color: #F8D800;
        }
        .auth-dd-item.ai-item { color: #F8D800; font-weight: 600; }
        .auth-dd-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 4px 0; }
        .auth-dd-item.logout { color: rgba(255,100,100,0.8); }
        .auth-dd-item.logout:hover { background: rgba(255,100,100,0.1); color: #ff6464; }
        .ai-badge {
            margin-left: auto;
            background: linear-gradient(135deg, #F8D800, #e6c800);
            color: #000;
            font-size: 9px;
            font-weight: 900;
            font-family: 'IBM Plex Mono', monospace;
            padding: 2px 6px;
            border-radius: 6px;
            letter-spacing: 0.5px;
        }
    `;
    document.head.appendChild(dropdownStyle);

    // ── Wrapper ────────────────────────────────────────────────────────────
    const wrapper = document.createElement('div');
    wrapper.id = 'auth-nav-wrapper';

    const authBtn = document.createElement('div');
    authBtn.id = 'auth-nav-btn';

    if (user) {
        const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';
        authBtn.innerHTML = `
            <span style="width:24px;height:24px;border-radius:50%;background:#F8D800;color:#000;
                display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;">
                ${initial}
            </span>
            <span>${user.name.split(' ')[0]}</span>
            <i class="fas fa-chevron-down" style="font-size:9px;opacity:0.6;margin-left:2px;"></i>
        `;
    } else {
        authBtn.innerHTML = `<i class="fas fa-user"></i><span>Bejelentkezés</span>`;
        authBtn.addEventListener('click', () => { window.location.href = 'login.html'; });
        const cartContainer = navbar.querySelector('.cart-container');
        if (cartContainer) navbar.insertBefore(authBtn, cartContainer);
        else navbar.appendChild(authBtn);
        return;
    }

    // ── Dropdown menü ──────────────────────────────────────────────────────
    const dropdown = document.createElement('div');
    dropdown.id = 'auth-dropdown';
    dropdown.classList.add('hidden');
    dropdown.innerHTML = `
        <div class="auth-dd-header">
            <div class="auth-dd-name">${user.name || 'Felhasználó'}</div>
            <div class="auth-dd-email">${user.email || ''}</div>
        </div>
        <div class="auth-dd-items">
            <button class="auth-dd-item ai-item" id="dd-chatbot-btn">
                <span class="dd-icon">🤖</span>
                <span>AI Asszisztens</span>
                <span class="ai-badge">ÚJ</span>
            </button>
            <div class="auth-dd-divider"></div>
            <a href="#" class="auth-dd-item">
                <span class="dd-icon"><i class="fas fa-box"></i></span>
                <span>Rendeléseim</span>
            </a>
            <a href="#" class="auth-dd-item">
                <span class="dd-icon"><i class="fas fa-heart"></i></span>
                <span>Kedvenceim</span>
            </a>
            <a href="#" class="auth-dd-item">
                <span class="dd-icon"><i class="fas fa-cog"></i></span>
                <span>Beállítások</span>
            </a>
            <div class="auth-dd-divider"></div>
            <button class="auth-dd-item logout" id="dd-logout-btn">
                <span class="dd-icon"><i class="fas fa-sign-out-alt"></i></span>
                <span>Kijelentkezés</span>
            </button>
        </div>
    `;

    wrapper.appendChild(authBtn);
    wrapper.appendChild(dropdown);

    const cartContainer = navbar.querySelector('.cart-container');
    if (cartContainer) navbar.insertBefore(wrapper, cartContainer);
    else navbar.appendChild(wrapper);

    // ── Dropdown toggle ────────────────────────────────────────────────────
    let isOpen = false;

    function openDropdown() {
        dropdown.classList.remove('hidden');
        authBtn.classList.add('open');
        isOpen = true;
    }
    function closeDropdown() {
        dropdown.classList.add('hidden');
        authBtn.classList.remove('open');
        isOpen = false;
    }

    authBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isOpen ? closeDropdown() : openDropdown();
    });
    document.addEventListener('click', (e) => {
        if (isOpen && !wrapper.contains(e.target)) closeDropdown();
    });

    // ── AI Chatbot ─────────────────────────────────────────────────────────
    dropdown.querySelector('#dd-chatbot-btn').addEventListener('click', () => {
        closeDropdown();
        if (typeof window.openPronyoChatbot === 'function') {
            window.openPronyoChatbot();
        } else {
            const script = document.createElement('script');
            script.src = 'chatbot.js';
            script.onload = () => window.openPronyoChatbot?.();
            document.head.appendChild(script);
        }
    });

    // ── Kijelentkezés ──────────────────────────────────────────────────────
    dropdown.querySelector('#dd-logout-btn').addEventListener('click', () => {
        localStorage.removeItem('pronyo_current_user');
        window.location.reload();
    });
});
