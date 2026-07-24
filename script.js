// =========================================================
// WELIGAMA BAY ECO VILLA — shared interactions
// =========================================================
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Nav: shrink + blur intensify on scroll ---------- */
  const nav = document.querySelector('.site-nav');
  const onScrollNav = () => {
    if (!nav) return;
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Mobile drawer ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  if (toggle && drawer) {
    const closeIcon = toggle.querySelector('.icon-close');
    const openIcon = toggle.querySelector('.icon-open');
    toggle.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (openIcon && closeIcon) {
        openIcon.style.display = isOpen ? 'none' : 'block';
        closeIcon.style.display = isOpen ? 'block' : 'none';
      }
    });
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
      if (openIcon && closeIcon) { openIcon.style.display = 'block'; closeIcon.style.display = 'none'; }
    }));
    drawer.querySelector('.backdrop')?.addEventListener('click', () => {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
      if (openIcon && closeIcon) { openIcon.style.display = 'block'; closeIcon.style.display = 'none'; }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach((el, i) => {
    el.style.setProperty('--i', i % 8);
    io.observe(el);
  });

  /* ---------- Boat: tilt on hover / touch, gentle idle float ---------- */
  const boatWrap = document.querySelector('.boat-tilt');
  if (boatWrap) {
    const img = boatWrap.querySelector('img');
    const glow = boatWrap.querySelector('.boat-glow');
    let raf = null;

    const applyTilt = (px, py) => {
      // px, py are -1..1
      const rotY = px * 10;
      const rotX = py * -8;
      boatWrap.style.transform =
        `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0) scale(1.02)`;
      if (img) img.style.transform = `scale(1.06) translate(${px * -8}px, ${py * -6}px)`;
      if (glow) glow.style.opacity = 0.55 + Math.abs(px) * 0.2;
    };
    const reset = () => {
      boatWrap.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale(1)';
      if (img) img.style.transform = 'scale(1) translate(0,0)';
      if (glow) glow.style.opacity = 0.4;
    };

    boatWrap.addEventListener('mousemove', (e) => {
      const rect = boatWrap.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const py = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => applyTilt(px, py));
    });
    boatWrap.addEventListener('mouseleave', reset);

    boatWrap.addEventListener('touchmove', (e) => {
      const t = e.touches[0];
      if (!t) return;
      const rect = boatWrap.getBoundingClientRect();
      const px = ((t.clientX - rect.left) / rect.width - 0.5) * 2;
      const py = ((t.clientY - rect.top) / rect.height - 0.5) * 2;
      applyTilt(px, py);
    }, { passive: true });
    boatWrap.addEventListener('touchend', reset);
    boatWrap.addEventListener('touchstart', () => boatWrap.classList.add('touched'));
  }

  /* ---------- Scrollytelling: "Weligama evenings" pinned crossfade ---------- */
  const story = document.querySelector('.story');
  if (story) {
    const frames = story.querySelectorAll('.story-frame');
    const track = story.querySelector('.story-track');
    const dots = story.querySelectorAll('.story-dot');

    const updateStory = () => {
      const rect = story.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      let progress = total > 0 ? (-rect.top) / total : 0;
      progress = Math.min(1, Math.max(0, progress));

      const n = frames.length;
      const activeFloat = progress * (n - 1);
      const activeIndex = Math.round(activeFloat);

      frames.forEach((f, i) => {
        const dist = Math.abs(activeFloat - i);
        const opacity = Math.max(0, 1 - dist * 1.6);
        f.style.opacity = opacity;
        f.style.transform = `scale(${1.06 - opacity * 0.06})`;
      });
      dots.forEach((d, i) => d.classList.toggle('active', i === activeIndex));
      if (track) track.style.transform = `translateY(${-progress * 18}px)`;
    };

    window.addEventListener('scroll', updateStory, { passive: true });
    window.addEventListener('resize', updateStory);
    updateStory();
  }

  /* ---------- Menu category filter (menu page) ---------- */
  const filterBtns = document.querySelectorAll('.menu-filter');
  if (filterBtns.length) {
    const items = document.querySelectorAll('.menu-group');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        items.forEach(group => {
          const show = cat === 'all' || group.dataset.cat === cat;
          group.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Parallax hero drift ---------- */
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.15;
    const update = () => {
      const y = window.scrollY * speed;
      el.style.transform = `translate3d(0, ${y}px, 0)`;
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  });

  /* ---------- Simple contact form (front-end only) ---------- */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Message sent ✓';
      btn.style.background = 'var(--gold-bright)';
      setTimeout(() => { btn.textContent = original; }, 2600);
      form.reset();
    });
  }
});
