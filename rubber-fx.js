// Rubber card: a 3D tyre rolls one full lap around the card,
// telling the recycling process step by step.
(function () {
  var card = document.querySelector('.segment-card[data-fx="rubber"]');
  if (!card) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var STAGES = [
    { title: 'Sourcing', text: 'End-of-life tyres from cars, trucks, tractors and aircraft' },
    { title: 'Preparation', text: 'Supplied as baled, 3-cut or shredded tyres' },
    { title: 'Granulation', text: 'Rubber crumbs, granules and buffing powder' },
    { title: 'Trusted recyclers', text: 'Supplied to audited recycling partners' }
  ];
  var DONE = { title: 'Waste to value', text: 'Tyres turned into useful, eco-safe output' };

  var SIZE = 46;          // tyre size in pixels
  var R = SIZE / 2;
  var LAP_MS = 12000;     // time for one full lap (12 seconds)
  // ---- Build the tyre picture ----
  function tyreSVG() {
    var tread = '';
    for (var i = 0; i < 28; i++) {
      tread += '<rect x="47" y="1" width="6" height="8" rx="1.2" fill="#2b2f33" transform="rotate(' + (i * 360 / 28) + ' 50 50)"/>';
    }
    var spokes = '';
    for (var k = 0; k < 5; k++) {
      spokes += '<rect x="47.5" y="29" width="5" height="13" rx="2.5" fill="#aab3ba" transform="rotate(' + (k * 72) + ' 50 50)"/>';
    }
    var lugs = '';
    for (var j = 0; j < 5; j++) {
      var a = (j * 72 - 90) * Math.PI / 180;
      lugs += '<circle cx="' + (50 + 5.5 * Math.cos(a)).toFixed(2) + '" cy="' + (50 + 5.5 * Math.sin(a)).toFixed(2) + '" r="1.4" fill="#4a5258"/>';
    }
    return '<svg viewBox="0 0 100 100" aria-hidden="true">' +
      '<defs>' +
        '<radialGradient id="rfxSide"><stop offset="60%" stop-color="#121416"/><stop offset="82%" stop-color="#363b40"/><stop offset="100%" stop-color="#16191b"/></radialGradient>' +
        '<radialGradient id="rfxRim" cx="40%" cy="35%" r="70%"><stop offset="0%" stop-color="#f4f6f8"/><stop offset="55%" stop-color="#aab3ba"/><stop offset="100%" stop-color="#5d666d"/></radialGradient>' +
      '</defs>' +
      '<circle cx="50" cy="50" r="49" fill="#0b0c0d"/>' + tread +
      '<circle cx="50" cy="50" r="41" fill="url(#rfxSide)"/>' +
      '<circle cx="50" cy="50" r="35" fill="none" stroke="#3a4045" stroke-width="1"/>' +
      '<circle cx="50" cy="50" r="24" fill="url(#rfxRim)"/>' +
      '<circle cx="50" cy="50" r="21" fill="#1a1e22"/>' + spokes +
      '<circle cx="50" cy="50" r="9" fill="url(#rfxRim)"/>' + lugs +
      '<circle cx="50" cy="50" r="2.5" fill="#2a2f33"/>' +
      '</svg>';
  }

  // ---- Add the layers to the card ----
  var layer = document.createElement('div');
  layer.className = 'rfx-layer';
  layer.innerHTML =
    '<svg class="rfx-track"><rect pathLength="1000" rx="10" ry="10"></rect></svg>' +
    '<div class="rfx-tyre"><div class="rfx-wheel">' + tyreSVG() + '</div></div>';
  card.appendChild(layer);

  var chip = document.createElement('div');
  chip.className = 'rfx-chip';
  chip.innerHTML = '<span class="rfx-step"></span><strong></strong><small></small>';
  card.querySelector('.segment-image').appendChild(chip);

  var rect = layer.querySelector('rect');
  var tyre = layer.querySelector('.rfx-tyre');
  var wheel = layer.querySelector('.rfx-wheel');
  var stepEl = chip.querySelector('.rfx-step');
  var titleEl = chip.querySelector('strong');
  var textEl = chip.querySelector('small');

  var running = false, hovering = false;
  var start = 0, w = 0, h = 0, P = 0, lastSide = -1, lastCrumb = 0;

  function setStage(i) {
    var s = i < 4 ? STAGES[i] : DONE;
    stepEl.textContent = i < 4 ? (i + 1) : '✓';
    titleEl.textContent = s.title;
    textEl.textContent = s.text;
  }

  function swapStage(i) {
    chip.classList.add('is-swap');
    setTimeout(function () {
      setStage(i);
      chip.classList.remove('is-swap');
    }, 180);
  }

  function measure() {
    w = layer.offsetWidth;
    h = layer.offsetHeight;
    P = 2 * (w + h);
    rect.setAttribute('width', w);
    rect.setAttribute('height', h);
  }

  // Where is the tyre after travelling distance d around the card?
  function locate(d) {
    if (d < w) return { x: d, y: 0, side: 0 };
    d -= w;
    if (d < h) return { x: w, y: d, side: 1 };
    d -= h;
    if (d < w) return { x: w - d, y: h, side: 2 };
    d -= w;
    return { x: 0, y: h - Math.min(d, h), side: 3 };
  }

  // Small rubber crumbs falling off during granulation
  function crumb(x, y) {
    var c = document.createElement('span');
    c.className = 'rfx-crumb';
    c.style.left = (x + R * 0.6) + 'px';
    c.style.top = (y + R * 0.4) + 'px';
    c.style.setProperty('--dx', (10 + Math.random() * 30) + 'px');
    c.style.setProperty('--dy', (6 + Math.random() * 26) + 'px');
    layer.appendChild(c);
    setTimeout(function () { c.remove(); }, 900);
  }

  function frame(now) {
    var t = Math.min((now - start) / LAP_MS, 1);
    var eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    var d = eased * P;
    var p = locate(d);

    tyre.style.transform = 'translate(' + (p.x - R) + 'px,' + (p.y - R) + 'px)';
    wheel.style.transform = 'rotate(' + (d / R * 180 / Math.PI) + 'deg)';
    rect.style.strokeDashoffset = 1000 * (1 - eased);

    if (p.side !== lastSide) {
      lastSide = p.side;
      swapStage(p.side);
    }
    if (p.side === 2 && now - lastCrumb > 45) {
      lastCrumb = now;
      crumb(p.x, p.y);
    }

    if (t < 1) requestAnimationFrame(frame);
    else finish();
  }

  function begin() {
    if (running) return;
    running = true;
    measure();
    lastSide = -1;
    rect.style.strokeDashoffset = 1000;
    layer.classList.add('is-on');
    tyre.classList.add('is-on');
    chip.classList.add('is-on');
    start = performance.now();
    requestAnimationFrame(frame);
  }

  function finish() {
    swapStage(4);
    tyre.classList.remove('is-on');
    setTimeout(function () {
      running = false;
      if (!hovering) reset();
    }, 1600);
  }

  function reset() {
    layer.classList.remove('is-on');
    chip.classList.remove('is-on');
  }

  card.addEventListener('mouseenter', function () {
    hovering = true;
    begin();
  });
  card.addEventListener('mouseleave', function () {
    hovering = false;
    if (!running) reset();
  });
})();