const topbar=document.querySelector('.topbar');
const nav=document.querySelector('.nav');
const menu=document.querySelector('.menu');
const year=document.querySelector('[data-year]');
const lang=document.documentElement.lang==='sv'?'sv':'en';

if(year) year.textContent=new Date().getFullYear();

const syncHeader=()=>topbar?.classList.toggle('scrolled',window.scrollY>20);
syncHeader();
window.addEventListener('scroll',syncHeader,{passive:true});

const setMenu=(open)=>{
  nav?.classList.toggle('open',open);
  menu?.setAttribute('aria-expanded',String(open));
  if(menu) menu.textContent=open?(lang==='sv'?'Stäng':'Close'):(lang==='sv'?'Meny':'Menu');
};

menu?.addEventListener('click',()=>setMenu(!nav?.classList.contains('open')));
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setMenu(false)));
window.addEventListener('keydown',event=>{if(event.key==='Escape')setMenu(false)});
window.addEventListener('resize',()=>{if(window.innerWidth>1040)setMenu(false)});

const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals=[...document.querySelectorAll('.reveal')];
if(reduceMotion||!('IntersectionObserver' in window)){
  reveals.forEach(el=>el.classList.add('show'));
}else{
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('show');observer.unobserve(entry.target)}
    });
  },{threshold:.12,rootMargin:'0px 0px -4% 0px'});
  reveals.forEach(el=>observer.observe(el));
}

const sections=[...document.querySelectorAll('section[id]')];
const navLinks=[...document.querySelectorAll('.nav a[href^="#"]')];
const updateActiveNav=()=>{
  let current='';
  for(const section of sections){if(window.scrollY>=section.offsetTop-170)current=section.id}
  navLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')==='#'+current));
};
updateActiveNav();
window.addEventListener('scroll',updateActiveNav,{passive:true});

