(function () {
  'use strict';

  var ctaInner = document.getElementById('cta-inner');
  var goalZoom = document.getElementById('goal-zoom');
  var overlay = document.getElementById('dive-overlay');
  var ctaDesktop = document.getElementById('cta-desktop');
  var ctaMobile = document.getElementById('cta-mobile');

  var diving = false;

  function handleCtaClick(e) {
    e.preventDefault();
    if (diving) return;

    var url = e.currentTarget.href;
    diving = true;

    // Effet "plongeon" : le CTA grossit et disparaît, l'écran blanchit
    ctaInner.style.transform = 'scale(6.5)';
    ctaInner.style.opacity = '0';

    // Sur mobile, on zoome aussi dans la cage
    if (window.innerWidth <= 480) {
      goalZoom.style.transform = 'scale(5.5)';
    }

    overlay.style.opacity = '1';

    setTimeout(function () {
      window.open(url, '_blank', 'noopener');
      diving = false;
      ctaInner.style.transform = 'scale(1)';
      ctaInner.style.opacity = '1';
      goalZoom.style.transform = 'scale(1)';
      overlay.style.opacity = '0';
    }, 720);
  }

  if (ctaDesktop) ctaDesktop.addEventListener('click', handleCtaClick);
  if (ctaMobile) ctaMobile.addEventListener('click', handleCtaClick);

  // Hexagone de stats : scores aléatoires qui évoluent en boucle infinie
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initRadar(svg) {
    var poly = svg.querySelector('.radar-data');
    if (!poly) return;

    var cx = 80, cy = 80, R = 62, MIN = 18, n = 6;
    var angles = [];
    for (var i = 0; i < n; i++) angles.push(-Math.PI / 2 + i * (Math.PI * 2 / n));

    function randomTarget() {
      var t = [];
      for (var i = 0; i < n; i++) t.push(55 + Math.random() * 40);
      return t;
    }

    function pointsFor(values) {
      var pts = [];
      for (var i = 0; i < n; i++) {
        var r = MIN + (values[i] / 100) * (R - MIN);
        var x = cx + r * Math.cos(angles[i]);
        var y = cy + r * Math.sin(angles[i]);
        pts.push(x.toFixed(1) + ',' + y.toFixed(1));
      }
      return pts.join(' ');
    }

    function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

    var current = randomTarget();
    var target = randomTarget();

    if (reduceMotion) {
      poly.setAttribute('points', pointsFor(current));
      return;
    }

    var DURATION = 2600;
    var start = null;

    function frame(ts) {
      if (!start) start = ts;
      var t = Math.min((ts - start) / DURATION, 1);
      var et = ease(t);
      var vals = [];
      for (var i = 0; i < n; i++) vals.push(current[i] + (target[i] - current[i]) * et);
      poly.setAttribute('points', pointsFor(vals));

      if (t >= 1) {
        current = target;
        target = randomTarget();
        start = ts;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var radars = document.querySelectorAll('.radar-svg');
  for (var r = 0; r < radars.length; r++) initRadar(radars[r]);
})();
