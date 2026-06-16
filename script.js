/* =========================================================================
   Trey Brown — portfolio
   Nav scroll · scroll reveals · theme toggle (paper default) · live demos
   ========================================================================= */

/* ---------- Nav scroll border -------------------------------------------- */
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
}

/* ---------- Theme toggle (light paper default, dark via body.dark) -------- */
const toggle = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme');
if (saved === 'dark') document.body.classList.add('dark');
if (toggle) {
    toggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

/* ---------- Scroll reveals ------------------------------------------------ */
const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fades = document.querySelectorAll('.fade-in');
if (prefersReduced) {
    fades.forEach(el => el.classList.add('visible'));
} else {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    fades.forEach(el => observer.observe(el));
}

/* ---------- Terminal samples --------------------------------------------- */
const RISK_SAMPLES = [
    {
        fn: "risk.score() · Epic production",
        out: "0.805 AUC · 114K scored",
        parts: [
            { t: "features: age=58 cd4_nadir=180\n          missed_visits=3\n\n" },
            { t: "risk_score  " },
            { t: "0.81  HIGH", k: "HIGH" },
            { t: "\n  ↑ " },
            { t: "missed_visits  +0.21", k: "SHAP" },
            { t: "\n  ↑ " },
            { t: "cd4_nadir  +0.14", k: "SHAP" },
            { t: "\n  threshold ≥0.55 → " },
            { t: "FLAG", k: "FLAG" },
            { t: "\n\n→ " },
            { t: "Epic Nebula OPA · scored", k: "DEPLOY" },
        ],
    },
];

const VALVE_SAMPLES = [
    {
        fn: "valve.classify() · echo NLP",
        out: "valvular disease · GPT-4o",
        parts: [
            { t: "read echo_impression.txt\n\n" },
            { t: "“…" },
            { t: "moderate aortic stenosis", k: "AORTIC" },
            { t: ",\n " },
            { t: "severe mitral regurgitation", k: "MITRAL" },
            { t: ",\n " },
            { t: "mild tricuspid regurgitation", k: "TRICUSPID" },
            { t: "…”\n\n→ " },
            { t: "3 valvular diagnoses", k: "DEPLOY" },
        ],
    },
    {
        fn: "valve.classify() · echo NLP",
        out: "valvular disease · GPT-4o",
        parts: [
            { t: "read echo_impression.txt\n\n" },
            { t: "“…trileaflet aortic valve,\n " },
            { t: "severe aortic regurgitation", k: "AORTIC" },
            { t: ",\n " },
            { t: "moderate mitral stenosis", k: "MITRAL" },
            { t: "…”\n\n→ " },
            { t: "2 valvular diagnoses", k: "DEPLOY" },
        ],
    },
];

const LEAD_MS = 480;
const REVEAL_MS = 300;
const HOLD_MS = 1900;
const FADE_MS = 340;

function escapeHTML(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ---------- Reusable terminal player ------------------------------------- */
function makeTerminalPlayer(card, samples) {
    const bodyEl = card.querySelector("[data-term-body]");
    const countEl = card.querySelector("[data-term-count]");
    const fnEl = card.querySelector("[data-term-fn]");
    const outEl = card.querySelector("[data-term-out]");
    const tokenCount = (s) => s.parts.filter((p) => p.k).length;

    let timers = [];
    let running = false;
    let idx = 0;

    function clearTimers() { timers.forEach(clearTimeout); timers = []; }
    function later(fn, ms) { timers.push(setTimeout(() => { if (running) fn(); }, ms)); }

    function render(sample) {
        bodyEl.innerHTML = sample.parts.map((p) =>
            p.k
                ? `<span class="tok" data-k="${p.k}">${escapeHTML(p.t)}<span class="sup">${p.k}</span></span>`
                : `<span>${escapeHTML(p.t)}</span>`
        ).join("");
        if (fnEl) fnEl.textContent = sample.fn;
        if (outEl) outEl.textContent = sample.out;
    }

    function playSample() {
        const sample = samples[idx];
        render(sample);
        const total = tokenCount(sample);
        const toks = bodyEl.querySelectorAll(".tok");
        if (countEl) countEl.textContent = `0/${total} entities`;

        let i = 0;
        function revealNext() {
            if (i < total) {
                toks[i].classList.add("revealed");
                i += 1;
                if (countEl) countEl.textContent = `${i}/${total} entities`;
                later(revealNext, REVEAL_MS);
            } else if (samples.length > 1) {
                later(advance, HOLD_MS);
            } else {
                later(replay, HOLD_MS);
            }
        }
        later(revealNext, LEAD_MS);
    }

    function advance() {
        card.classList.add("switching");
        later(() => {
            idx = (idx + 1) % samples.length;
            playSample();
            requestAnimationFrame(() => card.classList.remove("switching"));
        }, FADE_MS);
    }
    function replay() {
        card.classList.add("switching");
        later(() => {
            playSample();
            requestAnimationFrame(() => card.classList.remove("switching"));
        }, FADE_MS);
    }

    return {
        start() {
            if (running) return;
            running = true;
            idx = 0;
            if (prefersReduced) {
                const sample = samples[0];
                render(sample);
                const total = tokenCount(sample);
                bodyEl.querySelectorAll(".tok").forEach((t) => t.classList.add("revealed"));
                if (countEl) countEl.textContent = `${total}/${total} entities`;
                running = false;
                return;
            }
            playSample();
        },
        stop() {
            running = false;
            clearTimers();
            card.classList.remove("switching");
        },
    };
}

/* ---------- Tabbed Live Demos -------------------------------------------- */
function initDemos() {
    const tabs = Array.from(document.querySelectorAll("[data-tab]"));
    const panels = Array.from(document.querySelectorAll("[data-panel]"));
    if (!tabs.length) return;

    const players = {};
    const valveCard = document.querySelector('[data-term="valve"]');
    const riskCard = document.querySelector('[data-term="risk"]');
    if (valveCard) players.valve = makeTerminalPlayer(valveCard, VALVE_SAMPLES);
    if (riskCard) players.risk = makeTerminalPlayer(riskCard, RISK_SAMPLES);

    let current = null;
    function activate(name) {
        tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === name)));
        panels.forEach((p) => p.classList.toggle("active", p.dataset.panel === name));
        if (current && players[current]) players[current].stop();
        if (players[name]) players[name].start();
        current = name;
    }

    tabs.forEach((t) => t.addEventListener("click", () => activate(t.dataset.tab)));
    activate(tabs[0].dataset.tab);
}

initDemos();
