const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

const heroWord = $('#hero-word');
const progress = $('#progress');
const term = $('#terminal-lines');

const words = ['frictionless.', 'adaptive.', 'deadline-safe.', 'focused.'];
let w = 0;
setInterval(() => {
  w = (w + 1) % words.length;
  heroWord.style.opacity = '0.25';
  setTimeout(() => {
    heroWord.textContent = words[w];
    heroWord.style.opacity = '1';
  }, 130);
}, 1700);

const targets = [
  { el: $('#s1'), value: 0, duration: 700 },
  { el: $('#s2'), value: 0, duration: 700 },
  { el: $('#s3'), value: 2, duration: 1200 },
];

let countsRun = false;
function animateCount(el, value, duration) {
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * value).toString();
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const heroObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !countsRun) {
      countsRun = true;
      targets.forEach((t) => animateCount(t.el, t.value, t.duration));
    }
  });
}, { threshold: 0.4 });
heroObs.observe($('#top'));

const lines = [
  '> ingest Canvas assignments',
  '> map deadline urgency weights',
  '> fetch calendar availability',
  '> allocate conflict-free blocks',
  '> attach flow timer cadence',
  '> output: executable weekly plan'
];

let idx = 0;
function loopTerm() {
  term.textContent = '';
  let i = 0;
  function write() {
    if (i <= idx) {
      term.textContent += `${lines[i]}\n`;
      i++;
      setTimeout(write, 115);
    } else {
      idx = (idx + 1) % lines.length;
      setTimeout(loopTerm, 900);
    }
  }
  write();
}
loopTerm();

const reveals = $$('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: '0px 0px -10% 0px' });
reveals.forEach((r) => io.observe(r));

function scrollLoop() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max > 0 ? y / max : 0;
  progress.style.width = `${(p * 100).toFixed(2)}%`;
  requestAnimationFrame(scrollLoop);
}
requestAnimationFrame(scrollLoop);

$$('.tilt').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (0.5 - y) * 8;
    const ry = (x - 0.5) * 10;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});