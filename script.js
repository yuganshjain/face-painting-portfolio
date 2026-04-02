/* ═══════════════════════════════════════════════════════
   Face Painting by Ritu Verma — Portfolio Scripts
   ═══════════════════════════════════════════════════════ */

/* ── NAV: scroll effect + mobile toggle ─────────────── */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  backToTop.classList.toggle('visible', window.scrollY > 400);
});

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', open);
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

/* ── BACK TO TOP ─────────────────────────────────────── */
const backToTop = document.getElementById('backToTop');
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── SCROLL FADE-IN ANIMATIONS ───────────────────────── */
const fadeEls = document.querySelectorAll(
  '.service-card, .gallery__item, .testimonial-card, .process__step, .stat, .highlight'
);
fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
fadeEls.forEach(el => observer.observe(el));

/* ── COUNTER ANIMATION ───────────────────────────────── */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statsBar = document.querySelector('.stats-bar');
let statsAnimated = false;
const statsObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    document.querySelectorAll('.stat__number').forEach(el => {
      animateCounter(el, parseInt(el.dataset.count, 10));
    });
  }
}, { threshold: 0.5 });
if (statsBar) statsObserver.observe(statsBar);

/* ── GALLERY FILTER ──────────────────────────────────── */
const filterBtns  = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery__item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hidden', !match);
      // Reset grid span for hidden items to avoid gaps — toggle wide/tall classes
    });
  });
});

/* ── GALLERY LIGHTBOX ────────────────────────────────── */
const lightbox        = document.getElementById('lightbox');
const lightboxClose   = document.getElementById('lightboxClose');
const lightboxContent = document.getElementById('lightboxContent');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const imgWrap = item.querySelector('.gallery__img-wrap');
    const img     = imgWrap.querySelector('img');

    if (img) {
      // Real image: show in lightbox
      lightboxContent.innerHTML = `<img src="${img.src}" alt="${img.alt || 'Gallery image'}" />`;
    } else {
      // Placeholder: show label
      const placeholder = imgWrap.querySelector('.gallery__placeholder');
      const label = placeholder ? placeholder.textContent.trim() : 'Gallery Item';
      lightboxContent.innerHTML = `
        <div style="
          padding:3rem 4rem;
          background:var(--c-surface);
          border-radius:16px;
          text-align:center;
          border:1px dashed rgba(199,125,255,0.4)
        ">
          <p style="font-size:1.1rem;color:#9894b0;margin-bottom:.5rem">📸 Replace with real photo</p>
          <p style="color:#c77dff;font-weight:600">${label}</p>
        </div>`;
    }
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

/* ── CONTACT FORM ────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const name    = contactForm.name.value.trim();
  const phone   = contactForm.phone.value.trim();
  const event   = contactForm.event.value;
  const date    = contactForm.date.value;
  const guests  = contactForm.guests.value;
  const message = contactForm.message.value.trim();

  // Basic validation
  if (!name || !phone || !event || !date) {
    showToast('Please fill in all required fields ✦');
    return;
  }

  // Build WhatsApp message and open WhatsApp
  // REPLACE: update the phone number below with Ritu's actual WhatsApp number
  const waNumber = '91XXXXXXXXXX';
  const waMsg = encodeURIComponent(
    `Hi Ritu! 👋\n\n` +
    `I'd like to book a face painting session.\n\n` +
    `Name: ${name}\n` +
    `Event Type: ${event}\n` +
    `Date: ${date}\n` +
    (guests ? `Guests: ${guests}\n` : '') +
    (message ? `\nDetails: ${message}` : '')
  );

  window.open(`https://wa.me/${waNumber}?text=${waMsg}`, '_blank');

  // Reset form and show toast
  contactForm.reset();
  showToast('Opening WhatsApp to send your enquiry! 🎨');
});

/* ── TOAST HELPER ────────────────────────────────────── */
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ── SMOOTH ACTIVE NAV LINKS ─────────────────────────── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
