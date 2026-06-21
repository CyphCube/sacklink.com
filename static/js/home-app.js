/* Sacklink — Homepage app */

(function () {
  'use strict';

  function fmt(n) {
    if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'B';
    if (n >= 1)    return '$' + n.toFixed(0) + 'M';
    return '<$1M';
  }

  function set(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function renderSummary(s) {
    set('s-best',  s.stable.best.toFixed(2) + '%');
    set('s-avg',   s.stable.avg.toFixed(2) + '%');
    set('s-tvl',   fmt(s.stable.tvl));
    set('s-count', s.stable.count);

    set('c-best',  s.crypto.best.toFixed(2) + '%');
    set('c-avg',   s.crypto.avg.toFixed(2) + '%');
    set('c-tvl',   fmt(s.crypto.tvl));
    set('c-count', s.crypto.count);

    set('r-best',  s.rwa.best.toFixed(2) + '%');
    set('r-avg',   s.rwa.avg.toFixed(2) + '%');
    set('r-tvl',   fmt(s.rwa.tvl));
    set('r-count', s.rwa.count);
  }

  function renderWallets() {
    const wallets = window.WALLETS || [];
    if (!wallets.length) return;
    const tokens  = new Set(wallets.flatMap(w => w.tokens || []));
    function parseMau(m) {
      if (!m) return 0;
      const n = parseFloat(m);
      if (/[Bb]/.test(m)) return n * 1e9;
      if (/[Mm]/.test(m)) return n * 1e6;
      if (/[Kk]/.test(m)) return n * 1e3;
      return n;
    }
    const top = wallets.reduce((a, b) => parseMau(a.mau) >= parseMau(b.mau) ? a : b);
    const oss = wallets.filter(w => w.openSource).length;
    set('w-count',  wallets.length);
    set('w-tokens', tokens.size);
    set('w-top',    top.name);
    set('w-oss',    oss + ' / ' + wallets.length);
  }

  async function init() {
    renderWallets();
    try {
      const summary = await window.fetchHomeSummary();
      renderSummary(summary);
    } catch(e) {
      console.error('Home data fetch failed:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
