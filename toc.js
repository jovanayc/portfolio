// Case study outline: builds a quiet left-side section list from every <h2 data-toc="...">,
// highlights the section being read, and scrolls to a section on click.
(function () {
  var heads = Array.prototype.slice.call(document.querySelectorAll('h2[data-toc]'));
  if (!heads.length) return;

  var nav = document.createElement('nav');
  nav.className = 'cs-toc';
  nav.setAttribute('aria-label', 'Case study sections');
  var label = document.createElement('div');
  label.className = 'cs-toc-label';
  label.textContent = 'On this page';
  nav.appendChild(label);

  var links = heads.map(function (h, i) {
    if (!h.id) h.id = 'section-' + (i + 1);
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.innerHTML = '<span class="cs-toc-num">' + (i + 1) + '</span><span>' + h.getAttribute('data-toc') + '</span>';
    nav.appendChild(a);
    return a;
  });
  document.body.appendChild(nav);

  var article = heads[0].closest('article') || document.body;
  var current = -1;
  function update() {
    var y = window.innerHeight * 0.3;
    var idx = -1;
    for (var i = 0; i < heads.length; i++) {
      if (heads[i].getBoundingClientRect().top <= y) idx = i;
    }
    var r = article.getBoundingClientRect();
    var show = heads[0].getBoundingClientRect().top < window.innerHeight * 0.9 && r.bottom > nav.getBoundingClientRect().bottom + 40;
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
