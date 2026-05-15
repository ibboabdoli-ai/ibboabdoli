const topbar=document.querySelector('.topbar');
const nav=document.querySelector('.nav');
const menu=document.querySelector('.menu');
const year=document.querySelector('[data-year]');

if (year) year.textContent = new Date().getFullYear();

const onScroll = () => topbar && topbar.classList.toggle('scrolled', scrollY > 24);
onScroll();
addEventListener('scroll', onScroll, { passive: true });

menu?.addEventListener('click', () => {
  const open = !nav.classList.contains('open');
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
});

nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menu?.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('show');
    revealObserver.unobserve(entry.target);
  }
}), { threshold: .13 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const sections = [...document.querySelectorAll('section[id]')];
const navLinks = [...document.querySelectorAll('.nav a')];
addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (scrollY >= section.offsetTop - 160) current = section.id;
  });
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + current));
}, { passive: true });

(() => {
  const email = 'ibbo.abdoli@gmail.com';
  const phone = '+46790783238';
  const linkedin = 'https://www.linkedin.com/in/ibbo-abdoli/';

  document.querySelectorAll('.contact-list').forEach(list => {
    list.innerHTML = `
      <a href="mailto:${email}"><span>Email:</span><strong>${email}</strong></a>
      <a href="tel:${phone}"><span>Phone:</span><strong>${phone}</strong></a>
      <a href="${linkedin}" target="_blank" rel="noopener"><span>LinkedIn:</span><strong>Open profile</strong></a>
      <span><span>Location:</span><strong>Stockholm, Sweden</strong></span>
    `;
  });

  document.querySelectorAll('a[href^="tel:"]').forEach(a => {
    a.href = 'tel:' + phone;
    const strong = a.querySelector('strong');
    if (strong) strong.textContent = phone;
  });
})();

