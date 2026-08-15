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
})();
