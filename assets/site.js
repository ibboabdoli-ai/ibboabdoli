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
    if (!window.fetch) return; // Native POST remains available without JS.
    const status = form.querySelector('[data-form-status]');
    const button = form.querySelector('button[type="submit"]');
    const original = button.textContent;
    let pending = false;

    const responseMessage = (payload, response) => {
      const errors = Array.isArray(payload?.errors)
        ? payload.errors.map(item => item?.message).filter(Boolean)
        : [];
      if (errors.length) return errors.join(' ');
      if (typeof payload?.error === 'string' && payload.error.trim()) return payload.error.trim();
      if (typeof payload?.message === 'string' && payload.message.trim()) return payload.message.trim();
      return response?.status ? `HTTP ${response.status}` : '';
    };

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (pending || !form.reportValidity()) return;
      if (form.elements.namedItem('_gotcha')?.value) return;

      pending = true;
      button.disabled = true;
      button.textContent = text('Skickar…', 'Sending…');
      status.textContent = text('Skickar ditt meddelande…', 'Sending your message…');
      status.dataset.state = 'pending';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });

        let payload = null;
        try {
          payload = await response.json();
        } catch {
          payload = null;
        }

        if (!response.ok) {
          const detail = responseMessage(payload, response);
          status.dataset.state = 'error';
          if (response.status === 429) {
            status.textContent = text(
              'För många försök på kort tid. Vänta en stund och försök igen.',
              'Too many attempts in a short time. Please wait a moment and try again.'
            );
          } else {
            status.textContent = text(
              `Formuläret kunde inte skickas${detail ? `: ${detail}` : '.'} Texten finns kvar.`,
              `The form could not be sent${detail ? `: ${detail}` : '.'} Your text has been kept.`
            );
          }
          return;
        }

        status.dataset.state = 'success';
        status.textContent = text('Tack! Ditt meddelande har skickats.', 'Thank you! Your message has been sent.');
        form.reset();
      } catch (error) {
        status.dataset.state = 'error';
        status.textContent = text(
          'Nätverkskontakten med Formspree misslyckades. Texten finns kvar. Försök igen eller skicka e-post direkt.',
          'The network connection to Formspree failed. Your text has been kept. Try again or send an email directly.'
        );
      } finally {
        pending = false;
        button.disabled = false;
        button.textContent = original;
        status.focus();
      }
    });
  });
})();