(() => {
  const st = document.createElement('style');
  st.textContent = `
  @media(max-width:640px){
    .topbar{height:72px!important;padding:0 14px!important;gap:8px!important}
    .brand{gap:8px!important;min-width:0!important;max-width:42vw!important;overflow:hidden!important}
    .mark{width:34px!important;height:34px!important;flex:0 0 34px!important;font-size:12px!important}
    .brand strong{font-size:13px!important;letter-spacing:.04em!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;line-height:1.1!important}
    .brand em{display:none!important}
    .actions{gap:8px!important;flex:0 0 auto!important}
    .lang{height:36px!important}
    .lang a{min-width:38px!important;font-size:11px!important}
    .menu{height:36px!important;padding:0 12px!important;font-size:11px!important}
    .hero{padding-top:72px!important}
  }

  .contact-list a,.contact-list>span{display:flex!important;justify-content:space-between!important;align-items:center!important;gap:18px!important;border-bottom:1px solid var(--line)!important;padding:0 0 14px!important;line-height:1.45!important}
  .contact-list span{color:var(--muted)!important;min-width:max-content!important}
  .contact-list strong{color:var(--text)!important;text-align:right!important;word-break:break-word!important}
  @media(max-width:560px){
    .contact-list{gap:16px!important}
    .contact-list a,.contact-list>span{display:grid!important;grid-template-columns:1fr!important;gap:6px!important;align-items:start!important}
    .contact-list strong{text-align:left!important}
  }

  .case .visual{height:190px!important;position:relative;overflow:hidden;background:#071019!important;isolation:isolate;border-bottom:1px solid rgba(139,198,235,.18)}
  .case .visual:before{content:'';position:absolute;inset:0;z-index:3;background:linear-gradient(110deg,transparent 0 42%,rgba(37,186,255,.28) 48%,transparent 56%);transform:translateX(-120%);animation:caseScan 4.6s ease-in-out infinite}
  .case .visual:after{content:'';position:absolute;inset:18px;z-index:2;border:1px solid rgba(37,186,255,.22);box-shadow:inset 0 0 42px rgba(37,186,255,.10),0 0 34px rgba(37,186,255,.12)}
  .case:nth-child(1) .visual{background:radial-gradient(circle at 72% 66%,rgba(220,232,239,.98) 0 13px,rgba(109,125,136,.9) 14px 23px,transparent 24px),radial-gradient(circle at 58% 38%,rgba(220,232,239,.96) 0 16px,rgba(109,125,136,.85) 17px 27px,transparent 28px),radial-gradient(circle at 38% 58%,rgba(220,232,239,.88) 0 13px,rgba(109,125,136,.8) 14px 23px,transparent 24px),linear-gradient(30deg,transparent 0 42%,rgba(220,232,239,.85) 43% 50%,transparent 51%),linear-gradient(-28deg,transparent 0 44%,rgba(149,166,178,.8) 45% 51%,transparent 52%),radial-gradient(circle at 26% 28%,rgba(37,186,255,.16),transparent 28%),linear-gradient(135deg,#0b1721,#050a0f)!important;background-size:auto,auto,auto,78% 78%,72% 72%,auto,auto;background-position:center,center,center,50% 50%,48% 54%,center,center}
  .case:nth-child(1) .visual:after{content:'ROBOT PATH · RAPID · MOTION';display:flex;align-items:flex-end;justify-content:flex-start;padding:12px;color:#25baff;font:900 11px var(--mono);letter-spacing:.12em}
  .case:nth-child(2) .visual{background:radial-gradient(circle at 54% 55%,#02070b 0 22px,#25baff 23px 28px,rgba(220,232,239,.92) 29px 46px,rgba(37,186,255,.25) 47px 78px,transparent 79px),radial-gradient(circle at 54% 55%,rgba(255,138,61,.34),transparent 24%),radial-gradient(circle at 72% 34%,rgba(255,138,61,.88) 0 8px,transparent 9px),linear-gradient(90deg,transparent 0 28%,rgba(220,232,239,.18) 29% 70%,transparent 71%),linear-gradient(135deg,#0b1721,#050a0f)!important}
  .case:nth-child(2) .visual:after{content:'VISION TRIGGER · CAMERA · TIMEOUT';display:flex;align-items:flex-end;justify-content:flex-start;padding:12px;color:#25baff;font:900 11px var(--mono);letter-spacing:.12em}
  .case:nth-child(3) .visual{background:linear-gradient(90deg,transparent 0 32%,rgba(37,186,255,.22) 33% 37%,transparent 38% 41%,rgba(37,186,255,.20) 42% 46%,transparent 47% 50%,rgba(37,186,255,.18) 51% 55%,transparent 56% 60%,rgba(255,138,61,.24) 61% 65%,transparent 66%),radial-gradient(circle at 36% 38%,#62f6b1 0 4px,transparent 5px),radial-gradient(circle at 44% 48%,#62f6b1 0 4px,transparent 5px),radial-gradient(circle at 54% 38%,#62f6b1 0 4px,transparent 5px),radial-gradient(circle at 63% 48%,#ff8a3d 0 4px,transparent 5px),linear-gradient(135deg,#0b1721,#050a0f)!important}
  .case:nth-child(3) .visual:after{content:'PLC / I-O STATUS · BUS · ALARMS';display:flex;align-items:flex-end;justify-content:flex-start;padding:12px;color:#25baff;font:900 11px var(--mono);letter-spacing:.12em}
  .case .visual{box-shadow:inset 0 -80px 110px rgba(3,7,10,.34),inset 0 0 0 1px rgba(37,186,255,.08)}
  @keyframes caseScan{0%,42%{transform:translateX(-120%)}65%{transform:translateX(120%)}100%{transform:translateX(120%)}}

  .portrait{position:relative!important;overflow:hidden!important;min-height:420px!important;background:#061017!important;border:1px solid rgba(139,198,235,.28)!important;box-shadow:0 28px 90px rgba(0,0,0,.42),inset 0 0 80px rgba(37,186,255,.08)!important}
  .portrait:before{content:''!important;position:absolute;inset:0!important;background:linear-gradient(rgba(37,186,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(37,186,255,.08) 1px,transparent 1px),radial-gradient(circle at 60% 42%,rgba(37,186,255,.22),transparent 34%),linear-gradient(135deg,#08131d,#03070a)!important;background-size:34px 34px,34px 34px,auto,auto!important;color:transparent!important;animation:videoGrid 7s linear infinite!important}
  .portrait:after{content:'LIVE CELL FEED\\A PLC · ROBOT · VISION';white-space:pre;position:absolute;left:22px;bottom:22px;right:22px;z-index:4;color:#25baff;font:900 12px var(--mono);letter-spacing:.14em;line-height:1.8;padding-top:14px;border-top:1px solid rgba(37,186,255,.35);text-shadow:0 0 18px rgba(37,186,255,.55)}
  .portrait .motion-panel{position:absolute;inset:0;z-index:2;pointer-events:none}
  .portrait .motion-panel:before{content:'';position:absolute;left:12%;right:12%;bottom:18%;height:58px;border:1px solid rgba(139,198,235,.32);background:repeating-linear-gradient(90deg,rgba(255,255,255,.10) 0 1px,transparent 1px 28px),linear-gradient(90deg,rgba(255,138,61,.16),rgba(37,186,255,.12));box-shadow:0 22px 70px rgba(0,0,0,.55)}
  .portrait .motion-panel:after{content:'';position:absolute;inset:0;background:linear-gradient(110deg,transparent 0 43%,rgba(37,186,255,.28) 48%,transparent 55%);transform:translateX(-120%);animation:videoScan 3.9s ease-in-out infinite;mix-blend-mode:screen}
  .portrait .robot-video{position:absolute;left:9%;top:12%;width:82%;height:70%;z-index:3;filter:drop-shadow(0 0 28px rgba(37,186,255,.28))}
  .portrait .rv-arm{transform-origin:420px 330px;animation:rvArm 6s ease-in-out infinite}
  .portrait .rv-tool{transform-origin:265px 330px;animation:rvTool 3.5s ease-in-out infinite}
  .portrait .rv-led{animation:rvLed 1.2s ease-in-out infinite}
  @keyframes videoGrid{to{background-position:34px 34px,34px 34px,center,center}}
  @keyframes videoScan{0%,45%{transform:translateX(-120%)}70%,100%{transform:translateX(120%)}}
  @keyframes rvArm{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(7deg)}}
  @keyframes rvTool{0%,100%{transform:rotate(4deg)}50%{transform:rotate(-9deg)}}
  @keyframes rvLed{0%,100%{opacity:.35}50%{opacity:1}}
  @media(max-width:980px){.portrait{min-height:340px!important}}
  `;
  document.head.appendChild(st);
})();

