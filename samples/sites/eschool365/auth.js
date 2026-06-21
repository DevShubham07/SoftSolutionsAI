/* ============================================================================
   eschool365 — mock auth (DEMO/TESTING ONLY, clearly labelled in the UI).
   Session model {role, displayName, email, isGuest, loginAt, via}
   persisted in localStorage. No real OAuth, no Google SDK, no network.
   RBAC itself is enforced structurally by the per-role NAV trees + canDo().
   ============================================================================ */
(function () {
  var KEY = 'eschool365.session';

  // Personas offered on the login screen (4 roles; student = combined Parent/Student).
  var ROLES = [
    { role: 'admin',   label: 'Admin',             desc: 'Full institute — students, fees, staff, settings', name: 'Anita Menon',  email: 'principal@greenfield.edu',   accent: '#5B47E0' },
    { role: 'coord',   label: 'Class Coordinator', desc: 'Your assigned classes — students, attendance, marks', name: 'Rahul Nair',   email: 'coord.viiia@greenfield.edu', accent: '#0E9488' },
    { role: 'teach',   label: 'Teacher',           desc: 'Your class — attendance, homework, marks, timetable', name: 'Rohit Verma',  email: 'r.verma@greenfield.edu',     accent: '#2563EB' },
    { role: 'student', label: 'Parent / Student',  desc: 'Fees, attendance, results, homework & notices',       name: 'Nikhil Patel', email: 'n.patel@greenfield.edu',     accent: '#059669' }
  ];

  // Seeded accounts shown in the mock Google "Choose an account" chooser.
  var GOOGLE = [
    { name: 'Anita Menon',  email: 'principal@greenfield.edu',   role: 'admin' },
    { name: 'Rahul Nair',   email: 'coord.viiia@greenfield.edu', role: 'coord' },
    { name: 'Rohit Verma',  email: 'r.verma@greenfield.edu',     role: 'teach' },
    { name: 'Nikhil Patel', email: 'n.patel@gmail.com',          role: 'student' },
    { name: 'Diya Patel',   email: 'diya.patel@greenfield.edu',  role: 'student' }
  ];

  function read()  { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function write(s){ try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} return s; }
  function now()   { try { return Date.now(); } catch (e) { return 0; } }

  window.RWAuth = {
    ROLES: ROLES, GOOGLE: GOOGLE,
    base: function (role) { for (var i = 0; i < ROLES.length; i++) if (ROLES[i].role === role) return ROLES[i]; return { role: role, label: role }; },
    session: read,
    login: function (role, opts) {
      opts = opts || {}; var b = this.base(role);
      return write({
        role: role,
        displayName: opts.name || (opts.guest ? 'Guest ' + (b.label || role) : (b.name || b.label)),
        email: opts.email != null ? opts.email : (b.email || ''),
        isGuest: !!opts.guest,
        loginAt: now(),
        via: opts.via || 'role'
      });
    },
    switchRole: function (role) {
      var s = read(); if (!s) return null; var b = this.base(role);
      s.role = role;
      if (s.isGuest) { s.displayName = 'Guest ' + (b.label || role); }
      else { s.displayName = b.name || b.label; s.email = b.email || ''; }
      return write(s);
    },
    logout: function () { try { localStorage.removeItem(KEY); } catch (e) {} }
  };
})();
