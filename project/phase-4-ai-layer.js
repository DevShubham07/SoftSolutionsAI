/* =================================================================
   SofSolutionsAI — Phase 04 · AI layer
   Three live-demo cards. Vanilla JS. Palette C.
   ================================================================= */
(function () {
  'use strict';

  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (sel, root) => (root || document).querySelector(sel);
  const ce = (tag, cls) => { const e = document.createElement(tag); if (cls) e.className = cls; return e; };

  /* ---- streaming text helper (word or char) ---- */
  function stream(el, text, opts) {
    opts = opts || {};
    const mode  = opts.mode || 'word';
    const speed = opts.speed || (mode === 'word' ? 48 : 16);
    el.textContent = '';
    if (RM) { el.textContent = text; el.classList.remove('caret'); opts.onDone && opts.onDone(); return { cancel() {} }; }
    el.classList.add('caret');
    const toks = mode === 'word' ? text.split(/(\s+)/) : text.split('');
    let i = 0, cancelled = false, t = null;
    (function step() {
      if (cancelled) return;
      if (i >= toks.length) { el.classList.remove('caret'); opts.onDone && opts.onDone(); return; }
      el.textContent += toks[i++];
      t = setTimeout(step, speed * (0.55 + Math.random() * 0.9));
    })();
    return { cancel() { cancelled = true; clearTimeout(t); el.classList.remove('caret'); } };
  }

  /* =================================================================
     SCHEDULER — gate ambient loops on section-in-view + tab-visible
     ================================================================= */
  const cards = [];          // { id, el, running, wantRun, beat, cadence, timer }
  let tabVisible = !document.hidden;

  function cardOn(c) { return c.wantRun && tabVisible && !RM; }

  function loop(card) {
    clearTimeout(card.timer);
    card.timer = setTimeout(function tick() {
      if (!card.running) return;
      try { card.beat(); } catch (e) {}
      if (card.running) card.timer = setTimeout(tick, card.cadence);
    }, card.cadence);
  }
  function syncCards() {
    cards.forEach(c => {
      const on = cardOn(c);
      if (on && !c.running) { c.running = true; loop(c); }
      else if (!on && c.running) { c.running = false; clearTimeout(c.timer); }
    });
  }

  document.addEventListener('visibilitychange', () => { tabVisible = !document.hidden; syncCards(); });

  /* =================================================================
     CARD 1 — AI EMAIL INBOX
     ================================================================= */
  (function emailCard() {
    const list = $('#inbox');
    const countEl = $('#inbox-count');
    if (!list) return;

    const SEED = [
      { who: 'Priya Sharma', subj: "Order #4821 still hasn't arrived", chip: 'urgent · refund', unread: true,
        summary: '3-message thread — customer wants a refund on a delayed Mumbai order.',
        reply: "Hi Priya, really sorry about #4821 — it's stuck at the Bhiwandi hub. I've issued a full refund of ₹2,340 to your original payment; it'll reflect in 3–4 days. Anything else I can sort?" },
      { who: 'Razorpay', subj: 'Settlement of ₹1,24,500 completed', chip: 'invoice', unread: false,
        summary: 'Automated payout — today\'s settlement landed in your current account.',
        reply: 'Logged for the books. No reply needed — filed under settlements › may. I\'ll flag it if the amount looks off next cycle.' },
      { who: 'Zomato Partner', subj: 'Bulk catering enquiry for Friday', chip: 'hot lead', unread: true,
        summary: 'New enquiry — 80-cover office lunch this Friday, budget flexible.',
        reply: 'Hi! Yes, we can do 80 covers this Friday. Sending a sample menu and quote within the hour — could you confirm the veg / non-veg split and a delivery window?' },
      { who: 'Aarav M.', subj: 'Quick question on your pricing', chip: 'fyi', unread: false,
        summary: 'Low priority — prospect comparing plans, no urgency detected.',
        reply: 'Hi Aarav, happy to help. The Standard plan covers what most teams need — here\'s a one-pager breaking down the tiers. Shout if a quick call is easier.' }
    ];

    const POOL = [
      { who: 'Swiggy Instamart', subj: 'Low stock alert — 3 SKUs', chip: 'inventory', unread: true,
        summary: 'Automated alert — three SKUs dropped below reorder threshold.',
        reply: 'Reorder raised for all three. Restock ETA is Thursday — I\'ll confirm once the PO is acknowledged.' },
      { who: 'Neha Reddy', subj: 'Loved the new dashboard!', chip: 'fyi', unread: false,
        summary: 'Positive feedback — customer praising the latest release.',
        reply: 'Thank you, Neha — that means a lot! I\'ll pass it to the team. Anything you\'d want next?' },
      { who: 'HDFC Bank', subj: 'GST payment due in 2 days', chip: 'urgent · invoice', unread: true,
        summary: 'Reminder — quarterly GST filing window closes in 48 hours.',
        reply: 'Noted — scheduling the payment for tomorrow morning and looping in accounts to confirm the challan.' },
      { who: 'Flipkart Seller', subj: 'Return request on order #9912', chip: 'urgent · refund', unread: true,
        summary: '2-message thread — customer requesting a size exchange.',
        reply: 'Hi! Happy to exchange #9912 for the larger size — free pickup is arranged for tomorrow, replacement ships same day.' }
    ];

    const panel = $('#email-panel');
    const panelEmpty = $('#email-panel-empty');
    let selected = null, streamHandle = null, poolPtr = 0;

    function updateCount() {
      const need = SEED.filter(x => x.unread).length;
      countEl.textContent = 'inbox · ' + need + ' need attention';
    }

    function render() {
      list.innerHTML = '';
      SEED.forEach((m) => list.appendChild(rowEl(m)));
    }

    function rowEl(m) {
      const row = ce('div', 'email' + (m.unread ? ' is-unread' : '') + (m._new ? ' slidein' : '') + (m === selected ? ' active' : ''));
      const top = ce('div', 'email-row');
      top.appendChild(ce('span', 'unread'));
      const who = ce('span', 'who'); who.textContent = m.who; top.appendChild(who);
      const subj = ce('span', 'subj'); subj.textContent = m.subj; top.appendChild(subj);
      const chip = ce('span', 'echip'); chip.textContent = m.chip; top.appendChild(chip);
      row.appendChild(top);
      row.addEventListener('click', () => selectEmail(m, row));
      return row;
    }

    function selectEmail(m, row) {
      if (streamHandle) streamHandle.cancel();
      selected = m; m.unread = false;
      list.querySelectorAll('.email').forEach(r => r.classList.toggle('active', r === row));
      row.classList.remove('is-unread');
      updateCount();
      renderPanel(m, true);
    }

    function renderPanel(m, doStream) {
      if (panelEmpty) panelEmpty.style.display = 'none';
      panel.querySelectorAll('.ep-block').forEach(n => n.remove());

      const from = ce('div', 'ep-block ep-from');
      const who = ce('span', 'ep-who'); who.textContent = m.who;
      const chip = ce('span', 'echip'); chip.textContent = m.chip;
      from.appendChild(who); from.appendChild(chip);

      const subj = ce('div', 'ep-block ep-subj'); subj.textContent = m.subj;

      const sum = ce('div', 'ep-block email-summary');
      sum.innerHTML = '<i class="ti ti-sparkles"></i>';
      const sumtxt = ce('span'); sumtxt.textContent = m.summary; sum.appendChild(sumtxt);

      const draft = ce('div', 'ep-block email-draft');
      const dl = ce('span', 'lbl'); dl.textContent = 'ai-suggested reply'; draft.appendChild(dl);
      const dtxt = ce('span', 'draft-text'); draft.appendChild(dtxt);

      const acts = ce('div', 'ep-block draft-actions');
      const send = ce('button', 'mini-btn mini-btn--send'); send.innerHTML = '<i class="ti ti-send" style="font-size:13px"></i>send';
      const edit = ce('button', 'mini-btn mini-btn--ghost'); edit.textContent = 'edit';
      acts.appendChild(send); acts.appendChild(edit);
      send.addEventListener('click', () => { send.innerHTML = '<i class="ti ti-check" style="font-size:13px"></i>sent'; send.style.background = 'var(--pos)'; });
      edit.addEventListener('click', () => { dtxt.setAttribute('contenteditable', 'true'); dtxt.focus(); });

      [from, subj, sum, draft, acts].forEach(el => panel.appendChild(el));

      if (doStream) {
        dtxt.textContent = '';
        setTimeout(() => { streamHandle = stream(dtxt, m.reply, { mode: 'word', speed: 42 }); }, RM ? 0 : 240);
      } else {
        dtxt.textContent = m.reply;
      }
    }

    // ambient: every ~7s a new email slides in at the top, "sorting…" then the tag resolves
    function beat() {
      const incoming = Object.assign({}, POOL[poolPtr % POOL.length]); poolPtr++;
      incoming._new = true;
      SEED.unshift(incoming); SEED.pop();
      render();
      const chip = list.querySelector('.email .echip');
      const realChip = incoming.chip;
      chip.textContent = 'ai sorting…'; chip.classList.add('sorting');
      setTimeout(() => { chip.textContent = realChip; chip.classList.remove('sorting'); }, 1300);
      updateCount();
      incoming._new = false;
    }

    render(); updateCount();
    cards.push({ id: 'email', el: $('#card-email'), running: false, wantRun: false, beat, cadence: 7000, timer: null });
  })();

  /* =================================================================
     CARD 2 — AI CHATBOT
     ================================================================= */
  (function chatCard() {
    const log = $('#chat-log');
    const chipsWrap = $('#chat-chips');
    const input = $('#chat-text');
    const sendBtn = $('#chat-send');
    if (!log) return;

    const QA = {
      "where's my order?": { a: "Your order #4821 left our Bengaluru hub this morning and is out for delivery — it should reach you by 7pm today. You'll get an SMS the moment it's nearby.", src: 'order-tracking' },
      "do you ship to Pune?": { a: "Yes! We ship across Maharashtra, Pune included. Orders there usually arrive in 2–3 working days, and delivery is free above ₹999.", src: 'shipping-policy' },
      "return policy?": { a: "You can return any unworn item within 7 days for a full refund — no questions asked. Just tap 'return' in your orders and we'll arrange a free pickup.", src: 'returns-policy' }
    };
    const CHIPS = ["where's my order?", "do you ship to Pune?", "return policy?"];

    let busy = false, idleArmed = false, lastActivity = Date.now();

    function addBubble(role, opts) {
      opts = opts || {};
      const b = ce('div', 'bubble ' + role + (opts.extra ? ' ' + opts.extra : ''));
      log.appendChild(b);
      trim();
      return b;
    }
    function trim() { while (log.children.length > 6) log.removeChild(log.firstChild); }

    function showTyping() {
      const t = ce('div', 'bubble bot');
      const ind = ce('span', 'typing'); ind.innerHTML = '<span></span><span></span><span></span>';
      t.appendChild(ind); log.appendChild(t); trim();
      return t;
    }

    function answer(q) {
      if (busy) return;
      const key = q.toLowerCase().trim();
      const match = QA[key] || QA[Object.keys(QA).find(k => key.includes(k.replace('?', '').split(' ')[0]) || k.includes(key.slice(0, 6))) ] ||
        { a: "Good question — I've logged it for the team and someone will follow up shortly. In the meantime, anything else about orders, shipping or returns?", src: 'general-faq' };
      busy = true; lastActivity = Date.now();
      setChips(true);
      addBubble('user').textContent = q;
      const typing = showTyping();
      setTimeout(() => {
        log.removeChild(typing);
        const b = addBubble('bot');
        const txt = ce('span'); b.appendChild(txt);
        stream(txt, match.a, { mode: 'word', speed: 46, onDone: () => {
          const src = ce('span', 'src'); src.innerHTML = '<i class="ti ti-file-text" style="font-size:10px"></i>from: ' + match.src;
          b.appendChild(src);
          busy = false; setChips(false); lastActivity = Date.now();
        }});
      }, RM ? 0 : 720);
    }

    function setChips(disabled) {
      chipsWrap.querySelectorAll('.chat-chip').forEach(c => c.disabled = disabled);
    }

    CHIPS.forEach(q => {
      const c = ce('button', 'chat-chip'); c.textContent = q;
      c.addEventListener('click', () => answer(q));
      chipsWrap.appendChild(c);
    });
    sendBtn.addEventListener('click', () => { const v = input.value.trim(); if (v) { input.value = ''; answer(v); } });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const v = input.value.trim(); if (v) { input.value = ''; answer(v); } } });
    input.addEventListener('input', () => { lastActivity = Date.now(); });

    // opening message
    addBubble('bot').textContent = "Hi! I'm trained on your store's docs. Ask me anything — orders, shipping, returns.";

    // ambient: if untouched ~8s, brief typing then a soft proactive prompt
    function beat() {
      if (busy) return;
      if (Date.now() - lastActivity < 7000) return;     // only when genuinely idle
      if (idleArmed) return;
      idleArmed = true;
      const typing = showTyping();
      setTimeout(() => {
        if (log.contains(typing)) log.removeChild(typing);
        const b = addBubble('bot', { extra: 'proactive' });
        b.textContent = 'Still here whenever you need — want me to check an order or our return policy?';
        lastActivity = Date.now();
        setTimeout(() => { idleArmed = false; }, 2000);
      }, 900);
    }

    cards.push({ id: 'chat', el: $('#card-chat'), running: false, wantRun: false, beat, cadence: 8000, timer: null });
  })();

  /* =================================================================
     CARD 3 — AI DASHBOARD
     ================================================================= */
  (function dashCard() {
    const chart = $('#dash-chart');
    const empty = $('#dash-empty');
    const narr  = $('#dash-narr');
    const chipsWrap = $('#dash-chips');
    const queryBox = $('#dash-query');
    const queryTxt = $('#dash-query-text');
    const spark = $('#dash-spark');
    const sparkPath = spark ? spark.querySelector('path') : null;
    const mv = $('#dash-mv');
    const md = $('#dash-md');
    if (!chart) return;

    const QUERIES = [
      { q: 'why did revenue dip in March?', type: 'bars',
        data: [{ l: 'jan', v: 78 }, { l: 'feb', v: 84 }, { l: 'mar', v: 62 }, { l: 'apr', v: 81 }, { l: 'may', v: 92 }],
        narr: 'Revenue dipped 12% in March — mostly fewer repeat orders in Bengaluru. It recovered through April.' },
      { q: 'top 3 products', type: 'bars',
        data: [{ l: 'coffee', v: 100 }, { l: 'chai kit', v: 66 }, { l: 'tumblers', v: 44 }],
        narr: 'Top sellers: filter coffee (₹1.4L), masala chai kits (₹92k), brass tumblers (₹61k) — 71% of revenue together.' },
      { q: 'forecast next month', type: 'line',
        data: [60, 64, 58, 72, 80, 88, 96],
        narr: 'On current trend, June lands around ₹4.8L — about 14% up, assuming April\'s repeat-order rate holds.' }
    ];

    let busy = false, narrHandle = null, activeChip = null;

    // sparkline
    function sparkLine(seed) {
      if (!sparkPath) return;
      const n = 14, pts = [];
      for (let i = 0; i < n; i++) {
        const base = 22 + Math.sin(i * 0.9 + seed) * 8 + (i / n) * 6;
        pts.push([i / (n - 1) * 96, 40 - base + Math.random() * 3]);
      }
      sparkPath.setAttribute('d', 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L'));
    }
    sparkLine(0);

    function clearChart() { chart.querySelectorAll('.bars, .linechart').forEach(n => n.remove()); }

    function drawBars(data) {
      clearChart(); empty.style.display = 'none';
      const wrap = ce('div', 'bars');
      const max = Math.max.apply(null, data.map(d => d.v));
      data.forEach(d => {
        const col = ce('div', 'barcol');
        const bar = ce('div', 'bar');
        const pct = Math.round(d.v / max * 100);
        const val = ce('span', 'barval'); val.textContent = d.v + '%';
        const lab = ce('span', 'barlab'); lab.textContent = d.l;
        bar.style.height = RM ? pct + '%' : '0%';
        col.appendChild(bar); col.appendChild(val); col.appendChild(lab);
        wrap.appendChild(col);
        if (!RM) requestAnimationFrame(() => requestAnimationFrame(() => {
          bar.style.height = pct + '%';
          setTimeout(() => val.classList.add('show'), 520);
        }));
        else val.classList.add('show');
      });
      chart.appendChild(wrap);
    }

    function drawLine(data) {
      clearChart(); empty.style.display = 'none';
      const W = 300, H = 120, pad = 6;
      const max = Math.max.apply(null, data), min = Math.min.apply(null, data);
      const x = i => pad + i / (data.length - 1) * (W - pad * 2);
      const y = v => H - pad - (v - min) / (max - min || 1) * (H - pad * 2);
      const pts = data.map((v, i) => [x(i), y(v)]);
      const d = 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');
      const area = d + ' L' + pts[pts.length - 1][0].toFixed(1) + ',' + H + ' L' + pts[0][0].toFixed(1) + ',' + H + ' Z';
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'linechart'); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('preserveAspectRatio', 'none');
      svg.innerHTML =
        '<defs><linearGradient id="lgrad" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="#7c6cff" stop-opacity="0.35"/><stop offset="100%" stop-color="#7c6cff" stop-opacity="0"/></linearGradient></defs>' +
        '<path class="area" d="' + area + '"/>' +
        '<path class="ln" d="' + d + '"/>' +
        '<circle class="dot-pt" cx="' + pts[pts.length - 1][0].toFixed(1) + '" cy="' + pts[pts.length - 1][1].toFixed(1) + '" r="3.5"/>';
      chart.appendChild(svg);
      const ln = svg.querySelector('.ln');
      const len = ln.getTotalLength();
      const dot = svg.querySelector('.dot-pt');
      const areaEl = svg.querySelector('.area');
      if (!RM) {
        ln.style.strokeDasharray = len; ln.style.strokeDashoffset = len;
        dot.style.opacity = 0; areaEl.style.opacity = 0;
        requestAnimationFrame(() => {
          ln.style.transition = 'stroke-dashoffset 900ms var(--ease)'; ln.style.strokeDashoffset = 0;
          areaEl.style.transition = 'opacity 700ms var(--ease) 300ms'; areaEl.style.opacity = 0.5;
          dot.style.transition = 'opacity 300ms 850ms'; dot.style.opacity = 1;
        });
      }
    }

    function ask(item, chipEl) {
      if (busy) return;
      busy = true;
      if (activeChip) activeChip.classList.remove('active');
      if (chipEl) { chipEl.classList.add('active'); activeChip = chipEl; }
      if (narrHandle) narrHandle.cancel();
      // query bar reflects the question + focus ring
      queryTxt.textContent = item.q; queryTxt.style.color = 'var(--text-on-dark)';
      queryBox.classList.add('focus');
      // analyzing shimmer
      clearChart(); empty.style.display = 'flex'; empty.textContent = 'analyzing…';
      narr.innerHTML = '';
      setTimeout(() => {
        if (item.type === 'bars') drawBars(item.data); else drawLine(item.data);
        narr.innerHTML = '<i class="ti ti-sparkles"></i>';
        const nt = ce('span'); narr.appendChild(nt);
        narrHandle = stream(nt, item.narr, { mode: 'word', speed: 40, onDone: () => {
          busy = false; queryBox.classList.remove('focus');
        }});
      }, RM ? 0 : 760);
    }

    QUERIES.forEach(item => {
      const c = ce('button', 'dash-chip'); c.textContent = item.q;
      c.addEventListener('click', () => ask(item, c));
      chipsWrap.appendChild(c);
    });

    // ambient: sparkline gently shimmers / metric ticks every ~9s
    let tickN = 0;
    function beat() {
      tickN++;
      sparkLine(tickN * 0.7);
      if (spark) { spark.classList.remove('shimmer'); void spark.offsetWidth; spark.classList.add('shimmer'); }
      // tiny metric tick
      const base = 4.2, jit = (Math.random() * 0.06 - 0.02);
      mv.textContent = '₹' + (base + jit).toFixed(2).replace(/0$/, '') + 'L';
      const pct = (2.1 + Math.random() * 0.9).toFixed(1);
      md.textContent = '+' + pct + '% vs last month';
    }

    cards.push({ id: 'dash', el: $('#card-dash'), running: false, wantRun: false, beat, cadence: 9000, timer: null });
  })();

  /* =================================================================
     DECK CONTROLLER — scroll-driven shuffle, pager, peek-click,
     settle gating, mobile fallback
     ================================================================= */
  (function deck() {
    const section = $('#ailayer');
    const stage = $('#deck-stage');
    const pager = $('#deck-pager');
    const hint = $('#deck-hint');
    if (!section || !stage) { cards.forEach(c => { c.wantRun = true; }); syncCards(); return; }

    const cardEls = [$('#card-email'), $('#card-chat'), $('#card-dash')];
    const keys = ['email', 'chat', 'dash'];
    const N = 3;
    let activeIndex = -1;
    let sectionVisible = false;
    let shuffleTimer = null;
    let hintDismissed = false;

    const isDesktop = () => window.matchMedia('(min-width: 981px)').matches;

    function setSlots(idx) {
      cardEls.forEach((el, i) => {
        el.classList.remove('is-front', 'is-mid', 'is-back');
        const rel = (i - idx + N) % N;
        el.classList.add(rel === 0 ? 'is-front' : rel === 1 ? 'is-mid' : 'is-back');
      });
      if (pager) pager.querySelectorAll('.pager-item').forEach((p, i) => p.classList.toggle('active', i === idx));
    }

    // only the settled front card (desktop) runs ambient; back cards inert
    function applyAmbient(settled) {
      cards.forEach(c => { c.wantRun = false; });
      if (isDesktop() && settled && sectionVisible && activeIndex >= 0) {
        const f = cards.find(c => c.id === keys[activeIndex]);
        if (f) f.wantRun = true;
      }
      syncCards();
    }

    function advanceTo(idx) {
      if (idx === activeIndex) return;
      const first = activeIndex < 0;
      activeIndex = idx;
      const outgoingFront = cardEls.find(el => el.classList.contains('is-front'));
      setSlots(idx);
      if (RM || !isDesktop() || first) { applyAmbient(true); return; }
      // if the old front card is travelling all the way to the back, keep it on
      // top through the move so it reads as the top card being placed behind
      if (outgoingFront && outgoingFront.classList.contains('is-back')) {
        outgoingFront.classList.add('is-leaving');
        clearTimeout(outgoingFront._leaveT);
        outgoingFront._leaveT = setTimeout(() => outgoingFront.classList.remove('is-leaving'), 560);
      }
      stage.classList.add('shuffling');
      applyAmbient(false);                       // calm everything during the shuffle
      clearTimeout(shuffleTimer);
      shuffleTimer = setTimeout(() => {
        stage.classList.remove('shuffling');
        applyAmbient(true);                      // front becomes interactive + idle
      }, 560);
    }

    /* scroll → progress 0..1 → activeIndex via thirds (desktop only) */
    let ticking = false;
    function onScroll() {
      if (!isDesktop()) return;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const total = section.offsetHeight - window.innerHeight;
        const scrolled = Math.min(Math.max(-section.getBoundingClientRect().top, 0), total);
        const p = total > 0 ? scrolled / total : 0;
        const idx = Math.max(0, Math.min(N - 1, Math.floor(p * N)));
        advanceTo(idx);
        if (!hintDismissed && p > 0.015) { hintDismissed = true; if (hint) hint.classList.remove('show'); }
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    function scrollToIndex(i) {
      const total = section.offsetHeight - window.innerHeight;
      const targetP = (i + 0.5) / N;
      window.scrollTo({ top: section.offsetTop + targetP * total, behavior: RM ? 'auto' : 'smooth' });
    }

    /* pager → smooth-scroll runway to that card's segment */
    if (pager) pager.querySelectorAll('.pager-item').forEach(p => {
      p.addEventListener('click', () => { if (isDesktop()) scrollToIndex(+p.dataset.i); });
    });

    /* clicking a peeking (mid/back) card brings it forward */
    cardEls.forEach((el, i) => {
      el.addEventListener('click', () => {
        if (!isDesktop() || el.classList.contains('is-front')) return;
        scrollToIndex(i);
      });
    });

    if ('IntersectionObserver' in window) {
      /* section visibility gates desktop ambient */
      const visIO = new IntersectionObserver((entries) => {
        entries.forEach(e => { sectionVisible = e.isIntersecting; });
        if (isDesktop()) applyAmbient(!stage.classList.contains('shuffling'));
      }, { threshold: 0 });
      visIO.observe(section);

      /* mobile: per-card near-viewport ambient */
      const mobileIO = new IntersectionObserver((entries) => {
        if (isDesktop()) return;
        entries.forEach(e => {
          const c = cards.find(cc => ('card-' + cc.id) === e.target.id);
          if (c) c.wantRun = e.isIntersecting;
        });
        syncCards();
      }, { rootMargin: '120px 0px 120px 0px', threshold: 0 });
      cardEls.forEach(el => mobileIO.observe(el));

      /* hint on first view (desktop) */
      const hintIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting && !hintDismissed && isDesktop() && hint) hint.classList.add('show');
        });
      }, { threshold: 0.3 });
      hintIO.observe(section);
    } else {
      sectionVisible = true;
    }

    function init() {
      setSlots(0);
      if (isDesktop()) { activeIndex = -1; onScroll(); }
      else { activeIndex = 0; cards.forEach(c => { c.wantRun = false; }); syncCards(); }
    }
    init();

    /* re-evaluate on mode switch */
    let rt = null;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        setSlots(activeIndex < 0 ? 0 : activeIndex);
        if (isDesktop()) onScroll();
        else { cards.forEach(c => { c.wantRun = false; }); syncCards(); }
      }, 180);
    }, { passive: true });
  })();

  /* =================================================================
     JOURNEY THREAD (inherited)
     ================================================================= */
  (function () {
    const nodesWrap = $('#journey-nodes');
    const sections = Array.from(document.querySelectorAll('section[id]'));
    if (!nodesWrap || !sections.length) return;
    const labelMap = { 'leadin': '03 · solutions', 'ailayer': '04 · ai layer', 'trailing': '05 · next' };
    const nodeEls = sections.map((s, i) => {
      const el = ce('span', 'node');
      const lbl = ce('span', 'lbl'); lbl.textContent = labelMap[s.id] || String(i + 1).padStart(2, '0');
      el.appendChild(lbl);
      el.addEventListener('click', () => window.scrollTo({ top: window.scrollY + s.getBoundingClientRect().top, behavior: 'smooth' }));
      nodesWrap.appendChild(el); return el;
    });
    function position() {
      const track = nodesWrap.getBoundingClientRect();
      const docH = document.documentElement.scrollHeight;
      sections.forEach((s, i) => { nodeEls[i].style.top = (Math.min(1, Math.max(0, s.offsetTop / docH)) * track.height) + 'px'; });
    }
    function update() {
      const mid = window.scrollY + window.innerHeight * 0.45;
      let activeIdx = 0;
      sections.forEach((s, i) => {
        if (s.offsetTop <= mid) activeIdx = i;
        nodeEls[i].classList.toggle('filled', s.offsetTop <= window.scrollY + window.innerHeight * 0.55);
      });
      nodeEls.forEach((el, i) => el.classList.toggle('active', i === activeIdx));
    }
    position(); update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', () => { position(); update(); }, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { position(); update(); });
  })();

})();
