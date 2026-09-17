const topbar=document.querySelector('.topbar');
const nav=document.querySelector('.nav');
const menu=document.querySelector('.menu');
const year=document.querySelector('[data-year]');

if(year) year.textContent=new Date().getFullYear();

const syncHeader=()=>topbar?.classList.toggle('scrolled',window.scrollY>20);
syncHeader();
window.addEventListener('scroll',syncHeader,{passive:true});

const setMenu=(open)=>{
  nav?.classList.toggle('open',open);
  menu?.setAttribute('aria-expanded',String(open));
  if(menu) menu.textContent=open?(document.documentElement.lang==='sv'?'Stäng':'Close'):(document.documentElement.lang==='sv'?'Meny':'Menu');
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
