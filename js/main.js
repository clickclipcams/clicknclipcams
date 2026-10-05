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

const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
  const bookingError = document.getElementById('booking-error');
  const bookingFields = [
    { element: document.getElementById('booking-name'), label: 'Nama' },
    { element: document.getElementById('booking-phone'), label: 'Nomor WhatsApp' },
    { element: document.getElementById('booking-camera'), label: 'Kamera yang diminati' },
    { element: document.getElementById('booking-needs'), label: 'Kebutuhan pemotretan' }
  ];

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const missingFields = bookingFields.filter(({ element }) => !element.value.trim());
    if (missingFields.length) {
      bookingError.textContent = `Mohon isi semua field wajib: ${missingFields.map(({ label }) => label).join(', ')}.`;
      bookingError.hidden = false;
      missingFields[0].element.focus();
      return;
    }

    bookingError.hidden = true;

    const [name, phone, camera, needs] = bookingFields.map(({ element }) => element.value.trim());
    const message = `Halo clicknclipcams 👋

Saya ingin melakukan booking kamera.

Nama: ${name}
No. WhatsApp: ${phone}
Kamera yang diminati: ${camera}
Kebutuhan pemotretan: ${needs}

Mohon informasi mengenai ketersediaan kamera dan proses bookingnya.

Terima kasih.`;
    const whatsappUrl = `https://wa.me/message/5H4XGYNTRZLXB1?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
  });
}
