// chatbot.js - Pronyo cipőbolt chatbot (fix válaszokkal, API nélkül)

(function () {
    const QUICK_QUESTIONS = [
        "Milyen márkák kaphatók?",
        "Mik a szállítási feltételek?",
        "Hogyan válasszak méretet?",
        "Van visszaküldési lehetőség?",
        "Hogyan követhetem a rendelésem?",
        "Milyen fizetési módok vannak?"
    ];

    // ── Fix válaszok kulcsszavak alapján ──────────────────────────────────────
    const RESPONSES = [
        {
            keywords: ["márka", "márká", "brand", "nike", "adidas", "jordan", "vans", "converse", "balenciaga", "louis vuitton", "dior", "gucci", "kapható", "árusít", "forgalmaz"],
            answer: "Az oldalon a következő prémium márkák találhatók:<br><br><strong>Streetwear:</strong> Nike, Adidas, Jordan, Vans, Converse<br><strong>Luxury:</strong> Balenciaga, Louis Vuitton, Dior, Gucci<br><br>Összesen <strong>151 termék</strong> közül válogathatsz! 👟"
        },
        {
            keywords: ["szállít", "szállítás", "kiszállít", "postat", "posta", "futár", "ingyenes", "díj", "mikor", "mennyi idő", "mennyibe kerül a szállítás"],
            answer: "📦 <strong>Szállítási feltételek:</strong><br><br>✅ <strong>Ingyenes szállítás</strong> minden rendelésre – nincs minimumösszeg!<br>⏱️ <strong>Szállítási idő:</strong> 2–5 munkanap Magyarországon belül<br><br>Rendelésed feladása után e-mailben küldünk értesítést a pontos szállítási adatokkal."
        },
        {
            keywords: ["méret", "méretet", "sizing", "méretezés", "mekkora", "melyik méret", "size", "nagyság", "mi a méretem"],
            answer: "📏 <strong>Méretválasztási segítség:</strong><br><br>Az oldalon <strong>38–47-es méretben</strong> kaphatók a cipők.<br><br>Tanácsok:<br>• Ha félméret között vagy, válaszd a nagyobbat<br>• Nike/Adidas: általában igaz a méret<br>• Balenciaga/luxury cipők: sokszor ajánlott fél mérettel nagyobbat venni<br><br>Minden terméknél feltüntettük az elérhető méreteket. Ha bizonytalan vagy, írj nekünk az ügyfélszolgálatra! 😊"
        },
        {
            keywords: ["visszaküldes", "visszaküld", "visszaküldés", "csere", "visszavesz", "visszavesznek", "garancia", "nem jó", "nem tetszik", "nem illik"],
            answer: "🔄 <strong>Visszaküldési feltételek:</strong><br><br>✅ <strong>14 napon belül</strong> visszaküldheted a cipőt<br>✅ A cipő legyen <strong>nem viselt állapotban</strong>, eredeti csomagolásban<br>✅ A visszaküldés után <strong>teljes visszatérítést</strong> kapsz<br><br>Visszaküldéshez lépj be a fiókodba, és kérj visszaküldési kérelmet. Segítségre van szükséged? Ügyfélszolgálatunk szívesen segít!"
        },
        {
            keywords: ["rendelés", "követés", "nyomon követ", "hol van", "mikor érkezik", "státusz", "rendelésem", "track", "csomagom"],
            answer: "📬 <strong>Rendeléskövetés:</strong><br><br>1. Jelentkezz be a fiókoddal<br>2. Kattints a <strong>\"Fiókom\"</strong> menüpontra<br>3. Ott láthatod az összes rendelésed státuszát<br><br>Ha még nem regisztráltál, rendeléskor e-mailben küldünk frissítéseket a csomagod helyzetéről. 📩"
        },
        {
            keywords: ["fizet", "fizetés", "fizetési", "kártya", "bankkártya", "átutalás", "utánvét", "paypal", "hogyan fizetek"],
            answer: "💳 <strong>Fizetési módok:</strong><br><br>• <strong>Bankkártyás fizetés</strong> (Visa, Mastercard, Amex)<br>• <strong>Banki átutalás</strong><br>• <strong>Utánvét</strong> (futárnál fizetsz készpénzzel)<br><br>Minden fizetés biztonságos, titkosított kapcsolaton keresztül történik. 🔒"
        },
        {
            keywords: ["legnépszerűbb", "legjobb", "ajánl", "ajánlott", "top", "bestseller", "divatos", "trend", "melyiket", "mit vegyek"],
            answer: "🔥 <strong>Legnépszerűbb cipők nálunk:</strong><br><br>🥇 <strong>Nike Air Force 1</strong> – örök klasszikus, minden stílushoz illik<br>🥈 <strong>Adidas Samba</strong> – jelenleg a legnagyobb trend<br>🥉 <strong>Jordan 1 Retro</strong> – streetwear ikondarab<br><br>Luxury vonalon a <strong>Balenciaga Triple S</strong> a legtöbbet keresett termékünk. Nézd meg őket az oldalon! 👀"
        },
        {
            keywords: ["regisztr", "bejelentk", "fiók", "profil", "account", "login", "jelszó"],
            answer: "👤 <strong>Fiók és bejelentkezés:</strong><br><br>A <strong>bejelentkezés/regisztráció</strong> gombra kattintva hozhatsz létre fiókot.<br><br>Fiókkal elérheted:<br>• Rendelés nyomonkövetés<br>• Rendelési előzmények<br>• Gyorsabb vásárlás<br><br>Ha elfelejtett jelszóval van problémád, a bejelentkezési oldalon kérhetsz jelszó-visszaállítást. 🔑"
        },
        {
            keywords: ["kosár", "cart", "vásárl", "vesz", "megvesz", "hozzáad"],
            answer: "🛒 <strong>Vásárlás menete:</strong><br><br>1. Válaszd ki a cipőt és a méreted<br>2. Kattints az <strong>\"Add to cart\"</strong> gombra<br>3. A kosár ikonra kattintva ellenőrizheted a kiválasztott termékeket<br>4. Kövesd a fizetési folyamatot<br><br>Ha bármilyen probléma lép fel, szólj és segítünk! 😊"
        },
        {
            keywords: ["kapcsolat", "ügyfélszolgálat", "email", "telefon", "elérhetőség", "segítség", "support", "help"],
            answer: "📞 <strong>Ügyfélszolgálat:</strong><br><br>Ha személyes segítségre van szükséged, vedd fel velünk a kapcsolatot:<br><br>✉️ <strong>E-mail:</strong> info@pronyo.hu<br>⏰ <strong>Munkaidő:</strong> H–P: 9:00–17:00<br><br>Igyekszünk <strong>24 órán belül</strong> válaszolni minden megkeresésre! 💪"
        },
        {
            keywords: ["köszön", "szia", "hello", "hi", "helló", "üdv", "jó reggelt", "jó napot", "jó estét"],
            answer: "Szia! 👋 Örülök, hogy itt vagy a <strong>Pronyo</strong> webshopban!<br><br>Miben segíthetek ma? Kérdezz bátran márkákról, szállításról, méretekről – vagy bármi másról! 😊"
        },
        {
            keywords: ["ár", "árak", "drága", "olcsó", "mennyibe kerül", "price", "cost", "összeg"],
            answer: "💰 <strong>Árainkról:</strong><br><br>Az árak márkától és modelltől függően változnak:<br><br>• <strong>Streetwear</strong> (Nike, Adidas, Vans, Converse): ~$80–$250<br>• <strong>Jordan:</strong> ~$150–$400<br>• <strong>Luxury</strong> (Balenciaga, LV, Gucci, Dior): ~$500–$1200+<br><br>Minden ár a terméklapján pontosan feltüntetve megtalálható. 🏷️"
        }
    ];

    const DEFAULT_ANSWER = "Érdekes kérdés! 🤔 Sajnos erre nem tudok pontos választ adni.<br><br>Kérlek, lépj kapcsolatba <strong>ügyfélszolgálatunkkal</strong>:<br>✉️ info@pronyo.hu<br><br>Vagy próbálj rákattintani az alábbi gyakori kérdések egyikére! 👇";

    function getBotReply(userText) {
        const lower = userText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        for (const entry of RESPONSES) {
            for (const kw of entry.keywords) {
                const normalizedKw = kw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                if (lower.includes(normalizedKw)) {
                    return entry.answer;
                }
            }
        }
        return DEFAULT_ANSWER;
    }

    // ── UI ───────────────────────────────────────────────────────────────────

    function createChatbotHTML() {
        const overlay = document.createElement('div');
        overlay.id = 'chatbot-overlay';
        overlay.innerHTML = `
            <div id="chatbot-panel">
                <div id="chatbot-header">
                    <div id="chatbot-header-left">
                        <div id="chatbot-avatar">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
                            </svg>
                        </div>
                        <div>
                            <div id="chatbot-name">Pronyo AI</div>
                            <div id="chatbot-status"><span class="status-dot"></span>Online</div>
                        </div>
                    </div>
                    <button id="chatbot-close" title="Bezárás">✕</button>
                </div>

                <div id="chatbot-messages">
                    <div class="msg bot-msg">
                        <div class="msg-bubble">
                            Szia! 👟 Én vagyok a <strong>Pronyo AI</strong> asszisztensed. Miben segíthetek?
                        </div>
                    </div>
                    <div id="quick-questions">
                        <div id="quick-label">Gyors kérdések:</div>
                        ${QUICK_QUESTIONS.map(q => `<button class="quick-btn">${q}</button>`).join('')}
                    </div>
                </div>

                <div id="chatbot-input-area">
                    <input type="text" id="chatbot-input" placeholder="Írj kérdést..." maxlength="500" autocomplete="off"/>
                    <button id="chatbot-send">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const style = document.createElement('style');
        style.textContent = `
            #chatbot-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.55);
                z-index: 99999;
                display: flex;
                align-items: flex-end;
                justify-content: flex-end;
                padding: 20px;
                animation: chatOverlayIn 0.2s ease;
            }
            @keyframes chatOverlayIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            #chatbot-panel {
                width: 380px;
                max-width: calc(100vw - 40px);
                height: 560px;
                max-height: calc(100vh - 40px);
                background: #1a2535;
                border: 1px solid rgba(248,216,0,0.25);
                border-radius: 16px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                animation: chatPanelIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                box-shadow: 0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(248,216,0,0.1);
            }
            @keyframes chatPanelIn {
                from { transform: scale(0.85) translateY(20px); opacity: 0; }
                to { transform: scale(1) translateY(0); opacity: 1; }
            }
            #chatbot-header {
                background: linear-gradient(135deg, #22313F 0%, #1a2535 100%);
                border-bottom: 1px solid rgba(248,216,0,0.2);
                padding: 14px 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-shrink: 0;
            }
            #chatbot-header-left {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            #chatbot-avatar {
                width: 38px;
                height: 38px;
                border-radius: 50%;
                background: linear-gradient(135deg, #F8D800, #e6c800);
                color: #000;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                box-shadow: 0 0 12px rgba(248,216,0,0.4);
            }
            #chatbot-name {
                font-family: 'IBM Plex Mono', monospace;
                font-weight: 700;
                font-size: 14px;
                color: #fff;
                letter-spacing: 0.5px;
            }
            #chatbot-status {
                font-size: 11px;
                color: rgba(255,255,255,0.5);
                display: flex;
                align-items: center;
                gap: 5px;
                margin-top: 2px;
            }
            .status-dot {
                width: 6px; height: 6px;
                background: #4ade80;
                border-radius: 50%;
                display: inline-block;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0%,100% { opacity:1; transform:scale(1); }
                50% { opacity:0.6; transform:scale(0.8); }
            }
            #chatbot-close {
                background: rgba(255,255,255,0.08);
                border: none;
                color: rgba(255,255,255,0.6);
                width: 30px; height: 30px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 13px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            #chatbot-close:hover {
                background: rgba(248,216,0,0.2);
                color: #F8D800;
            }
            #chatbot-messages {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                scroll-behavior: smooth;
            }
            #chatbot-messages::-webkit-scrollbar { width: 4px; }
            #chatbot-messages::-webkit-scrollbar-track { background: transparent; }
            #chatbot-messages::-webkit-scrollbar-thumb { background: rgba(248,216,0,0.3); border-radius: 2px; }
            .msg { display: flex; }
            .bot-msg { justify-content: flex-start; }
            .user-msg { justify-content: flex-end; }
            .msg-bubble {
                max-width: 82%;
                padding: 10px 14px;
                border-radius: 14px;
                font-size: 13.5px;
                line-height: 1.5;
                font-family: 'Open Sans', sans-serif;
            }
            .bot-msg .msg-bubble {
                background: rgba(255,255,255,0.07);
                color: #e8eaf0;
                border-bottom-left-radius: 4px;
                border: 1px solid rgba(255,255,255,0.08);
            }
            .user-msg .msg-bubble {
                background: linear-gradient(135deg, #F8D800, #e6c800);
                color: #000;
                font-weight: 600;
                border-bottom-right-radius: 4px;
            }
            #quick-questions {
                display: flex;
                flex-direction: column;
                gap: 6px;
                margin-top: 4px;
            }
            #quick-label {
                font-size: 11px;
                color: rgba(248,216,0,0.6);
                font-family: 'IBM Plex Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 2px;
            }
            .quick-btn {
                background: rgba(248,216,0,0.07);
                border: 1px solid rgba(248,216,0,0.2);
                color: rgba(255,255,255,0.8);
                padding: 8px 12px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 12.5px;
                text-align: left;
                transition: all 0.2s;
                font-family: 'Open Sans', sans-serif;
            }
            .quick-btn:hover {
                background: rgba(248,216,0,0.15);
                border-color: rgba(248,216,0,0.5);
                color: #F8D800;
                transform: translateX(3px);
            }
            .typing-bubble {
                display: flex;
                gap: 4px;
                align-items: center;
                padding: 12px 16px;
            }
            .typing-dot {
                width: 7px; height: 7px;
                background: rgba(248,216,0,0.6);
                border-radius: 50%;
                animation: typingBounce 1.2s infinite;
            }
            .typing-dot:nth-child(2) { animation-delay: 0.2s; }
            .typing-dot:nth-child(3) { animation-delay: 0.4s; }
            @keyframes typingBounce {
                0%,60%,100% { transform: translateY(0); }
                30% { transform: translateY(-6px); }
            }
            #chatbot-input-area {
                padding: 12px 14px;
                border-top: 1px solid rgba(255,255,255,0.07);
                display: flex;
                gap: 8px;
                background: rgba(0,0,0,0.2);
                flex-shrink: 0;
            }
            #chatbot-input {
                flex: 1;
                background: rgba(255,255,255,0.07);
                border: 1px solid rgba(255,255,255,0.12);
                border-radius: 10px;
                padding: 10px 14px;
                color: #fff;
                font-size: 13.5px;
                font-family: 'Open Sans', sans-serif;
                outline: none;
                transition: border-color 0.2s;
            }
            #chatbot-input:focus {
                border-color: rgba(248,216,0,0.4);
            }
            #chatbot-input::placeholder { color: rgba(255,255,255,0.3); }
            #chatbot-send {
                width: 42px; height: 42px;
                background: linear-gradient(135deg, #F8D800, #e6c800);
                border: none;
                border-radius: 10px;
                color: #000;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                flex-shrink: 0;
            }
            #chatbot-send:hover { transform: scale(1.06); box-shadow: 0 4px 12px rgba(248,216,0,0.4); }
            #chatbot-send:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        `;
        document.head.appendChild(style);

        setupEvents();
    }

    function setupEvents() {
        const overlay = document.getElementById('chatbot-overlay');
        const panel = document.getElementById('chatbot-panel');
        const closeBtn = document.getElementById('chatbot-close');
        const input = document.getElementById('chatbot-input');
        const sendBtn = document.getElementById('chatbot-send');

        closeBtn.addEventListener('click', closeChatbot);
        overlay.addEventListener('click', (e) => {
            if (!panel.contains(e.target)) closeChatbot();
        });

        sendBtn.addEventListener('click', () => sendMessage());
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const q = btn.textContent;
                sendMessage(q);
            });
        });
    }

    function closeChatbot() {
        const overlay = document.getElementById('chatbot-overlay');
        if (overlay) {
            overlay.style.animation = 'chatOverlayIn 0.15s ease reverse';
            setTimeout(() => overlay.remove(), 140);
        }
    }

    function appendMessage(text, isUser) {
        const messagesDiv = document.getElementById('chatbot-messages');
        const div = document.createElement('div');
        div.className = `msg ${isUser ? 'user-msg' : 'bot-msg'}`;
        div.innerHTML = `<div class="msg-bubble">${isUser ? escapeHtml(text) : text}</div>`;
        messagesDiv.appendChild(div);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        return div;
    }

    function showTyping() {
        const messagesDiv = document.getElementById('chatbot-messages');
        const div = document.createElement('div');
        div.className = 'msg bot-msg';
        div.id = 'typing-indicator';
        div.innerHTML = `<div class="msg-bubble typing-bubble">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>`;
        messagesDiv.appendChild(div);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function removeTyping() {
        const t = document.getElementById('typing-indicator');
        if (t) t.remove();
    }

    function escapeHtml(text) {
        return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function sendMessage(forcedText) {
        const input = document.getElementById('chatbot-input');
        const sendBtn = document.getElementById('chatbot-send');
        const text = forcedText || input.value.trim();
        if (!text) return;

        if (!forcedText) input.value = '';
        appendMessage(text, true);
        sendBtn.disabled = true;
        showTyping();

        // Rövid késleltetés a természetesebb érzésért
        setTimeout(() => {
            removeTyping();
            const reply = getBotReply(text);
            appendMessage(reply, false);
            sendBtn.disabled = false;
            document.getElementById('chatbot-input')?.focus();
        }, 600);
    }

    // Globálisan elérhető megnyitó funkció
    window.openPronyoChatbot = function () {
        if (document.getElementById('chatbot-overlay')) return;
        createChatbotHTML();
    };
})();
