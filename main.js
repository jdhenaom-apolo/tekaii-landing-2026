(function () {
  'use strict';
  function emit(eventName, params) {
    if (typeof params !== 'object') params = {};
    try {
      if (typeof gtag === 'function') gtag('event', eventName, params);
      if (typeof window.dataLayer !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ e: eventName, ...params });
      }
    } catch (e) {}
  }
  var ctaElements = document.querySelectorAll('.btn-cta, #cta-hero, #cta-submit');
  if (typeof IntersectionObserver !== 'undefined') {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          emit('view_cta', { cta_placement: entry.target.getAttribute('data-cta') || 'cta' });
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '50px', threshold: 0.2 });
    ctaElements.forEach(function (el) { if (el) obs.observe(el); });
  }
  ctaElements.forEach(function (el) {
    if (!el) return;
    el.addEventListener('click', function () {
      emit('click_cta', { cta_placement: el.getAttribute('data-cta') || (el.id === 'cta-submit' ? 'form' : 'cta') });
    });
  });
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = Object.fromEntries(new FormData(form));
      emit('submit_form', { status: 'success', form_data: data });
      form.reset();
      if (typeof alert === 'function') alert('Gracias. Te contactaremos en menos de 24h.');
    });
  }
})();