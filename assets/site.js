const topbar = document.querySelector('.topbar');
const nav = document.querySelector('.nav');
const menu = document.querySelector('.menu');
const year = document.querySelector('[data-year]');

if (year) year.textContent = new Date().getFullYear();

const onScroll = () => topbar && topbar.classList.toggle('scrolled', scrollY > 24);
onScroll();
addEventListener('scroll', onScroll, { passive: true });

menu?.addEventListener('click', () => {
  const open = !nav.classList.contains('open');
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
});

nav?.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
  })
);

const revealObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    }),
  { threshold: 0.13 }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const sections = [...document.querySelectorAll('section[id]')];
const navLinks = [...document.querySelectorAll('.nav a')];
addEventListener(
  'scroll',
  () => {
    let current = '';
    sections.forEach((section) => {
      if (scrollY >= section.offsetTop - 160) current = section.id;
    });
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === '#' + current));
  },
  { passive: true }
);

(() => {
  const email = 'ibbo.abdoli@gmail.com';
  const linkedin = 'https://www.linkedin.com/in/ibbo-abdoli/';
  const cal15 = 'https://cal.com/ibboabdoli/15min';
  const cal30 = 'https://cal.com/ibboabdoli/30min';

  document.querySelectorAll('.contact-list').forEach((list) => {
    list.innerHTML = `
      <a href="mailto:${email}"><span>Email:</span><strong>${email}</strong></a>
      <a href="${linkedin}" target="_blank" rel="noopener"><span>LinkedIn:</span><strong>Open profile</strong></a>
      <span><span>Location:</span><strong>Stockholm, Sweden</strong></span>
    `;

    if (!list.nextElementSibling?.classList?.contains('booking-card')) {
      list.insertAdjacentHTML(
        'afterend',
        `
        <div class="booking-card">
          <span class="booking-eyebrow">Calendar booking</span>
          <h3>Book a technical meeting</h3>
          <p>Choose a 15 minute quick call or a 30 minute automation / troubleshooting discussion.</p>
          <div class="booking-actions">
            <a class="booking-btn primary" href="${cal15}" target="_blank" rel="noopener">Book 15 min</a>
            <a class="booking-btn" href="${cal30}" target="_blank" rel="noopener">Book 30 min</a>
          </div>
        </div>
      `
      );
    }
  });

  document.querySelectorAll('a[href^="tel:"]').forEach((a) => a.remove());
})();

// Fix broken Formspree endpoint: convert the contact form to a safe mailto flow.
(() => {
  const email = 'ibbo.abdoli@gmail.com';

  document.querySelectorAll('form.panel').forEach((form) => {
    form.setAttribute('action', `mailto:${email}`);
    form.setAttribute('method', 'post');
    form.setAttribute('enctype', 'text/plain');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const from = (data.get('email') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();
      const subject = encodeURIComponent(`Website contact${name ? ' - ' + name : ''}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${from}\n\nMessage:\n${message}\n\nSource: ibboabdoli.com`
      );
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    });
  });
})();

(() => {
  const st = document.createElement('style');
  st.textContent = `
  @media(max-width:640px){.topbar{height:72px!important;padding:0 14px!important;gap:8px!important}.brand{gap:8px!important;min-width:0!important;max-width:42vw!important;overflow:hidden!important}.mark{width:34px!important;height:34px!important;flex:0 0 34px!important;font-size:12px!important}.brand strong{font-size:13px!important;letter-spacing:.04em!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;line-height:1.1!important}.brand em{display:none!important}.actions{gap:8px!important;flex:0 0 auto!important}.lang{height:36px!important}.lang a{min-width:38px!important;font-size:11px!important}.menu{height:36px!important;padding:0 12px!important;font-size:11px!important}.hero{padding-top:72px!important}}
  .contact-list a,.contact-list>span{display:flex!important;justify-content:space-between!important;align-items:center!important;gap:18px!important;border-bottom:1px solid var(--line)!important;padding:0 0 14px!important;line-height:1.45!important}.contact-list span{color:var(--muted)!important;min-width:max-content!important}.contact-list strong{color:var(--text)!important;text-align:right!important;word-break:break-word!important}@media(max-width:560px){.contact-list{gap:16px!important}.contact-list a,.contact-list>span{display:grid!important;grid-template-columns:1fr!important;gap:6px!important;align-items:start!important}.contact-list strong{text-align:left!important}}
  .booking-card{margin-top:24px;border:1px solid var(--line);background:linear-gradient(135deg,rgba(37,186,255,.10),rgba(255,138,61,.06));padding:22px;box-shadow:0 22px 70px rgba(0,0,0,.28)}.booking-eyebrow{display:block;color:var(--blue)!important;font:900 11px var(--mono);letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px}.booking-card h3{margin:0 0 8px;font-size:22px;color:var(--text)}.booking-card p{margin:0 0 18px;color:#b6c5cf;line-height:1.65}.booking-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}.booking-btn{display:flex;align-items:center;justify-content:center;min-height:44px;border:1px solid var(--line);font:900 11px var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--text);text-decoration:none}.booking-btn.primary{background:var(--blue);border-color:var(--blue);color:#021019}.booking-btn:hover{border-color:var(--blue);color:var(--blue)}.booking-btn.primary:hover{color:#021019}@media(max-width:560px){.booking-actions{grid-template-columns:1fr}}
  `;
  document.head.appendChild(st);
})();

var Tawk_API = Tawk_API || {};
Tawk_API.customStyle = {
  visibility: {
    desktop: { position: 'br', xOffset: '20px', yOffset: '20px' },
    mobile: { position: 'br', xOffset: '15px', yOffset: '86px' },
  },
};
var Tawk_LoadStart = new Date();
(() => {
  const s1 = document.createElement('script');
  const s0 = document.getElementsByTagName('script')[0];
  s1.async = true;
  s1.src = 'https://embed.tawk.to/6895ddde56ddd81926b30080/1j24mlbt5';
  s1.charset = 'UTF-8';
  s1.setAttribute('crossorigin', '*');
  s0.parentNode.insertBefore(s1, s0);
})();
