// Extend the official HugoBlox widget without replacing its template.
// FormSubmit requires an absolute return URL; use the current deployment origin.
for (const form of document.querySelectorAll('form[action]')) {
  const endpoint = new URL(form.action, window.location.href);
  if (endpoint.origin !== 'https://formsubmit.co') continue;

  let next = form.querySelector('input[name="_next"]');
  if (!next) {
    next = document.createElement('input');
    next.type = 'hidden';
    next.name = '_next';
    form.append(next);
  }
  const destination = document.documentElement.lang.toLowerCase().startsWith('en')
    ? '/en/thank-you/'
    : '/gracias/';
  next.value = new URL(destination, window.location.origin).href;
}
