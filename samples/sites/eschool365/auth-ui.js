/* ============================================================================
   eschool365 — login screen + mock Google "Choose an account" chooser.
   Pure simulated UI (no Google SDK / OAuth / network). Renders before the app;
   on selection it writes a session via RWAuth and calls props.onAuthed().
   ============================================================================ */
(function () {
  var h = React.createElement;
  var IND = { 100: '#E2E4FF', 500: '#5B47E0', 600: '#4E3DD2' };
  var C = { ink: '#1C2230', ink2: '#10141F', mut: '#737A88', mut2: '#9AA0AC', line: '#E7E9EF', line2: '#EEF0F3', bg: '#F4F6F8' };

  // Recognisable multi-colour Google "G" for the simulated chooser (mock UI).
  function googleG(sz) {
    sz = sz || 18;
    return h('svg', { width: sz, height: sz, viewBox: '0 0 48 48', 'aria-hidden': true, style: { flex: 'none' } },
      h('path', { fill: '#EA4335', d: 'M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z' }),
      h('path', { fill: '#4285F4', d: 'M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z' }),
      h('path', { fill: '#FBBC05', d: 'M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z' }),
      h('path', { fill: '#34A853', d: 'M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z' })
    );
  }

  function initials(name) { return (name || '?').split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase(); }
  function avatarCircle(name, color, sz) {
    sz = sz || 40;
    return h('div', { style: { width: sz, height: sz, borderRadius: '50%', background: color || IND[500], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: Math.round(sz * 0.38), flex: 'none' } }, initials(name));
  }

  function RoleCard(r, onClick) {
    return h('button', { key: r.role, onClick: onClick, 'aria-label': 'Sign in as ' + r.label,
      onMouseEnter: function (e) { e.currentTarget.style.borderColor = r.accent; e.currentTarget.style.boxShadow = '0 4px 14px ' + r.accent + '22'; },
      onMouseLeave: function (e) { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.boxShadow = 'none'; },
      style: { display: 'flex', alignItems: 'center', gap: 13, width: '100%', textAlign: 'left', padding: '12px 14px', border: '1px solid ' + C.line, borderRadius: 12, background: '#fff', cursor: 'pointer', transition: 'border-color .15s, box-shadow .15s' } },
      avatarCircle(r.label, r.accent, 40),
      h('div', { style: { flex: 1, minWidth: 0 } },
        h('div', { style: { fontWeight: 700, fontSize: 14, color: C.ink2 } }, r.label),
        h('div', { style: { fontSize: 12, color: C.mut, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, r.desc)),
      h('div', { style: { color: C.mut2, fontSize: 20, lineHeight: 1 } }, '›'));
  }

  function RWLogin(props) {
    var s = React.useState(false), chooser = s[0], setChooser = s[1];
    var doLogin = function (role, opts) { RWAuth.login(role, opts); props.onAuthed(); };

    var card = h('div', { style: { background: '#fff', borderRadius: 18, boxShadow: '0 24px 60px rgba(16,20,31,.16)', padding: '30px 28px 22px', width: '100%', maxWidth: 432 } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 11, justifyContent: 'center', marginBottom: 6 } },
        h('div', { style: { width: 40, height: 40, borderRadius: 11, background: IND[500], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 21, boxShadow: '0 4px 12px ' + IND[500] + '66' } }, 'e'),
        h('div', { style: { fontWeight: 800, fontSize: 22, letterSpacing: '-.5px', color: C.ink2 } }, 'eschool365')),
      h('div', { style: { textAlign: 'center', fontSize: 13.5, color: C.mut, marginBottom: 20 } }, 'Sign in to the Greenfield International demo workspace'),

      h('div', { style: { fontSize: 11, fontWeight: 700, color: C.mut2, textTransform: 'uppercase', letterSpacing: .5, marginBottom: 9 } }, 'Sign in as'),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 9 } },
        RWAuth.ROLES.map(function (r) { return RoleCard(r, function () { doLogin(r.role, { via: 'role' }); }); })),

      h('div', { style: { display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' } },
        h('div', { style: { flex: 1, height: 1, background: C.line } }), h('span', { style: { fontSize: 11.5, color: C.mut2, fontWeight: 600 } }, 'OR'), h('div', { style: { flex: 1, height: 1, background: C.line } })),

      h('button', { onClick: function () { setChooser(true); }, style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '11px', border: '1px solid ' + C.line, borderRadius: 10, background: '#fff', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: '#3c4043' } }, googleG(18), 'Continue with Google'),

      h('div', { style: { marginTop: 18 } },
        h('div', { style: { fontSize: 11, fontWeight: 700, color: C.mut2, textTransform: 'uppercase', letterSpacing: .5, marginBottom: 9 } }, 'Just exploring? Continue as guest'),
        h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 } },
          RWAuth.ROLES.map(function (r) {
            return h('button', { key: r.role, onClick: function () { doLogin(r.role, { guest: true }); },
              style: { padding: '9px 10px', border: '1px dashed ' + C.line, borderRadius: 9, background: C.bg, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: C.mut, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, 'Guest ' + r.label);
          }))),

      h('div', { style: { marginTop: 20, padding: '10px 12px', background: '#FDF3E5', border: '1px solid #D9770633', borderRadius: 9, fontSize: 11.5, color: '#9a6a12', textAlign: 'center', lineHeight: 1.5 } },
        'Demo only — authentication is mocked for testing. No real account, no Google sign-in, no network. Your data stays in this browser.'));

    var chooserModal = chooser && h('div', { style: { position: 'fixed', inset: 0, background: 'rgba(16,20,31,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 18 }, onClick: function () { setChooser(false); } },
      h('div', { onClick: function (e) { e.stopPropagation(); }, role: 'dialog', 'aria-label': 'Choose an account', style: { background: '#fff', borderRadius: 14, boxShadow: '0 24px 60px rgba(16,20,31,.3)', width: '100%', maxWidth: 400, overflow: 'hidden' } },
        h('div', { style: { padding: '22px 24px 6px' } }, googleG(24),
          h('div', { style: { fontSize: 20, color: '#202124', marginTop: 14, fontWeight: 400 } }, 'Choose an account'),
          h('div', { style: { fontSize: 13.5, color: '#5f6368', marginTop: 3 } }, 'to continue to ', h('span', { style: { color: IND[600], fontWeight: 600 } }, 'eschool365'))),
        h('div', { style: { padding: '12px 0 4px' } },
          RWAuth.GOOGLE.map(function (a, i) {
            return h('button', { key: i, onClick: function () { RWAuth.login(a.role, { name: a.name, email: a.email, childRegs: a.childRegs, via: 'google' }); props.onAuthed(); },
              onMouseEnter: function (e) { e.currentTarget.style.background = '#f7f8f9'; }, onMouseLeave: function (e) { e.currentTarget.style.background = 'transparent'; },
              style: { display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '10px 24px', border: 0, background: 'transparent', cursor: 'pointer', textAlign: 'left' } },
              avatarCircle(a.name, ['#1a73e8', '#188038', '#d93025', '#e37400', '#9334e6'][i % 5], 36),
              h('div', null, h('div', { style: { fontSize: 14, color: '#202124', fontWeight: 500 } }, a.name), h('div', { style: { fontSize: 12.5, color: '#5f6368' } }, a.email)));
          })),
        h('div', { style: { padding: '6px 24px 16px', borderTop: '1px solid #f1f3f4' } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', color: '#5f6368', fontSize: 14 } },
            h('div', { style: { width: 36, height: 36, borderRadius: '50%', border: '1px dashed #bdc1c6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#5f6368' } }, '+'), 'Use another account'),
          h('div', { style: { fontSize: 11, color: '#9aa0a6', marginTop: 4, lineHeight: 1.5 } }, 'Demo only — a simulated chooser. No real Google sign-in or network request occurs.'))));

    return h('div', { style: { minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'radial-gradient(1100px 560px at 50% -10%, ' + IND[100] + ' 0%, ' + C.bg + ' 55%)', fontFamily: 'Inter,-apple-system,Segoe UI,sans-serif', overflowY: 'auto' } }, card, chooserModal);
  }

  window.RWLogin = RWLogin;
})();
