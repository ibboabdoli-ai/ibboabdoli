/* Behaviour only. SVG lives in HTML; animation styles live in visuals.css. */
'use strict';
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const sv = root.lang === 'sv';
  const text = (swedish, english) => sv ? swedish : english;
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
  const nav = document.querySelector('.nav');
  const menu = document.querySelector('.menu');
  const mobile = window.matchMedia('(max-width: 1040px)');
  const setMenu = (open, restoreFocus = false) => {
    if (!nav || !menu) return;
    const expanded = mobile.matches && open;
    nav.hidden = mobile.matches && !expanded;
    nav.classList.toggle('open', expanded);
    menu.setAttribute('aria-expanded', String(expanded));
    menu.setAttribute('aria-label', expanded ? text('Stäng meny', 'Close menu') : text('Öppna meny', 'Open menu'));
    menu.textContent = expanded ? text('Stäng', 'Close') : text('Meny', 'Menu');
    if (restoreFocus && mobile.matches) menu.focus();
  };
  setMenu(false);
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    setMenu(open);
    if (open) nav?.querySelector('a')?.focus();
  });
  nav?.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') setMenu(false, true);
  });
  document.addEventListener('pointerdown', event => {
    if (nav && menu && !nav.contains(event.target) && !menu.contains(event.target)) setMenu(false);
  });
  mobile.addEventListener('change', () => setMenu(false));
  const topbar = document.querySelector('.topbar');
  const sections = [...document.querySelectorAll('main > section[id]')];
  const links = [...document.querySelectorAll('.nav a[href^="#"]')];
  let scheduled = false;
  const updateScroll = () => {
    scheduled = false;
    topbar?.classList.toggle('scrolled', window.scrollY > 20);
    let current = '';
    sections.forEach(section => { if (section.getBoundingClientRect().top <= 170) current = section.id; });
    links.forEach(link => {
      const active = link.hash === '#' + current;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
  };
  updateScroll();
  window.addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); } }, { passive: true });
  document.querySelector('[data-motion-toggle]')?.addEventListener('click', event => {
    const paused = root.dataset.motion !== 'paused';
    root.dataset.motion = paused ? 'paused' : 'running';
    event.currentTarget.setAttribute('aria-pressed', String(paused));
    event.currentTarget.textContent = paused ? text('Starta animationer', 'Resume animations') : text('Pausa animationer', 'Pause animations');
  });
  document.addEventListener('visibilitychange', () => { root.classList.toggle('page-hidden', document.hidden); });
  document.querySelectorAll('[data-contact-form]').forEach(form => {
    if (!window.fetch || !window.AbortController) return; // Native POST remains available without JS.
    const status = form.querySelector('[data-form-status]');
    const button = form.querySelector('button[type="submit"]');
    const original = button.textContent;
    let pending = false;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (pending || !form.reportValidity()) return;
      if (form.elements.namedItem('_gotcha')?.value) return;
      pending = true;
      button.disabled = true;
      button.textContent = text('Skickar…', 'Sending…');
      status.textContent = text('Skickar ditt meddelande…', 'Sending your message…');
      status.dataset.state = 'pending';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, signal: controller.signal });
        if (!response.ok) throw new Error('Submission was not accepted');
        status.dataset.state = 'success';
        status.textContent = text('Tack! Ditt meddelande har skickats.', 'Thank you! Your message has been sent.');
        form.reset();
      } catch {
        status.dataset.state = 'error';
        status.textContent = text('Det gick inte att bekräfta att meddelandet kom fram. Texten finns kvar. Kontakta mig via e-post vid behov.', 'Delivery could not be confirmed. Your text has been kept. Please contact me by email as needed.');
      } finally {
        clearTimeout(timeout);
        pending = false;
        button.disabled = false;
        button.textContent = original;
        status.focus();
      }
    });
  });
})();
