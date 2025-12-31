const sndCash = new Audio('https://www.soundjay.com/misc/sounds/cash-register-05.mp3');
const tokens = ['🧣', '🐍', '🫶', '💎', '🎸', '🐈'];
let players = [], turn = 0, housesBuilt = 0, doubles = 0;

const music = [
    // LADO 1 (0-12): DEBUT & FEARLESS
    { n: "INÍCIO<br><span style='font-size:0.5rem'>RECEBA $200 DE ROYALTIES</span>", t: "s" },
    { n: "Picture To Burn", p: 60, r: [2, 10, 30, 90, 160, 250], c: "#b9d8b5", h: 50 },
    { n: "Our Song", p: 60, r: [4, 20, 60, 180, 320, 450], c: "#b9d8b5", h: 50 },
    { n: "SORTE OU REVÉS", t: "card" },
    { n: "TAXA<br><span style='font-size:0.5rem'>$100</span>", t: "tax", v: 100 },
    { n: "Eras Tour", p: 200, t: "rail" },
    { n: "Love Story", p: 100, r: [6, 30, 90, 270, 400, 550], c: "#fff176", h: 50 },
    { n: "SORTE OU REVÉS", t: "card" },
    { n: "You Belong With Me", p: 120, r: [8, 40, 100, 300, 450, 600], c: "#fff176", h: 50 },
    { n: "Fearless", p: 120, r: [8, 40, 100, 300, 450, 600], c: "#fff176", h: 50 },
    { n: "Enchanted", p: 140, r: [10, 50, 150, 450, 625, 750], c: "#d1b2d1", h: 100 },
    { n: "Long Live", p: 160, r: [12, 60, 180, 500, 700, 900], c: "#d1b2d1", h: 100 },
    { n: "MASTERS PRESAS<br><span style='font-size:0.5rem'>FIQUE SEM JOGAR POR ATÉ 3 TURNOS</span>", t: "s" },

    // LADO 2 (12-24): RED & 1989
    { n: "Red", p: 140, r: [10, 50, 150, 450, 625, 750], c: "#8b0000", h: 100 },
    { n: "22", p: 140, r: [10, 50, 150, 450, 625, 750], c: "#8b0000", h: 100 },
    { n: "All Too Well", p: 160, r: [12, 60, 180, 500, 700, 900], c: "#8b0000", h: 100 },
    { n: "Buyback Masters", p: 150, t: "util" },
    { n: "Eras Tour", p: 200, t: "rail" },
    { n: "Style", p: 180, r: [14, 70, 200, 550, 750, 950], c: "#b1d4e0", h: 100 },
    { n: "Blank Space", p: 180, r: [14, 70, 200, 550, 750, 950], c: "#b1d4e0", h: 100 },
    { n: "Shake It Off", p: 200, r: [16, 80, 220, 600, 800, 1000], c: "#b1d4e0", h: 100 },
    { n: "Look What You Made Me Do", p: 220, r: [18, 90, 250, 700, 875, 1050], c: "#010101", h: 150 },
    { n: "SORTE OU REVÉS", t: "card" },
    { n: "Delicate", p: 220, r: [18, 90, 250, 700, 875, 1050], c: "#010101", h: 150 },
    { n: "HIATO", t: "s" }, // Renamed from BACKSTAGE

    // LADO 3 (24-36): REP, LOVER, FOLKLORE, EVERMORE
    { n: "End Game", p: 240, r: [20, 100, 300, 750, 925, 1100], c: "#010101", h: 150 },
    { n: "Cruel Summer", p: 260, r: [22, 110, 330, 800, 975, 1150], c: "#ffb6c1", h: 150 },
    { n: "Lover", p: 260, r: [22, 110, 330, 800, 975, 1150], c: "#ffb6c1", h: 150 },
    { n: "You Need To Calm Down", p: 280, r: [24, 120, 360, 850, 1025, 1200], c: "#ffb6c1", h: 150 },
    { n: "Taylor's Version", p: 150, t: "util" },
    { n: "cardigan", p: 300, r: [26, 130, 390, 900, 1100, 1275], c: "#cfcfcf", h: 200 },
    { n: "Eras Tour", p: 200, t: "rail" },
    { n: "seven", p: 300, r: [26, 130, 390, 900, 1100, 1275], c: "#cfcfcf", h: 200 },
    { n: "willow", p: 320, r: [28, 150, 450, 1000, 1200, 1400], c: "#795548", h: 200 },
    { n: "SORTE OU REVÉS", t: "card" },
    { n: "champagne problems", p: 320, r: [28, 150, 450, 1000, 1200, 1400], c: "#795548", h: 200 },
    { n: "MASTERS<br>VENDIDAS", t: "s" }, // Renamed from ENTRE EM HIATO

    // LADO 4 (36-48): MIDNIGHTS, TTPD, SHOWGIRL
    { n: "Anti-Hero", p: 350, r: [35, 175, 500, 1100, 1300, 1500], c: "#3c3abeff", h: 200 },
    { n: "Lavender Haze", p: 350, r: [35, 175, 500, 1100, 1300, 1500], c: "#3c3abeff", h: 200 },
    { n: "Karma", p: 380, r: [40, 185, 550, 1200, 1400, 1700], c: "#3c3abeff", h: 200 },
    { n: "SORTE OU REVÉS", t: "card" },
    { n: "Eras Tour", p: 200, t: "rail" },
    { n: "Fortnight", p: 400, r: [50, 200, 600, 1400, 1700, 2000], c: "#85836dff", h: 200 },
    { n: "Down Bad", p: 400, r: [50, 200, 600, 1400, 1700, 2000], c: "#85836dff", h: 200 },
    { n: "I Can Do With a Broken Heart", p: 420, r: [55, 225, 650, 1450, 1750, 2050], c: "#c4c3c3ff", h: 200 },
    { n: "The Fate of Ophelia", p: 450, r: [60, 250, 700, 1500, 1800, 2200], c: "#ff9800", h: 250 },
    { n: "Opalite", p: 450, r: [60, 250, 700, 1500, 1800, 2200], c: "#ff9800", h: 250 },
    { n: "CANCELLED!", p: 500, r: [70, 300, 800, 1600, 2000, 2500], c: "#ff9800", h: 250 }
];

let grid = [];
for (let i = 13; i >= 1; i--) grid.push(`13/${i}`);
for (let i = 12; i >= 2; i--) grid.push(`${i}/1`);
for (let i = 1; i <= 13; i++) grid.push(`1/${i}`);
for (let i = 2; i <= 12; i++) grid.push(`${i}/13`);

