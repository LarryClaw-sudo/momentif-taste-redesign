const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

const progress = $('#progress');
const revealEls = $$('.reveal');
const warmTrigger = $('#warmTransition');
const phones = $$('.phone');
const blobs = $$('.blob');
const timelineDots = $$('.dot');

// anime.js hero ambient motion
anime({
  targets: '.blob.b1',
  translateY: [-20, 24],
  translateX: [-8, 10],
  duration: 6200,
  direction: 'alternate',
  easing: 'easeInOutSine',
  loop: true
});

anime({
  targets: '.blob.b2',
  translateY: [20, -18],
  translateX: [16, -14],
  duration: 6800,
  direction: 'alternate',
  easing: 'easeInOutSine',
  loop: true
});

anime({
  targets: '.blob.b3',
  translateY: [-12, 16],
  translateX: [-14, 9],
  duration: 5600,
  direction: 'alternate',
  easing: 'easeInOutSine',
  loop: true
});

anime({
  targets: '.hero .reveal',
  opacity: [0, 1],
  translateY: [26, 0],
  delay: anime.stagger(120),
  duration: 820,
  easing: 'easeOutExpo'
});

anime({
  targets: '.phone',
  translateY: [18, -14],
  direction: 'alternate',
  duration: 2800,
  loop: true,
  delay: anime.stagger(220),
  easing: 'easeInOutSine'
});

anime({
  targets: timelineDots,
  translateX: [0, 8, 0],
  delay: anime.stagger(180),
  duration: 1800,
  loop: true,
  easing: 'easeInOutSine'
});

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

revealEls.forEach((el) => io.observe(el));

// Scroll-linked effects + phase shift
function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max > 0 ? (y / max) : 0;
  progress.style.width = `${(p * 100).toFixed(2)}%`;

  phones.forEach((el, i) => {
    const driftY = y * (0.025 + i * 0.005);
    const driftX = (i % 2 === 0 ? 1 : -1) * y * (0.008 + i * 0.002);
    const baseRot = [-12, 6, -4][i] || 0;
    el.style.transform = `translate3d(${driftX}px, ${driftY}px, 0) rotate(${baseRot}deg)`;
  });

  const blend = p * 100;
  $('.bg-gradient').style.opacity = `${Math.max(0.35, 1 - blend * 0.007)}`;

  if (warmTrigger) {
    const r = warmTrigger.getBoundingClientRect();
    const triggerPoint = window.innerHeight * 0.68;
    if (r.top < triggerPoint) {
      document.body.classList.add('warm-phase');
    } else {
      document.body.classList.remove('warm-phase');
    }
  }

  requestAnimationFrame(onScroll);
}
requestAnimationFrame(onScroll);