/* Industrial visual system: lightweight animated SVG instead of generic stock imagery. */
const visualStyle=document.createElement('style');
visualStyle.textContent=`
.stage:before{display:none!important}
.stage{background:linear-gradient(180deg,#0b1721,#050a0f)!important;border-color:rgba(139,198,235,.28)!important;box-shadow:0 30px 100px rgba(0,0,0,.48),inset 0 0 70px rgba(37,186,255,.06)!important}
.cell-hud{position:absolute;z-index:5;top:18px;left:20px;right:20px;display:flex;justify-content:space-between;gap:12px;color:#33c2ff;font:800 10px var(--mono);letter-spacing:.14em;text-transform:uppercase}
.cell-hud span:last-child{color:#62f6b1}.cell-hud i{display:inline-block;width:7px;height:7px;border-radius:50%;background:#62f6b1;box-shadow:0 0 12px #62f6b1;margin-right:8px}
.cell-svg{position:absolute;inset:48px 18px 46px;width:calc(100% - 36px);height:calc(100% - 94px)}
.cell-foot{position:absolute;z-index:5;left:20px;right:20px;bottom:15px;display:flex;justify-content:space-between;gap:12px;color:#78909f;font:800 9px var(--mono);letter-spacing:.12em;text-transform:uppercase}
.hero-arm{transform-origin:505px 390px;animation:heroArm 7s ease-in-out infinite}.hero-tool{transform-origin:252px 252px;animation:heroTool 4.2s ease-in-out infinite}.hero-part{animation:heroPart 7.4s linear infinite}.hero-part.p2{animation-delay:-2.45s}.hero-part.p3{animation-delay:-4.9s}.hero-scan{animation:heroScan 3.3s ease-in-out infinite}.hero-led{animation:heroLed 1.2s ease-in-out infinite}
@keyframes heroArm{0%,100%{transform:rotate(-3deg)}48%{transform:rotate(5deg)}72%{transform:rotate(1deg)}}
@keyframes heroTool{0%,100%{transform:rotate(4deg)}50%{transform:rotate(-8deg)}}
@keyframes heroPart{0%{transform:translateX(-170px);opacity:0}10%,88%{opacity:1}100%{transform:translateX(560px);opacity:0}}
@keyframes heroScan{0%,18%{transform:translateY(-90px);opacity:0}35%,75%{opacity:.85}92%,100%{transform:translateY(155px);opacity:0}}
@keyframes heroLed{50%{opacity:.35}}
.case .visual{height:210px!important;position:relative;overflow:hidden;background:linear-gradient(180deg,#0b1721,#050a0f)!important;border-bottom:1px solid rgba(139,198,235,.2)!important}
.case .visual:before,.case .visual:after{content:none!important}.case-visual-svg{width:100%;height:100%;display:block}.case-scan{animation:caseScan 3.7s ease-in-out infinite}.case-pulse{animation:casePulse 1.6s ease-in-out infinite}.case-data{animation:caseData 6s linear infinite}.case-data.d2{animation-delay:-2s}.case-data.d3{animation-delay:-4s}
@keyframes caseScan{0%,20%{transform:translateY(-70px);opacity:0}38%,72%{opacity:.85}92%,100%{transform:translateY(135px);opacity:0}}
@keyframes casePulse{50%{opacity:.3}}
@keyframes caseData{0%{transform:translateX(-24px);opacity:.2}50%{opacity:1}100%{transform:translateX(24px);opacity:.2}}
.portrait{min-height:430px!important;position:relative!important;overflow:hidden!important;background:linear-gradient(180deg,#08131c,#04080c)!important;border:1px solid rgba(139,198,235,.25)!important;box-shadow:0 28px 85px rgba(0,0,0,.42),inset 0 0 70px rgba(37,186,255,.06)!important}
.portrait:before,.portrait:after{display:none!important}.about-live{position:absolute;inset:0;display:grid;grid-template-rows:auto 1fr auto;padding:20px}.about-live-head,.about-live-foot{display:flex;justify-content:space-between;gap:12px;color:#33c2ff;font:800 10px var(--mono);letter-spacing:.13em;text-transform:uppercase}.about-live-head span:last-child{color:#62f6b1}.about-live-foot{color:#78909f}.about-live-svg{width:100%;height:100%;min-height:315px}.about-scan{animation:aboutScan 4.4s ease-in-out infinite}.about-node{animation:aboutNode 1.8s ease-in-out infinite}.about-node.n2{animation-delay:-.6s}.about-node.n3{animation-delay:-1.2s}.about-flow{stroke-dasharray:8 11;animation:aboutFlow 2.4s linear infinite}
@keyframes aboutScan{0%,18%{transform:translateY(-115px);opacity:0}38%,72%{opacity:.7}92%,100%{transform:translateY(175px);opacity:0}}
@keyframes aboutNode{50%{opacity:.35;filter:drop-shadow(0 0 2px currentColor)}}
@keyframes aboutFlow{to{stroke-dashoffset:-38}}
@media(max-width:980px){.case .visual{height:230px!important}.portrait{min-height:360px!important}}
@media(max-width:560px){.cell-svg{inset:44px 8px 40px;width:calc(100% - 16px);height:calc(100% - 84px)}.cell-hud{left:12px;right:12px;top:12px;font-size:8px}.cell-foot{left:12px;right:12px;font-size:7px}.case .visual{height:190px!important}.portrait{min-height:330px!important}.about-live{padding:14px}.about-live-svg{min-height:260px}}
@media(prefers-reduced-motion:reduce){.hero-arm,.hero-tool,.hero-part,.hero-scan,.hero-led,.case-scan,.case-pulse,.case-data,.about-scan,.about-node,.about-flow{animation:none!important}}
`;
document.head.appendChild(visualStyle);

