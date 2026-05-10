/* ============================================================
   scripts.js — Noé Huerta Macías Web-CV
   p5.js creative sketch + scroll interactions + animations
   ============================================================ */

/* ============================
   P5.JS SKETCH (instance mode)
   ============================ */
const sketch = (p) => {
  // Controls state
  const ctrl = {
    bg: true,
    centerSize: 80,
    sphereSize: 18,
    rotation: 40,
    offsetX: 0,
    count: 9,
  };

  // Internal state
  let angle = 0;
  let noiseOffset = 0;
  let particles = [];
  let W, H;

  // Palette
  const C = {
    bg:     [13,  13,  13],
    accent: [200, 169, 110],
    soft:   [245, 242, 236],
    mid:    [107, 104, 96],
  };

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = p.random(p.width);
      this.y  = p.random(p.height);
      this.sz = p.random(1, 3);
      this.a  = p.random(30, 90);
      this.sp = p.random(0.1, 0.5);
      this.drift = p.random(-0.2, 0.2);
    }
    update() {
      this.y -= this.sp;
      this.x += this.drift;
      this.a -= 0.15;
      if (this.a <= 0 || this.y < -10) this.reset();
    }
    draw() {
      p.noStroke();
      p.fill(C.accent[0], C.accent[1], C.accent[2], this.a * 0.4);
      p.ellipse(this.x, this.y, this.sz, this.sz * 0.5);
    }
  }

  p.setup = () => {
    const container = document.getElementById('p5-canvas-container');
    W = container.offsetWidth;
    H = container.offsetHeight;
    const cnv = p.createCanvas(W, H);
    cnv.parent('p5-canvas-container');
    p.colorMode(p.RGB, 255);

    for (let i = 0; i < 60; i++) particles.push(new Particle());
    readControls();
  };

  p.draw = () => {
    // Background
    if (ctrl.bg) {
      p.background(C.bg[0], C.bg[1], C.bg[2], 28);
    } else {
      p.clear();
      p.background(C.bg[0], C.bg[1], C.bg[2], 0);
    }

    // Particles
    particles.forEach(pt => { pt.update(); pt.draw(); });

    const cx = p.width  * 0.5 + ctrl.offsetX;
    const cy = p.height * 0.5;

    // Outer orbit rings
    p.noFill();
    for (let r = 0; r < 3; r++) {
      const radius = ctrl.centerSize * (1.8 + r * 0.8);
      p.stroke(C.accent[0], C.accent[1], C.accent[2], 18 - r * 4);
      p.strokeWeight(0.5);
      p.ellipse(cx, cy, radius * 2, radius * 0.6);
    }

    // Orbiting spheres
    const n    = ctrl.count;
    const rot  = (ctrl.rotation / 100) * 0.025;
    const orbitR = ctrl.centerSize * 2.4;
    const sz   = ctrl.sphereSize;

    for (let i = 0; i < n; i++) {
      const θ     = (p.TWO_PI / n) * i + angle;
      const x     = cx + p.cos(θ) * orbitR;
      const y     = cy + p.sin(θ) * orbitR * 0.36;
      const depth = p.map(p.sin(θ), -1, 1, 0.3, 1);
      const pulse = 1 + 0.12 * p.sin(angle * 3 + i * 0.9);
      const drawSz = sz * depth * pulse;

      // Shadow
      p.noStroke();
      p.fill(0, 0, 0, 40 * depth);
      p.ellipse(x + 4, y + 4, drawSz * 1.1, drawSz * 0.5);

      // Sphere gradient simulation: outer glow
      const glow = sz * depth * 2.4;
      p.fill(C.accent[0], C.accent[1], C.accent[2], 12 * depth);
      p.ellipse(x, y, glow, glow);

      // Body
      p.fill(C.accent[0], C.accent[1], C.accent[2], 200 * depth);
      p.ellipse(x, y, drawSz, drawSz);

      // Specular highlight
      p.fill(C.soft[0], C.soft[1], C.soft[2], 80 * depth);
      p.ellipse(x - drawSz * 0.18, y - drawSz * 0.2, drawSz * 0.3, drawSz * 0.2);
    }

    // Center sphere
    const cs     = ctrl.centerSize;
    const cPulse = 1 + 0.04 * p.sin(angle * 1.5);

    // Glow layers
    for (let g = 4; g > 0; g--) {
      p.noStroke();
      p.fill(C.accent[0], C.accent[1], C.accent[2], 6 * g);
      p.ellipse(cx, cy, cs * cPulse * (1 + g * 0.25), cs * cPulse * (1 + g * 0.25));
    }

    // Center body
    const noiseMod = p.noise(noiseOffset) * 0.08;
    p.fill(C.accent[0], C.accent[1], C.accent[2], 230);
    p.ellipse(cx, cy, cs * cPulse * (1 + noiseMod), cs * cPulse * (1 + noiseMod));

    // Center highlight
    p.fill(C.soft[0], C.soft[1], C.soft[2], 120);
    p.ellipse(cx - cs * 0.2, cy - cs * 0.22, cs * 0.32, cs * 0.22);

    // Subtle connection lines to spheres
    p.strokeWeight(0.4);
    for (let i = 0; i < n; i++) {
      const θ = (p.TWO_PI / n) * i + angle;
      const x = cx + p.cos(θ) * orbitR;
      const y = cy + p.sin(θ) * orbitR * 0.36;
      const depth = p.map(p.sin(θ), -1, 1, 0.1, 0.5);
      p.stroke(C.accent[0], C.accent[1], C.accent[2], 15 * depth);
      p.line(cx, cy, x, y);
    }

    angle      += rot;
    noiseOffset += 0.005;
  };

  p.windowResized = () => {
    const container = document.getElementById('p5-canvas-container');
    p.resizeCanvas(container.offsetWidth, container.offsetHeight);
  };

  function readControls() {
    ctrl.bg         = document.getElementById('ctrl-bg').checked;
    ctrl.centerSize = +document.getElementById('ctrl-center').value;
    ctrl.sphereSize = +document.getElementById('ctrl-size').value;
    ctrl.rotation   = +document.getElementById('ctrl-rot').value;
    ctrl.offsetX    = +document.getElementById('ctrl-x').value;
    ctrl.count      = +document.getElementById('ctrl-count').value;
  }

  // Wire controls
  document.querySelectorAll('#sketch-controls input').forEach(el => {
    el.addEventListener('input', readControls);
    el.addEventListener('change', readControls);
  });
};

