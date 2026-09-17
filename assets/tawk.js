/* tawk.to live-chat loader. Property/widget IDs supplied by the site owner. */
(() => {
  let loaded = false;
  const loadTawk = () => {
    if (loaded) return;
    loaded = true;
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = "https://embed.tawk.to/6895ddde56ddd81926b30080/1j24mlbt5";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    s1.dataset.tawkWidget = "true";
    s0.parentNode.insertBefore(s1, s0);
  };
  window.addEventListener("load", () => window.setTimeout(loadTawk, 2500), { once: true });
})();
