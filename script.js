// Portfolio JavaScript - Modern, clean interactions

(function() {
  'use strict';

  // DOM Elements
  const contactForm = document.querySelector('.contact-form');
  const formStatus = document.querySelector('.form-status');
  const submitBtn = document.querySelector('.btn--submit');

  // Theme Management
  function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');

    // Default to light theme on page load unless user explicitly saved a preference
    const activeTheme = savedTheme || 'light';
    applyTheme(activeTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        localStorage.setItem('theme', nextTheme);
      });
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.querySelector('#theme-toggle i');
    if (themeIcon) {
      if (theme === 'dark') {
        themeIcon.className = 'fa-solid fa-sun';
      } else {
        themeIcon.className = 'fa-solid fa-moon';
      }
    }
  }

  // Mobile Navigation
  function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        const icon = navToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        const icon = navToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    });
  }

  // Intersection Observer for scroll animations
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Initialize reveal elements
  function initRevealAnimations() {
    const animatedElements = document.querySelectorAll(
      '.skill-card, .project-card, .timeline-item, .info-card, .education-card, .contact-item, .stat, .hero-content > *'
    );
    animatedElements.forEach((el, index) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${Math.min(index * 80, 800)}ms`;
      revealObserver.observe(el);
    });
  }

  // Form handling
  async function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Basic validation
    if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
      showFormStatus('Please fill in all fields.', 'error');
      return;
    }

    if (!isValidEmail(data.email)) {
      showFormStatus('Please enter a valid email address.', 'error');
      return;
    }

    // Disable form during submission
    setFormLoading(true);
    showFormStatus('Sending...', 'pending');

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showFormStatus('Failed to send message. Please try again or email me directly.', 'error');
    } finally {
      setFormLoading(false);
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setFormLoading(loading) {
    submitBtn.disabled = loading;
    contactForm.querySelectorAll('input, textarea').forEach(input => {
      input.disabled = loading;
    });
  }

  function showFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.hidden = false;
    formStatus.className = 'form-status';
    if (type) {
      formStatus.classList.add(type);
    }

    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        formStatus.hidden = true;
      }, 5000);
    }
  }

  // Smooth scroll for anchor links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const nav = document.querySelector('.nav');
          const navHeight = nav ? nav.offsetHeight : 72;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update URL without page jump
          history.pushState(null, '', targetId);
        }
      });
    });
  }

  // Active nav link highlighting
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const nav = document.querySelector('.nav');
    const navHeight = nav ? nav.offsetHeight : 72;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const isMatch = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', isMatch);
          });
        }
      });
    }, {
      rootMargin: `-${navHeight}px 0px -50% 0px`,
      threshold: 0.1
    });

    sections.forEach(section => observer.observe(section));
  }

  // Parallax effect for hero image
  function initParallax() {
    const heroImage = document.querySelector('.hero-image');
    const heroGlow = document.querySelector('.hero-image-glow');

    if (!heroImage || !heroGlow) return;

    let ticking = false;

    function updateParallax() {
      const heroSection = document.querySelector('.hero');
      if (!heroSection) return;

      const heroRect = heroSection.getBoundingClientRect();
      const heroHeight = heroRect.height;

      // Only apply parallax when hero is visible
      if (heroRect.bottom > 0 && heroRect.top < window.innerHeight) {
        const progress = Math.max(0, Math.min(1, -heroRect.top / heroHeight));
        const translateY = progress * 50;
        const scale = 1 + progress * 0.1;

        heroImage.style.transform = `translateY(${translateY}px) scale(${scale})`;
        heroGlow.style.transform = `translateY(${translateY * 0.5}px) scale(${scale})`;
      }

      ticking = false;
    }

    function requestParallax() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestParallax, { passive: true });
  }

  // Initialize all functionality
  function init() {
    // Theme toggle initialization
    initTheme();

    // Mobile nav
    initMobileNav();

    // Add reveal classes to elements
    initRevealAnimations();

    // Form submission
    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Smooth scroll
    initSmoothScroll();

    // Active nav highlighting
    initActiveNav();

    // Parallax (disabled if user prefers reduced motion)
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      initParallax();
    }

    // Add loaded class to body for CSS transitions
    document.body.classList.add('loaded');
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
