/* =========================================================================
   Trey Brown — portfolio
   Click-to-activate pill nav (scrolls away with the page) · scroll reveals
   ========================================================================= */

/* ---------- Pill nav: active state set on click, not on scroll ----------- */
function initSectionNav() {
    const icons = Array.from(document.querySelectorAll('.nav-icon[data-section]'));
    if (!icons.length) return;
    icons.forEach((icon) => {
        icon.addEventListener('click', () => {
            icons.forEach((i) => i.classList.toggle('active', i === icon));
        });
    });
}
initSectionNav();

/* ---------- Contact form: builds a mailto: link, no backend needed ------- */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('cf-name').value.trim();
        const email = document.getElementById('cf-email').value.trim();
        const message = document.getElementById('cf-message').value.trim();
        const topic = document.getElementById('cf-topic').value.trim();
        const subject = encodeURIComponent(topic ? `${topic} — ${name}` : `Portfolio contact from ${name}`);
        const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
        window.location.href = `mailto:brown.treyk@gmail.com?subject=${subject}&body=${body}`;
    });
}

/* ---------- Scroll reveals ------------------------------------------------
   Elements settle downward into place (see .fade-in in style.css). Each one
   gets a stagger delay from its index within its own section, so a section
   cascades top-to-bottom instead of every element firing at once.
   -------------------------------------------------------------------------- */
const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fades = Array.from(document.querySelectorAll('.fade-in'));

if (prefersReduced) {
    fades.forEach(el => el.classList.add('visible'));
} else {
    const STEP = 0.07;   // seconds between siblings
    const MAX = 0.35;    // cap, so long sections don't crawl

    // index each element within its section, then stagger by that index
    const counters = new Map();
    fades.forEach((el) => {
        const scope = el.closest('section') || el.parentElement;
        const i = counters.get(scope) || 0;
        counters.set(scope, i + 1);
        el.style.transitionDelay = Math.min(i * STEP, MAX) + 's';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });

    fades.forEach(el => observer.observe(el));
}
