// =================================================================
// Étoiles animées de la page d'accueil
// 1) des points blancs qui filent sur un <canvas>
// 2) des petites étoiles (div .star) qui montent puis disparaissent
// =================================================================

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Le canvas suit la taille de la fenêtre (et se réajuste si on la redimensionne)
function ajusterCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
ajusterCanvas();
window.addEventListener('resize', ajusterCanvas);

const stars = [];
const maxStars = 100;

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Star() {
  this.x = random(0, canvas.width);
  this.y = random(0, canvas.height);
  this.vx = random(-5, 5);
  this.vy = random(-5, 5);
  this.radius = random(1, 3);
}

for (let i = 0; i < maxStars; i++) {
  stars.push(new Star());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    star.x += star.vx;
    star.y += star.vy;

    if (star.x < 0 || star.x > canvas.width || star.y < 0 || star.y > canvas.height) {
      star.x = random(0, canvas.width);
      star.y = random(0, canvas.height);
    }
  }

  requestAnimationFrame(animate);
}

/* ---------------------------------------------------------------- */

// Avant : une étoile était ajoutée toutes les 100 ms sans jamais être
// retirée (600 de plus par minute → la page finissait par ramer).
// Maintenant chaque étoile est supprimée à la fin de son animation,
// et on n'en garde jamais plus de maxPetitesEtoiles en même temps.
const conteneurEtoiles = document.getElementById('stars');
const maxPetitesEtoiles = 150;

function createStar() {
  if (conteneurEtoiles.childElementCount >= maxPetitesEtoiles) return;

  const star = document.createElement('div');
  star.className = 'star';
  star.style.top = Math.random() * window.innerHeight + 'px';
  star.style.left = Math.random() * window.innerWidth + 'px';
  star.style.animationDelay = Math.random() * 2 + 's';
  star.style.animationIterationCount = '1';
  star.addEventListener('animationend', () => star.remove());
  conteneurEtoiles.appendChild(star);
}

// Si la personne a demandé à son système de réduire les animations, on s'abstient
const reduireAnimations = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduireAnimations) {
  animate();
  for (let i = 0; i < 100; i++) {
    createStar();
  }
  setInterval(createStar, 100);
}
