// Case study outline: builds a quiet left-side section list from every <h2 data-toc="...">
// (plus optional sub-items marked data-toc-sub="..."), highlights the part being read,
// and scrolls to it on click.
(function () {
  var targets = Array.prototype.slice.call(document.querySelectorAll('[data-toc-plain], h2[data-toc], [data-toc-sub]'));
  if (!targets.length) return;

  var nav = document.createElement('nav');
  nav.className = 'cs-toc';
  nav.setAttribute('aria-label', 'Case study sections');
  var label = document.createElement('div');
  label.className = 'cs-toc-label';
  label.textContent = 'On this page';
  nav.appendChild(label);

  var n = 0;
  var links = targets.map(function (el, i) {
    if (!el.id) el.id = 'section-' + (i + 1);
    var sub = el.hasAttribute('data-toc-sub');
    var a = document.createElement('a');
    a.href = '#' + el.id;
    if (el.hasAttribute('data-toc-plain')) {
      a.innerHTML = '<span class="cs-toc-num"></span><span>' + el.getAttribute('data-toc-plain') + '</span>';
    } else if (sub) {
      a.className = 'cs-toc-sub';
      a.innerHTML = '<span class="cs-toc-mark" aria-hidden="true">↳</span><span>' + el.getAttribute('data-toc-sub') + '</span>';
    } else {
      n += 1;
      a.innerHTML = '<span class="cs-toc-num">' + n + '</span><span>' + el.getAttribute('data-toc') + '</span>';
    }
    nav.appendChild(a);
    return a;
  });
  document.body.appendChild(nav);

  var first = targets[0];
  var article = first.closest('article') || document.body;
  var current = -1;
  function update() {
    var y = window.innerHeight * 0.3;
    var idx = -1;
    for (var i = 0; i < targets.length; i++) {
      if (targets[i].getBoundingClientRect().top <= y) idx = i;
    }
    var r = article.getBoundingClientRect();
    var show = first.getBoundingClientRect().top < window.innerHeight * 0.9 && r.bottom > nav.getBoundingClientRect().bottom + 40;
    nav.classList.toggle('is-visible', show);
    if (idx === current) return;
    current = idx;
    links.forEach(function (a, i) {
      a.classList.toggle('is-active', i === idx);
      if (i === idx) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
