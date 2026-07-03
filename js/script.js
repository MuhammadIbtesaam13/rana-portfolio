document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Nav scroll state + progress bar ---------- */
const nav = document.getElementById('nav');
const progressBar = document.getElementById('progressBar');

/* ---------- Active nav link on scroll ---------- */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');
function updateActiveNav() {
  let current = sections[0]?.id;
  const offset = 120;
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - offset) current = sec.id;
  });
  navItems.forEach(item => {
    item.classList.toggle('active', item.getAttribute('href') === '#' + current);
  });
}

function onScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 20);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';

  updateActiveNav();
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Mobile nav ---------- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ---------- Typing effect (hero role line) ---------- */
const roles = [
  'DevOps Engineer',
  'Cloud Infrastructure Enthusiast',
  'CI/CD Automation Specialist',
  'Aspiring SRE'
];
const typedEl = document.getElementById('typed');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 40 : 80);
}
typeLoop();

/* ---------- Terminal typing animation ---------- */
const terminalLines = [
  { prompt: '$ whoami', out: 'rana-ibtesaam' },
  { prompt: '$ cat role.txt', out: 'Junior DevOps Engineer' },
  { prompt: '$ docker ps --status=running', out: '3 containers healthy ✓' },
  { prompt: '$ kubectl get pods', out: 'All pods Running ✓' },
  { prompt: '$ terraform apply', out: 'Apply complete! 12 resources added.' },
  { prompt: '$ echo $STATUS', out: 'Ready to deploy 🚀' },
];
const terminalBody = document.getElementById('terminalBody');

async function typeText(el, text, speed = 22) {
  for (let i = 0; i <= text.length; i++) {
    el.textContent = text.slice(0, i);
    await new Promise(r => setTimeout(r, speed));
  }
}

async function runTerminal() {
  while (true) {
    terminalBody.innerHTML = '';
    for (const line of terminalLines) {
      const promptEl = document.createElement('div');
      promptEl.className = 'prompt';
      terminalBody.appendChild(promptEl);
      await typeText(promptEl, line.prompt);
      await new Promise(r => setTimeout(r, 200));

      const outEl = document.createElement('div');
      outEl.className = 'out';
      terminalBody.appendChild(outEl);
      await typeText(outEl, line.out, 12);
      await new Promise(r => setTimeout(r, 500));
    }
    await new Promise(r => setTimeout(r, 2200));
  }
}
runTerminal();

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

/* ---------- Animated counters ---------- */
const statEls = document.querySelectorAll('.stat-num');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
statEls.forEach(el => statObserver.observe(el));

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();
  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ---------- Skill bar fill on scroll ---------- */
const skillCards = document.querySelectorAll('.skill-card');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar span').forEach(span => {
        span.style.width = span.dataset.target;
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
skillCards.forEach(card => {
  card.querySelectorAll('.bar span').forEach(span => {
    span.dataset.target = span.style.width;
    span.style.width = '0%';
  });
  skillObserver.observe(card);
});

/* ---------- Contact form (Netlify AJAX submit) ---------- */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

function encodeForm(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(contactForm);
  const payload = {};
  formData.forEach((value, key) => { payload[key] = value; });

  formStatus.textContent = 'Sending...';
  formStatus.className = 'form-status';

  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encodeForm(payload),
  })
    .then(() => {
      formStatus.textContent = "Thanks! Your message has been sent — I'll get back to you soon.";
      formStatus.className = 'form-status success';
      contactForm.reset();
    })
    .catch(() => {
      formStatus.textContent = 'Something went wrong. Please email me directly instead.';
      formStatus.className = 'form-status error';
    });
});

/* ---------- Particle background ---------- */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const PARTICLE_COUNT = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 18000));

function initParticles() {
  particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.6 + 0.6,
  }));
}
initParticles();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function drawParticles() {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(34, 211, 238, 0.6)';

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i], b = particles[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        ctx.strokeStyle = `rgba(167, 139, 250, ${0.15 * (1 - dist / 140)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  if (!reducedMotion) requestAnimationFrame(drawParticles);
}
drawParticles();
