/* Sacklink — Homepage summary data (single DefiLlama fetch) */

(function () {
  'use strict';

  /* ── Filters MUST stay in sync with the page data files ──
     stablecoins → data.js · cryptocurrencies → crypto-data.js · rwa → rwa-data.js
     so the homepage summary matches each page exactly. */

  /* Stablecoins (data.js): USDC/USDT only */
  const STABLE_CHAINS    = new Set(['Ethereum','Arbitrum','Base','Polygon','Avalanche','Solana','BSC','Sui']);
  const STABLE_EXCLUDED  = new Set([
    'euler-v2|Avalanche|USDC',
    'credix|Ethereum|USDC','credix|Ethereum|USDT','credix|Arbitrum|USDC','credix|Arbitrum|USDT',
    'credix|Polygon|USDC','credix|Polygon|USDT','credix|Solana|USDC','credix|Solana|USDT',
    'credix|Base|USDC','credix|Base|USDT','credix|BSC|USDC','credix|BSC|USDT',
    'credix|Sui|USDC','credix|Sui|USDT',
    'allbridge-classic|Ethereum|USDC','allbridge-classic|Ethereum|USDT',
    'allbridge-classic|Arbitrum|USDC','allbridge-classic|Arbitrum|USDT',
    'allbridge-classic|Polygon|USDC','allbridge-classic|Polygon|USDT',
    'allbridge-classic|Solana|USDC','allbridge-classic|Solana|USDT',
    'allbridge-classic|Base|USDC','allbridge-classic|Base|USDT',
    'allbridge-classic|BSC|USDC','allbridge-classic|BSC|USDT',
    'allbridge-classic|Sui|USDC','allbridge-classic|Sui|USDT',
  ]);

  /* Cryptocurrencies (crypto-data.js) */
  const CRYPTO_TOKENS = new Set(['ETH','WETH','STETH','BTC','WBTC','BTCB','SOL','WSOL','SUI','HYPE']);
  const CRYPTO_CHAINS = new Set(['Ethereum','Arbitrum','Base','Polygon','Avalanche','Solana','BSC','Sui','Hyperliquid','Hyperliquid L1']);

  /* RWA (rwa-data.js) */
  const RWA_CHAINS     = new Set(['Ethereum','Solana','BSC','Aptos','Stellar','Avalanche','XRPL','Sui','Base']);
  const RWA_CATEGORIES = new Set(['RWA','Real World Assets','Tokenized Treasury','Tokenized Stocks','Tokenized Commodities','Undercollateralized Lending','Institutional']);
  const RWA_PROJECTS   = new Set(['ondo-finance','ondo','maple','maple-finance','centrifuge','goldfinch','truefi','credix','clearpool','superstate','backed-finance','openeden','matrixdock','spiko','hashnote','steakhouse','bprotocol','janus-henderson','franklin-templeton','blackrock-buidl','buidl','mountain-protocol','m0','agora','midas','dinari','swarm','tangible','parcl','realtoken','lofty','landshare','houseloan','yieldnest','securitize','tokeny','libre','etherfuse','popcorn','flux-finance']);
  const RWA_EXCLUDED   = new Set(['USDC','USDT','YNETHX','YNLSDE','YNETH']);

  const CACHE_KEY = 'sacklink_cache_home_v2';
  const CACHE_TTL = 5 * 60 * 1000;

  function loadCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const { ts, data } = JSON.parse(raw);
      return { data, fresh: Date.now() - ts <= CACHE_TTL };
    } catch(e) { return null; }
  }

  function saveCache(data) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch(e) {}
  }

  function summarise(pools) {
    if (!pools.length) return { best: 0, avg: 0, tvl: 0, count: 0 };
    const best = Math.max(...pools.map(p => p.apy || 0));
    const avg  = pools.reduce((s, p) => s + (p.apy || 0), 0) / pools.length;
    const tvl  = pools.reduce((s, p) => s + (p.tvlUsd || 0), 0) / 1e6;
    return { best, avg, tvl, count: pools.length };
  }

  function dedup(pools) {
    const seen = new Map();
    pools.forEach(p => {
      const k = `${p.project}|${p.chain}|${p.symbol.toUpperCase()}`;
      if (!seen.has(k) || p.tvlUsd > seen.get(k).tvlUsd) seen.set(k, p);
    });
    return Array.from(seen.values());
  }

  function compute(json) {
    const all = json.data || [];
    const active = p => !p.status || p.status === 'active';

    /* Stablecoins — mirrors data.js (USDC/USDT only, exclusions, dedup) */
    const stablePools = all.filter(p => {
      if (!active(p) || !p.symbol) return false;
      if (!STABLE_CHAINS.has(p.chain)) return false;
      const sym = p.symbol.toUpperCase();
      if (sym !== 'USDC' && sym !== 'USDT') return false;
      if ((p.apy || 0) <= 0 || (p.tvlUsd || 0) < 1e6) return false;
      if (p.project === 'centrifuge-protocol') return false;
      const tok = sym.includes('USDC') ? 'USDC' : 'USDT';
      if (STABLE_EXCLUDED.has(`${p.project}|${p.chain}|${tok}`)) return false;
      return true;
    });

    /* Cryptocurrencies — mirrors crypto-data.js (no dedup) */
    const cryptoPools = all.filter(p =>
      active(p) && p.symbol && CRYPTO_CHAINS.has(p.chain) &&
      CRYPTO_TOKENS.has(p.symbol.toUpperCase()) &&
      (p.apy || 0) > 0 && (p.tvlUsd || 0) >= 1e6
    );

    /* RWA — mirrors rwa-data.js (chain filter, category/project match, dedup) */
    const rwaPools = all.filter(p => {
      if (!active(p) || !p.symbol) return false;
      if (!RWA_CHAINS.has(p.chain)) return false;
      if ((p.apy || 0) <= 0 || (p.tvlUsd || 0) < 1e6) return false;
      if (RWA_EXCLUDED.has(p.symbol.toUpperCase())) return false;
      const cat = (p.category || '').trim();
      return RWA_CATEGORIES.has(cat) || RWA_PROJECTS.has(p.project);
    });

    return {
      stable: summarise(dedup(stablePools)),
      crypto: summarise(cryptoPools),
      rwa:    summarise(dedup(rwaPools)),
    };
  }

  /* Returns { data, fresh } from cache (any age), or null if never cached. Synchronous. */
  window.getHomeSummaryCached = loadCache;

  /* Fetches live data, updates cache, resolves with fresh summary. */
  window.fetchHomeSummaryFresh = async function () {
    const res = await fetch('https://yields.llama.fi/pools');
    if (!res.ok) throw new Error('DefiLlama API error');
    const json = await res.json();
    const summary = compute(json);
    saveCache(summary);
    return summary;
  };
})();
