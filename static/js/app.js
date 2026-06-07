/* yield.fi — App Logic (live DefiLlama data) */

(function () {
  'use strict';

  /* ── State ── */
  let activeToken = 'all';
  let activeChain = 'all';
  let sortKey     = 'apy';
  let sortDir     = -1;
  let tickTimer   = null;

  /* ── Helpers ── */
  function fmtTVL(m) {
    if (m >= 1000) return '$' + (m / 1000).toFixed(2) + 'B';
    if (m >= 1)    return '$' + m.toFixed(2) + 'M';
    return '<$1M';
  }

  function fmtAPY(a) { return a.toFixed(2) + '%'; }

  function apyClass(a) {
    if (a >= 7) return 'high';
    if (a >= 5) return 'mid';
    return 'low';
  }

  function riskClass(r) {
    return r === 'Low' ? 'risk-low' : r === 'Med' ? 'risk-med' : 'risk-hi';
  }

  function riskBarColor(score) {
    if (score <= 39) return 'var(--green)';
    if (score <= 69) return 'var(--amber)';
    return 'var(--red)';
  }

  function escHtml(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  /* ── Filter / sort ── */
  function getFiltered() {
    return (window.MARKETS || []).filter(r => {
      if (activeToken !== 'all' && r.token !== activeToken) return false;
      if (activeChain !== 'all' && r.chain !== activeChain) return false;
      return true;
    });
  }

  function getSorted(rows) {
    return [...rows].sort((a, b) => {
      let diff = 0;
      if (sortKey === 'protocol') diff = a.protocol.localeCompare(b.protocol);
      if (sortKey === 'apy')  diff = b.apy - a.apy;
      if (sortKey === 'tvl')  diff = b.tvl - a.tvl;
      if (sortKey === '7d')   diff = b.trend - a.trend;
      if (sortKey === 'risk') diff = a.riskScore - b.riskScore;
      return diff * (sortDir < 0 ? 1 : -1);
    });
  }

  /* ── Metrics ── */
  function updateMetrics(rows) {
    if (!rows.length) {
      ['stat-avg-apy','stat-tvl','stat-best','stat-count'].forEach(id => {
        document.getElementById(id).textContent = '—';
      });
      return;
    }
    const avg  = rows.reduce((s, r) => s + r.apy, 0) / rows.length;
    const tvl  = rows.reduce((s, r) => s + r.tvl, 0);
    const best = rows.reduce((b, r) => r.apy > b.apy ? r : b, rows[0]);

    document.getElementById('stat-avg-apy').textContent = fmtAPY(avg);
    document.getElementById('stat-tvl').textContent     = fmtTVL(tvl);
    document.getElementById('stat-best').textContent    =
      fmtAPY(best.apy) + ' · ' + best.protocol;
    document.getElementById('stat-count').textContent   = rows.length;
  }

  /* ── Table ── */
  function renderTable() {
    const filtered = getFiltered();
    const sorted   = getSorted(filtered);

    updateMetrics(filtered);
    document.getElementById('count-note').textContent =
      filtered.length + ' market' + (filtered.length !== 1 ? 's' : '');

    const maxTVL = Math.max(...(window.MARKETS || []).map(r => r.tvl), 1);

    if (!sorted.length) {
      document.getElementById('tbody').innerHTML =
        '<tr><td colspan="7" class="loading-row">No markets match your filters.</td></tr>';
      return;
    }

    document.getElementById('tbody').innerHTML = sorted.map((r, i) => {
      const tvlPct  = Math.round((r.tvl / maxTVL) * 100);
      const rowAttr = r.url
        ? `class="market-row clickable" data-href="${escHtml(r.url)}"`
        : `class="market-row"`;

      /* Protocol logo: use <img> with inline SVG fallback on error */
      const fallbackLetter = escHtml(r.protocol[0].toUpperCase());
      const logoHtml = r.logoSvg
        ? `<span class="protocol-logo-svg">${r.logoSvg}</span>`
        : `<img
            class="protocol-logo"
            src="${escHtml(r.logoUrl)}"
            alt="${escHtml(r.protocol)}"
            width="28" height="28"
            loading="lazy"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
          /><span class="protocol-logo-fallback" style="display:none">${fallbackLetter}</span>`;

      return `<tr ${rowAttr}>
        <td>
          <div class="protocol-cell">
            <div class="protocol-logo-wrap">
              ${logoHtml}
            </div>
            <div>
              <div class="protocol-name">
                ${escHtml(r.protocol)}
                ${i === 0 ? '<span class="best-tag">top</span>' : ''}
              </div>
              <div class="protocol-sub">${escHtml(r.chain.toLowerCase())}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="chain-cell">
            ${window.chainLogo(r.chain, 20)}
            <span class="chain-name">${escHtml(r.chain)}</span>
          </div>
        </td>
        <td>
          <span class="token-pill ${r.token.toLowerCase()}">${r.token}</span>
        </td>
        <td>
          <span class="apy ${apyClass(r.apy)}">${fmtAPY(r.apy)}</span>
        </td>
        <td>
          <div class="tvl-cell">
            <span class="tvl-val">${fmtTVL(r.tvl)}</span>
            <div class="bar-wrap">
              <div class="bar-fill green" style="width:${tvlPct}%"></div>
            </div>
          </div>
        </td>
        <td>
          <span class="trend ${r.trend >= 0 ? 'up' : 'dn'}">
            ${r.trend >= 0 ? '+' : ''}${r.trend.toFixed(2)}%
          </span>
        </td>
        <td>
          <div class="risk-cell" title="Score: ${r.riskScore}/100 · TVL:${r.riskDetail.tvl} Volatility:${r.riskDetail.sigma} Age:${r.riskDetail.count} Drift:${r.riskDetail.drift} Confidence:${r.riskDetail.conf}">
            <div class="risk-row">
              <span class="risk-badge ${riskClass(r.risk)}">${r.risk}</span>
              <span class="risk-score">${r.riskScore}</span>
            </div>
            <div class="risk-bar-wrap">
              <div class="risk-bar-fill" style="width:${r.riskScore}%;background:${riskBarColor(r.riskScore)}"></div>
            </div>
          </div>
        </td>
      </tr>`;
    }).join('');
  }

  /* ── Loading / error states ── */
  function setLoading() {
    document.getElementById('tbody').innerHTML =
      '<tr><td colspan="7" class="loading-row">Fetching live rates from DefiLlama…</td></tr>';
    ['stat-avg-apy','stat-tvl','stat-best','stat-count'].forEach(id => {
      document.getElementById(id).textContent = '…';
    });
  }

  /* ── Refresh from API ── */
  async function refreshData() {
    try {
      await window.fetchMarkets();
      renderTable();
    } catch (err) {
      console.error('DefiLlama fetch failed:', err);
      if (!window.MARKETS || !window.MARKETS.length) {
        document.getElementById('tbody').innerHTML =
          '<tr><td colspan="7" class="loading-row" style="color:var(--red)">⚠ Could not load live data.</td></tr>';
      } else {
        renderTable();
      }
    }
  }

  /* ── Sort header arrows ── */
  function updateSortHeaders() {
    document.querySelectorAll('thead th.sortable').forEach(th => {
      const key   = th.dataset.sort;
      const arrow = th.querySelector('.sort-arrow');
      th.classList.toggle('sorted', key === sortKey);
      if (arrow) {
        arrow.textContent = key === sortKey ? (sortDir < 0 ? '↓' : '↑') : '';
      }
    });
  }

  /* ── Auto-refresh every 60 seconds ── */
  function startAutoRefresh() {
    if (tickTimer) clearInterval(tickTimer);
    tickTimer = setInterval(refreshData, 60_000);
  }

  /* ── Event listeners ── */
  function bindFilters() {
    document.querySelectorAll('[data-token]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeToken = btn.dataset.token;
        document.querySelectorAll('[data-token]').forEach(b =>
          b.classList.toggle('active', b === btn));
        renderTable();
      });
    });

    document.querySelectorAll('[data-chain]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeChain = btn.dataset.chain;
        document.querySelectorAll('[data-chain]').forEach(b =>
          b.classList.toggle('active', b === btn));
        renderTable();
      });
    });

    document.getElementById('sort-select').addEventListener('change', e => {
      sortKey = e.target.value;
      sortDir = -1;
      updateSortHeaders();
      renderTable();
    });

    document.querySelectorAll('thead th.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const key = th.dataset.sort;
        if (sortKey === key) {
          sortDir *= -1;
        } else {
          sortKey = key;
          sortDir = -1;
          const sel = document.getElementById('sort-select');
          const opt = sel && sel.querySelector(`option[value="${key}"]`);
          if (opt) sel.value = key;
        }
        updateSortHeaders();
        renderTable();
      });
    });
  }

  /* ── Inject chain logos into filter buttons ── */
  function injectButtonLogos() {
    document.querySelectorAll('[data-chain-logo]').forEach(span => {
      const chain = span.dataset.chainLogo;
      span.innerHTML = window.chainLogo(chain, 16);
    });
  }

  /* ── Row click → navigate to protocol ── */
  function bindRowClicks() {
    document.getElementById('tbody').addEventListener('click', e => {
      const row = e.target.closest('tr.clickable');
      if (!row) return;
      const href = row.dataset.href;
      if (href) window.open(href, '_blank', 'noopener,noreferrer');
    });
  }

  /* ── Init ── */
  async function init() {
    injectButtonLogos();
    bindFilters();
    bindRowClicks();
    updateSortHeaders();
    setLoading();
    await refreshData();
    startAutoRefresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
