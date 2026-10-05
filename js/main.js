const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navRight = document.querySelector('.nav-right');
const langSwitcher = document.querySelector('.lang-switcher');
const bookingPill = document.querySelector('.booking-pill');
const mobileNav = window.matchMedia('(max-width: 900px)');


/* =========================================================
   NAVIGATION
   ========================================================= */

function syncMenuLabel(
  isOpen = navToggle?.getAttribute('aria-expanded') === 'true'
) {
  if (navToggle) {
    navToggle.setAttribute(
      'aria-label',
      window.getTranslation(isOpen ? 'menuClose' : 'menuOpen')
    );
  }
}


function placeNavControls() {
  if (
    !navLinks ||
    !navRight ||
    !navToggle ||
    !langSwitcher ||
    !bookingPill
  ) {
    return;
  }

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


/* =========================================================
   SCROLL REVEAL ANIMATION
   ========================================================= */

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
    {
      threshold: 0.15
    }
  );

  revealItems.forEach((item) => {
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => {
    item.classList.add('visible');
  });
}


/* =========================================================
   FOOTER YEAR
   ========================================================= */

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

  const nameInput = document.getElementById('booking-name');
  const phoneInput = document.getElementById('booking-phone');
  const cameraInput = document.getElementById('booking-camera');
  const needsInput = document.getElementById('booking-needs');

  const bookingFields = [
    {
      element: nameInput,
      label: 'Nama'
    },
    {
      element: phoneInput,
      label: 'Nomor WhatsApp'
    },
    {
      element: cameraInput,
      label: 'Kamera yang diminati'
    },
    {
      element: needsInput,
      label: 'Kebutuhan pemotretan'
    }
  ];


  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();


    /* -----------------------------------------------------
       CEK FIELD KOSONG
       ----------------------------------------------------- */

    const missingFields = bookingFields.filter(
      ({ element }) => !element || !element.value.trim()
    );


    if (missingFields.length > 0) {
      if (bookingError) {
        bookingError.textContent =
          `Mohon isi semua field wajib: ${missingFields
            .map(({ label }) => label)
            .join(', ')}.`;

        bookingError.hidden = false;
      }

      const firstMissingField = missingFields[0].element;

      if (firstMissingField) {
        firstMissingField.focus();
      }

      return;
    }


    /* -----------------------------------------------------
       HILANGKAN ERROR
       ----------------------------------------------------- */

    if (bookingError) {
      bookingError.hidden = true;
    }


    /* -----------------------------------------------------
       AMBIL DATA FORM
       ----------------------------------------------------- */

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const camera = cameraInput.value.trim();
    const needs = needsInput.value.trim();


    /* -----------------------------------------------------
       PESAN WHATSAPP OTOMATIS
       ----------------------------------------------------- */

    const message =
`Halo clicknclipcams,

Saya ingin melakukan booking kamera.

Nama: ${name}
No. WhatsApp: ${phone}
Kamera yang diminati: ${camera}
Kebutuhan pemotretan: ${needs}

Mohon informasi mengenai ketersediaan kamera dan proses bookingnya.

Terima kasih.`;


    /* -----------------------------------------------------
       NOMOR WHATSAPP CLICKNCLIPCAM
       0857-8004-3435
       Menjadi format internasional:
       6285780043435
       ----------------------------------------------------- */

    const whatsappNumber = '6285780043435';


    /* -----------------------------------------------------
       BUAT LINK WHATSAPP
       ----------------------------------------------------- */

    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


    /* -----------------------------------------------------
       BUKA WHATSAPP
       ----------------------------------------------------- */

    window.location.href = whatsappUrl;
  });
}