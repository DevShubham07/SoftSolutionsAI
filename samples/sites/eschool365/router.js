/* ============================================================================
   eschool365 — tiny hash router. URLs look like #/<role>/<page>[/<param>]
   (e.g. #/admin/allstd, #/admin/stdprofile/2026-0143). The app component owns
   navigation state; this module only parses/builds the hash. Refresh-safe and
   back/forward-friendly because navigation writes to location.hash (history).
   ============================================================================ */
(function () {
  window.RWRouter = {
    ROLES: { admin: 1, coord: 1, teach: 1, student: 1 },
    parse: function () {
      var raw = (location.hash || '').replace(/^#\/?/, '');
      var p = raw.split('/').filter(Boolean).map(function (x) { try { return decodeURIComponent(x); } catch (e) { return x; } });
      return { role: p[0] || null, page: p[1] || null, param: p[2] || null };
    },
    build: function (role, page, param) {
      var s = '#/' + encodeURIComponent(role || '') + '/' + encodeURIComponent(page || '');
      if (param) s += '/' + encodeURIComponent(param);
      return s;
    }
  };
})();
