/* ══════════════════════════════════════════════════════════════
   BIJUKUMAR BRAHMA — PORTFOLIO JS
   Full interactive portfolio script
   ══════════════════════════════════════════════════════════════ */

'use strict';

/* ─── DOM Ready ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initNavbar();
  initParticles();
  initTypedText();
  initCounters();
  initScrollReveal();
  initSkillBars();
  initProjectFilter();
  initContactForm();
  initThemeToggle();
  initBackToTop();
  setFooterYear();
});

/* ══════════════════════════════════════════════════════════════
   LOADER
══════════════════════════════════════════════════════════════ */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';

      // Trigger hero animations after loader
      const heroElements = document.querySelectorAll('.hero .reveal-up');
      heroElements.forEach((el, i) => {
        setTimeout(() => {
          el.classList.add('visible');
        }, i * 150);
      });
    }, 1800);
  });

  document.body.style.overflow = 'hidden';
}

/* ══════════════════════════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════════════════════════ */
function initCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (!dot || !ring) return;

  // Only on desktop
  if (window.innerWidth <= 768) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  // Smooth ring follow with RAF
  function animateRing() {
    const dx = mouseX - ringX;
    const dy = mouseY - ringY;

    ringX += dx * 0.12;
    ringY += dy * 0.12;

    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';

    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Scale on hover
  const hoverables = document.querySelectorAll('a, button, .project-card, .service-card, .story-block');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform = 'translate(-50%,-50%) scale(2)';
      ring.style.transform = 'translate(-50%,-50%) scale(1.5)';
      ring.style.opacity = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.opacity = '0.7';
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!navbar) return;

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
    updateActiveNav();
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // Active section highlighting
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* ══════════════════════════════════════════════════════════════
   PARTICLE CANVAS
