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

      const PLATFORM_SVGS = {'iOS': '<img src="https://api.iconify.design/logos:apple-app-store.svg" width="16" height="16" alt="iOS" />', 'Android': '<img src="https://api.iconify.design/logos:google-play.svg" width="16" height="16" alt="Android" />', 'Extension': '<svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#4285F4"/><circle cx="12" cy="12" r="6" fill="white"/><circle cx="12" cy="12" r="3.5" fill="#4285F4"/><path d="M12 2a10 10 0 0 1 8.66 5H12a5 5 0 0 0-4.33 2.5L5.34 5.67A10 10 0 0 1 12 2z" fill="#EA4335"/><path d="M22 12a10 10 0 0 1-5 8.66l-3.5-6.06A5 5 0 0 0 17 12z" fill="#FBBC05"/><path d="M12 22a10 10 0 0 1-8.66-5L6.84 14A5 5 0 0 0 12 17z" fill="#34A853"/></svg>', 'Desktop': '<svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="#60A5FA"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H3V4h18v10z"/></svg>', 'Hardware': '<svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="#F0B90B"><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>'};
      const PLATFORM_ORDER = ['iOS', 'Android', 'Extension', 'Desktop', 'Hardware'];
      const platforms = [...(w.platforms || [])].sort((a, b) => PLATFORM_ORDER.indexOf(a) - PLATFORM_ORDER.indexOf(b)).map(p => {
        const svg = PLATFORM_SVGS[p] || '';
        return `<span class="platform-badge" title="${escHtml(p)}">${svg}</span>`;
      }).join('');

      const TOKEN_SLUGS = {'BTC': ['bitcoin', '#F7931A'], 'ETH': ['ethereum', '#627EEA'], 'SOL': ['solana', '#9945FF'], 'BNB': ['bsc', '#F0B90B'], 'SUI': ['sui', '#6FBCF0'], 'HYPE': ['hyperliquid-l1', '#00E5C0'], 'XRP': ['xrpl', '#346AA9'], 'XLM': ['stellar', '#7B7BEE']};
      const tokens = (w.tokens || []).map(t => {
        const info = TOKEN_SLUGS[t];
        if (info) {
          return `<img src="https://icons.llamao.fi/icons/chains/rsz_${info[0]}.jpg" width="18" height="18" title="${escHtml(t)}" style="border-radius:50%;display:inline-block;vertical-align:middle" onerror="this.outerHTML='<span style=\'display:inline-flex;width:18px;height:18px;border-radius:50%;background:${info[1]};align-items:center;justify-content:center;font-size:8px;color:#fff;font-weight:bold\'>${escHtml(t[0])}</span>'" />`;
        }
        return `<span style="font-size:10px;color:var(--text-secondary)">${escHtml(t)}</span>`;
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

  function injectButtonLogos() {
    document.querySelectorAll('[data-chain-logo]').forEach(span => {
      const chain = span.dataset.chainLogo;
      if (window.chainLogo) span.innerHTML = window.chainLogo(chain, 16);
    });
  }

  function init() {
    injectButtonLogos();
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
