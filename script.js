document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initActiveNav();
  initCardFadeIn();
  initCardFlip();
  initHamburger();
  initCountdown();
  initItineraryMap();
});

function initItineraryMap() {
  const frame = document.querySelector('.itinerary__map-wrap iframe');
  const label = document.querySelector('.itinerary__map-label');
  if (!frame) return;

  const events = document.querySelectorAll('.timeline__event[data-map]');
  events.forEach(ev => {
    ev.addEventListener('click', e => {
      // Let real links (e.g. Event details) behave normally
      if (e.target.closest('a')) return;

      const query = ev.getAttribute('data-map');
      const text = ev.getAttribute('data-label');
      frame.src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
      if (text && label) label.textContent = text;

      events.forEach(o => o.classList.remove('timeline__event--active'));
      ev.classList.add('timeline__event--active');

      // On narrow screens the map sits below the list — bring it into view
      frame.closest('.itinerary__map-wrap').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
}

function initSmoothScroll() {
  const navHeight = document.getElementById('nav').offsetHeight;
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
      // Close mobile nav if open
      document.getElementById('navMobile').classList.remove('is-open');
      document.getElementById('navHamburger').classList.remove('is-open');
    });
  });
}

function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  const navHeight = document.getElementById('nav').offsetHeight;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'nav__link--active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  }, {
    rootMargin: `-${navHeight}px 0px -55% 0px`,
    threshold: 0,
  });

  sections.forEach(s => observer.observe(s));
}


function initCardFadeIn() {
  const cards = document.querySelectorAll('.famiglia__card');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.07}s`;
    observer.observe(card);
  });
}

function initCountdown() {
  const target = new Date('2026-09-11T12:00:00-07:00'); // noon Pacific on check-in day
  const els = {
    days:    document.getElementById('cd-days'),
    hours:   document.getElementById('cd-hours'),
    minutes: document.getElementById('cd-minutes'),
    seconds: document.getElementById('cd-seconds'),
  };

  if (!els.days) return; // no countdown on this page

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      Object.values(els).forEach(el => { el.textContent = '00'; });
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    els.days.textContent    = String(d).padStart(2, '0');
    els.hours.textContent   = String(h).padStart(2, '0');
    els.minutes.textContent = String(m).padStart(2, '0');
    els.seconds.textContent = String(s).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
}

function initCardFlip() {
  document.querySelectorAll('.famiglia__card.is-flippable').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.famiglia__card.is-flipped').forEach(other => {
        if (other !== card) other.classList.remove('is-flipped');
      });
      card.classList.toggle('is-flipped');
    });
  });
}

function initHamburger() {
  const btn = document.getElementById('navHamburger');
  const drawer = document.getElementById('navMobile');
  if (!btn || !drawer) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('is-open');
    drawer.classList.toggle('is-open');
  });
}
