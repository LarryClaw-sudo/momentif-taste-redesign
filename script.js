const revealEls = [...document.querySelectorAll('.reveal')];

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

revealEls.forEach((el) => io.observe(el));

const phones = [...document.querySelectorAll('.phone')];
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  phones.forEach((phone, i) => {
    const drift = (i % 2 === 0 ? 1 : -1) * (y * (0.012 + i * 0.002));
    const lift = y * (0.018 + i * 0.003);
    phone.style.transform = `translate3d(${drift}px, ${-lift}px, 0) rotate(${[-9,4,-5,8][i]}deg)`;
  });
}, { passive: true });