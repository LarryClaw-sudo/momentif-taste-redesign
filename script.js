const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

const progress = $('#progress');
const heroWord = $('#heroWord');
const countA = $('#countA');
const countB = $('#countB');
const countC = $('#countC');
const termLines = $('#termLines');
const warmTarget = $('#download');

const words = ['frictionless', 'adaptive', 'focused', 'deadline-safe'];
let wordIndex = 0;
setInterval(() => {
  wordIndex = (wordIndex + 1) % words.length;
  heroWord.style.opacity = '0.2';
  setTimeout(() => {
    heroWord.textContent = words[wordIndex];
    heroWord.style.opacity = '1';
  }, 170);
}, 1800);

function animateCount(el, target, duration = 1400) {
  const start = performance.now();
  const from = 0;
  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.round(from + (target - from) * eased);
    el.textContent = String(val);
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

let countsStarted = false;
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !countsStarted) {
      countsStarted = true;
      animateCount(countA, 0, 600);
      animateCount(countB, 0, 600);
      animateCount(countC, 2, 1200);
    }
  });
}, { threshold: 0.4 });
heroObserver.observe($('#top'));

const lines = [
  '> ingest canvas assignments',
  '> read calendar conflicts',
  '> compute urgency weights',
  '> allocate study blocks',
  '> insert focus timers',
  '> output: executable week plan'
];
let lineIdx = 0;
function typeLoop() {
  if (!termLines) return;
  termLines.innerHTML = '';
  let i = 0;
  const tick = () => {
    if (i <= lineIdx) {
      termLines.innerHTML += `${lines[i]}\n`;
      i++;
      setTimeout(tick, 120);
    } else {
      lineIdx = (lineIdx + 1) % lines.length;
      setTimeout(typeLoop, 900);
    }
  };
  tick();
}
typeLoop();

const revealEls = $$('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
revealEls.forEach((el) => io.observe(el));

function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max > 0 ? y / max : 0;
  progress.style.width = `${(p * 100).toFixed(2)}%`;

  if (warmTarget.getBoundingClientRect().top < window.innerHeight * 0.72) {
    document.body.classList.add('warm');
  } else {
    document.body.classList.remove('warm');
  }

  requestAnimationFrame(onScroll);
}
requestAnimationFrame(onScroll);

// subtle tilt on feature cards
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