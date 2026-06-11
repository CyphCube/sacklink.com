/* Sacklink — Wallets Page App Logic */
(function () {
  'use strict';

  let activePlatform = 'all';
  let activeCrypto   = 'all';
  let sortKey        = 'name';
  let sortDir        = 1;

  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function truncate(s, n) {
    n = n || 16;
    return s.length > n ? s.slice(0, n) + '…' : s;
  }

  function getFiltered() {
    return (window.WALLETS || []).filter(w => {
      if (activePlatform !== 'all' && !w.platforms.includes(activePlatform)) return false;
      if (activeCrypto   !== 'all' && !w.tokens.includes(activeCrypto))     return false;
      return true;
    });
  }

  function parseMau(mau) {
    if (!mau) return 0;
    const n = parseFloat(mau.replace(/[^0-9.]/g, ''));
    if (mau.includes('B')) return n * 1e9;
    if (mau.includes('M')) return n * 1e6;
    if (mau.includes('K')) return n * 1e3;
    return n;
  }

  function getSorted(rows) {
    return [...rows].sort((a, b) => {
      let diff = 0;
      if (sortKey === 'name') diff = a.name.localeCompare(b.name);
      if (sortKey === 'mau')  diff = parseMau(b.mau) - parseMau(a.mau);
      return diff * sortDir;
    });
  }

  const PLATFORM_ICONS = {
    iOS: '🍎', Android: '🤖', Extension: '🧩', Desktop: '💻', Hardware: '🔑',
  };

  const TOKEN_COLORS = {
    BTC:  { bg: '#2a1800', fg: '#f7931a' },
    ETH:  { bg: '#1e1e3a', fg: '#8c7df7' },
    SOL:  { bg: '#1a0a30', fg: '#b87eff' },
    BNB:  { bg: '#1a1500', fg: '#F0B90B' },
    SUI:  { bg: '#001a2e', fg: '#6FBCF0' },
    HYPE: { bg: '#1a0a1a', fg: '#ff6bff' },
    BTC:  { bg: '#2a1800', fg: '#f7931a' },
  };

  function renderTable() {
    const filtered = getFiltered();
    const sorted   = getSorted(filtered);

    document.getElementById('count-note').textContent =
      filtered.length + ' wallet' + (filtered.length !== 1 ? 's' : '');

    if (!sorted.length) {
      document.getElementById('tbody').innerHTML =
        '<tr><td colspan="5" class="loading-row">No wallets match your filters.</td></tr>';
      return;
    }

    document.getElementById('tbody').innerHTML = sorted.map(w => {
      const rowAttr = w.url
        ? `class="market-row clickable" data-href="${escHtml(w.url)}"`
        : `class="market-row"`;

      const logoHtml = w.logo
        ? `<img class="protocol-logo" src="${escHtml(w.logo)}" alt="${escHtml(w.name)}" width="28" height="28" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><span class="protocol-logo-fallback" style="display:none">${escHtml(w.name[0])}</span>`
        : `<span class="protocol-logo-fallback" style="display:flex">${escHtml(w.name[0])}</span>`;

      const platforms = (w.platforms || []).map(p =>
        `<span class="platform-badge">${PLATFORM_ICONS[p] || ''} ${escHtml(p)}</span>`
      ).join('');

      const tokens = (w.tokens || []).map(t => {
        const col = TOKEN_COLORS[t] || { bg: '#1a1a1a', fg: '#aaa' };
        return `<span class="wallet-token-pill" style="background:${col.bg};color:${col.fg}">${escHtml(t)}</span>`;
      }).join('');

      const osBadge = w.openSource
        ? '<span class="os-badge os-yes">Yes</span>'
        : '<span class="os-badge os-no">No</span>';

      return `<tr ${rowAttr}>
        <td>
          <div class="protocol-cell">
            <div class="protocol-logo-wrap">${logoHtml}</div>
            <div class="protocol-name">${escHtml(truncate(w.name))}</div>
          </div>
        </td>
        <td><div class="platform-badges">${platforms}</div></td>
        <td><div class="token-pills-wrap">${tokens}</div></td>
        <td><span class="mau-val">${escHtml(w.mau || '—')}</span></td>
        <td>${osBadge}</td>
      </tr>`;
    }).join('');
  }

  function updateSortHeaders() {
    document.querySelectorAll('thead th.sortable').forEach(th => {
      const key   = th.dataset.sort;
      const arrow = th.querySelector('.sort-arrow');
      th.classList.toggle('sorted', key === sortKey);
      if (arrow) arrow.textContent = key === sortKey ? (sortDir > 0 ? '↓' : '↑') : '';
    });
  }

  function bindFilters() {
    document.querySelectorAll('[data-platform]').forEach(btn => {
      btn.addEventListener('click', () => {
        activePlatform = btn.dataset.platform;
        document.querySelectorAll('[data-platform]').forEach(b =>
          b.classList.toggle('active', b === btn));
        renderTable();
      });
    });

    document.querySelectorAll('[data-crypto]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCrypto = btn.dataset.crypto;
        document.querySelectorAll('[data-crypto]').forEach(b =>
          b.classList.toggle('active', b === btn));
        renderTable();
      });
    });

    document.querySelectorAll('thead th.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const key = th.dataset.sort;
        if (sortKey === key) { sortDir *= -1; }
        else { sortKey = key; sortDir = 1; }
        updateSortHeaders();
        renderTable();
      });
    });
  }

  function bindRowClicks() {
    document.getElementById('tbody').addEventListener('click', e => {
      const row = e.target.closest('tr.clickable');
      if (!row) return;
      if (row.dataset.href) window.open(row.dataset.href, '_blank', 'noopener,noreferrer');
    });
  }

  function init() {
    bindFilters();
    bindRowClicks();
    updateSortHeaders();
    renderTable();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
