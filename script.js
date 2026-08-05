(() => {
  'use strict';

  const header = document.querySelector('[data-site-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  const setHeaderState = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      mobileMenu.classList.toggle('is-open', !isOpen);
      document.body.classList.toggle('menu-open', !isOpen);
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuButton.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      });
    });

    const closeMobileMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    };

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMobileMenu();
        menuButton.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (!mobileMenu.classList.contains('is-open')) return;
      if (mobileMenu.contains(event.target) || menuButton.contains(event.target)) return;
      closeMobileMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        menuButton.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', targetId);
    });
  });

  const detailSections = [...document.querySelectorAll('[data-detail-section]')];
  const detailLinks = [...document.querySelectorAll('[data-detail-link]')];
  if (detailSections.length && detailLinks.length && 'IntersectionObserver' in window) {
    const detailObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      detailLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`);
      });
    }, { rootMargin: '-20% 0px -65% 0px', threshold: [0.05, 0.2, 0.5] });
    detailSections.forEach((section) => detailObserver.observe(section));
  }

  const reviewTrack = document.querySelector('[data-review-track]');
  const reviewPrev = document.querySelector('[data-review-prev]');
  const reviewNext = document.querySelector('[data-review-next]');
  const scrollReviews = (direction) => {
    if (!reviewTrack) return;
    const card = reviewTrack.querySelector('.review-card');
    const distance = card ? card.getBoundingClientRect().width + 16 : reviewTrack.clientWidth * 0.8;
    reviewTrack.scrollBy({ left: direction * distance, behavior: 'smooth' });
  };
  reviewPrev?.addEventListener('click', () => scrollReviews(-1));
  reviewNext?.addEventListener('click', () => scrollReviews(1));

  const revealCandidates = document.querySelectorAll(
    '.section-heading, .service-summary-card, .technology-card-home, .review-card, .detail-content-section, .philosophy-grid article'
  );
  revealCandidates.forEach((element) => element.classList.add('reveal-on-scroll'));
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealCandidates.forEach((element) => revealObserver.observe(element));
  } else {
    revealCandidates.forEach((element) => element.classList.add('is-visible'));
  }

  const demoForm = document.querySelector('[data-demo-form]');
  if (demoForm) {
    const status = demoForm.querySelector('[data-form-status]');
    demoForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!demoForm.checkValidity()) {
        demoForm.reportValidity();
        if (status) status.textContent = 'Please complete the required fields.';
        return;
      }
      if (status) {
        status.textContent = 'Demo only: connect a Google Apps Script or WordPress form integration before launch.';
      }
    });
  }

  const dateInput = document.querySelector('input[type="date"]');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
})();
