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
  if (navToggle && typeof window.getTranslation === 'function') {
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

  const bookingError =
    document.getElementById('booking-error');

  const nameInput =
    document.getElementById('booking-name');

  const phoneInput =
    document.getElementById('booking-phone');

  const cameraInput =
    document.getElementById('booking-camera');

  const needsInput =
    document.getElementById('booking-needs');


  /* =======================================================
     SUBMIT FORM
     ======================================================= */

  bookingForm.addEventListener('submit', (event) => {

    event.preventDefault();


    /* -----------------------------------------------------
       VALIDASI ELEMENT
       ----------------------------------------------------- */

    if (
      !nameInput ||
      !phoneInput ||
      !cameraInput ||
      !needsInput
    ) {

      console.error(
        'Booking form tidak lengkap.'
      );

      return;
    }


    /* -----------------------------------------------------
       AMBIL DATA
       ----------------------------------------------------- */

    const name =
      nameInput.value.trim();

    const phone =
      phoneInput.value.trim();

    const camera =
      cameraInput.value.trim();

    const needs =
      needsInput.value.trim();


    /* -----------------------------------------------------
       CEK DATA KOSONG
       ----------------------------------------------------- */

    const missingFields = [];

    if (!name) {
      missingFields.push('Nama');
    }

    if (!phone) {
      missingFields.push('Nomor WhatsApp');
    }

    if (!camera) {
      missingFields.push('Kamera yang diminati');
    }

    if (!needs) {
      missingFields.push('Kebutuhan pemotretan');
    }


    if (missingFields.length > 0) {

      if (bookingError) {

        bookingError.textContent =
          `Mohon isi semua field wajib: ${missingFields.join(', ')}.`;

        bookingError.hidden = false;
      }

      return;
    }


    /* -----------------------------------------------------
       HILANGKAN ERROR
       ----------------------------------------------------- */

    if (bookingError) {
      bookingError.hidden = true;
    }


    /* =====================================================
       PESAN WHATSAPP
       ===================================================== */

    const message =
`Halo clicknclipcams,

Saya ingin melakukan booking kamera.

Nama: ${name}
No. WhatsApp: ${phone}
Kamera yang diminati: ${camera}
Kebutuhan pemotretan: ${needs}

Mohon informasi mengenai ketersediaan kamera dan proses bookingnya.

Terima kasih.`;


    /* =====================================================
       NOMOR WHATSAPP CLICK N CLIP CAMS
       ===================================================== */

    const whatsappNumber =
      '6285780043435';


    /* =====================================================
       ENCODE PESAN
       ===================================================== */

    const encodedMessage =
      encodeURIComponent(message);


    /* =====================================================
       BUAT URL WHATSAPP
       ===================================================== */

    const whatsappUrl =
      `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;


    /* =====================================================
       DEBUG
       ===================================================== */

    console.log(
      'Nama:',
      name
    );

    console.log(
      'Nomor:',
      phone
    );

    console.log(
      'Kamera:',
      camera
    );

    console.log(
      'Kebutuhan:',
      needs
    );

    console.log(
      'Pesan WhatsApp:',
      message
    );

    console.log(
      'WhatsApp URL:',
      whatsappUrl
    );


    /* =====================================================
       BUKA WHATSAPP
       ===================================================== */

    window.location.href =
      whatsappUrl;

  });

}