const stage=document.querySelector('.stage');
if(stage){
  const label=lang==='sv'?'Animerad vy av industriell robotcell med PLC, vision och transportbana':'Animated industrial robot cell with PLC, vision and conveyor';
  stage.innerHTML=`
    <div class="cell-hud"><span>SYSTEM FEED · ROBOT_CELL_01</span><span><i></i>ONLINE</span></div>
    <svg class="cell-svg" viewBox="0 0 720 520" role="img" aria-label="${label}">
      <g opacity=".18" stroke="#37bfff" stroke-width="1"><path d="M40 92H680M40 164H680M40 236H680M40 308H680M40 380H680M120 52V462M240 52V462M360 52V462M480 52V462M600 52V462"/></g>
      <rect x="46" y="370" width="628" height="72" rx="8" fill="#0b1620" stroke="#446575"/><path d="M65 393H655M65 418H655" stroke="#28495a" stroke-width="2"/>
      <g stroke="#2c5367" stroke-width="2" opacity=".9"><path d="M90 370v72M145 370v72M200 370v72M255 370v72M310 370v72M365 370v72M420 370v72M475 370v72M530 370v72M585 370v72M640 370v72"/></g>
      <g class="hero-part" transform="translate(-170 0)"><rect x="84" y="382" width="62" height="45" rx="5" fill="#c8d7e1" stroke="#e8f3f8"/><path d="M96 395h38v19H96z" fill="#2b3a45"/><circle cx="115" cy="404" r="5" fill="#ff9854"/></g>
      <g class="hero-part p2" transform="translate(-170 0)"><rect x="84" y="382" width="62" height="45" rx="5" fill="#c8d7e1" stroke="#e8f3f8"/><path d="M96 395h38v19H96z" fill="#2b3a45"/><circle cx="115" cy="404" r="5" fill="#62f6b1"/></g>
      <g class="hero-part p3" transform="translate(-170 0)"><rect x="84" y="382" width="62" height="45" rx="5" fill="#c8d7e1" stroke="#e8f3f8"/><path d="M96 395h38v19H96z" fill="#2b3a45"/><circle cx="115" cy="404" r="5" fill="#37bfff"/></g>
      <g transform="translate(515 64)"><rect width="126" height="88" rx="8" fill="#0d1a24" stroke="#40667b"/><rect x="16" y="17" width="41" height="40" rx="4" fill="#162c3b" stroke="#37bfff"/><circle cx="36" cy="37" r="12" fill="#02070b" stroke="#8ad7ff" stroke-width="4"/><circle cx="36" cy="37" r="5" fill="#37bfff"/><path d="M70 24h38M70 36h29M70 48h33" stroke="#78909f" stroke-width="4"/><circle class="hero-led" cx="108" cy="70" r="5" fill="#62f6b1"/></g>
      <g class="hero-scan" transform="translate(0 -90)"><rect x="415" y="168" width="164" height="4" fill="#37bfff" opacity=".6"/><rect x="415" y="168" width="164" height="34" fill="#37bfff" opacity=".05"/></g>
      <g class="hero-arm">
        <circle cx="505" cy="350" r="62" fill="#141f28" stroke="#647786" stroke-width="10"/><circle cx="505" cy="350" r="34" fill="#1d2a34" stroke="#e1edf4" stroke-width="7"/>
        <path d="M488 300C470 246 447 199 414 157" fill="none" stroke="#dce8ef" stroke-width="48" stroke-linecap="round"/>
        <circle cx="414" cy="157" r="39" fill="#dce8ef" stroke="#657681" stroke-width="8"/>
        <path d="M380 167C334 170 291 196 253 242" fill="none" stroke="#c8d6df" stroke-width="43" stroke-linecap="round"/>
        <circle cx="253" cy="242" r="32" fill="#dce8ef" stroke="#657681" stroke-width="7"/>
        <g class="hero-tool"><path d="M253 242l-45 58" stroke="#dce8ef" stroke-width="16" stroke-linecap="round"/><path d="M211 298l-23 31" stroke="#37bfff" stroke-width="8" stroke-linecap="round"/><circle cx="185" cy="333" r="7" fill="#ff9854"/></g>
        <text x="384" y="147" fill="#e32620" font-size="22" font-family="Arial" font-weight="900">ABB</text>
      </g>
      <path d="M184 333C235 330 285 334 336 354" fill="none" stroke="#ff9854" stroke-width="2" stroke-dasharray="7 8" opacity=".75"/>
      <g transform="translate(56 62)"><rect width="138" height="118" rx="7" fill="#0c1922" stroke="#40667b"/><text x="15" y="23" fill="#37bfff" font-size="11" font-family="monospace" font-weight="700">PLC · S7-1500</text><g transform="translate(15 38)"><rect width="25" height="58" fill="#1c3442" stroke="#59798a"/><rect x="31" width="25" height="58" fill="#1c3442" stroke="#59798a"/><rect x="62" width="25" height="58" fill="#1c3442" stroke="#59798a"/><rect x="93" width="15" height="58" fill="#1c3442" stroke="#59798a"/><circle cx="12" cy="15" r="3" fill="#62f6b1"/><circle cx="43" cy="15" r="3" fill="#62f6b1"/><circle cx="74" cy="15" r="3" fill="#62f6b1"/><circle class="hero-led" cx="100" cy="15" r="3" fill="#ff9854"/></g></g>
    </svg>
    <div class="cell-foot"><span>PLC S7-1500</span><span>ABB IRC5 / RAPID</span><span>VISION ONLINE</span></div>`;
}

