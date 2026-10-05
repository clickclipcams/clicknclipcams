const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navRight = document.querySelector('.nav-right');
const langSwitcher = document.querySelector('.lang-switcher');
const bookingPill = document.querySelector('.booking-pill');
const mobileNav = window.matchMedia('(max-width: 900px)');

function syncMenuLabel(isOpen = navToggle?.getAttribute('aria-expanded') === 'true') {
  if (navToggle) {
    navToggle.setAttribute(
      'aria-label',
      window.getTranslation(isOpen ? 'menuClose' : 'menuOpen')
    );
  }
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
      syncMenuLabel(false);
    }
  });

  window.addEventListener('langChanged', () => {
    syncMenuLabel();
  });
}

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
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
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const yearNode = document.getElementById('year');

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}


/* =========================================================
   BOOKING VIA WHATSAPP
   ========================================================= */

const bookingForm = document.getElementById('booking-form');

if (bookingForm) {
  const bookingError = document.getElementById('booking-error');

  const bookingFields = [
    {
      element: document.getElementById('booking-name'),
      label: 'Nama'
    },
    {
      element: document.getElementById('booking-phone'),
      label: 'Nomor WhatsApp'
    },
    {
      element: document.getElementById('booking-camera'),
      label: 'Kamera yang diminati'
    },
    {
      element: document.getElementById('booking-needs'),
      label: 'Kebutuhan pemotretan'
    }
  ];

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();

    /* Cek apakah semua field sudah diisi */
    const missingFields = bookingFields.filter(
      ({ element }) => !element || !element.value.trim()
    );

    if (missingFields.length > 0) {
      bookingError.textContent =
        `Mohon isi semua field wajib: ${missingFields
          .map(({ label }) => label)
          .join(', ')}.`;

      bookingError.hidden = false;

      const firstMissingField = missingFields[0].element;

      if (firstMissingField) {
        firstMissingField.focus();
      }

      return;
    }

    /* Hilangkan pesan error */
    bookingError.hidden = true;

    /* Ambil data dari form */
    const name = document.getElementById('booking-name').value.trim();
    const phone = document.getElementById('booking-phone').value.trim();
    const camera = document.getElementById('booking-camera').value.trim();
    const needs = document.getElementById('booking-needs').value.trim();

    /* Pesan otomatis WhatsApp */
    const message = `Halo clicknclipcams 👋

Saya ingin melakukan booking kamera.

Nama: ${name}
No. WhatsApp: ${phone}
Kamera yang diminati: ${camera}
Kebutuhan pemotretan: ${needs}

Mohon informasi mengenai ketersediaan kamera dan proses bookingnya.

Terima kasih.`;

    /*
     * Nomor WhatsApp clicknclipcams:
     * 0857-8004-3435
     * Format internasional:
     * 6285780043435
     */
    const whatsappUrl =
      `https://wa.me/6285780043435?text=${encodeURIComponent(message)}`;

    /* Buka WhatsApp dengan pesan otomatis */
    window.open(whatsappUrl, '_blank');
  });
}