const chanceCards = [
    { t: "Abertura da The Eras Tour! Avance para o GO e comece o show! (+$200)", a: (p) => { p.pos = 0; p.money += 200; sync(); } },
    { t: "Kanye interrompeu seu discurso! Vá direto para o Hiato.", a: (p) => { p.pos = 12; p.jail = 3; doubles = 0; sync(); } },
    {
        t: "Jatinho particular pronto! Avance para a próxima cidade da Eras Tour (Trem).", a: (p) => {
            if (p.pos < 5) p.pos = 5; else if (p.pos < 17) p.pos = 17; else if (p.pos < 31) p.pos = 31; else if (p.pos < 41) p.pos = 41; else p.pos = 5;
            sync(); handle(p, 0); return false;
        }
    },
    { t: "Recorde de vendas de vinil! Receba $200.", a: (p) => { p.money += 200; } },
    { t: "Exaustão pós-show. Pague $50 em vitaminas.", a: (p) => { p.money -= 50; } },
    { t: "Venda de merch esgotada na lojinha! Receba $50.", a: (p) => { p.money += 50; } },
    { t: "Ticket Dourado! Saia do Hiato de graça.", a: (p) => { p.jailCard = true; } },
    {
        t: "Lançamento de álbum surpresa! Colete $50 de cada fã (jogador).", a: (p) => {
            players.forEach(op => { if (op.id !== p.id) { op.money -= 50; p.money += 50; if (op.money < 0) fail(op); } });
        }
    },
    { t: "Taylor's Version superou a original! Receba $100 de royalties.", a: (p) => { p.money += 100; } },
    { t: "Reembolso de processo ganho contra DJ. Receba $20.", a: (p) => { p.money += 20; } },
    {
        t: "Sessão secreta com fãs! Receba $10 de cada um.", a: (p) => {
            players.forEach(op => { if (op.id !== p.id) { op.money -= 10; p.money += 10; if (op.money < 0) fail(op); } });
        }
    },
    { t: "Assinou contrato milionário com a Republic Records. Receba $100.", a: (p) => { p.money += 100; } },
    { t: "Multa por atraso no palco. Pague $100.", a: (p) => { p.money -= 100; } },
    { t: "Compra de figurinos novos da Versace. Pague $50.", a: (p) => { p.money -= 50; } },
    { t: "Escreveu música para outro artista. Receba $25.", a: (p) => { p.money += 25; } },
    {
        t: "Renovação dos estádios. Pague $40 por casa e $115 por hotel.", a: (p) => {
            let bill = 0;
            p.props.forEach(pr => { bill += pr.houses === 5 ? 115 : pr.houses * 40; });
            p.money -= bill;
        }
    },
    { t: "Capa da revista TIME! Pessoa do Ano. Receba $10.", a: (p) => { p.money += 10; } },
    { t: "Fã clube oficial cresceu. Receba $100.", a: (p) => { p.money += 100; } },
    { t: "Vá passear na 'The Life of a Showgirl'. Você consegue.", a: (p) => { p.pos = 45; sync(); handle(p, 0); return false; } },
    { t: "Crise existencial. Avance para 'Anti-Hero'. Sou eu, oi!", a: (p) => { p.pos = 37; sync(); handle(p, 0); return false; } }
];

let auc = { idx: -1, players: [], turn: 0, bid: 0, leader: null };
let tradeIdx = -1;
let sellIdx = -1;

const tsNames = [
    "Meredith Grey", "Olivia Benson", "Benjamin Button", "Betty", "James", "Inez", "Augustine",
    "Dorothea", "Peter", "Wendy", "Juliet", "Cassandra", "Jack Leopards", "Nils Sjöberg", "Rebekah", "Este"
];

function randomizeName(id) {
    const name = tsNames[Math.floor(Math.random() * tsNames.length)];
    document.getElementById(`p-n-${id}`).value = name;
}

function addP() {
    const div = document.getElementById('player-inputs');
    if (div.children.length >= 4) return;
    const id = div.children.length; // Use current length as ID base

    const row = document.createElement('div');
    row.id = `p-row-${id}`;
    row.style.cssText = "display:flex; gap:10px; margin-bottom:10px; align-items:center;";

    row.innerHTML = `
        <input type="text" id="p-n-${id}" value="Jogador ${id + 1}" style="flex:3; border-radius:4px 4px 0 0;" placeholder="Nome">
        <button id="rand-btn-${id}" style="background:#673ab7; color:white; border:none; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1.2rem">🎲</button>
        <select id="p-e-${id}" style="flex:1; border-radius:4px 4px 0 0;">${tokens.map(t => `<option>${t}</option>`).join('')}</select>
        <button id="del-btn-${id}" style="background:var(--md-sys-color-error-container); color:var(--md-sys-color-on-error-container); border:none; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer">✕</button>
    `;

    div.appendChild(row);

    // Bind events separately to avoid string escaping madness
    document.getElementById(`rand-btn-${id}`).onclick = () => randomizeName(id);
    document.getElementById(`del-btn-${id}`).onclick = () => row.remove();
}

function startGame() {
    const rows = document.getElementById('player-inputs').children;
    for (let i = 0; i < rows.length; i++) {
        const num = rows[i].id.split('-').pop();
        players.push({ id: i, name: document.getElementById(`p-n-${num}`).value, money: 1500, pos: 0, props: [], token: document.getElementById(`p-e-${num}`).value, jail: 0 });
    }
    if (players.length === 1) players.push({ id: 1, name: "Bot Swift", money: 1500, pos: 0, props: [], token: '🐍', jail: 0 });
    document.getElementById('setup').remove();
    document.getElementById('game-wrapper').style.display = 'grid';

    // DELAY SYNC to ensure Grid Layout is painted
    setTimeout(() => {
        render();
        sync();
        startTurn();
    }, 100);
}

function render() {
    const b = document.getElementById('game-wrapper');
    const centerDash = b.querySelector('.center-dash');

    Array.from(b.children).forEach(c => {
        if (!c.classList.contains('center-dash')) b.removeChild(c);
    });

    music.forEach((d, i) => {
        const t = document.createElement('div'); t.className = 'tile'; t.id = `tile-${i}`; t.style.gridArea = grid[i];

        // Special Styles
        if (d.n === "GO" || d.n.includes("INÍCIO")) t.classList.add('tile-go');
        else if (d.t === "card") t.classList.add('tile-card');
        else if (d.n.includes("MASTERS PRESAS")) t.classList.add('tile-jail');
        else if (d.n.includes("HIATO")) t.classList.add('tile-hiato');
        else if (d.n.includes("VENDIDAS") || d.n.includes("ENTRE EM")) t.classList.add('tile-gotojail');
        else if (d.t === "s" || d.t === "tax") t.classList.add('tile-special');
        else if (d.t === "rail") t.classList.add('tile-rail');
        else if (d.t === "util") t.classList.add('tile-util');

        if (d.c) t.innerHTML = `<div class="tile-color" style="background:${d.c}"></div><div id="build-${i}" style="position:absolute; top:12px"></div>`;
        t.innerHTML += `<div>${d.n}</div><div class="price">${d.p ? '$' + d.p : ''}</div><div id="owner-${i}" class="owner-bar"></div>`;
        b.appendChild(t);
    });

    // ----------------------------------------------------------------------------------
    // FIX STATE PERSISTENCE: Re-apply ownership colors and houses from players array
    // ----------------------------------------------------------------------------------
    players.forEach(p => {
        p.props.forEach(prop => {
            const ownerBar = document.getElementById(`owner-${prop.idx}`);
            if (ownerBar) {
                ownerBar.style.background = (p.id === 0 ? '#ff4081' : (p.id === 1 ? '#4caf50' : '#2196f3'));
            }
            updateTile(prop.idx, prop);
        });
    });

    players.forEach(p => {
        const tk = document.createElement('div'); tk.id = `tk-${p.id}`; tk.className = 'token'; tk.innerText = p.token;
        tk.style.background = p.id === 0 ? '#ff4081' : (p.id === 1 ? '#4caf50' : '#2196f3');
        b.appendChild(tk);
    });
    updateHUD(); sync();
}

function startTurn() {
    const p = players[turn];
    updateHUD();

    document.getElementById('turn-msg').innerText = `Vez de ${p.name}`;
    showModal('modal-turn');

    setTimeout(() => {
        closeModal('modal-turn');
        if (p.name.includes("Bot")) {
            // document.getElementById('roll-btn').disabled = true; // Button removed
            log(`🤖 ${p.name} vai jogar...`);
            setTimeout(toss, 1000);
        } else {
            // document.getElementById('roll-btn').disabled = false; // Button removed
            log(`👉 Sua vez! Toque nos dados para jogar.`);
        }
    }, 1500);
}

