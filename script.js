/* ============================================================
   JAVASCRIPT - JEFERSON ARQUITETURA
   ============================================================ */

(function () {
  'use strict';

  /* ── Header scroll behaviour ── */
  const header    = document.getElementById('header');
  const logoImg   = document.getElementById('logo-img');
  const navItems  = document.querySelectorAll('.nav-item');
  const sections  = document.querySelectorAll('section[id]');

  function onScroll() {
    const y = window.scrollY;

    /* Scrolled state */
    if (y > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    /* Active nav link */
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (y >= top) current = sec.getAttribute('id');
    });
    navItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile nav toggle ── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  function closeMobileNav() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileNav.classList.toggle('open', isOpen);
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileNavItems.forEach(item => {
    item.addEventListener('click', closeMobileNav);
  });

  /* ── Reveal on scroll (Intersection Observer) ── */
  const revealEls = document.querySelectorAll('.reveal-up');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));

  /* ── Trigger hero reveals immediately ── */
  const heroEls = document.querySelectorAll('.hero .reveal-up');
  setTimeout(() => {
    heroEls.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 160);
    });
  }, 200);

  /* ── Smooth anchor navigation ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Contact form (demo handler) ── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name  = document.getElementById('form-name').value.trim();
      const type  = document.getElementById('form-type').value;
      const msg   = document.getElementById('form-message').value.trim();
      const phone = '5547988552140';

      let text = `Olá, meu nome é ${name || 'visitante'}.`;
      if (type) text += ` Tenho interesse em um projeto de ${type}.`;
      if (msg)  text += ` ${msg}`;

      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  /* ── Subtle parallax on hero ── */
  const heroVideo = document.getElementById('hero-video');
  const heroContent = document.querySelector('.hero-content');

  function heroParallax() {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      if (heroContent) {
        heroContent.style.transform = `translateY(${y * 0.18}px)`;
        heroContent.style.opacity = String(1 - y / (window.innerHeight * 0.75));
      }
    }
  }

  window.addEventListener('scroll', heroParallax, { passive: true });

  /* ── Cursor trail effect (desktop only) ── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const trail = document.createElement('div');
    trail.style.cssText = `
      position:fixed; top:0; left:0; width:6px; height:6px;
      border-radius:50%; background:rgba(28,28,30,0.35);
      pointer-events:none; z-index:9999; transition:transform 0.08s;
      mix-blend-mode: multiply;
    `;
    document.body.appendChild(trail);

    let mx = 0, my = 0, tx = 0, ty = 0;

    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

    (function animTrail() {
      tx += (mx - tx) * 0.12;
      ty += (my - ty) * 0.12;
      trail.style.transform = `translate(${tx - 3}px, ${ty - 3}px)`;
      requestAnimationFrame(animTrail);
    })();
  }

  /* ── Lazy load videos ── */
  const lazyVideos = document.querySelectorAll('video[preload="none"]');
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(video => {
        if (video.isIntersecting) {
          const videoEl = video.target;
          const source = videoEl.querySelector('source[data-src]');
          if (source) {
            source.src = source.getAttribute('data-src');
            videoEl.load();
            videoEl.play().catch(e => console.log('Autoplay prevented', e));
          }
          observer.unobserve(videoEl);
        }
      });
    }, { rootMargin: '0px 0px 800px 0px' });

    lazyVideos.forEach(v => videoObserver.observe(v));
  }

})();
