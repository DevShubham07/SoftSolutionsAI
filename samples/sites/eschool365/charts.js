/* Redwood ERP — central ApexCharts wrapper.
   One factory applies the global theme so every chart is consistent.
   Palette is aligned to the live ERP indigo identity (not navy) so charts
   sit on-brand with the existing gradient dashboard tiles.            */
(function () {
  var PALETTE = ['#5B47E0', '#0E9488', '#E2495B', '#2563EB', '#D97706', '#8A7BB8'];
  var FONT = 'Inter,-apple-system,Segoe UI,sans-serif';

  function base(type) {
    return {
      chart: {
        type: type,
        fontFamily: FONT,
        foreColor: '#737A88',
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: { enabled: true, easing: 'easeinout', speed: 450 },
        parentHeightOffset: 0
      },
      colors: PALETTE,
      grid: {
        borderColor: '#EEF1F4',
        strokeDashArray: 0,
        xaxis: { lines: { show: false } },          // no vertical gridlines
        padding: { left: 8, right: 8, top: 0, bottom: 0 }
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: (type === 'line' || type === 'area') ? 2.5 : 0,
        lineCap: 'round'
      },
      fill: (type === 'area')
        ? { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.18, opacityTo: 0, stops: [0, 100] } }
        : { opacity: 1 },
      tooltip: {
        theme: 'light',
        style: { fontSize: '12px', fontFamily: FONT },
        marker: { show: true }
      },
      legend: {
        fontSize: '12px', fontWeight: 600, fontFamily: FONT,
        markers: { radius: 4, width: 9, height: 9 },
        itemMargin: { horizontal: 10, vertical: 4 }
      },
      plotOptions: {
        bar: { borderRadius: 4, columnWidth: '55%', borderRadiusApplication: 'end' },
        pie: { donut: { size: '68%', labels: { show: true, total: { show: true, fontSize: '13px', fontWeight: 600, color: '#737A88' } } } }
      },
      states: { hover: { filter: { type: 'darken', value: 0.92 } } },
      noData: { text: 'No data yet for this period', style: { color: '#9AA0AC', fontSize: '13px', fontFamily: FONT } }
    };
  }

  function deepMerge(a, b) {
    if (Array.isArray(b)) return b;
    if (typeof b !== 'object' || b === null) return b;
    var o = {};
    for (var k in a) o[k] = a[k];
    for (var j in b) o[j] = (j in a) ? deepMerge(a[j], b[j]) : b[j];
    return o;
  }

  window.RWCharts = {
    PALETTE: PALETTE,
    /* el: DOM node, type: 'bar'|'line'|'area'|'donut', series, opts: ApexCharts overrides */
    makeChart: function (el, type, series, opts) {
      if (!window.ApexCharts || !el) return null;
      var o = base(type);
      o.series = series;
      o = deepMerge(o, opts || {});
      var c = new window.ApexCharts(el, o);
      c.render();
      return c;
    }
  };
})();
