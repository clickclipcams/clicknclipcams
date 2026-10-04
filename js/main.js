const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navRight = document.querySelector('.nav-right');
const langSwitcher = document.querySelector('.lang-switcher');
const bookingPill = document.querySelector('.booking-pill');
const mobileNav = window.matchMedia('(max-width: 900px)');

function syncMenuLabel(isOpen = navToggle?.getAttribute('aria-expanded') === 'true') {
  if (navToggle) navToggle.setAttribute('aria-label', window.getTranslation(isOpen ? 'menuClose' : 'menuOpen'));
}

function placeNavControls() {
  if (!navLinks || !navRight || !navToggle || !langSwitcher || !bookingPill) return;

  if (mobileNav.matches) {
    navLinks.append(langSwitcher, bookingPill);
    return;
  }

  navRight.insertBefore(langSwitcher, navToggle);
  navRight.insertBefore(bookingPill, navToggle);
}

if (navToggle && navLinks) {
  placeNavControls();
  syncMenuLabel();
  mobileNav.addEventListener('change', placeNavControls);

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    syncMenuLabel(isOpen);
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  window.addEventListener('langChanged', () => syncMenuLabel());
}

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const yearNode = document.getElementById('year');
if (yearNode) yearNode.textContent = new Date().getFullYear();
