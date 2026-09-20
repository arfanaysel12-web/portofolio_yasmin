/* ============================================================
   [Nama Siswi] — Portfolio Scripts
   Hamburger menu · Smooth scroll · Scroll reveal
   Dark mode · Back to top · Progress bars · Contact form
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  const $ = (selector, ctx = document) => ctx.querySelector(selector);
  const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));

  /* ============================================================
     Navbar: sticky style + active link on scroll
     ============================================================ */
  const navbar = $('#navbar');
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 30);

    const position = window.scrollY + 140;
    let currentId = '';

    sections.forEach((section) => {
      if (position >= section.offsetTop) {
        currentId = section.getAttribute('id');
      }
    });

    /* Fallback for the very top → highlight Home */
    if (window.scrollY < 40) currentId = 'home';

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });

    updateBackToTop();
  }

  /* ============================================================
     Mobile hamburger menu
     ============================================================ */
  const hamburger = $('#hamburger');
  const navMenu = $('#nav-menu');

  function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* Close menu when clicking a link inside it */
  $$('.nav-link', navMenu).forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  /* Close menu on outside click / Escape */
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ============================================================
     Back to top
     ============================================================ */
  const backToTop = $('#back-to-top');

  function updateBackToTop() {
    backToTop.classList.toggle('show', window.scrollY > 600);
  }

  /* ============================================================
     Scroll reveal (IntersectionObserver)
     ============================================================ */
  const revealEls = $$('.reveal');

  const io = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          /* Animate progress bars inside revealed skill cards */
          $$('.progress-bar', entry.target).forEach(animateProgressBar);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => io.observe(el));

  /* Stagger reveal inside grids for nicer entrance */
  $$('.skills-grid .reveal, .projects-grid .reveal, .achievements-grid .reveal, .exp-grid .reveal, .timeline .reveal')
    .forEach((el, index) => {
      el.style.transitionDelay = `${(index % 3) * 90}ms`;
    });

  /* Fallback: if IntersectionObserver is unavailable, show everything */
  if (typeof IntersectionObserver === 'undefined') {
    revealEls.forEach((el) => el.classList.add('visible'));
    $$('.progress-bar').forEach(animateProgressBar);
  }

  /* ============================================================
     Progress bars
     ============================================================ */
  function animateProgressBar(bar) {
    const level = bar.getAttribute('data-level');
    if (level) bar.style.width = `${level}%`;
  }

  /* ============================================================
     Dark mode toggle
     ============================================================ */
  const themeToggle = $('#theme-toggle');
  const storedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  function setTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
  }

  /* Apply initial theme on load (before paint) */
  if (storedTheme) {
    setTheme(storedTheme);
  } else {
    setTheme(systemDark ? 'dark' : 'light');
  }

  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });

  /* ============================================================
     Contact form (demo)
     ============================================================ */
  const form = $('#contact-form');
  const formStatus = $('#form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = $('#name');
    const email = $('#email');
    const message = $('#message');
    let valid = true;

    /* Reset errors */
    [name, email, message].forEach((field) => field.classList.remove('error'));

    if (!name.value.trim()) { markError(name); valid = false; }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) { markError(email); valid = false; }

    if (!message.value.trim()) { markError(message); valid = false; }

    if (!valid) {
      formStatus.textContent = 'Mohon lengkapi data dengan benar.';
      formStatus.className = 'form-status error';
      return;
    }

    formStatus.textContent = 'Terima kasih! Pesan kamu sudah terkirim.';
    formStatus.className = 'form-status success';
    form.reset();

    setTimeout(() => {
      formStatus.textContent = '';
      formStatus.className = 'form-status';
    }, 5000);
  });

  function markError(field) {
    field.classList.add('error');
  }

  /* Live-clear error state while typing */
  $$('#contact-form input, #contact-form textarea').forEach((field) => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });

  /* ============================================================
     Footer year
     ============================================================ */
  $('#year').textContent = new Date().getFullYear();

  /* Handler for placeholder links so they don't jump to top */
  window.preventLink = function (e) {
    e.preventDefault();
  };

  /* ============================================================
     Scroll handler
     ============================================================ */
  window.addEventListener('scroll', updateNavbar, { passive: true });
  window.addEventListener('resize', closeMenu, { passive: true });
  updateNavbar();
})();