// Dice State
let d1Rot = { x: 0, y: 0 }, d2Rot = { x: 0, y: 0 };

const faceAngles = {
    1: { x: 0, y: 0 },
    2: { x: 0, y: -90 },
    3: { x: -90, y: 0 },
    4: { x: 90, y: 0 },
    5: { x: 0, y: 90 },
    6: { x: 0, y: 180 },
};

function toss() {
    const p = players[turn];
    if (document.getElementById('d1-cube').style.pointerEvents === 'none') return; // Prevent double click

    // Lock interaction
    const cubes = [document.getElementById('d1-cube'), document.getElementById('d2-cube')];
    cubes.forEach(c => c.style.pointerEvents = 'none'); // Disable clicking

    // Determine Result
    let d1 = Math.floor(Math.random() * 6) + 1;
    let d2 = Math.floor(Math.random() * 6) + 1;

    // Anti-Double Bias (50% reroll)
    if (d1 === d2 && Math.random() > 0.5) d2 = Math.floor(Math.random() * 6) + 1;

    // Calculate new rotation (add multiples of 360 for spinning)
    const spins = 5; // Minimum full spins
    d1Rot.x += (360 * spins) + faceAngles[d1].x - (d1Rot.x % 360);
    d1Rot.y += (360 * spins) + faceAngles[d1].y - (d1Rot.y % 360);

    d2Rot.x += (360 * spins) + faceAngles[d2].x - (d2Rot.x % 360);
    d2Rot.y += (360 * spins) + faceAngles[d2].y - (d2Rot.y % 360);

    // Apply Transform
    cubes[0].style.transform = `rotateX(${d1Rot.x}deg) rotateY(${d1Rot.y}deg)`;
    cubes[1].style.transform = `rotateX(${d2Rot.x}deg) rotateY(${d2Rot.y}deg)`;

    // Wait for animation (600ms)
    setTimeout(() => {
        // Unlock
        cubes.forEach(c => c.style.pointerEvents = 'auto');

        let moved = false;
        // Game Logic
        const glowers = document.querySelectorAll('.glow-active');
        glowers.forEach(g => g.classList.remove('glow-active'));

        if (p.jail > 0) {
            if (d1 === d2) {
                p.jail = 0;
                log("Saiu do Hiato!");
                doubles = 0;
                moved = true;
                move(p, d1 + d2);
            } else {
                p.jail--;
                log(`Ainda no Hiato (${p.jail})`);
                doubles = 0;
                nextTurn();
            }
        } else {
            if (d1 === d2) doubles++; else doubles = 0;

            if (doubles === 3) {
                log("3 Doubles! Vai pro Hiato!");
                p.pos = 12; p.jail = 3; doubles = 0; sync(); nextTurn();
            } else {
                moved = true;
                move(p, d1 + d2);
            }
        }
    }, 700); // 600ms animation + 100ms buffer
}

function move(p, dist) {
    let old = p.pos; p.pos = (p.pos + dist) % 48;
    if (p.pos < old) { p.money += 200; log("Passou pelo GO! +$200"); sndCash.play(); }
    sync(); setTimeout(() => handle(p, dist), 500);
}

function handle(p, dist) {
    const t = music[p.pos];
    if (p.pos === 36) { p.pos = 12; p.jail = 3; doubles = 0; sync(); nextTurn(); return; }
    if (t.t === "card") { drawCard(p); return; }
    if (t.t === "tax") return askPay(p, t.v, "Taxa", nextTurn);

    const owner = players.find(x => x.props.some(y => y.idx === p.pos));
    if (t.p && !owner) {
        if (p.name.includes("Bot")) {
            if (p.money > t.p + 200) {
                buy(p, p.pos);
                nextTurn();
            }
            else if (Math.random() > 0.5) startAuction(p.pos);
            else nextTurn();
        } else {
            // Render the Full Deed Card for the Buy Modal
            const cardHtml = renderBuyCard(p.pos);
            document.getElementById('buy-card-area').innerHTML = cardHtml;

            // NEW: Show Current Balance
            const balanceDiv = document.createElement('div');
            balanceDiv.style.cssText = "text-align:center; padding:10px; color:#aaa; font-size:1.1rem; border-bottom:1px solid #333; margin-bottom:10px";
            balanceDiv.innerHTML = `Seu Saldo: <span style="color:#4caf50; font-weight:bold">$${p.money}</span>`;

            // Clean previous buttons
            const footer = document.getElementById('buy-actions');
            footer.innerHTML = ""; // Clear all

            // Prepend balance to footer or insert before? 
            // Better to insert it into the area before buttons.
            footer.appendChild(balanceDiv);

            // Container for buttons for layout
            const btnContainer = document.createElement('div');
            btnContainer.style.display = 'flex';
            btnContainer.style.gap = '10px';
            btnContainer.style.marginTop = '10px';

            // 1. Buy Button
            const buyBtn = document.createElement('button');
            buyBtn.className = 'm3-btn';
            buyBtn.style.background = '#4caf50';
            buyBtn.style.flex = '1';
            buyBtn.innerText = `Comprar ($${t.p})`; // Show price in button

            // FIX: Validate Money
            if (p.money < t.p) {
                buyBtn.disabled = true;
                buyBtn.innerText = 'Sem Fundos';
                buyBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                buyBtn.style.color = 'rgba(255, 255, 255, 0.5)';
                buyBtn.style.cursor = 'not-allowed';
            } else {
                buyBtn.onclick = doBuy;
            }
            btnContainer.appendChild(buyBtn);

            // 2. Auction Button
            const auBtn = document.createElement('button');
            auBtn.className = 'm3-btn';
            auBtn.style.background = '#ff9800';
            auBtn.style.flex = '1';
            auBtn.innerText = 'Leiloar';
            auBtn.onclick = () => { closeModal('modal-buy'); startAuction(p.pos); };
            footer.appendChild(auBtn);

            showModal('modal-buy');
        }
    } else if (owner && owner.id !== p.id) {
        const rent = calcRent(t, owner, dist);

        // FIX: Pay the OWNER
        askPay(p, rent, `Aluguel para ${owner.name}`, () => {
            owner.money += rent; // Transfer Logic
            log(`${owner.name} recebeu $${rent}.`);
            nextTurn();
        });
    } else nextTurn();
    updateHUD();
}

function buy(p, i) {
    p.money -= music[i].p;
    p.props.push({ idx: i, houses: 0, mortgaged: false });
    document.getElementById(`owner-${i}`).style.background = (p.id === 0 ? '#ff4081' : (p.id === 1 ? '#4caf50' : '#2196f3'));

    // Glow Effect
    const tile = document.getElementById(`tile-${i}`);
    if (tile) {
        tile.classList.add('glow-active');
        setTimeout(() => tile.classList.remove('glow-active'), 1000);
    }

    sndCash.play();
    if (p.money < 0) fail(p); else updateHUD();
}
function doBuy() { buy(players[turn], players[turn].pos); closeModal('modal-buy'); nextTurn(); }
function nextTurn() {
    if (doubles === 0) turn = (turn + 1) % players.length;
    updateHUD();
    startTurn();
}

