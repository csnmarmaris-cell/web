/* ─────────────────────────────────────────────────────────────
   CSN Real Estate — main.js
   Header scroll · mobile drawer · reveal · form validation
   ───────────────────────────────────────────────────────── */

(function () {
  'use strict';

  // ── Header scroll state ───────────────────────────────────
  const header = document.getElementById('siteHeader');
  function onScroll() {
    if (window.scrollY > 80) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Mobile drawer ─────────────────────────────────────────
  const drawer = document.getElementById('mobileDrawer');
  const menuBtn = document.getElementById('menuBtn');
  const drawerClose = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    drawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  menuBtn?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawerLinks.forEach(a => a.addEventListener('click', closeDrawer));

  // ── Reveal on scroll ──────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // ── Language toggle (TR/EN) — EN content will follow later ─
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      langBtns.forEach(b => b.classList.toggle('is-active', b.dataset.lang === lang));
      document.documentElement.lang = lang;
      if (lang === 'en') {
        // Stub for now — to be wired with full EN strings.
        // Briefly notify the user.
        showToast('English version is coming soon. Currently TR only.');
      }
    });
  });

  function showToast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    Object.assign(t.style, {
      position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
      background: 'rgba(28,24,21,0.92)', color: '#faf7f2',
      padding: '14px 22px', fontSize: '13px', letterSpacing: '0.04em',
      fontFamily: 'Manrope, sans-serif', zIndex: 9999,
      backdropFilter: 'blur(10px)',
      opacity: 0, transition: 'opacity 240ms ease, transform 240ms ease',
    });
    document.body.appendChild(t);
    requestAnimationFrame(() => { t.style.opacity = 1; });
    setTimeout(() => {
      t.style.opacity = 0;
      setTimeout(() => t.remove(), 280);
    }, 3000);
  }

  // ── Contact form validation ───────────────────────────────
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  function setErr(fieldEl, msg) {
    const wrap = fieldEl.closest('.form-field');
    if (!wrap) return;
    wrap.classList.toggle('is-error', !!msg);
    const errEl = wrap.querySelector('.err');
    if (errEl) errEl.textContent = msg || '';
  }

  function validate() {
    let ok = true;
    const name = form.querySelector('#f-name');
    const email = form.querySelector('#f-email');
    const phone = form.querySelector('#f-phone');
    const message = form.querySelector('#f-message');
    const consent = form.querySelector('#f-consent');
    const consentLabel = document.getElementById('consentLabel');

    if (!name.value.trim()) { setErr(name, 'Adınızı girin.'); ok = false; } else setErr(name, '');
    if (!email.value.trim()) { setErr(email, 'E-posta girin.'); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { setErr(email, 'Geçerli bir e-posta girin.'); ok = false; }
    else setErr(email, '');

    if (phone.value.trim() && !/^[\d\s+()-]{7,}$/.test(phone.value.trim())) {
      setErr(phone, 'Geçerli bir telefon numarası girin.'); ok = false;
    } else setErr(phone, '');

    if (!message.value.trim()) { setErr(message, 'Kısa bir mesaj yazın.'); ok = false; } else setErr(message, '');

    if (!consent.checked) {
      consentLabel.classList.add('is-error');
      ok = false;
    } else {
      consentLabel.classList.remove('is-error');
    }

    return ok;
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validate()) {
      form.reset();
      success.style.display = 'flex';
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => { success.style.display = 'none'; }, 10000);
    }
  });

  // Clear errors as the user types
  form?.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('input', () => {
      const wrap = el.closest('.form-field');
      if (wrap?.classList.contains('is-error')) setErr(el, '');
      if (el.id === 'f-consent') document.getElementById('consentLabel').classList.remove('is-error');
    });
    el.addEventListener('change', () => {
      if (el.id === 'f-consent' && el.checked) document.getElementById('consentLabel').classList.remove('is-error');
    });
  });

  // ── Smooth-scroll offset for sticky header on anchor clicks ─
  // Browser handles scroll-behavior:smooth, but we want to land
  // a bit below the sticky header for nicer framing.
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 70;
      const rect = target.getBoundingClientRect();
      const y = window.pageYOffset + rect.top - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

})();
