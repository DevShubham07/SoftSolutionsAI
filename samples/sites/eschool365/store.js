/* ============================================================================
   eschool365 — persistence layer (localStorage). Frontend-only, no network.
   - Namespaced ("eschool365.v1.*"), schema-versioned, resilient (try/catch +
     per-slice re-seed) — never white-screens on corrupt data.
   - Guest sandbox namespace ("eschool365.guest.v1.*") so guests can't corrupt
     the main demo store.
   - Persists ONLY pure-data state slices (overlays/UI state stay in memory).
   - Wired to the React app: boot() seeds + hydrates in the constructor;
     persist() (debounced, per-slice shallow diff) runs in componentDidUpdate.
   ============================================================================ */
(function () {
  var NS_MAIN  = 'eschool365.v1';
  var NS_GUEST = 'eschool365.guest.v1';
  var SCHEMA   = 1;                 // bump to invalidate old seeds on breaking changes
  var ns = NS_MAIN;

  // State keys that are persisted (pure JSON only). Extra keys are
  // forward-compatible: absent slices are simply skipped at seed + hydrate.
  var SLICES = ['students','teachers','tt','subs','fees','promoted','attByDate','forms',
    'ttSet','secStrength','feeStructSet','adm','archive','marks','homeworks',
    'notices','messages','events','settings','logins','img','salary','staffAdded','classesAdded'];

  var last = {};        // last-saved JSON string per slice (shallow diff)
  var saveTimer = null;

  function keyOf(slice) { return ns + '.' + slice; }
  function readRaw(k)  { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function writeRaw(k, v) {
    try { localStorage.setItem(k, v); return true; }
    catch (e) { console.warn('[store] write failed:', k, e && e.name); return false; }
  }

  function getSlice(slice, fallback) {
    var raw = readRaw(keyOf(slice));
    if (raw == null) return fallback;
    try { return JSON.parse(raw); }
    catch (e) {
      console.warn('[store] corrupt slice "' + slice + '" — dropping & re-seeding');
      try { localStorage.removeItem(keyOf(slice)); } catch (_) {}
      return fallback;
    }
  }
  function setSlice(slice, value) {
    var s; try { s = JSON.stringify(value); } catch (e) { return false; }
    last[slice] = s;
    return writeRaw(keyOf(slice), s);
  }

  var RWStore = {
    NS_MAIN: NS_MAIN, NS_GUEST: NS_GUEST, SLICES: SLICES,
    namespace: function () { return ns; },
    setNamespace: function (n) { ns = n; last = {}; },
    useGuest: function (on) { ns = on ? NS_GUEST : NS_MAIN; last = {}; },
    hasData: function () { return readRaw(ns + '.__schema') != null; },

    /* Seed-on-first-load + overlay persisted slices onto component.state.
       Called from the constructor (mutating state before first render is fine). */
    boot: function (component) {
      var st = component.state, i;
      try {
        var schemaRaw = readRaw(ns + '.__schema');
        if (schemaRaw == null || parseInt(schemaRaw, 10) !== SCHEMA) {
          if (schemaRaw != null) this.clear();          // stale schema -> wipe namespace
          for (i = 0; i < SLICES.length; i++) {         // seed from default state
            if (st[SLICES[i]] !== undefined) setSlice(SLICES[i], st[SLICES[i]]);
          }
          writeRaw(ns + '.__schema', String(SCHEMA));
        } else {
          for (i = 0; i < SLICES.length; i++) {         // overlay saved over seed defaults
            var v = getSlice(SLICES[i], undefined);
            if (v !== undefined) { st[SLICES[i]] = v; last[SLICES[i]] = null; }
          }
        }
      } catch (e) { console.warn('[store] boot failed — using in-memory seed', e); }
    },

    /* Persist changed slices (debounced ~160ms, per-slice shallow diff).
       Called from componentDidUpdate after every committed mutation. */
    persist: function (state) {
      if (saveTimer) return;
      saveTimer = setTimeout(function () {
        saveTimer = null;
        for (var i = 0; i < SLICES.length; i++) {
          var sl = SLICES[i];
          if (state[sl] === undefined) continue;
          var s; try { s = JSON.stringify(state[sl]); } catch (e) { continue; }
          if (s !== last[sl]) { last[sl] = s; writeRaw(keyOf(sl), s); }
        }
      }, 160);
    },

    /* Generic key/value API (used by auth.js, settings, etc.) */
    get:    function (slice, fb) { return getSlice(slice, fb); },
    set:    function (slice, v)  { return setSlice(slice, v); },
    update: function (slice, fn, fb) { var v = fn(getSlice(slice, fb)); setSlice(slice, v); return v; },
    remove: function (slice) { try { localStorage.removeItem(keyOf(slice)); } catch (e) {} delete last[slice]; },
    query:  function (slice, pred) { var v = getSlice(slice, []); return Array.isArray(v) ? v.filter(pred) : []; },

    clear: function () {
      try {
        var pre = ns + '.', ks = [], i, k;
        for (i = 0; i < localStorage.length; i++) { k = localStorage.key(i); if (k && k.indexOf(pre) === 0) ks.push(k); }
        for (i = 0; i < ks.length; i++) localStorage.removeItem(ks[i]);
      } catch (e) {}
      last = {};
    },
    resetDemo: function () { this.clear(); try { location.reload(); } catch (e) {} },

    /* Downscale an uploaded image File to a small base64 JPEG (quota-safe). cb(dataUrl|null). */
    downscaleImage: function (file, maxPx, cb) {
      maxPx = maxPx || 256;
      var fr = new FileReader();
      fr.onload = function () {
        var img = new Image();
        img.onload = function () {
          var sc = Math.min(1, maxPx / Math.max(img.width, img.height));
          var w = Math.max(1, Math.round(img.width * sc)), hh = Math.max(1, Math.round(img.height * sc));
          var cv = document.createElement('canvas'); cv.width = w; cv.height = hh;
          cv.getContext('2d').drawImage(img, 0, 0, w, hh);
          try { cb(cv.toDataURL('image/jpeg', 0.82)); } catch (e) { cb(null); }
        };
        img.onerror = function () { cb(null); };
        img.src = fr.result;
      };
      fr.onerror = function () { cb(null); };
      fr.readAsDataURL(file);
    }
  };

  window.RWStore = RWStore;
})();
