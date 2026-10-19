// Scroll reveal: sections rise and fade in as they enter the screen.
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var page = document.querySelector('.page');
  if (!page) return;
  var sections = [].slice.call(page.querySelectorAll(':scope > section, :scope > footer')).slice(1); // skip hero
  var targets = [];
  function isGridOfCards(el) {
    var cs = getComputedStyle(el);
    return (cs.display === 'grid' || cs.display === 'flex') && el.children.length >= 3 &&
      [].every.call(el.children, function (c) { return /^(FIGURE|A|DIV|ARTICLE)$/.test(c.tagName); });
  }
  sections.forEach(function (sec) {
    [].forEach.call(sec.children, function (el) {
      if (el.tagName === 'STYLE' || el.tagName === 'SCRIPT') return;
      var tall = el.getBoundingClientRect().height > window.innerHeight * 1.1;
      var inner = el.querySelector(':scope > div');
      if (isGridOfCards(el)) {
        [].forEach.call(el.children, function (c, i) { targets.push([c, i * 0.12]); });
      } else if (tall && el.children.length > 1) {
        [].forEach.call(el.children, function (c) { targets.push([c, 0]); });
      } else if (inner && isGridOfCards(inner) && el.children.length === 1) {
        [].forEach.call(inner.children, function (c, i) { targets.push([c, i * 0.12]); });
      } else {
        targets.push([el, 0]);
      }
    });
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var el = e.target, d = parseFloat(el.style.getPropertyValue('--rd')) || 0;
        el.classList.add('is-in'); io.unobserve(el);
        // hand the element back to its own hover effects once it has landed
        setTimeout(function () { el.classList.remove('jc-reveal', 'is-in'); el.style.removeProperty('--rd'); }, (d + 1.1) * 1000);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  targets.forEach(function (t) {
    var el = t[0];
    el.classList.add('jc-reveal');
    if (t[1]) el.style.setProperty('--rd', t[1] + 's');
    io.observe(el);
  });
})();

// About me timeline: gold line fills as you scroll and lights each point it reaches.
(function () {
  var tl = document.querySelector('.jc-timeline');
  if (!tl) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var fill = tl.querySelector('.jc-tl-fill');
  var rows = [].slice.call(tl.querySelectorAll('.jc-tl-row'));
  document.documentElement.classList.add('jc-tl-js');
  var ticking = false;
  function update() {
    ticking = false;
    var r = tl.getBoundingClientRect();
    var total = r.height - 24;
    var reach = window.innerHeight * 0.62 - (r.top + 24);
    var h = Math.max(0, Math.min(total, reach));
    if (fill) fill.style.height = h + 'px';
    rows.forEach(function (row) {
      var y = row.getBoundingClientRect().top - r.top - 24 + 24;
      row.classList.toggle('is-on', h >= y);
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