(() => {
  document.querySelectorAll('.portrait').forEach(p => {
    p.classList.remove('has-photo');
    p.innerHTML = `<div class="motion-panel"></div><svg class="robot-video" viewBox="0 0 720 520" aria-hidden="true"><g opacity=".22" stroke="#25baff"><path d="M70 430H650M110 370H610M150 310H570"/><path d="M140 70v390M280 50v410M420 60v400M560 80v380"/></g><g class="rv-arm"><circle cx="455" cy="390" r="62" fill="#101821" stroke="#dce8ef" stroke-width="8"/><path d="M420 342 C390 272 350 210 295 160" fill="none" stroke="#dce8ef" stroke-width="46" stroke-linecap="round"/><circle cx="295" cy="160" r="36" fill="#dce8ef" stroke="#6d7d88" stroke-width="7"/><path d="M265 170 C210 178 170 220 142 270" fill="none" stroke="#9eb0bd" stroke-width="40" stroke-linecap="round"/><circle cx="142" cy="270" r="31" fill="#dce8ef" stroke="#6d7d88" stroke-width="6"/><g class="rv-tool"><path d="M142 270 L105 330" stroke="#dce8ef" stroke-width="18" stroke-linecap="round"/><circle cx="98" cy="342" r="8" fill="#ff8a3d"/></g></g><g class="rv-led"><circle cx="580" cy="160" r="7" fill="#62f6b1"/><circle cx="610" cy="190" r="7" fill="#62f6b1"/><circle cx="580" cy="220" r="7" fill="#ff8a3d"/><path d="M530 150h100v90H530z" fill="none" stroke="#25baff" stroke-width="3" opacity=".7"/></g><text x="44" y="62" fill="#25baff" font-family="monospace" font-size="19" font-weight="900">AUTOMATION DIAGNOSTICS</text></svg>`;
  });
})();

var Tawk_API = Tawk_API || {};
Tawk_API.customStyle = {
  visibility: {
    desktop: { position: 'br', xOffset: '20px', yOffset: '20px' },
    mobile: { position: 'br', xOffset: '15px', yOffset: '86px' }
  }
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
