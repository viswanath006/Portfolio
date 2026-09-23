/* ============================================================
   PORTFOLIO — INTERACTIONS
   Yeleswarapu Kasi Viswanath Sastry
   Preloader · Custom Cursor · Scroll Animations · Mobile Menu
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ==================== PRELOADER ====================
  const preloader = document.getElementById('preloader');
  const preloaderNumber = document.getElementById('preloader-number');
  const preloaderBar = document.getElementById('preloader-bar');
  let progress = 0;

  const preloaderInterval = setInterval(() => {
    progress += Math.random() * 12 + 3;
    if (progress > 100) progress = 100;

    const rounded = Math.floor(progress);
    preloaderNumber.textContent = rounded;
    preloaderBar.style.width = rounded + '%';

    if (progress >= 100) {
      clearInterval(preloaderInterval);
      setTimeout(() => {
        preloader.classList.add('is-done');
        document.body.classList.remove('is-loading');
        // Trigger hero animations after preloader is done
        triggerHeroAnimations();
      }, 400);
    }
  }, 80);


  // ==================== HERO ANIMATIONS ====================
  function triggerHeroAnimations() {
    const heroElements = document.querySelectorAll('.hero [data-animation]');
    heroElements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('is-visible');
      }, 150 + i * 120);
    });
  }


  // ==================== CUSTOM CURSOR ====================
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');
  const cursorLabel = cursor ? cursor.querySelector('.cursor__label') : null;

  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;

  if (cursor && cursorDot && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      // Dot follows instantly
      dotX = e.clientX;
      dotY = e.clientY;
      cursorDot.style.transform = `translate(${dotX - 3}px, ${dotY - 3}px)`;
    });

    // Smooth cursor circle follow
    function animateCursor() {
      const cx = parseFloat(cursor.style.left) || cursorX;
      const cy = parseFloat(cursor.style.top) || cursorY;
      const dx = cursorX - cx;
      const dy = cursorY - cy;

      cursor.style.transform = `translate(${cursorX - 22}px, ${cursorY - 22}px)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states
    const hoverTargets = document.querySelectorAll('a, button, [data-magnetic]');
    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hover');
      });
      target.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hover');
      });
    });

    // Project card cursor label
    const projectCards = document.querySelectorAll('[data-cursor-label]');
    projectCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        cursor.classList.add('is-project');
        cursor.classList.remove('is-hover');
        if (cursorLabel) {
          cursorLabel.textContent = card.getAttribute('data-cursor-label');
        }
      });
      card.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-project');
        if (cursorLabel) {
          cursorLabel.textContent = '';
        }
      });
    });
  }


  // ==================== NAVIGATION ====================
  const nav = document.getElementById('nav');
  let lastScrollY = 0;
  let ticking = false;

  function updateNav() {
    const scrollY = window.scrollY;

    // Show/hide on scroll direction
    if (scrollY > 80) {
      nav.classList.add('is-scrolled');
      if (scrollY > lastScrollY && scrollY > 200) {
        nav.classList.add('is-hidden');
      } else {
        nav.classList.remove('is-hidden');
      }
    } else {
      nav.classList.remove('is-scrolled');
      nav.classList.remove('is-hidden');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  });

  // Active nav link highlighting
  const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');
  const sections = document.querySelectorAll('main > section[id]');

  function updateActiveLink() {
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('is-active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('is-active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);


  // ==================== MOBILE MENU ====================
  const hamburger = document.getElementById('nav-hamburger');
  const menuOverlay = document.getElementById('menu-overlay');
  const menuLinks = document.querySelectorAll('.menu-overlay__link');

  if (hamburger && menuOverlay) {
    hamburger.addEventListener('click', () => {
      const isOpen = menuOverlay.classList.contains('is-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    function openMenu() {
      menuOverlay.classList.add('is-open');
      hamburger.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menuOverlay.classList.remove('is-open');
      hamburger.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }


  // ==================== SCROLL REVEAL ====================
  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger children if applicable
        const children = entry.target.querySelectorAll('.about-card, .stack-group, .featured-card, .project-card, .timeline-item');
        if (children.length > 0) {
          children.forEach((child, i) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            child.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s`;
            setTimeout(() => {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            }, 50);
          });
        }

        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // Non-hero animation elements
  const animatedElements = document.querySelectorAll('[data-animation]:not(.hero [data-animation])');
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animatedElements.forEach(el => animObserver.observe(el));


  // ==================== MAGNETIC HOVER ====================
  const magneticElements = document.querySelectorAll('[data-magnetic]');

  if (window.matchMedia('(hover: hover)').matches) {
    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
        el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => {
          el.style.transition = '';
        }, 400);
      });
    });
  }


  // ==================== SMOOTH SCROLL ====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80; // Account for fixed nav
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});
