/* ===== Rollun Mobile — shared chrome behaviour ===== */
(function(){
  // Drawer nav
  var body = document.body;
  var burger = document.getElementById('burger');
  var scrim = document.getElementById('scrim');
  var close = document.getElementById('drawerClose');
  function open(){ body.classList.add('menu-open'); if(burger) burger.setAttribute('aria-expanded','true'); body.style.overflow='hidden'; }
  function shut(){ body.classList.remove('menu-open'); if(burger) burger.setAttribute('aria-expanded','false'); body.style.overflow=''; }
  if (burger) burger.addEventListener('click', open);
  if (close) close.addEventListener('click', shut);
  if (scrim) scrim.addEventListener('click', shut);
  document.querySelectorAll('.drawer nav a').forEach(function(a){ a.addEventListener('click', shut); });

  // Header shrink on scroll
  var hdr = document.getElementById('hdr');
  if (hdr) window.addEventListener('scroll', function(){ hdr.classList.toggle('scrolled', window.scrollY > 20); }, { passive: true });

  // Footer accordions
  document.querySelectorAll('.facc-head').forEach(function(h){
    h.addEventListener('click', function(){ h.parentElement.classList.toggle('open'); });
  });

  // Reveal on scroll
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.phone > section, .reveal').forEach(function(s, i){
    if (s.tagName === 'SECTION' && i === 0) return;
    s.classList.add('reveal'); io.observe(s);
  });
})();
