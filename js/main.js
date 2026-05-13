/* ========================================
   MAIN.JS — Portfolio Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initBackToTop();
  initSkillBars();
  initContactForm();
  initCountUp();
  initMarqueeDotExtension();
});

/* --- Navbar --- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Hamburger toggle
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });
    // Close mobile nav on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

/* --- Scroll Reveal (IntersectionObserver) --- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');

  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Don't unobserve stagger-children so we can re-trigger if needed
        if (!entry.target.classList.contains('stagger-children')) {
          // Keep observing to allow re-reveal is optional; we unobserve for perf
        }
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --- Back to Top --- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --- Skill Bars Animation --- */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pct = entry.target.getAttribute('data-width');
        entry.target.style.width = pct;
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  fills.forEach(el => observer.observe(el));
}

/* --- Count-Up Animation --- */
function initCountUp() {
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        animateCount(el, 0, target, 1800, prefix, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

function animateCount(el, start, end, duration, prefix, suffix) {
  let startTime = null;
  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.floor(eased * (end - start) + start);
    el.textContent = prefix + current + suffix;
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

/* --- Contact Form --- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Reset errors
    form.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));

    // Validate
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const subject = form.querySelector('#subject');
    const message = form.querySelector('#message');

    if (!name.value.trim()) {
      name.closest('.form-group').classList.add('has-error');
      valid = false;
    }
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.closest('.form-group').classList.add('has-error');
      valid = false;
    }
    if (!subject.value.trim()) {
      subject.closest('.form-group').classList.add('has-error');
      valid = false;
    }
    if (!message.value.trim()) {
      message.closest('.form-group').classList.add('has-error');
      valid = false;
    }

    if (valid) {
      const submitBtn = form.querySelector('.submit-btn');
      submitBtn.innerHTML = 'Sending...';
      submitBtn.disabled = true;

      // Submit the form natively
      form.submit();
    }
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.querySelector('.toast-message').textContent = message;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 4000);
}

/* --- Smooth page transitions (for internal links) --- */
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto:')) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const overlay = document.querySelector('.page-transition-overlay');
      if (overlay) {
        document.body.classList.add('page-entering');
        // Faster transition - match animation duration (300ms)
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      } else {
        // Fallback if overlay doesn't exist
        window.location.href = href;
      }
    });
  }
});

// On page load — fade out overlay immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-leaving');
    setTimeout(() => {
      document.body.classList.remove('page-leaving', 'page-entering');
    }, 250);
  });
} else {
  // Page already loaded
  document.body.classList.add('page-leaving');
  setTimeout(() => {
    document.body.classList.remove('page-leaving', 'page-entering');
  }, 250);
}

/* --- Magnetic button effect --- */
document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* --- Parallax on hero glow --- */
window.addEventListener('mousemove', (e) => {
  const glow = document.querySelector('.hero-glow');
  if (!glow) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 40;
  const y = (e.clientY / window.innerHeight - 0.5) * 40;
  glow.style.transform = `translate(${x}px, ${y}px)`;
});

