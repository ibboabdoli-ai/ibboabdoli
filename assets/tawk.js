/* tawk.to live-chat loader. Property/widget IDs supplied by the site owner. */
(() => {
  let loaded = false;
  let fallbackTimer;

  const loadTawk = () => {
    if (loaded) return;
    loaded = true;
    if (fallbackTimer) window.clearTimeout(fallbackTimer);

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement('script');
    const firstScript = document.getElementsByTagName('script')[0];
    script.async = true;
    script.src = 'https://embed.tawk.to/6895ddde56ddd81926b30080/1j24mlbt5';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    script.dataset.tawkWidget = 'true';
    firstScript.parentNode.insertBefore(script, firstScript);
  };

  const interactionOptions = { once: true, passive: true };
  window.addEventListener('pointerdown', loadTawk, interactionOptions);
  window.addEventListener('touchstart', loadTawk, interactionOptions);
  window.addEventListener('keydown', loadTawk, { once: true });

  // Idle visitors still receive the widget, but outside the initial performance window.
  window.addEventListener('load', () => {
    fallbackTimer = window.setTimeout(loadTawk, 20000);
  }, { once: true });
})();
