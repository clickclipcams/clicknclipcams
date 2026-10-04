const filterButtons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.result-card');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
const closeBtn = document.querySelector('.lightbox-close');
const prevBtn = document.querySelector('.lightbox-prev');
const nextBtn = document.querySelector('.lightbox-next');

let activeCards = Array.from(cards);
let currentIndex = 0;

if (filterButtons.length && cards.length) {
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((item) => item.classList.toggle('active', item === button));

      const filter = button.dataset.filter;
      activeCards = [];

      cards.forEach((card) => {
        const category = card.dataset.category;
        const shouldShow = filter === 'all' || category === filter;
        card.classList.toggle('hidden', !shouldShow);
        if (shouldShow) activeCards.push(card);
      });

      activeCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.08}s`;
      });

      currentIndex = 0;
    });
  });
}

function updateLightbox(index) {
  if (!lightbox || !lightboxImg || !activeCards.length) return;

  currentIndex = (index + activeCards.length) % activeCards.length;
  const card = activeCards[currentIndex];
  lightboxImg.style.opacity = '0';
  lightboxImg.style.transform = 'scale(0.96)';

  setTimeout(() => {
    lightboxImg.src = card.dataset.full || card.querySelector('img').src;
    lightboxImg.alt = card.querySelector('img').alt || 'Expanded gallery image';
    lightboxImg.style.opacity = '1';
    lightboxImg.style.transform = 'scale(1)';
  }, 120);
}

cards.forEach((card) => {
  card.addEventListener('click', () => {
    activeCards = Array.from(cards).filter((item) => !item.classList.contains('hidden'));
    currentIndex = activeCards.indexOf(card);
    if (currentIndex < 0) return;
    if (lightbox && lightboxImg) {
      updateLightbox(currentIndex);
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    }
  });
});

if (closeBtn && lightbox) {
  closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  });
}

if (prevBtn && lightbox) {
  prevBtn.addEventListener('click', () => {
    updateLightbox(currentIndex - 1);
  });
}

if (nextBtn && lightbox) {
  nextBtn.addEventListener('click', () => {
    updateLightbox(currentIndex + 1);
  });
}

if (lightbox) {
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
    }
  });

  window.addEventListener('langChanged', () => {
    if (lightbox.classList.contains('open') && activeCards[currentIndex]) {
      lightboxImg.alt = activeCards[currentIndex].querySelector('img').alt;
    }
  });
}