══════════════════════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  const PARTICLE_COUNT = window.innerWidth < 768 ? 40 : 80;
  const CONNECTION_DIST = 120;
  const MOUSE = { x: -999, y: -999 };

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.size = Math.random() * 1.5 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulseOffset = Math.random() * Math.PI * 2;
    }

    update(t) {
      this.x += this.vx;
      this.y += this.vy;

      // Pulse opacity
      this.currentOpacity = this.opacity * (0.7 + 0.3 * Math.sin(t * this.pulseSpeed + this.pulseOffset));

      // Mouse repulsion
      const dx = this.x - MOUSE.x;
      const dy = this.y - MOUSE.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        this.x += (dx / dist) * 1.5;
        this.y += (dy / dist) * 1.5;
      }

      // Wrap
      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 200, 255, ${this.currentOpacity})`;
      ctx.fill();
    }
  }

  function init() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 200, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  let t = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t++;

    particles.forEach(p => {
      p.update(t);
      p.draw();
    });

    connect();
    animId = requestAnimationFrame(animate);
  }

  // Mouse tracking
  const hero = document.getElementById('home');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      MOUSE.x = e.clientX - rect.left;
      MOUSE.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', () => {
      MOUSE.x = -999;
      MOUSE.y = -999;
    });
  }

  window.addEventListener('resize', () => {
    resize();
    init();
  });

  resize();
  init();
  animate();
}

/* ══════════════════════════════════════════════════════════════
   TYPED TEXT EFFECT
══════════════════════════════════════════════════════════════ */
function initTypedText() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'Full Stack Developer',
    'Building Scalable Web Apps',
    'React + Node.js Engineer',
    'AI Integration Specialist',
    'Open to Opportunities 🚀',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const current = phrases[phraseIdx];

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 50;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIdx === current.length) {
      isDeleting = true;
      typingSpeed = 1800; // pause before delete
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 400; // pause before next phrase
    }

    setTimeout(type, typingSpeed);
  }

  // Start after loader
  setTimeout(type, 2500);
}

/* ══════════════════════════════════════════════════════════════
   COUNTER ANIMATION
══════════════════════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  let done = false;

  function animateCounters() {
    if (done) return;
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, 16);
    });
    done = true;
  }

  // Trigger on hero visibility
  const heroSection = document.getElementById('home');
  if (!heroSection) return;

  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) animateCounters();
  }, { threshold: 0.5 });

  obs.observe(heroSection);
}

/* ══════════════════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve so elements stay visible
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════════
   SKILL BARS
══════════════════════════════════════════════════════════════ */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  let animated = false;

  const section = document.getElementById('skills');
  if (!section) return;

  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      fills.forEach((fill, i) => {
        const width = fill.getAttribute('data-width');
        setTimeout(() => {
          fill.style.width = width + '%';
        }, i * 80);
      });
    }
  }, { threshold: 0.2 });

  obs.observe(section);
}

/* ══════════════════════════════════════════════════════════════
   PROJECT FILTER
══════════════════════════════════════════════════════════════ */
function initProjectFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';

        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = '';
          // Re-trigger animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = form.querySelector('.form-submit');
  const submitText = document.getElementById('submitText');
  const submitLoading = document.getElementById('submitLoading');
  const formSuccess = document.getElementById('formSuccess');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show loading state
    submitText.style.display = 'none';
    submitLoading.style.display = 'flex';
    submitBtn.disabled = true;

    // Simulate form submission (replace with real API)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Show success
    submitText.style.display = 'flex';
    submitLoading.style.display = 'none';
    submitBtn.disabled = false;
    formSuccess.style.display = 'flex';

    // Reset form
    form.reset();

    // Hide success after 5 seconds
    setTimeout(() => {
      formSuccess.style.display = 'none';
    }, 5000);
  });
}

/* ══════════════════════════════════════════════════════════════
   THEME TOGGLE
══════════════════════════════════════════════════════════════ */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const html = document.documentElement;

  if (!toggle) return;

  // Load saved preference
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateIcon(savedTheme);

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateIcon(next);
  });

  function updateIcon(theme) {
    if (!icon) return;
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

/* ══════════════════════════════════════════════════════════════
   BACK TO TOP
══════════════════════════════════════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════════════════════════════
   FOOTER YEAR
══════════════════════════════════════════════════════════════ */
function setFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ══════════════════════════════════════════════════════════════
   SMOOTH ANCHOR SCROLL
══════════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ══════════════════════════════════════════════════════════════
   TILT EFFECT ON PROJECT CARDS
══════════════════════════════════════════════════════════════ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  });
});

/* ══════════════════════════════════════════════════════════════
   GLOWING CURSOR TRAIL (Subtle)
══════════════════════════════════════════════════════════════ */
if (window.innerWidth > 768) {
  const trail = [];
  const TRAIL_LENGTH = 8;

  for (let i = 0; i < TRAIL_LENGTH; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position:fixed;
      width:${4 - i * 0.3}px;
      height:${4 - i * 0.3}px;
      background:rgba(0,200,255,${0.3 - i * 0.03});
      border-radius:50%;
      pointer-events:none;
      z-index:9996;
      transform:translate(-50%,-50%);
      transition:all ${i * 0.02}s ease;
    `;
    document.body.appendChild(dot);
    trail.push({ el: dot, x: 0, y: 0 });
  }

  let trailMouseX = 0, trailMouseY = 0;
  document.addEventListener('mousemove', (e) => {
    trailMouseX = e.clientX;
    trailMouseY = e.clientY;
  });

  function animateTrail() {
    let x = trailMouseX;
    let y = trailMouseY;

    trail.forEach((dot, i) => {
      const prev = trail[i - 1];
      if (prev) {
        x += (prev.x - x) * 0.4;
        y += (prev.y - y) * 0.4;
      }
      dot.x = x;
      dot.y = y;
      dot.el.style.left = x + 'px';
      dot.el.style.top = y + 'px';
    });

    requestAnimationFrame(animateTrail);
  }
  animateTrail();
}

/* ══════════════════════════════════════════════════════════════
   INTERSECTION OBSERVER FOR NAV HIGHLIGHT
══════════════════════════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

if (sections.length && navLinksAll.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinksAll.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.4,
    rootMargin: '-80px 0px -40px 0px'
  });

  sections.forEach(s => sectionObserver.observe(s));
}