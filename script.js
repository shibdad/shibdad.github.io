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
        const subject = encodeURIComponent(`Portfolio contact from ${name}`);
        const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
        window.location.href = `mailto:brown.treyk@gmail.com?subject=${subject}&body=${body}`;
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