const caseVisuals=[...document.querySelectorAll('.case .visual')];
const case1=`
<svg class="case-visual-svg" viewBox="0 0 420 210" role="img" aria-label="ABB robot motion diagnostic">
  <g opacity=".18" stroke="#37bfff"><path d="M20 45H400M20 90H400M20 135H400M20 180H400M70 20V195M140 20V195M210 20V195M280 20V195M350 20V195"/></g>
  <rect x="252" y="147" width="118" height="36" rx="4" fill="#0c1922" stroke="#355869"/><path d="M265 160h90M265 170h90" stroke="#234452"/>
  <g transform="translate(0 -6)"><circle cx="292" cy="139" r="31" fill="#15212a" stroke="#788b97" stroke-width="6"/><path d="M281 112C264 82 245 62 217 48" stroke="#dce8ef" stroke-width="27" stroke-linecap="round" fill="none"/><circle cx="217" cy="48" r="21" fill="#dce8ef" stroke="#697b87" stroke-width="5"/><path d="M199 52C170 57 149 75 132 99" stroke="#cbd8e0" stroke-width="23" stroke-linecap="round" fill="none"/><circle cx="132" cy="99" r="17" fill="#dce8ef" stroke="#697b87" stroke-width="4"/><path d="M132 99l-24 35" stroke="#dce8ef" stroke-width="10" stroke-linecap="round"/><circle cx="104" cy="139" r="5" fill="#ff9854"/><text x="202" y="44" fill="#e32620" font-size="13" font-family="Arial" font-weight="900">ABB</text></g>
  <path d="M103 139C145 121 185 128 224 148" fill="none" stroke="#ff9854" stroke-width="2" stroke-dasharray="6 7"/>
  <g transform="translate(28 155)"><circle class="case-pulse" cx="0" cy="0" r="4" fill="#62f6b1"/><text x="11" y="4" fill="#7e96a4" font-size="10" font-family="monospace">RAPID PATH VERIFIED</text></g>
</svg>`;
const case2=`
<svg class="case-visual-svg" viewBox="0 0 420 210" role="img" aria-label="Machine vision inspection diagnostic">
  <rect x="26" y="20" width="368" height="170" rx="9" fill="#071018" stroke="#2e5366"/>
  <g opacity=".17" stroke="#37bfff"><path d="M26 62H394M26 105H394M26 148H394M118 20V190M210 20V190M302 20V190"/></g>
  <rect x="76" y="60" width="266" height="92" rx="6" fill="#0f1d27" stroke="#647986"/><path d="M104 88h210v38H104z" fill="#c8d7e1" opacity=".9"/><circle cx="154" cy="107" r="14" fill="#263844"/><circle cx="268" cy="107" r="14" fill="#263844"/>
  <rect x="92" y="74" width="230" height="67" fill="none" stroke="#62f6b1" stroke-width="2"/><path d="M92 87h17M92 74v17M322 87h-17M322 74v17M92 128h17M92 141v-17M322 128h-17M322 141v-17" stroke="#62f6b1" stroke-width="3"/>
  <g class="case-scan" transform="translate(0 -70)"><rect x="86" y="74" width="242" height="3" fill="#37bfff"/><rect x="86" y="74" width="242" height="24" fill="#37bfff" opacity=".07"/></g>
  <g transform="translate(38 36)"><circle cx="0" cy="0" r="5" fill="#62f6b1"/><text x="13" y="4" fill="#62f6b1" font-size="11" font-family="monospace" font-weight="700">INSPECTION OK</text></g><text x="286" y="178" fill="#78909f" font-size="9" font-family="monospace">TRIGGER 42 ms</text>
</svg>`;
const case3=`
<svg class="case-visual-svg" viewBox="0 0 420 210" role="img" aria-label="PLC and PROFINET communication diagnostic">
  <g transform="translate(28 36)"><rect width="154" height="134" rx="7" fill="#0b1720" stroke="#37596a"/><text x="14" y="22" fill="#37bfff" font-size="11" font-family="monospace" font-weight="700">PLC RACK</text><g transform="translate(14 36)"><rect width="28" height="76" fill="#1b3442" stroke="#617988"/><rect x="34" width="28" height="76" fill="#1b3442" stroke="#617988"/><rect x="68" width="28" height="76" fill="#1b3442" stroke="#617988"/><rect x="102" width="24" height="76" fill="#1b3442" stroke="#617988"/><circle cx="14" cy="15" r="4" fill="#62f6b1"/><circle cx="48" cy="15" r="4" fill="#62f6b1"/><circle cx="82" cy="15" r="4" fill="#62f6b1"/><circle class="case-pulse" cx="114" cy="15" r="4" fill="#ff9854"/></g></g>
  <path d="M182 102H252" stroke="#37bfff" stroke-width="4"/><path class="case-data" d="M195 102h18" stroke="#62f6b1" stroke-width="4"/><path class="case-data d2" d="M215 102h18" stroke="#62f6b1" stroke-width="4"/><path class="case-data d3" d="M235 102h18" stroke="#ff9854" stroke-width="4"/>
  <g transform="translate(252 48)"><rect width="140" height="108" rx="7" fill="#0b1720" stroke="#37596a"/><text x="14" y="22" fill="#37bfff" font-size="10" font-family="monospace" font-weight="700">PROFINET / I-O</text><rect x="15" y="38" width="108" height="18" rx="3" fill="#142833"/><rect x="15" y="64" width="108" height="18" rx="3" fill="#142833"/><circle cx="30" cy="47" r="4" fill="#62f6b1"/><circle cx="30" cy="73" r="4" fill="#ff9854"/><path d="M43 47h60M43 73h60" stroke="#6f8794" stroke-width="4"/></g>
  <text x="188" y="90" fill="#78909f" font-size="8" font-family="monospace">BUS</text><text x="190" y="122" fill="#ff9854" font-size="8" font-family="monospace">FAULT TRACE</text>
</svg>`;
[case1,case2,case3].forEach((svg,i)=>{if(caseVisuals[i])caseVisuals[i].innerHTML=svg});

