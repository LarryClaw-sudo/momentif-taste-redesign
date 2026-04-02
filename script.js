import * as THREE from 'https://unpkg.com/three@0.163.0/build/three.module.js';

const webgl = document.getElementById('webgl');
const progress = document.getElementById('progress');
const tasteLabel = document.getElementById('tasteLabel');
const reveals = [...document.querySelectorAll('.reveal')];
const sections = [...document.querySelectorAll('.panel')];
const warmTarget = document.getElementById('download');

// ===== THREE SCENE =====
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 7);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
webgl.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0x88aadd, 0.8);
scene.add(ambient);
const keyLight = new THREE.DirectionalLight(0xaee6ff, 1.3);
keyLight.position.set(4, 6, 5);
scene.add(keyLight);
const rim = new THREE.DirectionalLight(0xa086ff, 1.1);
rim.position.set(-5, -3, -2);
scene.add(rim);

// Pencil group (procedural)
const pencil = new THREE.Group();

const woodMat = new THREE.MeshStandardMaterial({ color: 0xd9b28d, metalness: 0.1, roughness: 0.65 });
const bodyMat = new THREE.MeshStandardMaterial({ color: 0x334fdf, metalness: 0.2, roughness: 0.45 });
const ferruleMat = new THREE.MeshStandardMaterial({ color: 0xc6d8ef, metalness: 0.85, roughness: 0.25 });
const eraserMat = new THREE.MeshStandardMaterial({ color: 0xf0899d, metalness: 0.05, roughness: 0.65 });
const graphiteMat = new THREE.MeshStandardMaterial({ color: 0x2d2d35, metalness: 0.2, roughness: 0.7 });

const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 3.1, 9), bodyMat);
body.rotation.z = Math.PI / 2;
pencil.add(body);

const cone = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.52, 9), woodMat);
cone.position.x = -1.8;
cone.rotation.z = -Math.PI / 2;
pencil.add(cone);

const tip = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.2, 8), graphiteMat);
tip.position.x = -2.12;
tip.rotation.z = -Math.PI / 2;
pencil.add(tip);

const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.22, 12), ferruleMat);
ferrule.position.x = 1.66;
ferrule.rotation.z = Math.PI / 2;
pencil.add(ferrule);

const eraser = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.32, 12), eraserMat);
eraser.position.x = 1.93;
eraser.rotation.z = Math.PI / 2;
pencil.add(eraser);

pencil.rotation.z = -0.45;
scene.add(pencil);

// trail line (drawn when taste improves)
const lineMat = new THREE.LineBasicMaterial({ color: 0xff9966, transparent: true, opacity: 0.0 });
const pts = [new THREE.Vector3(-2.2, -1.25, 0), new THREE.Vector3(2.2, -1.05, 0)];
const lineGeom = new THREE.BufferGeometry().setFromPoints(pts);
const line = new THREE.Line(lineGeom, lineMat);
scene.add(line);

const clock = new THREE.Clock();

function render() {
  const t = clock.getElapsedTime();
  pencil.position.y += Math.sin(t * 1.1) * 0.0018;
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();

// ===== Scroll choreography =====
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.16, rootMargin: '0px 0px -12% 0px' });
reveals.forEach((el) => io.observe(el));

function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max > 0 ? y / max : 0;
  progress.style.width = `${(p * 100).toFixed(2)}%`;

  // scene states by page progress
  if (p < 0.34) {
    // Falling, unstable, "no taste"
    const lp = p / 0.34;
    pencil.position.set(-1.1 + lp * 1.3, 1.8 - lp * 3.5, 0);
    pencil.rotation.set(0.15 + lp * 0.5, 0.25 + lp * 0.8, -0.45 + lp * 1.9);
    lineMat.opacity = 0;
    tasteLabel.textContent = 'NO TASTE';
    tasteLabel.classList.remove('good');
  } else if (p < 0.7) {
    // Recovering, curation phase
    const lp = (p - 0.34) / 0.36;
    pencil.position.set(0.2 - lp * 0.5, -1.7 + lp * 1.25, 0.2 * lp);
    pencil.rotation.set(0.65 - lp * 0.35, 1.05 - lp * 0.6, 1.45 - lp * 1.15);
    lineMat.opacity = clamp((lp - 0.2) * 1.5, 0, 0.85);
    tasteLabel.textContent = 'CURATING';
    tasteLabel.classList.remove('good');
  } else {
    // Stable, tasteful
    const lp = (p - 0.7) / 0.3;
    pencil.position.set(-0.28 + lp * 0.35, -0.45 + lp * 0.2, 0.35);
    pencil.rotation.set(0.3 - lp * 0.12, 0.45 - lp * 0.2, 0.3 - lp * 0.16);
    lineMat.opacity = 0.95;
    tasteLabel.textContent = 'TASTE LOCKED';
    tasteLabel.classList.add('good');
  }

  // Warm brand transition near end
  const wr = warmTarget.getBoundingClientRect();
  if (wr.top < window.innerHeight * 0.72) {
    document.body.classList.add('warm');
  } else {
    document.body.classList.remove('warm');
  }

  requestAnimationFrame(onScroll);
}
requestAnimationFrame(onScroll);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});