function drawCard(p) {
    const c = chanceCards[Math.floor(Math.random() * chanceCards.length)];
    document.getElementById('card-msg').innerText = c.t;
    showModal('modal-card');

    const execute = () => {
        closeModal('modal-card');
        const ret = c.a(p);
        updateHUD();
        if (p.money < 0) fail(p);
        else if (ret !== false) nextTurn();
    };

    if (p.name.includes("Bot")) {
        setTimeout(execute, 2000);
    } else {
        document.querySelector('#modal-card .m3-btn').onclick = execute;
    }
}

function showAlert(msg) {
    document.getElementById('alert-msg').innerText = msg;
    showModal('modal-alert');
}

function startAuction(idx) {
    auc = { idx: idx, players: [...players], turn: 0, bid: music[idx].p / 2, leader: null };
    document.getElementById('auc-prop').innerText = music[idx].n;
    updateAuctionUI();
    showModal('modal-auction');
}

function updateAuctionUI() {
    if (auc.players.length === 0) {
        closeModal('modal-auction');
        log("Leilão cancelado (sem participantes).");
        nextTurn();
        return;
    }

    if (auc.players.length === 1 && auc.leader) {
        const winner = auc.players[0];
        closeModal('modal-auction');
        winner.money -= auc.bid;
        winner.props.push({ idx: auc.idx, houses: 0, mortgaged: false });
        log(`${winner.name} venceu o leilão de ${music[auc.idx].n} por $${auc.bid}!`);

        const tile = document.getElementById(`tile-${auc.idx}`);
        if (tile) {
            tile.classList.add('glow-active');
            setTimeout(() => tile.classList.remove('glow-active'), 1000);
        }

        sndCash.play();
        updateHUD(); render(); nextTurn(); // Render to update ownership visually
        return;
    }

    const p = auc.players[auc.turn];
    document.getElementById('auc-bid').innerText = `$${auc.bid}`;
    document.getElementById('auc-leader').innerText = auc.leader ? `Líder: ${auc.leader.name}` : `Lance Inicial`;

    // NEW: Show Balance
    document.getElementById('auc-turn').innerHTML = `Vez de: <span style="font-weight:bold">${p.name}</span> <span style="font-size:0.9rem; color:#ccc">($${p.money})</span>`;

    // NEW: Disable button if broke
    const bidBtn = document.querySelector('#modal-auction .m3-btn'); // The first button is "Cobrir"
    if (p.money < auc.bid + 10) {
        bidBtn.disabled = true;
        bidBtn.style.background = '#555';
        bidBtn.style.color = '#888';
        bidBtn.style.cursor = 'not-allowed';
    } else {
        bidBtn.disabled = false;
        bidBtn.style.background = 'gold';
        bidBtn.style.color = 'black';
        bidBtn.style.cursor = 'pointer';
    }

    if (p.name.includes("Bot")) {
        setTimeout(() => {
            if (p.money > auc.bid + 10 && Math.random() > 0.1) bidAuction();
            else passAuction();
        }, 1000);
    }
}

function bidAuction() {
    const p = auc.players[auc.turn];
    if (p.money < auc.bid + 10) { showAlert("Sem fundos para cobrir!"); return; }
    auc.bid += 10;
    auc.leader = p;
    auc.turn = (auc.turn + 1) % auc.players.length;
    updateAuctionUI();
}

function passAuction() {
    auc.players.splice(auc.turn, 1);
    if (auc.turn >= auc.players.length) auc.turn = 0;
    updateAuctionUI();
}

function askPay(p, val, reason, cb) {
    // Unified UI for Bot and Human
    showModal('modal-pay');
    const isRent = reason.includes("Aluguel para");
    const recipient = isRent ? reason.replace("Aluguel para ", "") : "O Banco";

    document.getElementById('pay-msg').innerHTML = `
        <div style="background:rgba(255,255,255,0.1); padding:15px; border-radius:10px; margin-bottom:10px">
            <div style="color:#ff9800; font-weight:bold; font-size:1.2rem; margin-bottom:10px">💸 PAGAMENTO 💸</div>
            <div style="display:flex; justify-content:space-between; margin-bottom:5px">
                <span>De:</span> <span style="font-weight:bold">${p.name} <span style="font-weight:normal; color:#ccc; font-size:0.9rem">(Saldo: $${p.money})</span></span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:5px">
                <span>Para:</span> <span style="font-weight:bold">${recipient}</span>
            </div>
             <div style="display:flex; justify-content:space-between; border-top:1px solid rgba(255,255,255,0.2); padding-top:5px; margin-top:5px">
                <span>Valor:</span> <span style="color:#f44336; font-weight:bold; font-size:1.2rem">$${val}</span>
            </div>
        </div>
        <div style="font-size:0.8rem; color:#ccc">${reason}</div>
    `;

    const payBtn = document.getElementById('pay-btn');
    // Reset button state
    payBtn.disabled = false;
    payBtn.innerText = "Pagar Agora";
    payBtn.onclick = () => {
        p.money -= val;
        closeModal('modal-pay');
        if (p.money < 0) fail(p); else {
            sndCash.play();
            log(`💰 PAGAMENTO: ${p.name} pagou $${val} para ${recipient}.`);
            cb();
        }
        updateHUD();
    };

    if (p.name.includes("Bot")) {
        payBtn.disabled = true;
        payBtn.innerText = "Processando...";
        setTimeout(() => {
            // Auto-click pay
            payBtn.disabled = false;
            payBtn.click();
        }, 1500); // 1.5s delay so user sees it
        return;
    }

    // For humans, logic continues below (duplicate rendering code removed via this replacement)
    // Actually, I need to be careful not to duplicate the UI setup code if I'm merging blocks.
    // The original code had:
    // if (bot) { ... return; }
    // // Human UI ...

    // I am replacing the TOP part. I need to replace the whole function essentially or handle the flow carefully.
    // Let's replace the whole function to be safe and clean.
}

function calcRent(t, o, d) {
    const pr = o.props.find(x => x.idx === music.indexOf(t));
    if (pr.mortgaged) return 0;
    if (t.t === "rail") return [0, 25, 50, 100, 200][o.props.filter(x => music[x.idx].t === "rail").length];
    if (t.t === "util") return d * (o.props.filter(x => music[x.idx].t === "util").length === 1 ? 4 : 10);
    return t.r[pr.houses];
}

function fail(p) {
    p.money = 0;
    updateHUD();
    document.getElementById('fail-msg').innerText = `FIM DE JOGO! ${p.name} faliu! O império musical desmoronou.`;
    showModal('modal-fail');
    document.getElementById('roll-btn').disabled = true; // Button removed but id might be needed by fail... wait, I removed the button.
    const btns = document.querySelectorAll('.m3-btn');
    btns.forEach(b => {
        if (!b.innerText.includes('Reiniciar')) b.disabled = true;
    });
}

