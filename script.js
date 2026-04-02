const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

const progressBar = $('.scroll-progress');
const revealEls = $$('.reveal');
const parallaxEls = $$('[data-speed]');
const cards = $$('.float-card');
const stage = $('#stickyStage');
const tiltEls = $$('.tilt');

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: '0px 0px -10% 0px' });

revealEls.forEach(el => io.observe(el));

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function animate() {
  const y = window.scrollY;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  const progress = h > 0 ? (y / h) * 100 : 0;
  progressBar.style.setProperty('--progress', `${progress}%`);

  parallaxEls.forEach((el) => {
    const speed = parseFloat(el.dataset.speed || '0.1');
    const offset = y * speed;
    el.style.transform = `translate3d(0, ${offset}px, 0)`;
  });

  if (stage) {
    const rect = stage.getBoundingClientRect();
    const span = window.innerHeight * 1.3;
    const p = clamp((window.innerHeight - rect.top) / span, 0, 1);

    cards.forEach((card, i) => {
      const local = clamp((p - i * 0.18) * 1.7, 0, 1);
      const yShift = 70 - local * 90;
      const z = local * 120;
      const rot = (i % 2 === 0 ? -1 : 1) * (6 - local * 8);
      card.style.opacity = String(0.25 + local * 0.75);
      card.style.transform = `translate3d(0, ${yShift}px, ${z}px) rotateZ(${rot}deg)`;
    });
  }

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// 3D glass tilt interaction
function handleTiltMove(e, el) {
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  const rx = (0.5 - y) * 12;
  const ry = (x - 0.5) * 14;
  el.style.transform += ` rotateX(${rx}deg) rotateY(${ry}deg)`;
}

tiltEls.forEach((el) => {
  el.addEventListener('mousemove', (e) => handleTiltMove(e, el));
  el.addEventListener('mouseleave', () => {
    el.style.transform = el.style.transform.replace(/ rotateX\([^)]*\) rotateY\([^)]*\)/, '');
  });
});