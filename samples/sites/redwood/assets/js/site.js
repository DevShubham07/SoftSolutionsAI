/* ============================================================
   Redwood Science Academy — site.js
   Single source of truth for shared chrome + all behaviors.
   Builds header / footer / floating UI / modals on every page,
   then wires navigation, modals, chat, forms and the 360 viewer.
   Plain vanilla JS. No build step. Works over file:// and http(s).
   ============================================================ */
(function () {
  'use strict';

  /* ---------- CONFIG (edit these) -------------------------- */
  // Wire forms to Formspree: create a form at https://formspree.io,
  // then replace YOUR_FORM_ID below. Until then, forms fall back to a
  // pre-filled mailto: so no submission is ever lost.
  const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

  // Swap in your real equirectangular campus panorama (2:1 ratio JPG).
  const PANO_IMAGE = 'https://pannellum.org/images/alma.jpg';

  const PANNELLUM_CSS = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
  const PANNELLUM_JS  = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';

  const SCHOOL = {
    name: 'Redwood Science Academy',
    phone: '+1 (650) 555 0142',
    tel: '+16505550142',
    whatsapp: '16505550142',
    email: 'admissions@redwoodscienceacademy.edu',
    email2: 'info@redwoodscienceacademy.edu',
    address: '120 Redwood Avenue, Cedar Valley, CA 94000',
    hours: 'Mon–Fri · 8:00–16:00'
  };

  /* ---------- PATH / PAGE RESOLUTION ----------------------- */
  const body = document.body;
  const ROOT = body.dataset.root != null ? body.dataset.root : './';
  const PAGE = body.dataset.page || 'home';
  const isHome = PAGE === 'home';

  // link to a homepage section (in-page on home, cross-page elsewhere)
  function home(hash) { return isHome ? (hash || '#top') : (ROOT + 'index.html' + (hash || '')); }
  // link to any file relative to site root
  function url(path) { return ROOT + path; }

  /* ---------- ICONS ---------------------------------------- */
  const ICON = {
    crest: '<svg viewBox="0 0 100 120" aria-hidden="true"><path d="M50 4 L92 22 V58 C92 90 50 116 50 116 C50 116 8 90 8 58 V22 Z" fill="none" stroke="#c9a875" stroke-width="3"/><text x="50" y="74" font-family="\'Cormorant Garamond\',serif" font-size="56" font-weight="600" text-anchor="middle" fill="#c9a875">R</text></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M22 2 11 13M22 2 15 22l-4-9-9-4z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20zm4.6-6c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.2a.4.4 0 0 0 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3A2.8 2.8 0 0 0 6 8c0 1.6 1.2 3.2 1.4 3.4s2.3 3.6 5.7 5c2.1.7 2.3.5 2.7.5s1.5-.6 1.7-1.2.2-1.1.1-1.2-.3-.2-.6-.3z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
    cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 4 2 9l10 5 10-5-10-5z"/><path d="M6 11v4c0 1.4 2.7 3 6 3s6-1.6 6-3v-4"/></svg>',
    build: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V8l7-4 7 4v13M10 21v-5h4v5"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6.5 8-6.5s8 2.5 8 6.5"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>'
  };
  // Rae — the AI admission assistant. Inline SVG (no external asset needed). Violet "eSkooly"-style mascot.
  const RAE_AV = '<svg class="rae-svg" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="32" fill="#6536e4"/><path d="M32 16 50 23 32 30 14 23z" fill="#fff"/><path d="M20 27v7c0 5 5.4 8 12 8s12-3 12-8v-7" fill="none" stroke="#fff" stroke-width="2.4"/><circle cx="26" cy="38" r="2.6" fill="#fff"/><circle cx="38" cy="38" r="2.6" fill="#fff"/><path d="M26 46c2 2 10 2 12 0" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><path d="M50 23v6" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><circle cx="50" cy="31" r="2.2" fill="#fff"/></svg>';
  const RAE_HEAD = '<svg class="rae-svg" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="rgba(255,255,255,.14)" stroke="#fff" stroke-width="2.5"/><path d="M32 17 49 23.5 32 30 15 23.5z" fill="#fff"/><path d="M21 27.5v6.5c0 4.8 5 7.6 11 7.6s11-2.8 11-7.6v-6.5" fill="none" stroke="#fff" stroke-width="2.3"/><circle cx="26.5" cy="37.5" r="2.5" fill="#fff"/><circle cx="37.5" cy="37.5" r="2.5" fill="#fff"/><path d="M26.5 45c2 1.9 9 1.9 11 0" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round"/></svg>';
  const RAE_FIG = '<svg class="rae-svg" viewBox="0 0 80 100" aria-hidden="true"><ellipse cx="40" cy="94" rx="22" ry="5" fill="rgba(8,16,28,.18)"/><rect x="22" y="56" width="36" height="34" rx="14" fill="#5526cf"/><rect x="20" y="22" width="40" height="40" rx="18" fill="#6536e4"/><path d="M40 8 66 17 40 26 14 17z" fill="#fff"/><path d="M24 31v8c0 7 7 11 16 11s16-4 16-11v-8" fill="none" stroke="#fff" stroke-width="3"/><circle cx="33" cy="40" r="3.4" fill="#fff"/><circle cx="47" cy="40" r="3.4" fill="#fff"/><path d="M33 49c3 2.6 11 2.6 14 0" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path d="M66 17v8" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><circle cx="66" cy="27" r="2.6" fill="#fff"/></svg>';

  /* ---------- BUILD HELPERS -------------------------------- */
  function el(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  /* ---------- HEADER --------------------------------------- */
  function buildHeader() {
    const header = document.getElementById('site-header') || document.createElement('header');
    header.id = 'site-header';
    header.className = 'site-header' + (isHome ? '' : ' always-solid');
    header.setAttribute('role', 'banner');
    header.innerHTML = `
      <div class="util-bar">
        <div style="display:flex;gap:18px;align-items:center;opacity:.9;">
          <span>${SCHOOL.hours}</span><span class="sep">/</span><a href="tel:${SCHOOL.tel}">${SCHOOL.phone}</a>
        </div>
        <div style="display:flex;gap:16px;align-items:center;opacity:.9;">
          <a href="${url('pages/admissions.html')}">Parent Login</a>
          <span class="sep">/</span>
          <a href="${url('pages/admissions.html')}#fees">Pay Fee</a>
        </div>
      </div>
      <div class="nav-main">
        <a href="${home('#top')}" class="brand" aria-label="${SCHOOL.name} — home">
          ${ICON.crest}
          <span><span class="brand-name">REDWOOD</span><span class="brand-sub">SCIENCE · ACADEMY</span></span>
        </a>
        <nav class="nav-right" aria-label="Primary">
          <a href="${url('pages/careers.html')}" class="nav-links">WORK WITH US</a>
          <a href="#" class="nav-links" data-action="modal:apply">APPLY NOW</a>
          <button class="menu-btn" data-action="menu:open" aria-label="Open menu" aria-haspopup="dialog" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </nav>
      </div>`;
    if (!header.parentNode) body.insertBefore(header, body.firstChild);

    // menu overlay
    const menu = el(`
      <div class="menu-overlay" id="menu-overlay" role="dialog" aria-modal="true" aria-label="Site menu">
        <button class="menu-close" data-action="menu:close" aria-label="Close menu">&times;</button>
        <a href="${home('#details')}">About</a>
        <a href="${home('#welcome')}">Head&rsquo;s Welcome</a>
        <a href="${home('#explore')}">Academics &amp; Admissions</a>
        <a href="${home('#campus')}">Campus</a>
        <a href="${home('#news')}">News &amp; Events</a>
        <a href="${home('#findus')}">Visit &amp; Contact</a>
        <a href="#" class="menu-apply" data-action="modal:apply">Apply Now</a>
      </div>`);
    body.appendChild(menu);

    // left-edge events tab (desktop)
    body.appendChild(el(`<a href="${home('#news')}" class="events-tab hide-mobile">Upcoming Events</a>`));
  }

  /* ---------- FOOTER --------------------------------------- */
  function buildFooter() {
    const footer = document.getElementById('site-footer') || document.createElement('footer');
    footer.id = 'site-footer';
    footer.className = 'site-footer';
    footer.setAttribute('role', 'contentinfo');
    footer.innerHTML = `
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="name">REDWOOD</div>
          <div class="sub">SCIENCE · ACADEMY</div>
          <p>An IB Continuum World School shaping confident, principled global citizens through a heritage of rigorous, curiosity-led learning.</p>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <a href="${url('pages/about.html')}">About</a>
          <a href="${url('pages/admissions.html')}">Admissions</a>
          <a href="${url('pages/careers.html')}">Careers</a>
          <a href="${url('pages/calendar.html')}">Calendar</a>
        </div>
        <div class="footer-col">
          <h4>Student Life</h4>
          <a href="${url('pages/student-life/sports.html')}">Sports</a>
          <a href="${url('pages/student-life/arts.html')}">The Arts</a>
          <a href="${url('pages/student-life/boarding.html')}">Boarding</a>
          <a href="${url('pages/campus.html')}">Campus</a>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <p>${SCHOOL.address}</p>
          <p><a href="tel:${SCHOOL.tel}" style="color:inherit;text-decoration:none;">${SCHOOL.phone}</a></p>
          <p style="margin-bottom:16px;"><a href="mailto:${SCHOOL.email}" style="color:inherit;text-decoration:none;">${SCHOOL.email}</a></p>
          <div class="footer-social">
            <a href="#" data-action="modal:contact" aria-label="Facebook">f</a>
            <a href="#" data-action="modal:contact" aria-label="LinkedIn">in</a>
            <a href="#" data-action="modal:contact" aria-label="YouTube">&#9658;</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span class="copy">&copy; 2026 ${SCHOOL.name} &middot; <a href="${url('pages/about.html')}">Privacy</a> &middot; <a href="${url('pages/about.html')}">Terms</a> &middot; <a href="${url('pages/about.html')}">Sitemap</a></span>
        <form class="footer-sub" data-form="newsletter" novalidate>
          <input type="email" name="email" placeholder="Email address" aria-label="Email address for newsletter" required>
          <button type="submit">Subscribe</button>
        </form>
      </div>`;
    if (!footer.parentNode) body.appendChild(footer);
  }

  /* ---------- FLOATING STACK ------------------------------- */
  function buildFloating() {
    const stack = document.getElementById('site-floating') || el('<div id="site-floating"></div>');
    stack.className = 'floatstack';
    stack.innerHTML = `
      <!-- chat panel -->
      <div class="chat-panel" id="chat-panel" role="dialog" aria-modal="false" aria-label="Chat with Rae, the admission assistant">
        <div class="chat-head">
          <span class="chat-ava">${RAE_HEAD}</span>
          <span class="chat-title">Rae AI <span class="verified" aria-label="Verified">${ICON.check}</span></span>
          <button class="x" data-action="chat:close" aria-label="Close chat">&times;</button>
        </div>
        <div class="chat-body" id="chat-body">
          <div class="chat-intro">
            <div class="chat-team" aria-hidden="true">
              <span class="t-av t-bot">${RAE_AV}</span>
              <img class="t-av" src="${U('photo-1544005313-94ddf0286df2', 96)}" alt="">
              <img class="t-av" src="${U('photo-1438761681033-6461ffad8d80', 96)}" alt="">
              <img class="t-av" src="${U('photo-1500648767791-00dcc994a43e', 96)}" alt="">
              <img class="t-av" src="${U('photo-1547425260-76bcadfb4f2c', 96)}" alt="">
              <img class="t-av" src="${U('photo-1529626455594-4ff0802cfb7e', 96)}" alt="">
            </div>
            <div class="chat-greet-card">Hi <span class="wave">&#128075;</span> there! How can we help you today?</div>
          </div>
          <div class="chat-typing" id="chat-typing"><span></span><span></span><span></span></div>
        </div>
        <div class="chat-quick">
          <button type="button" data-chat-chip="Tell me about admissions">Admissions</button>
          <button type="button" data-chat-chip="What are the fees?">Fees</button>
          <button type="button" data-action="modal:visit">Book a Visit</button>
          <button type="button" data-action="modal:apply">Apply</button>
        </div>
        <form class="chat-input" id="chat-input-form">
          <input type="text" id="chat-input" placeholder="Type your message…" aria-label="Type your message" autocomplete="off">
          <button type="submit" aria-label="Send message">${ICON.up}</button>
        </form>
      </div>

      <!-- greeting bubble -->
      <div class="rae-greet" id="rae-greet">
        <span class="avatar"><span class="rae-av">${RAE_AV}</span><span class="live"></span></span>
        <span class="text" data-action="chat:open">Hi! I&rsquo;m <b>Rae</b> <span class="ai">AI</span> &mdash; your Admission Assistant. <span style="opacity:.8;">Tap to chat.</span></span>
        <button class="dismiss" data-action="greet:dismiss" aria-label="Dismiss greeting">&times;</button>
      </div>

      <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-end;">
        <button class="rae-trigger" data-action="chat:open" aria-label="Chat with Rae AI">
          <span class="rae-badge"><span class="dot"></span>Rae AI<span class="ai">AI</span></span>
          <span class="rae-fig">${RAE_FIG}</span>
        </button>
        <a class="fab fab-wa" href="https://wa.me/${SCHOOL.whatsapp}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${ICON.wa}</a>
        <button class="fab fab-mail" data-action="modal:enquiry" aria-label="Enquire now">${ICON.mail}</button>
        <button class="fab fab-top" id="back-top" data-action="scrolltop" aria-label="Back to top">&uarr;</button>
      </div>`;
    if (!stack.parentNode) body.appendChild(stack);
  }

  /* ---------- MOBILE BOTTOM NAV ---------------------------- */
  function buildMobileNav() {
    const items = [
      { id: 'top', label: 'Home', icon: ICON.home, spy: '#top' },
      { id: 'explore', label: 'Admissions', icon: ICON.doc, spy: '#explore' },
      { id: 'welcome', label: 'Academics', icon: ICON.cap, spy: '#welcome' },
      { id: 'campus', label: 'Campus', icon: ICON.build, spy: '#campus' },
      { id: 'findus', label: 'Contact', icon: ICON.mail, spy: '#findus' }
    ];
    const nav = el('<nav class="mob-nav" aria-label="Mobile"></nav>');
    nav.innerHTML = items.map(i =>
      `<a href="${home('#' + i.id)}" data-spy="${i.spy}">${i.icon}<span>${i.label}</span></a>`
    ).join('');
    body.appendChild(nav);
  }

  /* ---------- MODALS --------------------------------------- */
  // field defs; an array value = a row of half-width fields
  const MODALS = {
    'modal-question': {
      eyebrow: 'Ask a Question', title: 'How can we help?',
      desc: 'Send us a question about admissions, the curriculum or life at Redwood and we will reply within one working day.',
      subject: 'Website question', submit: 'Send question',
      fields: [
        { name: 'name', label: 'Your name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'topic', label: 'Topic', type: 'select', required: true, options: ['Admissions', 'Curriculum & IB', 'Fees & scholarships', 'Boarding', 'Visiting', 'Other'] },
        { name: 'message', label: 'Your question', type: 'textarea', required: true }
      ]
    },
    'modal-newsletter': {
      eyebrow: 'Stay in Touch', title: 'Get the Redwood newsletter',
      desc: 'News, events and admissions deadlines, sent to your inbox once a month. No spam, unsubscribe anytime.',
      subject: 'Newsletter signup', submit: 'Subscribe',
      fields: [
        { name: 'name', label: 'Your name', type: 'text', required: false },
        { name: 'email', label: 'Email', type: 'email', required: true }
      ]
    },
    'modal-contact': {
      eyebrow: 'Contact Us', title: 'Send us a message',
      desc: 'Our team is here Monday to Friday, 8:00–16:00. We will get back to you as soon as we can.',
      subject: 'Contact form', submit: 'Send message',
      fields: [
        { name: 'name', label: 'Your name', type: 'text', required: true },
        [{ name: 'email', label: 'Email', type: 'email', required: true }, { name: 'phone', label: 'Phone', type: 'tel', required: false }],
        { name: 'message', label: 'Message', type: 'textarea', required: true }
      ]
    },
    'modal-enquiry': {
      eyebrow: 'Enquire Now', title: 'Make an enquiry',
      desc: 'Tell us a little about what you are looking for and an admissions officer will be in touch.',
      subject: 'General enquiry', submit: 'Send enquiry',
      fields: [
        { name: 'name', label: 'Your name', type: 'text', required: true },
        [{ name: 'email', label: 'Email', type: 'email', required: true }, { name: 'phone', label: 'Phone', type: 'tel', required: false }],
        { name: 'interest', label: 'I am interested in', type: 'select', required: true, options: ['A place for my child', 'Booking a visit', 'Fees & scholarships', 'Boarding', 'Working at Redwood', 'Something else'] },
        { name: 'message', label: 'Message', type: 'textarea', required: false }
      ]
    },
    'modal-apply': {
      eyebrow: 'Apply Now', title: 'Start an application',
      desc: 'Begin your application enquiry. We will follow up to arrange a visit and assessment — admissions are open year-round.',
      subject: 'Application enquiry', submit: 'Submit application enquiry',
      fields: [
        { name: 'student_name', label: 'Student name', type: 'text', required: true },
        [{ name: 'grade', label: 'Entry year / grade', type: 'select', required: true, options: ['Early Years', 'Primary (PYP)', 'Middle Years (MYP)', 'Diploma (DP)', 'Career-related (CP)'] }, { name: 'start', label: 'Preferred start', type: 'text', required: false, placeholder: 'e.g. Sept 2026' }],
        { name: 'parent_name', label: 'Parent / guardian name', type: 'text', required: true },
        [{ name: 'email', label: 'Email', type: 'email', required: true }, { name: 'phone', label: 'Phone', type: 'tel', required: true }],
        { name: 'message', label: 'Anything we should know? (optional)', type: 'textarea', required: false }
      ]
    },
    'modal-visit': {
      eyebrow: 'Book a Visit', title: 'Arrange a campus visit',
      desc: 'Visits run Monday to Friday, 8:00–16:00. Choose a preferred day and time and we will confirm by email.',
      subject: 'Visit request', submit: 'Request visit',
      fields: [
        { name: 'name', label: 'Your name', type: 'text', required: true },
        [{ name: 'email', label: 'Email', type: 'email', required: true }, { name: 'phone', label: 'Phone', type: 'tel', required: false }],
        [{ name: 'date', label: 'Preferred date', type: 'date', required: true }, { name: 'time', label: 'Preferred time', type: 'select', required: true, options: ['Morning (8:00–11:00)', 'Midday (11:00–13:00)', 'Afternoon (13:00–16:00)'] }],
        { name: 'message', label: 'Who is visiting / interests (optional)', type: 'textarea', required: false }
      ]
    }
  };

  function fieldHtml(f) {
    const req = f.required ? ' <span class="req" aria-hidden="true">*</span>' : '';
    const reqAttr = f.required ? ' required' : '';
    let control;
    if (f.type === 'textarea') {
      control = `<textarea name="${f.name}"${reqAttr} placeholder="${f.placeholder || ''}"></textarea>`;
    } else if (f.type === 'select') {
      control = `<select name="${f.name}"${reqAttr}><option value="" disabled selected>Choose…</option>` +
        f.options.map(o => `<option value="${o}">${o}</option>`).join('') + `</select>`;
    } else {
      control = `<input type="${f.type}" name="${f.name}"${reqAttr} placeholder="${f.placeholder || ''}" autocomplete="on">`;
    }
    return `<div class="field" data-field="${f.name}">
      <label>${f.label}${req}</label>
      ${control}
      <span class="err" role="alert">Please complete this field.</span>
    </div>`;
  }

  function buildModals() {
    const wrap = document.getElementById('site-modals') || el('<div id="site-modals"></div>');
    let html = '';
    Object.keys(MODALS).forEach(id => {
      const m = MODALS[id];
      const fields = m.fields.map(f => Array.isArray(f)
        ? `<div class="field-row">${f.map(fieldHtml).join('')}</div>`
        : fieldHtml(f)).join('');
      html += `
        <div class="modal-overlay" id="${id}" data-subject="${m.subject}" aria-hidden="true">
          <div class="modal" role="dialog" aria-modal="true" aria-labelledby="${id}-t">
            <button class="modal-x" data-action="modal:close" aria-label="Close dialog">&times;</button>
            <div class="modal-head">
              <span class="eyebrow">${m.eyebrow}</span>
              <h3 id="${id}-t">${m.title}</h3>
              <p>${m.desc}</p>
            </div>
            <div class="modal-body">
              <form data-form="${id}" novalidate>
                ${fields}
                <div class="modal-actions">
                  <button type="submit" class="btn btn-gold">${m.submit}</button>
                  <button type="button" class="btn btn-outline-navy btn-sm" data-action="modal:close">Cancel</button>
                </div>
                <p class="modal-note">By submitting you agree to be contacted about your enquiry. We never share your details.</p>
              </form>
              <div class="modal-success">
                <div class="check">&#10003;</div>
                <h3>Thank you!</h3>
                <p>Your message has been received. Our team will be in touch shortly.</p>
              </div>
            </div>
          </div>
        </div>`;
    });

    // 360 pano modal
    html += `
      <div class="pano-overlay" id="pano-overlay" role="dialog" aria-modal="true" aria-label="360 degree campus view">
        <div class="pano-bar">
          <h3>Campus · 360° View</h3>
          <button class="x" data-action="pano:close" aria-label="Close 360 view">&times;</button>
        </div>
        <div class="pano-stage" id="pano-stage">
          <div class="pano-loading" id="pano-loading"><span class="sp"></span> Loading panorama…</div>
        </div>
      </div>`;

    wrap.innerHTML = html;
    if (!wrap.parentNode) body.appendChild(wrap);

    // toast container
    if (!document.getElementById('toast-wrap')) {
      body.appendChild(el('<div class="toast-wrap" id="toast-wrap" aria-live="polite" aria-atomic="true"></div>'));
    }
  }

  /* ---------- SUBPAGE HERO --------------------------------- */
  function buildSubHero() {
    if (isHome) return;
    const main = document.getElementById('main') || document.querySelector('main');
    if (!main) return;
    const d = body.dataset;
    if (!d.title) return; // page provides its own hero
    const crumbs = (d.breadcrumb || '').split('>').map(s => s.trim()).filter(Boolean);
    const crumbHtml = ['<a href="' + home('#top') + '">Home</a>']
      .concat(crumbs.map((c, i) =>
        i === crumbs.length - 1
          ? `<span class="sep">/</span><span class="current">${c}</span>`
          : `<span class="sep">/</span><span>${c}</span>`
      )).join('');
    const bg = d.heroImg ? `<img src="${d.heroImg}" alt="" loading="lazy" aria-hidden="true">` : '';
    const hero = el(`
      <section class="subhero" data-reveal>
        ${bg}
        <div class="watermark">${ICON.crest.replace('stroke="#c9a875"', 'stroke="#fff"').replace('fill="#c9a875"', 'fill="#fff"')}</div>
        <div class="inner">
          <nav class="breadcrumb" aria-label="Breadcrumb">${crumbHtml}</nav>
          <h1>${d.title}</h1>
          ${d.subtitle ? `<p class="lede">${d.subtitle}</p>` : ''}
        </div>
      </section>`);
    main.insertBefore(hero, main.firstChild);
  }

  /* ============================================================
     BEHAVIORS
     ============================================================ */

  /* smooth scroll for in-page anchors (+ close menu) */
  function wireSmoothScroll() {
    document.addEventListener('click', function (e) {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (a.dataset.action) return; // handled by action delegator
      if (href === '#' || href === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeMenu();
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = (document.getElementById('site-header') || {}).offsetHeight || 0;
        const y = target.getBoundingClientRect().top + window.scrollY - offset - 6;
        window.scrollTo({ top: y, behavior: 'smooth' });
        closeMenu();
        try { history.replaceState(null, '', href); } catch (_) {}
      }
    });
  }

  /* sticky header solid + back-to-top visibility */
  function wireScrollChrome() {
    const header = document.getElementById('site-header');
    const back = document.getElementById('back-top');
    function onScroll() {
      if (isHome && header) {
        const solid = window.scrollY > window.innerHeight * 0.72;
        header.classList.toggle('solid', solid);
      }
      if (back) back.classList.toggle('show', window.scrollY > 700);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* reveal on scroll */
  function wireReveal() {
    const els = [].slice.call(document.querySelectorAll('[data-reveal]'));
    if (!els.length) return;
    els.forEach(e => { e.style.opacity = '0'; e.style.transform = 'translateY(30px)'; e.style.transition = 'opacity 1s cubic-bezier(.2,.7,.2,1), transform 1s cubic-bezier(.2,.7,.2,1)'; });
    if (!('IntersectionObserver' in window)) { els.forEach(e => { e.style.opacity = '1'; e.style.transform = 'none'; }); return; }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(en => { if (en.isIntersecting) { en.target.style.opacity = '1'; en.target.style.transform = 'none'; io.unobserve(en.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    els.forEach(e => io.observe(e));
    setTimeout(() => els.forEach(e => { if (getComputedStyle(e).opacity === '0') { e.style.opacity = '1'; e.style.transform = 'none'; } }), 3000);
  }

  /* hero video montage (home) */
  function wireHeroVideo() {
    const vids = [].slice.call(document.querySelectorAll('[data-hero]'));
    if (vids.length < 2) { vids.forEach(v => { try { v.muted = true; v.play().catch(() => {}); } catch (_) {} }); return; }
    vids.forEach(v => { try { v.muted = true; v.play().catch(() => {}); } catch (_) {} });
    let ci = 0;
    setInterval(function () {
      ci = (ci + 1) % vids.length;
      vids.forEach((v, i) => { v.style.opacity = i === ci ? '1' : '0'; if (i === ci) { try { v.play().catch(() => {}); } catch (_) {} } });
    }, 7000);
  }

  /* bento card hover (home) — JS toggles class so touch works on tap too */
  function wireBento() {
    [].slice.call(document.querySelectorAll('.bento .tile')).forEach(card => {
      if (!card.querySelector('.ov')) return; // only image tiles have an overlay
      card.addEventListener('mouseenter', () => card.classList.add('hovered'));
      card.addEventListener('mouseleave', () => card.classList.remove('hovered'));
      // keyboard / touch: toggle on focus & click without blocking navigation
      card.addEventListener('focusin', () => card.classList.add('hovered'));
      card.addEventListener('focusout', () => card.classList.remove('hovered'));
    });
  }

  /* campus tabs (home) */
  function wireCampus() {
    const stage = document.getElementById('campus-img');
    if (!stage) return;
    const data = {
      view: { img: U('photo-1541339907198-e08756dedf3f', 1700), label: 'Campus View', desc: 'A sweeping look across our 13-acre LEED Platinum certified campus — eco-conscious architecture set among open green grounds.' },
      facilities: { img: U('photo-1562774053-701939374585', 1700), label: 'World-Class Facilities', desc: 'State-of-the-art laboratories, libraries, performance studios and sporting arenas designed for every kind of learner.' },
      tour: { img: U('photo-1607013251379-e6eecfffe234', 1700), label: 'Virtual Tour', desc: 'Step inside from anywhere in the world — explore classrooms, boarding houses and the campus in immersive 360°.' }
    };
    const label = document.getElementById('campus-label');
    const desc = document.getElementById('campus-desc');
    [].slice.call(document.querySelectorAll('[data-camtab]')).forEach(btn => {
      btn.addEventListener('click', () => {
        const t = btn.getAttribute('data-camtab');
        const d = data[t]; if (!d) return;
        stage.src = d.img; label.textContent = d.label; desc.textContent = d.desc;
        document.querySelectorAll('[data-camtab]').forEach(b => b.classList.toggle('active', b === btn));
      });
    });
  }
  function U(id, w) { return 'https://images.unsplash.com/' + id + '?auto=format&fit=crop&w=' + w + '&q=80'; }

  /* scroll-spy → highlight mobile nav + menu links (home) */
  function wireScrollSpy() {
    if (!isHome || !('IntersectionObserver' in window)) return;
    const ids = ['top', 'explore', 'welcome', 'campus', 'findus', 'details', 'news'];
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const hash = '#' + en.target.id;
          document.querySelectorAll('.mob-nav a').forEach(a => a.classList.toggle('active', a.getAttribute('data-spy') === hash));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------- MENU ----------------------------------------- */
  function openMenu() {
    const m = document.getElementById('menu-overlay');
    if (!m) return;
    m.classList.add('open');
    const btn = document.querySelector('.menu-btn'); if (btn) btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    layers.push({ kind: 'menu', node: m });
    const first = m.querySelector('a, button'); if (first) setTimeout(() => first.focus(), 50);
  }
  function closeMenu() {
    const m = document.getElementById('menu-overlay');
    if (!m || !m.classList.contains('open')) return;
    m.classList.remove('open');
    const btn = document.querySelector('.menu-btn'); if (btn) btn.setAttribute('aria-expanded', 'false');
    popLayer(m);
  }

  /* ---------- MODAL ENGINE --------------------------------- */
  const layers = []; // stack of open overlays {kind,node,restore?}
  function topLayer() { return layers[layers.length - 1]; }
  function popLayer(node) {
    const i = layers.map(l => l.node).lastIndexOf(node);
    if (i > -1) layers.splice(i, 1);
    if (!layers.length) document.body.style.overflow = '';
  }

  function openModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    const restore = document.activeElement;
    // reset to form view
    const form = m.querySelector('form'); const success = m.querySelector('.modal-success');
    if (form) { form.classList.remove('is-hidden'); form.reset(); form.querySelectorAll('.field').forEach(f => f.classList.remove('invalid')); }
    if (success) success.classList.remove('show');
    m.classList.add('open'); m.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    layers.push({ kind: 'modal', node: m, restore: restore });
    const first = m.querySelector('input,select,textarea,button.modal-x');
    if (first) setTimeout(() => first.focus(), 60);
  }
  function closeModal(node) {
    const m = node || (topLayer() && topLayer().kind === 'modal' ? topLayer().node : null);
    if (!m) return;
    m.classList.remove('open'); m.setAttribute('aria-hidden', 'true');
    const layer = layers.filter(l => l.node === m)[0];
    popLayer(m);
    if (layer && layer.restore && layer.restore.focus) try { layer.restore.focus(); } catch (_) {}
  }

  /* ---------- CHAT ----------------------------------------- */
  let chatSeeded = false;
  function openChat() {
    const p = document.getElementById('chat-panel');
    const g = document.getElementById('rae-greet');
    if (!p) return;
    if (g) g.style.display = 'none';
    p.classList.add('open');
    // the static greeting card in .chat-intro is the welcome message — no seeded duplicate
    const inp = document.getElementById('chat-input'); if (inp) setTimeout(() => inp.focus(), 60);
    if (layers.map(l => l.node).indexOf(p) === -1) layers.push({ kind: 'chat', node: p });
  }
  function closeChat() {
    const p = document.getElementById('chat-panel');
    if (!p) return;
    p.classList.remove('open');
    popLayer(p);
  }
  function addMsg(text, who) {
    const bodyEl = document.getElementById('chat-body');
    const typing = document.getElementById('chat-typing');
    const d = document.createElement('div');
    d.className = 'chat-msg ' + who;
    d.textContent = text;
    bodyEl.insertBefore(d, typing);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }
  function botSay(text) { addMsg(text, 'bot'); }
  function botReply(q) {
    const s = (q || '').toLowerCase();
    if (/fee|cost|price|tuition|scholarship/.test(s)) return 'Our admissions team shares the current fee schedule on request — call ' + SCHOOL.phone + ' or email ' + SCHOOL.email + ' and we will send full details. Scholarships and bursaries are available.';
    if (/board|hostel|residen/.test(s)) return 'We offer full and weekly boarding with dedicated house parents and pastoral care. Tap “Book a Visit” below and I can arrange a boarding-house tour for you.';
    if (/admis|apply|enrol|join|place/.test(s)) return 'We have year-round admissions across the IB Continuum. The next step is a campus visit and an assessment — tap “Apply” below to start, or “Book a Visit”.';
    if (/visit|tour|campus|open day/.test(s)) return 'Wonderful! We host campus visits Monday to Friday, 8:00–16:00. Tap “Book a Visit” below and we will confirm your preferred day.';
    if (/curricul|ib|programme|program|subject|academ/.test(s)) return 'Redwood is a full IB Continuum school — PYP, MYP, DP and CP. You can read more on our Academics page. Anything specific you would like to know?';
    return 'Thank you for your question! Our admissions team will be glad to help — reach us at ' + SCHOOL.phone + ' or ' + SCHOOL.email + ', and we usually respond within one working day.';
  }
  function chatSend(text) {
    if (!text || !text.trim()) return;
    addMsg(text.trim(), 'user');
    const typing = document.getElementById('chat-typing');
    typing.classList.add('show');
    document.getElementById('chat-body').scrollTop = 1e9;
    const reply = botReply(text);
    setTimeout(function () { typing.classList.remove('show'); botSay(reply); }, 1000);
  }

  /* ---------- TOAST ---------------------------------------- */
  function toast(msg, isErr) {
    const wrap = document.getElementById('toast-wrap');
    if (!wrap) return;
    const t = el('<div class="toast' + (isErr ? ' err' : '') + '"><span class="ico">' + (isErr ? '!' : '&#10003;') + '</span><span>' + msg + '</span></div>');
    wrap.appendChild(t);
    setTimeout(() => { t.style.transition = 'opacity .4s, transform .4s'; t.style.opacity = '0'; t.style.transform = 'translateY(10px)'; }, 4200);
    setTimeout(() => t.remove(), 4700);
  }

  /* ---------- FORMS ---------------------------------------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function validate(form) {
    let ok = true;
    form.querySelectorAll('.field').forEach(function (fld) {
      const ctrl = fld.querySelector('input,select,textarea');
      if (!ctrl) return;
      const val = (ctrl.value || '').trim();
      let bad = false;
      if (ctrl.hasAttribute('required') && !val) bad = true;
      if (ctrl.type === 'email' && val && !EMAIL_RE.test(val)) bad = true;
      fld.classList.toggle('invalid', bad);
      if (bad && ok) { const first = ctrl; setTimeout(() => first.focus(), 0); }
      if (bad) ok = false;
    });
    return ok;
  }
  function formData(form) {
    const data = {};
    form.querySelectorAll('input,select,textarea').forEach(c => { if (c.name) data[c.name] = c.value.trim(); });
    return data;
  }
  function mailtoFor(subject, data) {
    const lines = Object.keys(data).map(k => k.replace(/_/g, ' ').replace(/\b\w/g, m => m.toUpperCase()) + ': ' + data[k]);
    const bodyTxt = encodeURIComponent(lines.join('\n') + '\n\n— sent from the Redwood Science Academy website');
    return 'mailto:' + SCHOOL.email + '?subject=' + encodeURIComponent('[' + subject + ']') + '&body=' + bodyTxt;
  }
  function showSuccess(modal) {
    if (!modal) return;
    const form = modal.querySelector('form'); const success = modal.querySelector('.modal-success');
    if (form) form.classList.add('is-hidden');
    if (success) success.classList.add('show');
  }
  function handleSubmit(form) {
    if (!validate(form)) return;
    const modal = form.closest('.modal-overlay');
    const subject = modal ? (modal.getAttribute('data-subject') || 'Website') : (form.getAttribute('data-form') === 'newsletter' ? 'Newsletter signup' : 'Website');
    const data = formData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const configured = FORM_ENDPOINT.indexOf('YOUR_FORM_ID') === -1;

    function done(viaMail) {
      if (submitBtn) submitBtn.classList.remove('loading');
      if (modal) { showSuccess(modal); }
      else { form.reset(); }
      toast(viaMail ? 'Opening your email app to send…' : 'Thank you — we’ve received your message.');
      if (!modal) return;
    }
    function fallbackMail() {
      // never lose data: open a pre-filled email
      const link = mailtoFor(subject, data);
      const a = document.createElement('a'); a.href = link; document.body.appendChild(a); a.click(); a.remove();
      done(true);
    }

    if (submitBtn) submitBtn.classList.add('loading');

    if (!configured) { setTimeout(fallbackMail, 500); return; }

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: (function () { const fd = new FormData(); Object.keys(data).forEach(k => fd.append(k, data[k])); fd.append('_subject', '[' + subject + '] ' + SCHOOL.name); return fd; })()
    }).then(function (r) {
      if (r.ok) { if (submitBtn) submitBtn.classList.remove('loading'); if (modal) showSuccess(modal); else form.reset(); toast('Thank you — we’ve received your message.'); }
      else fallbackMail();
    }).catch(fallbackMail);
  }

  function wireForms() {
    document.addEventListener('submit', function (e) {
      const form = e.target.closest('form[data-form]');
      if (!form) return;
      e.preventDefault();
      if (form.getAttribute('data-form') === 'chat') return;
      handleSubmit(form);
    });
    // live-clear invalid state
    document.addEventListener('input', function (e) {
      const fld = e.target.closest('.field.invalid');
      if (fld) fld.classList.remove('invalid');
    });
  }

  /* ---------- 360 PANORAMA --------------------------------- */
  let panoLoaded = false, panoViewer = null;
  function loadPannellum() {
    return new Promise(function (resolve, reject) {
      if (window.pannellum) return resolve();
      if (!document.querySelector('link[data-pannellum]')) {
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = PANNELLUM_CSS; link.setAttribute('data-pannellum', ''); document.head.appendChild(link);
      }
      const s = document.createElement('script'); s.src = PANNELLUM_JS; s.async = true;
      s.onload = resolve; s.onerror = reject; document.head.appendChild(s);
    });
  }
  function openPano() {
    const ov = document.getElementById('pano-overlay');
    const stage = document.getElementById('pano-stage');
    const loading = document.getElementById('pano-loading');
    if (!ov) return;
    const restore = document.activeElement;
    ov.classList.add('open'); ov.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    layers.push({ kind: 'pano', node: ov, restore: restore });
    if (loading) loading.style.display = 'flex';
    loadPannellum().then(function () {
      if (loading) loading.style.display = 'none';
      if (panoViewer) { try { panoViewer.destroy(); } catch (_) {} panoViewer = null; }
      const holder = document.createElement('div'); holder.id = 'pano-viewer'; holder.style.cssText = 'width:100%;height:100%';
      // clear stage but keep loading element reference
      [].slice.call(stage.querySelectorAll('#pano-viewer')).forEach(n => n.remove());
      stage.appendChild(holder);
      panoViewer = window.pannellum.viewer('pano-viewer', {
        type: 'equirectangular', panorama: PANO_IMAGE, autoLoad: true, showZoomCtrl: true,
        autoRotate: -2, compass: false, hfov: 110
      });
      panoLoaded = true;
    }).catch(function () {
      if (loading) loading.innerHTML = 'Could not load the 360° viewer. Please check your connection.';
      toast('Unable to load the 360° viewer right now.', true);
    });
  }
  function closePano() {
    const ov = document.getElementById('pano-overlay');
    if (!ov) return;
    ov.classList.remove('open'); ov.setAttribute('aria-hidden', 'true');
    const layer = layers.filter(l => l.node === ov)[0];
    popLayer(ov);
    if (layer && layer.restore && layer.restore.focus) try { layer.restore.focus(); } catch (_) {}
    if (panoViewer) { try { panoViewer.destroy(); } catch (_) {} panoViewer = null; }
  }

  /* ---------- ACTION DELEGATION ---------------------------- */
  function wireActions() {
    document.addEventListener('click', function (e) {
      const t = e.target.closest('[data-action]');
      if (t) {
        const act = t.getAttribute('data-action');
        const isLinkLike = t.tagName === 'A' || t.tagName === 'BUTTON';
        if (act.indexOf('modal:') === 0) {
          e.preventDefault();
          const key = act.split(':')[1];
          if (key === 'close') closeModal();
          else { closeMenu(); openModal('modal-' + key); }
          return;
        }
        switch (act) {
          case 'menu:open': e.preventDefault(); openMenu(); return;
          case 'menu:close': e.preventDefault(); closeMenu(); return;
          case 'chat:open': e.preventDefault(); openChat(); return;
          case 'chat:close': e.preventDefault(); closeChat(); return;
          case 'greet:dismiss': e.preventDefault(); { const g = document.getElementById('rae-greet'); if (g) g.style.display = 'none'; } return;
          case 'pano:open': e.preventDefault(); openPano(); return;
          case 'pano:close': e.preventDefault(); closePano(); return;
          case 'scrolltop': e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); return;
        }
      }
      // chat quick chips
      const chip = e.target.closest('[data-chat-chip]');
      if (chip) { e.preventDefault(); openChat(); chatSend(chip.getAttribute('data-chat-chip')); return; }

      // close modal on overlay backdrop click
      const ov = e.target.classList && e.target.classList.contains('modal-overlay') ? e.target : null;
      if (ov && ov.classList.contains('open')) { closeModal(ov); return; }
      const panoOv = e.target.id === 'pano-overlay' ? e.target : null;
      if (panoOv) { closePano(); return; }
    });

    // chat input form
    const cf = document.getElementById('chat-input-form');
    if (cf) cf.addEventListener('submit', function (e) {
      e.preventDefault();
      const inp = document.getElementById('chat-input');
      const v = inp.value; inp.value = '';
      chatSend(v);
    });

    // global keyboard: ESC + focus trap
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        const top = topLayer();
        if (top) {
          if (top.kind === 'modal') closeModal(top.node);
          else if (top.kind === 'pano') closePano();
          else if (top.kind === 'menu') closeMenu();
          else if (top.kind === 'chat') closeChat();
        } else {
          const chat = document.getElementById('chat-panel');
          if (chat && chat.classList.contains('open')) closeChat();
        }
        return;
      }
      if (e.key === 'Tab') {
        const top = topLayer();
        if (top && (top.kind === 'modal' || top.kind === 'menu' || top.kind === 'pano')) {
          trapFocus(top.node, e);
        }
      }
    });
  }

  function trapFocus(container, e) {
    const sel = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const f = [].slice.call(container.querySelectorAll(sel)).filter(n => n.offsetParent !== null || n === document.activeElement);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- INIT ----------------------------------------- */
  function init() {
    buildHeader();
    buildFooter();
    buildFloating();
    buildMobileNav();
    buildModals();
    buildSubHero();

    wireActions();
    wireForms();
    wireSmoothScroll();
    wireScrollChrome();
    wireReveal();
    wireHeroVideo();
    wireBento();
    wireCampus();
    wireScrollSpy();

    // expose a tiny API for inline page hooks if ever needed
    window.RSA = { openModal: openModal, openChat: openChat, openPano: openPano, toast: toast };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