function openManage() {
    const list = document.getElementById('manage-list');
    list.innerHTML = "";

    if (players[turn].props.length === 0) {
        list.innerHTML = "<p style='color:#888; text-align:center; width:100%'>Você não possui propriedades.</p>";
    }

    players[turn].props.forEach(pr => {
        const tile = music[pr.idx];
        const isRailUtil = tile.t === 'rail' || tile.t === 'util';
        const houseCost = tile.h || 0;
        const canBuild = !pr.mortgaged && !isRailUtil && players[turn].money >= houseCost && pr.houses < 5;
        const canSellHouse = !isRailUtil && pr.houses > 0;
        const mortgageValue = tile.p / 2;
        const unmortgageCost = Math.ceil(mortgageValue * 1.1);
        const canMortgage = !pr.mortgaged && pr.houses === 0;
        const canUnmortgage = pr.mortgaged && players[turn].money >= unmortgageCost;

        let rentStats = "";
        if (!isRailUtil) {
            rentStats = `
                <div class="rent-row"><span>Aluguel:</span> <span>$${tile.r[0]}</span></div>
                <div class="rent-row"><span>1 Casa:</span> <span>$${tile.r[1]}</span></div>
                <div class="rent-row"><span>2 Casas:</span> <span>$${tile.r[2]}</span></div>
                <div class="rent-row"><span>3 Casas:</span> <span>$${tile.r[3]}</span></div>
                <div class="rent-row"><span>4 Casas:</span> <span>$${tile.r[4]}</span></div>
                <div class="rent-row"><span>HOTEL:</span> <span>$${tile.r[5]}</span></div>
                <hr style="margin:5px 0; border:0; border-top:1px solid #ccc">
                <div class="rent-row"><span>Custo Casa:</span> <span>$${tile.h}</span></div>
            `;
        } else if (tile.t === 'rail') {
            rentStats = `
                <div class="rent-row"><span>1 Estádio:</span> <span>$25</span></div>
                <div class="rent-row"><span>2 Estádios:</span> <span>$50</span></div>
                <div class="rent-row"><span>3 Estádios:</span> <span>$100</span></div>
                <div class="rent-row"><span>4 Estádios:</span> <span>$200</span></div>
            `;
        } else {
            rentStats = `
                <div style="text-align:center; margin:10px 0">Se tiver 1 utilitário, aluguel é 4x dados.<br>Se tiver 2, é 10x dados.</div>
            `;
        }

        let html = `
        <div class="deed-card" style="${pr.mortgaged ? 'opacity:0.6;' : ''}">
            <div class="deed-header" style="background:${tile.c || '#ccc'}; color:${tile.c === '#010101' ? 'white' : 'black'}">
                ${tile.n}
                <div style="font-size:0.6rem; margin-top:2px">${pr.mortgaged ? '(HIPOTECADA)' : (isRailUtil ? '' : (pr.houses === 5 ? '🏨' : '🏠'.repeat(pr.houses)))}</div>
            </div>
            <div class="deed-body">
                ${rentStats}
                <div class="rent-row" style="margin-top:auto; font-weight:bold">
                    <span>Hipoteca:</span> <span>$${mortgageValue}</span>
                </div>
                
                <div class="deed-actions">
                    ${!isRailUtil ? `
                    <div style="display:flex; gap:2px">
                        <button class="m3-btn" ${canBuild ? '' : 'disabled'} style="background:#4caf50; flex:1" onclick="bld(${pr.idx})">+🏠</button>
                        <button class="m3-btn" ${canSellHouse ? '' : 'disabled'} style="background:#ff9800; flex:1" onclick="sellHouse(${pr.idx})">-🏠</button>
                    </div>` : ''}
                    
                    ${pr.mortgaged ?
                `<button class="m3-btn" ${canUnmortgage ? '' : 'disabled'} style="background:#4caf50" onclick="unmtg(${pr.idx})">Desipotecar (-$${unmortgageCost})</button>` :
                `<button class="m3-btn" ${canMortgage ? '' : 'disabled'} style="background:#673ab7; color:white" onclick="mtg(${pr.idx})">Hipotecar (+$${mortgageValue})</button>`
            }
                    
                    <div style="display:flex; gap:2px">
                        <button class="m3-btn" style="background:#00bcd4; flex:1" onclick="transfer(${pr.idx})">Trocar</button>
                        <button class="m3-btn" style="background:#f44336; color:white; flex:1" onclick="sl(${pr.idx})">Vender</button>
                    </div>
                </div>
            </div>
        </div>`;
        list.innerHTML += html;
    });
    showModal('modal-manage');
}

let currentTrade = {
    initiator: null,
    target: null,
    giveMoney: 0,
    giveProps: [], // Set of indices
    getMoney: 0,
    getProps: [], // Set of indices
    state: 'DRAFT' // DRAFT, REVIEW
};

// 1. ENTRY POINT: Click "Trocar" on a property or generic button
// 1. ENTRY POINT: Click "Trocar" on a property or generic button
function transfer(idx = -1) {
    tradeIdx = idx; // Global state for current trade property

    let headerMsg = "Nova Negociação";
    let subMsg = "Com quem você deseja negociar?";

    // Safely handle property context
    if (idx !== -1 && music[idx]) {
        headerMsg = `Negociando: ${music[idx].n}`;
        subMsg = "Escolha um parceiro para oferecer esta propriedade:";
    }

    const modalBody = document.getElementById('modal-trade');
    if (!modalBody) { console.error("Modal Trade not found!"); return; }

    // Generate fresh HTML every time to avoid ID conflicts or missing elements
    modalBody.innerHTML = `
        <h2>${headerMsg}</h2>
        <p>${subMsg}</p>
        <select id="trade-target" style="width:100%; padding:10px; margin:20px 0; border-radius:8px; font-size:1.1rem; background:rgba(255,255,255,0.1); color:white; border:1px solid #555"></select>
        <div style="display:flex; gap:10px; justify-content:center">
            <button class="m3-btn" style="background:#4caf50" onclick="initNegotiation()">Iniciar</button>
            <button class="m3-btn" style="background:#555" onclick="closeModal('modal-trade')">Cancelar</button>
        </div>
    `;

    // Populate Select
    const sel = document.getElementById('trade-target');
    if (sel) {
        players.forEach((p, i) => {
            // Don't list yourself
            if (i !== turn) {
                sel.innerHTML += `<option value="${i}">${p.token} ${p.name}</option>`;
            }
        });
    }

    showModal('modal-trade');
}

// 2. INITIALIZE NEGOTIATION
function initNegotiation() {
    closeModal('modal-manage'); // Close manage if open
    closeModal('modal-trade');

    const targetId = parseInt(document.getElementById('trade-target').value);
    const me = players[turn];
    const target = players[targetId];

    currentTrade = {
        initiator: me.id,
        target: target.id,
        giveMoney: 0,
        giveProps: tradeIdx !== -1 && players[turn].props.find(p => p.idx === tradeIdx) ? [tradeIdx] : [],
        getMoney: 0,
        getProps: tradeIdx !== -1 && target.props.find(p => p.idx === tradeIdx) ? [tradeIdx] : [],
        state: 'DRAFT'
    };

    renderNegotiationUI();
    showModal('modal-negotiation');
    document.getElementById('modal-negotiation').style.display = 'flex';
}

