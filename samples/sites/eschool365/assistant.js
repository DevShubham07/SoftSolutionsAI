/* ============================================================================
   eschool365 — "Rae", the in-app AI support assistant (rule/intent-based; no
   LLM, no backend, no network). Reads the live store (RWStore) + session role
   to give contextual answers, and deep-links the user to the right screen via
   the hash router ("Take me there"). Floats on every authenticated screen.
   ============================================================================ */
(function () {
  var h = React.createElement;
  var IND = { 500: '#5B47E0', 600: '#4E3DD2', 700: '#4031B0' };
  var C = { ink: '#1C2230', ink2: '#10141F', mut: '#737A88', line: '#E7E9EF', line2: '#EEF0F3', bg: '#F4F6F8' };
  var rupee = function (n) { return '₹' + Number(n || 0).toLocaleString('en-IN'); };

  /* A "digitized human" avatar (gradient sphere + stylised head/shoulders + face). */
  function avatar(size) {
    size = size || 52;
    var gid = 'raeg', gf = 'raef';
    return h('svg', { width: size, height: size, viewBox: '0 0 64 64', 'aria-hidden': true, style: { display: 'block', borderRadius: '50%' } },
      h('defs', null,
        h('radialGradient', { id: gid, cx: '35%', cy: '28%', r: '85%' },
          h('stop', { offset: '0%', stopColor: '#8B7BF0' }), h('stop', { offset: '55%', stopColor: IND[500] }), h('stop', { offset: '100%', stopColor: IND[700] })),
        h('linearGradient', { id: gf, x1: 0, y1: 0, x2: 0, y2: 1 },
          h('stop', { offset: '0%', stopColor: '#FCE9DD' }), h('stop', { offset: '100%', stopColor: '#F4CDB6' }))),
      h('circle', { cx: 32, cy: 32, r: 32, fill: 'url(#' + gid + ')' }),
      h('path', { d: 'M16 56c1.5-9 7.8-14 16-14s14.5 5 16 14z', fill: '#3B2DA8', opacity: .55 }),
      h('path', { d: 'M19 57c1.3-7.6 6.4-12 13-12s11.7 4.4 13 12z', fill: '#fff', opacity: .12 }),
      h('circle', { cx: 32, cy: 27, r: 11.5, fill: 'url(#' + gf + ')' }),
      h('path', { d: 'M21 25c0-7 5-11 11-11s11 4 11 11c0-1-2.5-3-4-3-1 0-2 .6-3 .6-2 0-3-1.6-5-1.6-4 0-7 2-10 5z', fill: '#2A1F6E' }),
      h('circle', { cx: 28, cy: 27.5, r: 1.5, fill: '#3A2E78' }), h('circle', { cx: 36, cy: 27.5, r: 1.5, fill: '#3A2E78' }),
      h('path', { d: 'M29 32q3 2.4 6 0', stroke: '#C98B6B', strokeWidth: 1.4, fill: 'none', strokeLinecap: 'round' }),
      h('circle', { cx: 48, cy: 16, r: 2.4, fill: '#33E1A1' }),
      h('circle', { cx: 48, cy: 16, r: 2.4, fill: 'none', stroke: '#fff', strokeWidth: .8, opacity: .8 }));
  }

  function ctxData() {
    var students = RWStore.get('students', []) || [];
    var fees = RWStore.get('fees', {}) || {};
    var ttSet = RWStore.get('ttSet', {}) || {};
    var SEC = ['VI-A','VI-B','VII-A','VII-B','VIII-A','VIII-B','IX-A','IX-B','X-A','X-B'];
    var defs = students.filter(function (s) { return Math.max(0, (s[4] || 0) - (fees[s[0]] || 0)) > 0; });
    var outstanding = defs.reduce(function (a, s) { return a + Math.max(0, (s[4] || 0) - (fees[s[0]] || 0)); }, 0);
    var noTT = SEC.filter(function (c) { return !ttSet[c]; });
    return { count: students.length, defs: defs, outstanding: outstanding, noTT: noTT };
  }

  function answer(qRaw, role) {
    var q = (qRaw || '').toLowerCase(), d = ctxData();
    var staff = role === 'admin' || role === 'coord' || role === 'teach';
    var go = function (page) { return page ? { label: 'Take me there', page: page } : null; };
    if (/defaulter|outstanding|overdue|who owe/.test(q))
      return { text: d.defs.length ? ('There ' + (d.defs.length === 1 ? 'is 1 student' : 'are ' + d.defs.length + ' students') + ' with outstanding fees, totalling ' + rupee(d.outstanding) + '.') : 'No outstanding fees right now — everyone is cleared. 🎉'.replace('🎉',''), action: go((role === 'admin' || role === 'coord') ? 'defaulters' : 'payonline') };
    if (/collect.*fee|take.*payment|^pay$|pay fee|^fee|fees\b/.test(q))
      return role === 'student'
        ? { text: 'Open Pay Fees, choose the invoice and pay — your balance, status and receipt update instantly.', action: go('payonline') }
        : { text: 'Go to Fees → Collect Fees, find the student and hit Collect. Partial payments are allowed; overpayment is blocked.', action: go('collect') };
    if (/add.*student|admission|enrol|new student|enquir/.test(q))
      return { text: 'Use Students → Admissions → New Enquiry. The wizard runs Enquiry → Provisional → Enrolled with duplicate, capacity and fee-structure checks.', action: go('admission') };
    if (/promot/.test(q))
      return { text: d.defs.length ? ('Promotion is blocked when a selected student has dues — ' + d.defs.length + ' currently owe fees. An admin can override with a typed reason.') : 'Select students in Promote and confirm; anyone with dues is blocked unless an admin overrides with a reason.', action: go('promote') };
    if (/attendance|present|absent|register/.test(q))
      return staff
        ? { text: 'Open Attendance → Students, set the date, mark P/A/L, then Lock. Future dates and uncovered periods are blocked.', action: go('markatt') }
        : { text: 'Open My Attendance to see your day-by-day record and term %.', action: go('myatt') };
    if (/marks|exam|grade|result|report card/.test(q))
      return staff
        ? { text: 'Enter marks in Exams → Add/Update Marks (validated ≤ max), then publish to generate report cards.', action: go('exammarks') }
        : { text: 'Open My Result Card for your published results.', action: go('myresult') };
    if (/timetable|schedule|period|substitut/.test(q)) {
      var tp = (role === 'admin' || role === 'coord') ? 'tt_edit' : 'tt_view';
      var extra = d.noTT.length ? (' Heads up: ' + d.noTT.length + ' section(s) have no timetable yet.') : '';
      return { text: 'Open Timetable to ' + ((role === 'admin' || role === 'coord') ? 'build it, drag subjects and assign substitutes.' : 'view your weekly schedule.') + extra, action: go(tp) };
    }
    if (/reset|clear data|start over|wipe/.test(q))
      return { text: 'You can reset the demo to its seed data from Settings → or I can do it for you now.', action: { label: 'Reset demo data', reset: true } };
    if (/hello|^hi|hey|help|what can you|who are you/.test(q))
      return { text: "Hi! I'm Rae, your eschool365 assistant. Ask me how to do something, or tap a suggestion below — I can take you straight there.", chips: true };
    return { text: "I can help with fees, attendance, admissions, timetable, marks and more. Pick a suggestion below, or just ask in your own words.", chips: true };
  }

  function chipsFor(role) {
    if (role === 'student') return ['Pay fees', 'View report card', 'My attendance', 'My timetable'];
    if (role === 'teach') return ['Mark attendance', 'Enter marks', 'My timetable'];
    if (role === 'coord') return ['Mark attendance', 'Show defaulters', 'Add a student'];
    return ['Collect a fee', 'Add a student', 'Why is promotion blocked?', 'Show defaulters', 'Reset demo data'];
  }

  function RWAssistant(props) {
    var role = (props.session && props.session.role) || 'admin';
    var oS = React.useState(false), open = oS[0], setOpen = oS[1];
    var mS = React.useState([{ from: 'rae', text: "Hi! I'm Rae — your eschool365 assistant. How can I help?", chips: true }]); var msgs = mS[0], setMsgs = mS[1];
    var tS = React.useState(false), typing = tS[0], setTyping = tS[1];
    var iS = React.useState(''), input = iS[0], setInput = iS[1];
    var listRef = React.useRef(null);
    React.useEffect(function () { if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight; }, [msgs, typing, open]);

    function doAction(a) { if (!a) return; if (a.reset) { RWStore.resetDemo(); return; } if (a.page) { location.hash = RWRouter.build(role, a.page); setOpen(false); } }
    function send(text) {
      if (!text || !text.trim()) return;
      var a = answer(text, role);
      setMsgs(function (m) { return m.concat([{ from: 'user', text: text }]); });
      setInput(''); setTyping(true);
      setTimeout(function () { setTyping(false); setMsgs(function (m) { return m.concat([{ from: 'rae', text: a.text, action: a.action, chips: a.chips }]); }); }, 520);
    }

    var bubble = function (m, i) {
      var mine = m.from === 'user';
      return h('div', { key: i, style: { display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 9 } },
        h('div', { style: { maxWidth: '82%' } },
          h('div', { style: { background: mine ? IND[500] : '#fff', color: mine ? '#fff' : C.ink, border: mine ? 0 : '1px solid ' + C.line, borderRadius: mine ? '13px 13px 4px 13px' : '13px 13px 13px 4px', padding: '9px 12px', fontSize: 13, lineHeight: 1.5, boxShadow: mine ? 'none' : '0 1px 2px rgba(20,30,55,.05)', whiteSpace: 'pre-wrap' } }, m.text),
          m.action && h('button', { onClick: function () { doAction(m.action); }, style: { marginTop: 7, display: 'inline-flex', alignItems: 'center', gap: 6, background: m.action.reset ? '#FCEDED' : IND[500] + '14', color: m.action.reset ? '#DC2626' : IND[600], border: 0, borderRadius: 8, padding: '7px 12px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' } }, m.action.label, ' →'),
          m.chips && h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 } },
            chipsFor(role).map(function (c, j) { return h('button', { key: j, onClick: function () { send(c); }, style: { background: '#fff', border: '1px solid ' + C.line, color: IND[600], borderRadius: 16, padding: '6px 11px', fontSize: 12, fontWeight: 600, cursor: 'pointer' } }, c); }))));
    };

    var header = h('div', { style: { display: 'flex', alignItems: 'center', gap: 11, padding: '12px 14px', background: 'linear-gradient(120deg,' + IND[600] + ',' + IND[500] + ')', color: '#fff', flex: 'none' } },
      avatar(40),
      h('div', { style: { flex: 1, lineHeight: 1.25 } }, h('div', { style: { fontWeight: 800, fontSize: 14.5 } }, 'Rae'),
        h('div', { style: { fontSize: 11.5, opacity: .92, display: 'flex', alignItems: 'center', gap: 6 } }, h('span', { style: { width: 7, height: 7, borderRadius: 7, background: '#33E1A1', display: 'inline-block' } }), 'AI Assistant · online')),
      h('button', { onClick: function () { setOpen(false); }, 'aria-label': 'Close assistant', style: { background: 'rgba(255,255,255,.18)', border: 0, color: '#fff', width: 28, height: 28, borderRadius: 8, cursor: 'pointer', fontSize: 16, lineHeight: 1 } }, '×'));

    var list = h('div', { ref: listRef, style: { flex: 1, overflowY: 'auto', padding: '14px', background: C.bg } },
      msgs.map(bubble),
      typing && h('div', { style: { display: 'flex', gap: 4, padding: '8px 12px', background: '#fff', border: '1px solid ' + C.line, borderRadius: '13px 13px 13px 4px', width: 'fit-content' } },
        [0, 1, 2].map(function (k) { return h('span', { key: k, className: 'rae-dot', style: { animationDelay: (k * 0.15) + 's' } }); })));

    var inputbar = h('form', { onSubmit: function (e) { e.preventDefault(); send(input); }, style: { display: 'flex', gap: 8, padding: 10, borderTop: '1px solid ' + C.line, background: '#fff', flex: 'none' } },
      h('input', { value: input, onChange: function (e) { setInput(e.target.value); }, placeholder: 'Ask Rae anything…', 'aria-label': 'Message Rae', style: { flex: 1, border: '1px solid ' + C.line, borderRadius: 9, padding: '9px 12px', fontSize: 13, outline: 'none' } }),
      h('button', { type: 'submit', 'aria-label': 'Send', style: { background: IND[500], color: '#fff', border: 0, borderRadius: 9, width: 40, cursor: 'pointer', fontSize: 16, flex: 'none' } }, '➤'));

    var launcher = !open && h('button', { onClick: function () { setOpen(true); }, 'aria-label': 'Open Rae, the AI assistant', className: 'rae-launch',
      style: { position: 'fixed', right: 20, bottom: 20, zIndex: 400, width: 58, height: 58, borderRadius: '50%', border: 0, padding: 0, cursor: 'pointer', background: 'transparent', boxShadow: '0 8px 22px rgba(91,71,224,.45)' } },
      avatar(58),
      h('span', { style: { position: 'absolute', right: -2, top: -2, background: '#11141F', color: '#fff', fontSize: 8.5, fontWeight: 800, letterSpacing: .5, padding: '2px 4px', borderRadius: 5, border: '1.5px solid #fff' } }, 'AI'),
      h('span', { className: 'rae-pulse', style: { position: 'absolute', right: 3, bottom: 3, width: 12, height: 12, borderRadius: 12, background: '#33E1A1', border: '2px solid #fff' } }));

    var panel = open && h('div', { className: 'rae-panel', role: 'dialog', 'aria-label': 'Rae assistant',
      style: { position: 'fixed', right: 20, bottom: 20, zIndex: 401, width: 'min(380px, calc(100vw - 32px))', height: 'min(560px, calc(100vh - 40px))', background: '#fff', borderRadius: 16, boxShadow: '0 24px 60px rgba(16,20,31,.32)', display: 'flex', flexDirection: 'column', overflow: 'hidden' } },
      header, list, inputbar);

    return h('div', { className: 'rae-root' }, launcher, panel);
  }

  window.RWAssistant = RWAssistant;
})();
