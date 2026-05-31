/* ============================================================
   NieR Portfolio — Script
   ============================================================ */

(function () {
  'use strict';

  // ── Loading Screen ────────────────────────────────────────
  const loadingMessages = [
    '> Initializing system modules...',
    '> Loading portfolio data... OK',
    '> Verifying credentials...',
    '> Connecting to remote servers...',
    '> Checking data integrity... PASSED',
    '> Syncing project archives...',
    '> Configuring display parameters...',
    '> Loading skills database...',
    '> Establishing secure connection...',
    '> Compiling experience records...',
    '> Finalizing system check...',
    '> All systems operational.',
    '> Welcome, operator.',
  ];

  const logsContainer = document.getElementById('loading-logs');
  const loadingScreen = document.getElementById('loading-screen');
  const loadingBar = document.getElementById('loading-bar-fill');
  const mainContent = document.getElementById('main-content');

  let currentMsg = 0;
  const totalMessages = loadingMessages.length;

  function typeNextMessage() {
    if (currentMsg >= totalMessages) {
      // All messages typed — finish loading
      setTimeout(finishLoading, 600);
      return;
    }

    const line = document.createElement('div');
    line.className = 'log-line';
    line.textContent = loadingMessages[currentMsg];
    logsContainer.appendChild(line);

    // Scroll logs to bottom
    logsContainer.scrollTop = logsContainer.scrollHeight;

    // Update progress bar
    const progress = ((currentMsg + 1) / totalMessages) * 100;
    loadingBar.style.width = progress + '%';

    currentMsg++;

    // Random delay between messages for realism
    const delay = 80 + Math.random() * 150;
    setTimeout(typeNextMessage, delay);
  }

  function finishLoading() {
    loadingScreen.classList.add('fade-out');
    mainContent.classList.add('visible');
    document.body.style.overflow = '';

    // Remove loading screen from DOM after transition
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 900);
  }

  // Start loading sequence
  if (loadingScreen && logsContainer) {
    document.body.style.overflow = 'hidden';
    setTimeout(typeNextMessage, 500);
  } else {
    // Fallback if elements not found
    if (mainContent) mainContent.classList.add('visible');
  }


  // ── Navigation ────────────────────────────────────────────
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // ── Theme Toggle (Light / Dark Mode) ──────────────────────
  const themeToggle = document.getElementById('theme-toggle');
  const iconSun = document.getElementById('icon-sun');
  const iconMoon = document.getElementById('icon-moon');
  
  if (themeToggle) {
    // Check saved theme
    const savedTheme = localStorage.getItem('nier-theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
      if (iconSun && iconMoon) {
        iconSun.style.display = 'none';
        iconMoon.style.display = 'block';
      }
    }

    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      
      if (isLight) {
        localStorage.setItem('nier-theme', 'light');
        if (iconSun && iconMoon) {
          iconSun.style.display = 'none';
          iconMoon.style.display = 'block';
        }
      } else {
        localStorage.setItem('nier-theme', 'dark');
        if (iconSun && iconMoon) {
          iconSun.style.display = 'block';
          iconMoon.style.display = 'none';
        }
      }
    });
  }


  // ── Active Nav on Scroll ──────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav__link');

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;

    let currentSection = '';
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.clientHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === '#' + currentSection) {
        item.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();


  // ── Smooth Scroll ─────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ── Scroll Reveal (IntersectionObserver) ──────────────────
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback for old browsers
    revealElements.forEach(el => el.classList.add('revealed'));
  }


  // ── Contact Form (Formspree) ──────────────────────────────
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('.form-submit .nier-btn');
      const originalText = submitBtn ? submitBtn.querySelector('span:last-child') : null;
      const originalContent = originalText ? originalText.textContent : '';

      // Show sending state
      if (originalText) originalText.textContent = 'SENDING...';
      if (submitBtn) submitBtn.style.pointerEvents = 'none';

      try {
        const formData = new FormData(contactForm);

        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Success
          if (formStatus) {
            formStatus.textContent = '> Message transmitted successfully. Awaiting response.';
            formStatus.className = 'form-status success';
          }
          contactForm.reset();
        } else {
          throw new Error('Server error');
        }
      } catch (err) {
        if (formStatus) {
          formStatus.textContent = '> Transmission failed. Please use direct email contact.';
          formStatus.className = 'form-status error';
        }
      }

      // Restore button
      if (originalText) originalText.textContent = originalContent;
      if (submitBtn) submitBtn.style.pointerEvents = '';

      // Hide status after 5s
      setTimeout(() => {
        if (formStatus) formStatus.className = 'form-status';
      }, 5000);
    });
  }

})();