// 3. RENDER UI
function renderNegotiationUI() {
    const p1 = players[currentTrade.initiator]; // Active User (Left)
    const p2 = players[currentTrade.target];    // Opponent (Right)
    const isReview = currentTrade.state === 'REVIEW';

    // Headers
    document.getElementById('trade-left-name').innerText = `${p1.token} ${p1.name} (Você)`;
    document.getElementById('trade-right-name').innerText = `${p2.token} ${p2.name}`;

    // Balances
    document.getElementById('trade-left-balance').innerText = `Saldo disponível: $${p1.money}`;
    document.getElementById('trade-right-balance').innerText = `Saldo disponível: $${p2.money}`;

    // Inputs (Money)
    const in1 = document.getElementById('trade-left-money');
    const in2 = document.getElementById('trade-right-money');

    in1.value = currentTrade.giveMoney;
    in2.value = currentTrade.getMoney;

    in1.disabled = isReview;
    in2.disabled = isReview;

    // Property Lists
    renderPropList('trade-left-props', p1, currentTrade.giveProps, isReview, (idx, checked) => {
        if (checked) currentTrade.giveProps.push(idx);
        else currentTrade.giveProps = currentTrade.giveProps.filter(x => x !== idx);
    });

    renderPropList('trade-right-props', p2, currentTrade.getProps, isReview, (idx, checked) => {
        if (checked) currentTrade.getProps.push(idx);
        else currentTrade.getProps = currentTrade.getProps.filter(x => x !== idx);
    });

    // Actions Buttons
    const actions = document.getElementById('trade-actions');
    actions.innerHTML = "";

    if (!isReview) {
        actions.innerHTML = `
            <button class="m3-btn" style="background:#f44336; color:white" onclick="closeModal('modal-negotiation')">Cancelar</button>
            <button class="m3-btn" style="background:#4caf50; min-width:150px" onclick="submitOffer()">Fazer Oferta ➤</button>
        `;
    } else {
        actions.innerHTML = `
            <div style="margin-right:auto; align-self:center; color:#ccc">⏳ ${p2.name} está analisando...</div>
            <button class="m3-btn" style="background:#f44336; color:white" onclick="rejectTrade()">Recusar</button>
            <button class="m3-btn" style="background:#ff9800" onclick="counterOffer()">Contra-Proposta</button>
            <button class="m3-btn" style="background:#4caf50" onclick="acceptTrade()">✅ Aceitar</button>
        `;
    }
}

function renderPropList(containerId, player, selectedIndices, disabled, onToggle) {
    const div = document.getElementById(containerId);
    div.innerHTML = "";

    if (player.props.length === 0) {
        div.innerHTML = "<div style='color:#666; font-size:0.8rem; text-align:center'>Sem propriedades</div>";
        return;
    }

    player.props.forEach(pr => {
        const m = music[pr.idx];
        const isSel = selectedIndices.includes(pr.idx);

        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.padding = '5px';
        row.style.background = isSel ? 'rgba(76, 175, 80, 0.2)' : 'transparent';
        row.style.borderBottom = '1px solid #333';

        // Color Indicator
        const colorDot = `<div style="width:12px; height:12px; background:${m.c}; border-radius:50%; margin-right:8px; border:1px solid #555"></div>`;

        // Checkbox
        const chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.checked = isSel;
        chk.disabled = disabled;
        chk.style.marginRight = '10px';
        chk.onchange = (e) => {
            onToggle(pr.idx, e.target.checked);
            row.style.background = e.target.checked ? 'rgba(76, 175, 80, 0.2)' : 'transparent';
        };

        const lbl = document.createElement('span');
        lbl.innerHTML = `${m.n}`;
        if (pr.mortgaged) lbl.innerHTML += ` <span style='font-size:0.7rem; color:#f44336'>(Hip.)</span>`;

        row.innerHTML = colorDot;
        row.appendChild(chk);
        row.appendChild(lbl);
        div.appendChild(row);
    });
}

// 4. LOGIC
function updateTradeBalance() {
    currentTrade.giveMoney = parseInt(document.getElementById('trade-left-money').value) || 0;
    currentTrade.getMoney = parseInt(document.getElementById('trade-right-money').value) || 0;
}

function submitOffer() {
    updateTradeBalance();
    const p1 = players[currentTrade.initiator];

    if (currentTrade.giveMoney > p1.money) { showAlert("Você não tem dinheiro suficiente para essa oferta!"); return; }

    // Check if at least something is offered/requested
    // (Optional: Allow gifts? Yes)

    currentTrade.state = 'REVIEW';
    renderNegotiationUI();

    // Check if Target is BOT
    const targetP = players[currentTrade.target];
    if (targetP.name.includes("Bot")) {
        const actions = document.getElementById('trade-actions');
        actions.innerHTML = `<div style="width:100%; text-align:center; color:#ffeb3b; font-weight:bold; font-size:1.1rem; padding:20px">🤖 Analisando proposta...</div>`;

        setTimeout(() => {
            analyzeBotTrade();
        }, 1500); // 1.5s thinking time
        return;
    }

    // In a real game, this would push to the other player.
    // Here we simulate the modal being passed to Player 2
    // showAlert(`Passe o dispositivo para ${players[currentTrade.target].name}!`);
}

function counterOffer() {
    // Swap Roles
    const tempId = currentTrade.initiator;
    currentTrade.initiator = currentTrade.target;
    currentTrade.target = tempId;

    // Swap Proposed Assets
    const tempMoney = currentTrade.giveMoney;
    currentTrade.giveMoney = currentTrade.getMoney;
    currentTrade.getMoney = tempMoney;

    const tempProps = currentTrade.giveProps;
    currentTrade.giveProps = currentTrade.getProps;
    currentTrade.getProps = tempProps;

    currentTrade.state = 'DRAFT';
    renderNegotiationUI();
    // showAlert(`Agora é a vez de ${players[currentTrade.initiator].name} editar a proposta.`);
}

function rejectTrade() {
    // Persistent Reject UI
    const actions = document.getElementById('trade-actions');
    actions.innerHTML = `
        <div style="width:100%; text-align:center; padding:15px; background:rgba(244, 67, 54, 0.2); border-radius:8px; margin-bottom:10px">
            <div style="color:#f44336; font-weight:bold; font-size:1.2rem">🚫 Proposta Recusada</div>
            <div style="color:#ccc; font-size:0.9rem">A negociação foi cancelada.</div>
        </div>
        <button class="m3-btn" style="background:#555; width:100%" onclick="closeModal('modal-negotiation')">Fechar</button>
    `;
    log("Negociação recusada.");
}

function acceptTrade() {
    const pRef1 = players[currentTrade.initiator]; // The one who made the LAST offer (Draft -> Submit)
    // Wait, in logic:
    // If P1 submited -> State REVIEW.
    // The Active View is now P2 (Target).
    // So if P2 accepts:
    // P2 Gets: giveMoney, giveProps
    // P2 Gives: getMoney, getProps

    // But wait, my render logic for Review Mode says:
    // "Left Side: You (Initiator)" -> displayed as the person who SENT the offer.
    // "Right Side: Oponente (Target)" -> displayed as the person VIEWING/RECEIVING.

    // Actually, let's keep it consistent with the data structure.
    // Data: Initiator (P1) offers GiveMoney/GiveProps.
    // Data: Target (P2) is asked for GetMoney/GetProps.
    //
    // So transfer is:
    // P1 -> P2: GiveMoney, GiveProps
    // P2 -> P1: GetMoney, GetProps

    const p1 = players[currentTrade.initiator];
    const p2 = players[currentTrade.target];

    // Final Validation
    if (p1.money < currentTrade.giveMoney) { showAlert(`${p1.name} não tem fundos!`); return; }
    if (p2.money < currentTrade.getMoney) { showAlert(`${p2.name} não tem fundos!`); return; }

    // Execute Money
    p1.money -= currentTrade.giveMoney;
    p2.money += currentTrade.giveMoney;

    p2.money -= currentTrade.getMoney;
    p1.money += currentTrade.getMoney;

    // Execute Props (Move P1 -> P2)
    currentTrade.giveProps.forEach(idx => {
        const propIndex = p1.props.findIndex(x => x.idx === idx);
        if (propIndex !== -1) {
            const prop = p1.props.splice(propIndex, 1)[0];
            p2.props.push(prop);
            document.getElementById(`owner-${idx}`).style.background = getPlayerColor(p2.id); // Helper needed or inline
        }
    });

    // Execute Props (Move P2 -> P1)
    currentTrade.getProps.forEach(idx => {
        const propIndex = p2.props.findIndex(x => x.idx === idx);
        if (propIndex !== -1) {
            const prop = p2.props.splice(propIndex, 1)[0];
            p1.props.push(prop);
            document.getElementById(`owner-${idx}`).style.background = getPlayerColor(p1.id);
        }
    });

    sndCash.play();
    log(`Negociação concluída entre ${p1.name} e ${p2.name}!`);
    updateHUD();

    // Persistent Success UI
    const actions = document.getElementById('trade-actions');
    actions.innerHTML = `
        <div style="width:100%; text-align:center; padding:15px; background:rgba(76, 175, 80, 0.2); border-radius:8px; margin-bottom:10px">
            <div style="color:#4caf50; font-weight:bold; font-size:1.2rem">✅ Negócio Fechado!</div>
            <div style="color:#ccc; font-size:0.9rem">Transferência realizada com sucesso.</div>
        </div>
        <button class="m3-btn" style="background:#555; width:100%" onclick="closeModal('modal-negotiation')">Fechar</button>
    `;

    // Disable inputs to prevent changes after acceptance
    document.querySelectorAll('#modal-negotiation input, #modal-negotiation button:not(.m3-btn)').forEach(el => el.disabled = true);
}