const portrait=document.querySelector('.portrait');
if(portrait){
  const aboutLabel=lang==='sv'?'Live diagnostikvy med PLC, robot och visionsystem':'Live diagnostics view with PLC, robot and vision system';
  portrait.setAttribute('aria-label',aboutLabel);
  portrait.innerHTML=`
  <div class="about-live">
    <div class="about-live-head"><span>LIVE DIAGNOSTICS · CELL_A</span><span>● STABLE</span></div>
    <svg class="about-live-svg" viewBox="0 0 560 350" role="img" aria-label="${aboutLabel}">
      <g opacity=".14" stroke="#37bfff"><path d="M18 62H542M18 118H542M18 174H542M18 230H542M18 286H542M90 28V326M180 28V326M270 28V326M360 28V326M450 28V326"/></g>
      <g transform="translate(32 74)"><rect width="132" height="126" rx="8" fill="#0a1720" stroke="#34596b"/><text x="14" y="22" fill="#37bfff" font-size="10" font-family="monospace" font-weight="700">PLC · I/O</text><g transform="translate(15 38)"><rect width="23" height="63" fill="#1a3442" stroke="#5f7a88"/><rect x="29" width="23" height="63" fill="#1a3442" stroke="#5f7a88"/><rect x="58" width="23" height="63" fill="#1a3442" stroke="#5f7a88"/><rect x="87" width="23" height="63" fill="#1a3442" stroke="#5f7a88"/><circle class="about-node" cx="11" cy="13" r="3" fill="#62f6b1"/><circle class="about-node n2" cx="40" cy="13" r="3" fill="#62f6b1"/><circle class="about-node n3" cx="69" cy="13" r="3" fill="#62f6b1"/><circle cx="98" cy="13" r="3" fill="#ff9854"/></g></g>
      <g transform="translate(202 56)"><rect width="160" height="164" rx="8" fill="#0a1720" stroke="#34596b"/><text x="14" y="22" fill="#37bfff" font-size="10" font-family="monospace" font-weight="700">ABB ROBOT</text><circle cx="109" cy="123" r="27" fill="#15212a" stroke="#758996" stroke-width="5"/><path d="M102 98C94 74 80 58 62 45" stroke="#dce8ef" stroke-width="21" stroke-linecap="round" fill="none"/><circle cx="62" cy="45" r="15" fill="#dce8ef" stroke="#697b87" stroke-width="4"/><path d="M50 49C34 55 24 68 18 83" stroke="#cbd8e0" stroke-width="17" stroke-linecap="round" fill="none"/><circle cx="18" cy="83" r="12" fill="#dce8ef" stroke="#697b87" stroke-width="3"/><path d="M18 83l-11 24" stroke="#dce8ef" stroke-width="7"/><circle cx="5" cy="112" r="4" fill="#ff9854"/><path d="M5 112C43 108 66 118 89 132" fill="none" stroke="#ff9854" stroke-width="2" stroke-dasharray="5 6"/><text x="49" y="43" fill="#e32620" font-size="11" font-family="Arial" font-weight="900">ABB</text></g>
      <g transform="translate(398 74)"><rect width="130" height="126" rx="8" fill="#0a1720" stroke="#34596b"/><text x="14" y="22" fill="#37bfff" font-size="10" font-family="monospace" font-weight="700">VISION</text><rect x="18" y="39" width="94" height="66" fill="#0e1c26" stroke="#617986"/><rect x="32" y="53" width="66" height="38" fill="#c8d7e1" opacity=".85"/><rect x="27" y="48" width="76" height="48" fill="none" stroke="#62f6b1" stroke-width="2"/><g class="about-scan" transform="translate(0 -115)"><rect x="24" y="52" width="82" height="3" fill="#37bfff"/></g></g>
      <path class="about-flow" d="M164 137H202M362 137H398" stroke="#37bfff" stroke-width="3" fill="none"/>
      <g transform="translate(33 250)"><text x="0" y="0" fill="#78909f" font-size="9" font-family="monospace">CYCLE TIME</text><text x="0" y="25" fill="#f4f8fb" font-size="19" font-family="monospace" font-weight="700">42.8 s</text><path d="M0 48h114" stroke="#294858"/><path d="M4 45l16-8 17 4 18-15 18 9 18-12 18 4" fill="none" stroke="#62f6b1" stroke-width="2"/></g>
      <g transform="translate(220 250)"><text x="0" y="0" fill="#78909f" font-size="9" font-family="monospace">ROBOT STATE</text><text x="0" y="25" fill="#62f6b1" font-size="19" font-family="monospace" font-weight="700">RUNNING</text><path d="M0 48h114" stroke="#294858"/></g>
      <g transform="translate(402 250)"><text x="0" y="0" fill="#78909f" font-size="9" font-family="monospace">VISION</text><text x="0" y="25" fill="#62f6b1" font-size="19" font-family="monospace" font-weight="700">OK</text><path d="M0 48h114" stroke="#294858"/></g>
    </svg>
    <div class="about-live-foot"><span>PROFINET CONNECTED</span><span>NO ACTIVE ALARMS</span></div>
  </div>`;
}
