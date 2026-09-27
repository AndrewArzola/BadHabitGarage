/*
TemplateMo 621 Luminary
https://templatemo.com/tm-621-luminary
*/

// ── Smooth Scroll (JS-driven, overrides CSS) ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// ── Reveal ──
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
reveals.forEach(el => io.observe(el));

// ── Counters ──
document.querySelectorAll('.counter').forEach(el => {
  new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    const t = parseFloat(el.dataset.target), d = parseInt(el.dataset.decimals), dur = 1800, s = performance.now();
    const ease = x => x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x+2,3)/2;
    (function u(n) { const p = Math.min((n-s)/dur,1); el.textContent = (t*ease(p)).toFixed(d); if(p<1) requestAnimationFrame(u); })(s);
    e.target._counted = true;
  }, { threshold: 0.5 }).observe(el);
});

// ── Nav scroll ──
const topNav = document.getElementById('topNav');
window.addEventListener('scroll', () => topNav.classList.toggle('scrolled', scrollY > 60), { passive: true });

// ── Hero grid spotlight ──
const heroGrid = document.querySelector('.hero-grid');
const heroEl = document.getElementById('hero');
let gx = 0, gy = 0, tx = 0, ty = 0;
let mouseInHero = false;

document.addEventListener('mousemove', e => {
  const heroRect = heroEl.getBoundingClientRect();
  const gridRect = heroGrid.getBoundingClientRect();
  const activeTop = heroRect.top + heroRect.height * 0.3;
  // Only track in the bottom 70% of hero
  if (e.clientY >= activeTop && e.clientY <= heroRect.bottom) {
    mouseInHero = true;
    tx = e.clientX - gridRect.left;
    ty = e.clientY - gridRect.top;
  } else {
    mouseInHero = false;
    tx = gridRect.width / 2;
    ty = gridRect.height * 0.3;
  }
});

(function lerpGrid() {
  gx += (tx - gx) * 0.08;
  gy += (ty - gy) * 0.08;
  heroGrid.style.setProperty('--mx', gx + 'px');
  heroGrid.style.setProperty('--my', gy + 'px');
  requestAnimationFrame(lerpGrid);
})();

// ── Active nav + Side panels ──
const navAnchors = document.querySelectorAll('.nav-links a');
const sectionEls = document.querySelectorAll('section[id]');
const leftDots = document.querySelectorAll('.side-panel.left .side-dot');
const rightDots = document.querySelectorAll('.side-panel.right .side-dot');
const leftTrack = document.getElementById('leftTrack');
const rightTrack = document.getElementById('rightTrack');
const scrollPctEl = document.getElementById('scrollPct');

function updateNavAndPanels() {
  const y = scrollY + innerHeight * 0.4;
  const maxScroll = document.documentElement.scrollHeight - innerHeight;
  const pct = Math.min(scrollY / maxScroll, 1);

  // Active nav link
  let id = '', activeIndex = 0;
  sectionEls.forEach((s, i) => { if (y >= s.offsetTop) { id = s.id; activeIndex = i; } });
  navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));

  // Side panel tracks
  const trackPct = (pct * 100).toFixed(0);
  if (leftTrack) leftTrack.style.height = trackPct + '%';
  if (rightTrack) rightTrack.style.height = trackPct + '%';
  if (scrollPctEl) scrollPctEl.textContent = String(trackPct).padStart(2, '0');

  // Side panel dots
  const leftIdx = Math.min(activeIndex, leftDots.length - 1);
  const rightIdx = Math.min(activeIndex, rightDots.length - 1);
  leftDots.forEach((d, i) => d.classList.toggle('active', i === leftIdx));
  rightDots.forEach((d, i) => d.classList.toggle('active', i === rightIdx));
}

window.addEventListener('scroll', updateNavAndPanels, { passive: true });
updateNavAndPanels();

// ── Mobile menu ──
const toggle = document.getElementById('navToggle'), menu = document.getElementById('mobileMenu');
const menuLinks = menu.querySelectorAll('.mobile-menu-link');
let menuOpen = false;
function openMenu() { menuOpen=true; toggle.classList.add('active'); toggle.setAttribute('aria-expanded','true'); menu.classList.add('open'); document.body.classList.add('menu-open'); }
function closeMenu() { if(!menuOpen) return; menuOpen=false; toggle.classList.remove('active'); toggle.setAttribute('aria-expanded','false'); menu.classList.remove('open'); document.body.classList.remove('menu-open'); }
toggle.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
menuLinks.forEach(l => l.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
window.addEventListener('resize', () => { if (innerWidth > 1300) closeMenu(); });

// ── Pricing toggle ──
const pToggle = document.getElementById('pricingToggle');
const mLabel = document.getElementById('monthlyLabel');
const aLabel = document.getElementById('annualLabel');
const saveBadge = document.getElementById('saveBadge');
const monthlyOpts = document.querySelectorAll('.price-option.monthly');
const annualOpts = document.querySelectorAll('.price-option.annual');
let annual = false;

function setPricing() {
  annual = !annual;
  pToggle.classList.toggle('annual', annual);
  pToggle.setAttribute('aria-checked', annual);
  mLabel.classList.toggle('active', !annual);
  aLabel.classList.toggle('active', annual);
  saveBadge.classList.toggle('show', annual);
  monthlyOpts.forEach(el => el.classList.toggle('active', !annual));
  annualOpts.forEach(el => el.classList.toggle('active', annual));
}
pToggle.addEventListener('click', setPricing);
pToggle.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPricing(); } });

// ── Builds carousel ──
const carousel = document.getElementById('buildsCarousel');
if (carousel) {
  const track = carousel.querySelector('.carousel-track');
  const slides = carousel.querySelectorAll('.carousel-slide');
  const dots = carousel.querySelectorAll('.carousel-dot');
  const count = carousel.querySelector('.carousel-count');
  let currentSlide = 0;
  let carouselTimer;

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
      dot.setAttribute('aria-selected', i === currentSlide);
    });
    count.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  }

  function startCarousel() {
    clearInterval(carouselTimer);
    carouselTimer = setInterval(() => showSlide(currentSlide + 1), 5000);
  }

  carousel.querySelector('.carousel-prev').addEventListener('click', () => { showSlide(currentSlide - 1); startCarousel(); });
  carousel.querySelector('.carousel-next').addEventListener('click', () => { showSlide(currentSlide + 1); startCarousel(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); startCarousel(); }));
  carousel.addEventListener('mouseenter', () => clearInterval(carouselTimer));
  carousel.addEventListener('mouseleave', startCarousel);
  carousel.addEventListener('focusin', () => clearInterval(carouselTimer));
  carousel.addEventListener('focusout', event => { if (!carousel.contains(event.relatedTarget)) startCarousel(); });
  showSlide(0);
  startCarousel();
}

// ── FAQ accordion ──
const faqItems = document.querySelectorAll('.faq-item');
const faqToggleAll = document.getElementById('faqToggleAll');

faqItems.forEach(item => {
  const btn = item.querySelector('.faq-question');
  btn.addEventListener('click', () => {
    item.classList.toggle('open');
    updateFaqToggleLabel();
  });
});

faqToggleAll.addEventListener('click', () => {
  const shouldExpand = !Array.from(faqItems).every(item => item.classList.contains('open'));
  faqItems.forEach(item => item.classList.toggle('open', shouldExpand));
  updateFaqToggleLabel();
});

function updateFaqToggleLabel() {
  const openCount = document.querySelectorAll('.faq-item.open').length;
  const allExpanded = openCount === faqItems.length;
  faqToggleAll.textContent = allExpanded ? 'Collapse All' : 'Expand All';
}