function getPlayerColor(id) {
    return id === 0 ? '#ff4081' : (id === 1 ? '#4caf50' : (id === 2 ? '#2196f3' : '#ffeb3b'));
}

function bld(idx) {
    const p = players[turn], pr = p.props.find(x => x.idx === idx);
    const thisPropColor = music[idx].c;
    const allPropsOfColor = music.filter(m => m.c === thisPropColor);
    const myPropsOfColor = p.props.filter(mp => music[mp.idx].c === thisPropColor);

    if (allPropsOfColor.length !== myPropsOfColor.length) {
        showAlert("Você precisa ter TODAS as propriedades dessa cor para construir!");
        return;
    }

    const houses = myPropsOfColor.map(mp => mp.houses);
    const minH = Math.min(...houses);

    if (pr.houses > minH) {
        showAlert("Regra de Construção Uniforme: Construa igualmente!");
        return;
    }

    p.money -= music[idx].h; pr.houses++;
    if (p.money < 0) { fail(p); return; }
    updateTile(idx, pr);

    // Glow
    const tile = document.getElementById(`tile-${idx}`);
    if (tile) {
        tile.classList.add('glow-active');
        setTimeout(() => tile.classList.remove('glow-active'), 1000);
    }

    sndCash.play(); updateHUD(); openManage();
}

function sellHouse(idx) {
    const p = players[turn], pr = p.props.find(x => x.idx === idx);
    const thisPropColor = music[idx].c;
    const myPropsOfColor = p.props.filter(mp => music[mp.idx].c === thisPropColor);
    const houses = myPropsOfColor.map(mp => mp.houses);
    const maxH = Math.max(...houses);

    if (pr.houses < maxH) {
        showAlert("Regra de Venda Uniforme: Venda das mais altas primeiro!");
        return;
    }

    p.money += music[idx].h / 2; pr.houses--;
    updateTile(idx, pr);

    // Glow
    const tile = document.getElementById(`tile-${idx}`);
    if (tile) {
        tile.classList.add('glow-active');
        setTimeout(() => tile.classList.remove('glow-active'), 1000);
    }

    sndCash.play(); updateHUD(); openManage();
}

function mtg(idx) {
    const p = players[turn], pr = p.props.find(x => x.idx === idx);
    p.money += music[idx].p / 2; pr.mortgaged = true;
    updateTile(idx, pr);
    sndCash.play(); updateHUD(); openManage();
}

function unmtg(idx) {
    const p = players[turn], pr = p.props.find(x => x.idx === idx);
    const cost = Math.ceil((music[idx].p / 2) * 1.1);
    p.money -= cost; pr.mortgaged = false;
    if (p.money < 0) { fail(p); return; }
    updateTile(idx, pr);
    sndCash.play(); updateHUD(); openManage();
}

function updateTile(idx, pr) {
    const el = document.getElementById(`build-${idx}`);
    if (!el) return;
    if (pr.mortgaged) el.innerText = "🚫";
    else el.innerText = pr.houses < 5 ? "🏠".repeat(pr.houses) : "🏨";
}

function sl(idx) {
    sellIdx = idx;
    document.getElementById('confirm-title').innerText = "Vender Propriedade?";
    document.getElementById('confirm-msg').innerText = `Vender ${music[idx].n} devolverá ao banco por $${music[idx].p / 2}. Confirmar?`;
    document.getElementById('confirm-yes-btn').onclick = doSell;
    showModal('modal-confirm');
}

function doSell() {
    if (sellIdx === -1) return;
    const p = players[turn];
    p.money += music[sellIdx].p / 2;
    p.props = p.props.filter(x => x.idx !== sellIdx);
    document.getElementById(`owner-${sellIdx}`).style.background = 'none';
    document.getElementById(`build-${sellIdx}`).innerText = '';

    closeModal('modal-confirm');
    updateHUD();
    openManage();
}

function updateHUD() {
    const row = document.getElementById('status-row'); row.innerHTML = "";
    players.forEach((p, i) => {
        const card = document.createElement('div'); card.className = `p-card ${turn === i ? 'active' : ''}`;

        // Dynamic Neon Color
        const color = i === 0 ? '#ff4081' : (i === 1 ? '#4caf50' : (i === 2 ? '#2196f3' : '#ffeb3b'));

        // Remove solid backgrounds, use glows
        if (turn === i) {
            card.style.border = `2px solid ${color}`;
            card.style.boxShadow = `0 0 15px ${color}`;
            // card.style.background = 'rgba(255,255,255,0.1)'; // Optional highlight
        } else {
            card.style.border = '1px solid rgba(255,255,255,0.1)';
            card.style.boxShadow = 'none';
        }

        card.innerHTML = `<div class="p-name" style="color:${color}">${p.token} ${p.name}</div><div class="p-money">$${p.money}</div>`;
        row.appendChild(card);
    });

    highlightActiveTile();
}

function highlightActiveTile() {
    // Remove from all
    document.querySelectorAll('.tile').forEach(t => t.classList.remove('current-turn-glow'));

    // Add to current player's tile
    const p = players[turn];
    const tile = document.getElementById(`tile-${p.pos}`);
    if (tile) {
        tile.classList.add('current-turn-glow');
        // Match glow color to player color? Optional, but cool.
        // For now, white pulse is good for visibility.
    }
}

function sync() {
    players.forEach((p, i) => {
        const t = document.getElementById(`tile-${p.pos}`); const tk = document.getElementById(`tk-${p.id}`);
        tk.style.left = (t.offsetLeft + 4 + i * 4) + 'px'; tk.style.top = (t.offsetTop + 18 + i * 4) + 'px';
    });
}

function log(m) { document.getElementById('log-box').innerHTML = `> ${m}<br>` + document.getElementById('log-box').innerHTML; }
function showModal(id) {
    const el = document.getElementById(id);
    if (el.classList.contains('modal-flex-container')) {
        el.style.display = 'flex';
    } else {
        el.style.display = 'block';
    }
}
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function toggleFS() { if (!document.fullscreenElement) document.documentElement.requestFullscreen().then(sync); else document.exitFullscreen().then(sync); }

window.onload = () => {
    addP(); // Prepare first input silently

    // Simulate Loading
    setTimeout(() => {
        const load = document.getElementById('loading-screen');
        const setup = document.getElementById('setup');

        load.style.opacity = '0';
        setTimeout(() => {
            load.style.display = 'none';
            setup.style.display = 'flex'; // Reveal setup
        }, 500); // Wait for opacity fade
    }, 2500); // 2.5s load time
};

