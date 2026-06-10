'use strict';

// ============================================================
// SaaS LP — main.js
// ============================================================

(function () {

  // ----------------------------------------------------------
  // Header: scroll class & mobile menu
  // ----------------------------------------------------------
  const header = document.getElementById('site-header');
  const menuBtn = header.querySelector('.header__menu-btn');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  }, { passive: true });

  const closeMenu = () => {
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'メニューを開く');
    navMenu.classList.remove('is-open');
    header.classList.remove('is-menu-open');
    document.body.style.overflow = '';
  };

  menuBtn.addEventListener('click', () => {
    const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.setAttribute('aria-label', 'メニューを閉じる');
      navMenu.classList.add('is-open');
      header.classList.add('is-menu-open');
      document.body.style.overflow = 'hidden';
    }
  });

  navMenu.querySelectorAll('.header__nav-link, .btn').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuBtn.focus();
    }
  });

  // ----------------------------------------------------------
  // Scroll Fade-in
  // ----------------------------------------------------------
  const fadeTargets = document.querySelectorAll('.js-fade-in');

  if (fadeTargets.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const parent = entry.target.parentElement;
          const siblings = parent.querySelectorAll('.js-fade-in:not(.is-visible)');
          let idx = 0;
          siblings.forEach((el, i) => { if (el === entry.target) idx = i; });

          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, idx * 80);

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );

    fadeTargets.forEach(el => observer.observe(el));
  }

  // ----------------------------------------------------------
  // FAQ Accordion
  // ----------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    if (!question || !answer) return;

    answer.addEventListener('transitionend', () => {
      if (question.getAttribute('aria-expanded') === 'true') {
        answer.style.height = 'auto';
      }
    });

    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';

      // Close all others
      faqItems.forEach(other => {
        const otherQ = other.querySelector('.faq__question');
        const otherA = other.querySelector('.faq__answer');
        if (otherQ !== question && otherQ.getAttribute('aria-expanded') === 'true') {
          otherQ.setAttribute('aria-expanded', 'false');
          otherA.style.height = otherA.scrollHeight + 'px';
          requestAnimationFrame(() => requestAnimationFrame(() => { otherA.style.height = '0'; }));
          otherA.addEventListener('transitionend', () => otherA.setAttribute('hidden', ''), { once: true });
        }
      });

      if (isExpanded) {
        question.setAttribute('aria-expanded', 'false');
        answer.style.height = answer.scrollHeight + 'px';
        requestAnimationFrame(() => requestAnimationFrame(() => { answer.style.height = '0'; }));
        answer.addEventListener('transitionend', () => answer.setAttribute('hidden', ''), { once: true });
      } else {
        answer.removeAttribute('hidden');
        answer.style.height = '0';
        requestAnimationFrame(() => requestAnimationFrame(() => {
          answer.style.height = answer.scrollHeight + 'px';
        }));
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ----------------------------------------------------------
  // Pricing Toggle (monthly / annual)
  // ----------------------------------------------------------
  const toggleBtns = document.querySelectorAll('.price__toggle-btn');
  const priceAmounts = document.querySelectorAll('.price__card-amount');

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const billing = btn.dataset.billing;

      toggleBtns.forEach(b => {
        b.classList.remove('price__toggle-btn--active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('price__toggle-btn--active');
      btn.setAttribute('aria-pressed', 'true');

      priceAmounts.forEach(amount => {
        const value = amount.dataset[billing];
        if (value) {
          if (billing === 'annual') {
            const parts = value.split('/');
            amount.innerHTML = parts[0] + '<small>/' + (parts[1] || '年') + '</small>';
          } else {
            const monthly = amount.dataset.monthly;
            if (monthly && monthly.includes('/')) {
              const parts = monthly.split('/');
              amount.innerHTML = parts[0] + '<small>/' + parts[1] + '</small>';
            } else {
              amount.textContent = monthly || value;
            }
          }
        }
      });
    });
  });

  // ----------------------------------------------------------
  // Smooth scroll
  // ----------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerH = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