new p5(sketch);

/* ============================
   NAV SCROLL EFFECT
   ============================ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ============================
   COUNTER ANIMATION (metrics band)
   ============================ */
function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1800;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out expo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ============================
   INTERSECTION OBSERVER
   ============================ */
const observerOpts = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };

// Generic reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOpts);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Timeline items staggered
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = +entry.target.dataset.index || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 120);
      timelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.timeline-item').forEach(el => timelineObserver.observe(el));

// Freelance items staggered
const flObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = Array.from(document.querySelectorAll('.fl-item')).indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 100);
      flObserver.unobserve(entry.target);
    }
  });
}, observerOpts);

document.querySelectorAll('.fl-item').forEach(el => flObserver.observe(el));

// Metrics counter trigger
const metricObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.metric-num[data-target]').forEach(el => {
        animateCounter(el);
      });
      metricObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const metricsBand = document.querySelector('.metrics-band');
if (metricsBand) metricObserver.observe(metricsBand);

// Language bars animation
const langObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.lang-fill').forEach(fill => {
        const target = fill.style.width;
        fill.style.width = '0';
        requestAnimationFrame(() => {
          setTimeout(() => { fill.style.width = target; }, 80);
        });
      });
      langObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const langBlock = document.querySelector('.lang-block');
if (langBlock) langObserver.observe(langBlock);

// Edu cards staggered reveal
const eduObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.edu-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${i * 100}ms, transform 0.6s ease ${i * 100}ms`;
        requestAnimationFrame(() => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        });
      });
      eduObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

const eduGrid = document.querySelector('.edu-grid');
if (eduGrid) eduObserver.observe(eduGrid);

// Stack pills reveal
const stackObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stack-pills span').forEach((pill, i) => {
        pill.style.opacity = '0';
        pill.style.transform = 'scale(0.9)';
        pill.style.transition = `opacity 0.4s ease ${i * 40}ms, transform 0.4s ease ${i * 40}ms`;
        setTimeout(() => {
          pill.style.opacity = '1';
          pill.style.transform = 'scale(1)';
        }, 60 + i * 40);
      });
      stackObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.stack-category').forEach(el => stackObserver.observe(el));

/* ============================
   ACTIVE NAV LINK (scroll spy)
   ============================ */
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => spyObserver.observe(sec));

// Add active style dynamically
const style = document.createElement('style');
style.textContent = `
  .nav-links a.active:not(.nav-cta) {
    color: var(--accent) !important;
  }
`;
document.head.appendChild(style);

/* ============================
   SMOOTH ANCHOR CLICKS
   ============================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================
   SECTION TITLE REVEAL
   ============================ */
document.querySelectorAll('.section-title, .contact-title').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)';

  const titleObs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      titleObs.unobserve(el);
    }
  }, { threshold: 0.2 });

  titleObs.observe(el);
});

/* ============================
   CURSOR GLOW (subtle, desktop only)
   ============================ */
if (window.matchMedia('(hover: hover)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(200,169,110,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.4s;
    opacity: 0;
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    glow.style.opacity = '1';
    glow.style.left = mx + 'px';
    glow.style.top  = my + 'px';
  });

  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
}

/* ============================
   ABOUT SECTION REVEAL
   ============================ */
['.lead', '.section-content > p', '.about-strengths'].forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.7s ease ${i * 120}ms, transform 0.7s ease ${i * 120}ms`;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        obs.unobserve(el);
      }
    }, { threshold: 0.1 });

    obs.observe(el);
  });
});
