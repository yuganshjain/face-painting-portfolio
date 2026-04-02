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

  if (!name || !phone || !event || !date) {
    showToast('Please fill in all required fields ✦');
    return;
  }

  const enquiryText =
    `Hi Ritu! 👋\n\n` +
    `I'd like to book a face painting session.\n\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Event: ${event}\n` +
    `Date: ${date}\n` +
    (guests ? `Guests: ${guests}\n` : '') +
    (message ? `\nDetails: ${message}` : '');

  showSendModal(enquiryText);
  contactForm.reset();
});

/* ── SEND MODAL (WhatsApp or Instagram DM) ───────────── */
function showSendModal(enquiryText) {
  // Remove any existing modal
  document.getElementById('sendModal')?.remove();

  const modal = document.createElement('div');
  modal.id = 'sendModal';
  modal.innerHTML = `
    <div class="send-modal__backdrop"></div>
    <div class="send-modal__box" role="dialog" aria-modal="true">
      <button class="send-modal__close" aria-label="Close">✕</button>
      <div class="send-modal__icon">✦</div>
      <h3>Send Your Enquiry</h3>
      <p>Choose how you'd like to reach Ritu:</p>
      <div class="send-modal__options">
        <button class="send-modal__btn send-modal__btn--wa" id="sendViaWA">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Send via WhatsApp
        </button>
        <button class="send-modal__btn send-modal__btn--ig" id="sendViaIG">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          Send via Instagram DM
        </button>
      </div>
      <p class="send-modal__note">Instagram DM: your message will be copied — just paste it in the chat!</p>
    </div>
  `;
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  // Animate in
  requestAnimationFrame(() => modal.classList.add('open'));

  function closeModal() {
    modal.classList.remove('open');
    setTimeout(() => { modal.remove(); document.body.style.overflow = ''; }, 300);
  }

  modal.querySelector('.send-modal__close').addEventListener('click', closeModal);
  modal.querySelector('.send-modal__backdrop').addEventListener('click', closeModal);

  // WhatsApp
  modal.querySelector('#sendViaWA').addEventListener('click', () => {
    // REPLACE: update with Ritu's real WhatsApp number
    const waNumber = '91XXXXXXXXXX';
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(enquiryText)}`, '_blank');
    closeModal();
    showToast('Opening WhatsApp! 💬');
  });

  // Instagram DM — copy message, open DM
  modal.querySelector('#sendViaIG').addEventListener('click', () => {
    navigator.clipboard.writeText(enquiryText).then(() => {
      window.open('https://ig.me/m/facepaintingbyrituverma', '_blank');
      closeModal();
      showToast('Message copied! Paste it in the Instagram DM 📩');
    }).catch(() => {
      // Fallback if clipboard blocked
      window.open('https://ig.me/m/facepaintingbyrituverma', '_blank');
      closeModal();
      showToast('Instagram DM opened — type your details there 📩');
    });
  });
}

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
