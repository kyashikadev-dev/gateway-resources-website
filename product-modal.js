/* ==========================================
   Product Image Modal
   Click any commodity item to view its image.
   Looks for a real photo at data-img first;
   if it's missing, shows an animated branded
   placeholder instead (so nothing ever breaks).
========================================== */

document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('product-modal');
  if (!modal) return;

  const modalImg = document.getElementById('product-modal-img');
  const modalFallback = document.getElementById('product-modal-fallback');
  const modalFallbackIcon = document.getElementById('product-modal-fallback-icon');
  const modalTitle = document.getElementById('product-modal-title');
  const modalSubtitle = document.getElementById('product-modal-subtitle');
  const items = document.querySelectorAll('.product-item[data-img]');

  // Premium gradient palette, cycled by item name so each item
  // always gets the same look.
  const palettes = [
    'linear-gradient(135deg, #177864, #10b981)',
    'linear-gradient(135deg, #0d2f63, #184d9c)',
    'linear-gradient(135deg, #00473d, #177864)',
    'linear-gradient(135deg, #1f2937, #374151)',
    'linear-gradient(135deg, #065f46, #059669)',
    'linear-gradient(135deg, #0f172a, #1e3a8a)'
  ];

  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  }

  function initials(label) {
    const words = label.replace(/[()/]/g, ' ').trim().split(/\s+/).filter(Boolean);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  let lastFocused = null;

  function openModal(item) {
    const imgSrc = item.getAttribute('data-img');
    const label = item.getAttribute('data-label') || item.querySelector('span').textContent.trim();
    const category = item.getAttribute('data-category') || '';

    lastFocused = item;
    modalTitle.textContent = label;
    modalSubtitle.textContent = category;

    // Reset state
    modalImg.style.display = 'none';
    modalFallback.style.display = 'none';

    const testImg = new Image();
    testImg.onload = function () {
      modalImg.src = imgSrc;
      modalImg.alt = label;
      modalImg.style.display = 'block';
      // restart reveal animation
      modalImg.style.animation = 'none';
      void modalImg.offsetWidth;
      modalImg.style.animation = '';
    };
    testImg.onerror = function () {
      const idx = hashCode(label) % palettes.length;
      modalFallback.style.background = palettes[idx];
      modalFallback.style.display = 'flex';
      modalFallbackIcon.textContent = initials(label);
      modalFallbackIcon.style.animation = 'none';
      void modalFallbackIcon.offsetWidth;
      modalFallbackIcon.style.animation = '';
    };
    testImg.src = imgSrc;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.product-modal-close').focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  items.forEach(function (item) {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('click', function () { openModal(item); });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(item);
      }
    });
  });

  modal.querySelectorAll('[data-close]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
});