function renderBuyCard(idx) {
    const tile = music[idx];
    const isRailUtil = tile.t === 'rail' || tile.t === 'company';

    let rentStats = "";
    if (!tile.t || tile.t === 'property') {
        rentStats = `
            <div class="rent-row"><span>Aluguel:</span> <span>$${tile.r[0]}</span></div>
            <div class="rent-row"><span>1 Casa:</span> <span>$${tile.r[1]}</span></div>
            <div class="rent-row"><span>2 Casas:</span> <span>$${tile.r[2]}</span></div>
            <div class="rent-row"><span>3 Casas:</span> <span>$${tile.r[3]}</span></div>
            <div class="rent-row"><span>4 Casas:</span> <span>$${tile.r[4]}</span></div>
            <div class="rent-row"><span>HOTEL:</span> <span>$${tile.r[5]}</span></div>
            <hr style="margin:5px 0; border:0; border-top:1px solid #ccc">
            <div class="rent-row"><span>Custo Casa:</span> <span>$${tile.h}</span></div>
        `;
    } else if (tile.t === 'rail') {
        rentStats = `
            <div class="rent-row"><span>1 Estádio:</span> <span>$25</span></div>
            <div class="rent-row"><span>2 Estádios:</span> <span>$50</span></div>
            <div class="rent-row"><span>3 Estádios:</span> <span>$100</span></div>
            <div class="rent-row"><span>4 Estádios:</span> <span>$200</span></div>
        `;
    } else {
        rentStats = `
            <div style="text-align:center; margin:10px 0">Se tiver 1 utilitário, aluguel é 4x dados.<br>Se tiver 2, é 10x dados.</div>
        `;
    }

    const mortgageValue = music[idx].p / 2;

    return `
    <div class="deed-card" style="width:260px; font-size:0.9rem; box-shadow: 0 10px 20px rgba(0,0,0,0.3)">
        <div class="deed-header" style="padding:15px; font-size:1.1rem; background:${tile.c || '#ccc'}; color:${tile.c === '#010101' ? 'white' : 'black'}">
            ${tile.n}
        </div>
        <div class="deed-body" style="gap:5px; padding:15px">
            ${rentStats}
            <div class="rent-row" style="margin-top:10px; font-weight:bold; border-top:1px solid #ccc; padding-top:5px">
                <span>Hipoteca:</span> <span>$${mortgageValue}</span>
            </div>
            <div class="rent-row" style="margin-top:5px; font-weight:bold; color:var(--md-primary)">
                <span>Preço:</span> <span style="font-size:1.2rem">$${tile.p}</span>
            </div>
        </div>
    </div>`;
}

function analyzeBotTrade() {
    const me = players[currentTrade.target]; // The bot

    // Helper para checar se completa um conjunto de cor
    const completesSet = (player, propIdx) => {
        const color = music[propIdx].c;
        if (!color) return false; // Ignora utilitários/ferrovias

        const allColorProps = music.filter(m => m.c === color);
        const myProps = player.props.filter(p => music[p.idx].c === color);

        // Se o player tem (Total - 1) e essa é a que falta
        return myProps.length === (allColorProps.length - 1) && !myProps.find(p => p.idx === propIdx);
    };

    // Helper para checar se dar a propriedade quebra um conjunto
    const breaksSet = (player, propIdx) => {
        const color = music[propIdx].c;
        if (!color) return false;

        const allColorProps = music.filter(m => m.c === color);
        const myProps = player.props.filter(p => music[p.idx].c === color);

        // Se o player tem TODAS
        return myProps.length === allColorProps.length;
    };

    // 1. Calcular Valor que o Bot DÁ
    let valGive = currentTrade.getMoney;
    currentTrade.getProps.forEach(idx => {
        let pVal = music[idx].p;
        // Se o Bot dá uma carta que quebra o set dele, cobra 2.5x mais caro
        if (breaksSet(me, idx)) {
            pVal *= 2.5;
            log("🤖 Bot: Não quero quebrar meu conjunto!");
        }
        valGive += pVal;
    });

    // 2. Calcular Valor que o Bot RECEBE
    let valGet = currentTrade.giveMoney;
    currentTrade.giveProps.forEach(idx => {
        let pVal = music[idx].p;
        // Se o Bot recebe uma carta que completa o set dele, valoriza 2x
        if (completesSet(me, idx)) {
            pVal *= 2.0;
            log("🤖 Bot: Uau! Isso completa meu conjunto!");
        }
        valGet += pVal;
    });

    // 3. Decisão
    // "Fator Sardinha": Aceita se receber pelo menos 80% do valor que dá.
    const threshold = 0.8;
    const ratio = valGet / (valGive || 1);

    log(`🤖 Análise: Dou (Valor Calc.) $${valGive}, Recebo (Valor Calc.) $${valGet}. Ratio: ${ratio.toFixed(2)}`);

    if (valGet >= (valGive * threshold)) {
        log("🤖 Bom negócio (ou sou bonzinho). Aceito!");
        acceptTrade();
    } else {
        // Tenta Contra-Proposta (Pedir a diferença em dinheiro)
        // O Bot quer pelo menos 100% do valor (Fair Value) na contra-proposta
        const fairVal = valGive;
        const deficit = Math.ceil(fairVal - valGet);
        const partner = players[currentTrade.initiator];

        if (deficit > 0 && partner.money >= (currentTrade.giveMoney + deficit)) {
            // Pode fazer contra-proposta
            log(`🤖 Recusado. Tentando contra-proposta de +$${deficit}.`);

            // Atualiza o valor que o user tem que dar
            currentTrade.giveMoney += deficit;

            // Re-renderiza UI
            renderNegotiationUI();

            // Injeta mensagem
            const actions = document.getElementById('trade-actions');
            actions.innerHTML = `
                <div style="width:100%; text-align:center; padding:10px; background:rgba(255,152,0,0.2); border-radius:8px; margin-bottom:10px">
                    <div style="color:#ffeb3b; font-weight:bold">🤖 Negociação Recusada!</div>
                    <div style="color:#ccc; font-size:0.9rem">Minha contra-proposta é: <br>Adicione <b>$${deficit}</b> e fechamos.</div>
                </div>
                <button class="m3-btn" style="background:#f44336; color:white" onclick="rejectTrade()">Cancelar</button>
                <button class="m3-btn" style="background:#4caf50" onclick="acceptTrade()">✅ Aceitar Contra-Proposta</button>
            `;

            // IMPORTANTE: Hack para permitir que o "Aceitar" funcione agora como o User aceitando a proposta do Bot
            // Como o estado ainda é REVIEW e os botões chamam acceptTrade...
            // acceptTrade() pega initiator e target.
            // Quando User propôs: Initiator = User, Target = Bot.
            // Se User clica "Aceitar" agora:
            // p1 (Initiator/User) GIVES giveMoney
            // p2 (Target/Bot) GIVES getMoney
            // Isso está CORRETO. O User aceita pagar o novo giveMoney.

        } else {
            // Não tem dinheiro ou diferença muito grande/complexa
            log("🤖 Prejuízo demais e você não tem fundos. Recusado.");

            // Mostrar motivo na UI antes de fechar?
            const actions = document.getElementById('trade-actions');
            actions.innerHTML = `
                <div style="color:#f44336; font-weight:bold; padding:10px">🤖 Recusado! Proposta injusta.</div>
            `;
            setTimeout(() => rejectTrade(), 2000);
        }
    }
}