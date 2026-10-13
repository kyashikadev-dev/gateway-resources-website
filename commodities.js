// Commodities list: photos play slowly on the right.
// Hovering a material pauses on its photo; leaving the list continues the slideshow.
(function () {
  var section = document.querySelector('.products-section');
  if (!section) return;
  var list = section.querySelector('.products-list');
  var items = Array.prototype.slice.call(section.querySelectorAll('.product-item'));
  if (!list || !items.length) return;

  section.classList.add('cx-on');
  // Long lists (more than 10 materials) use 2 columns of cards
  if (items.length > 10) section.classList.add('cx-two');

  // Two-column layout: list on the left, photo on the right
  var layout = document.createElement('div');
  layout.className = 'cx-layout';
  list.parentNode.insertBefore(layout, list);
  layout.appendChild(list);

  var preview = document.createElement('div');
  preview.className = 'cx-preview';
  preview.innerHTML =
    '<div class="cx-img"></div>' +
    '<div class="cx-missing">Image coming soon</div>' +
    '<span class="cx-count"></span>' +
    '<div class="cx-cap"><small></small><span></span></div>' +
    '<div class="cx-bar"></div>';
  layout.appendChild(preview);

  var img = preview.querySelector('.cx-img');
  var count = preview.querySelector('.cx-count');
  var capSmall = preview.querySelector('.cx-cap small');
  var capText = preview.querySelector('.cx-cap span');
  var bar = preview.querySelector('.cx-bar');
  var total = items.length;
  var current = -1;
  var cache = {};

    var AUTO_MS = 2000;   // time each photo stays (2 seconds)   // time each photo stays (3.5 seconds)
  var timer = null;
  var hovering = false;
  var visible = true;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  // Check whether a photo exists, and remember the answer
  function load(src, done) {
    if (!src) return done(false);
    if (src in cache) return done(cache[src]);
    var im = new Image();
    im.onload = function () { cache[src] = true; done(true); };
    im.onerror = function () { cache[src] = false; done(false); };
    im.src = src;
  }

  function show(i) {
    if (i === current) return;
    current = i;
    var it = items[i];
    var src = it.getAttribute('data-img');

    preview.classList.add('is-on');
    items.forEach(function (x, n) { x.classList.toggle('is-active', n === i); });
    count.textContent = pad(i + 1) + ' / ' + pad(total);
    bar.style.width = ((i + 1) / total * 100) + '%';
    capSmall.textContent = it.getAttribute('data-category') || '';
    capText.textContent = it.getAttribute('data-label') || it.textContent.trim();

    img.classList.add('is-fading');
    load(src, function (ok) {
      if (current !== i) return;
      setTimeout(function () {
        img.style.backgroundImage = ok ? 'url("' + src + '")' : 'none';
        preview.classList.toggle('is-missing', !ok);
        img.classList.remove('is-fading');
            }, 0);
    });
  }

  // Slideshow
  function next() { show((current + 1) % total); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function play() {
    stop();
    if (reduce || hovering || !visible) return;
    timer = setInterval(next, AUTO_MS);
  }

  // Mouse on a material: show it and pause
  items.forEach(function (it, i) {
    it.addEventListener('mouseenter', function () {
      hovering = true;
      stop();
      show(i);
    });
    // Phones: tap shows it, then the slideshow continues later
    it.addEventListener('click', function () {
      show(i);
      play();
    });
  });

  // Mouse leaves the list: continue from the current photo
  list.addEventListener('mouseleave', function () {
    hovering = false;
    play();
  });

  // Only play while the section is on screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) play(); else stop();
    }, { threshold: 0.2 }).observe(preview);
  }

  show(0);
  play();

  // Load the other photos in the background so changes feel instant
  items.forEach(function (it) { load(it.getAttribute('data-img'), function () {}); });
})();