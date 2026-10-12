// Click tracking for Google Analytics (GA4). Events show under Reports > Engagement > Events.
(function () {
  function track(name, a) {
    if (typeof gtag !== 'function') return;
    gtag('event', name, {
      link_url: a.href,
      link_text: (a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 100),
      page_location: location.href
    });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var h = a.getAttribute('href') || '';
    if (/\.pdf($|\?)/i.test(h)) track('resume_download', a);
    else if (/loom\.com/i.test(h)) track('loom_video_click', a);
    else if (/linkedin\.com/i.test(h)) track('linkedin_click', a);
    else if (/amplify\.html/i.test(h) && !/amplify\.html/i.test(location.pathname)) track('case_study_click', a);
    else if (/^mailto:/i.test(h)) track('email_click', a);
  }, true);
})();
