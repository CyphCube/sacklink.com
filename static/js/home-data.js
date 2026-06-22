/* Sacklink — Homepage summary data (single DefiLlama fetch) */

(function () {
  'use strict';

  const STABLE_TOKENS = new Set(['USDC','USDT','DAI','FRAX','LUSD','BUSD','GUSD','USDP','TUSD','USDD','CRVUSD','PYUSD','USDM','EURC','USDS','SUSDE','USDE','USDY','GHO','FDUSD','EUSD','SUSDS','RLUSD']);
  const STABLE_CHAINS = new Set(['Ethereum','Arbitrum','Base','Optimism','Polygon','Avalanche','BSC','Solana']);

  const CRYPTO_TOKENS = new Set(['ETH','WETH','STETH','BTC','WBTC','BTCB','SOL','WSOL','SUI','HYPE']);
  const CRYPTO_CHAINS = new Set(['Ethereum','Arbitrum','Base','Optimism','Polygon','Avalanche','BSC','Solana','Sui','Hyperliquid','Hyperliquid L1']);

  const RWA_CATEGORIES = new Set(['RWA','Real World Assets','Treasury','Treasury Bills','Money Market Fund']);
  const RWA_PROJECTS   = new Set(['ondo-finance','maple','goldfinch','clearpool','superstate','backed-finance','openeden','matrixdock','spiko','hashnote','mountain-protocol','midas','dinari','swarm','flux-finance','etherfuse','franklin-templeton','blackrock-buidl','buidl','agora','m0','truefi','yieldnest','libre']);
  const RWA_EXCLUDED   = new Set(['USDC','USDT','DAI','ETH','WETH','BTC','WBTC','SOL','BNB']);

  const CACHE_KEY = 'sacklink_cache_home';
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

  function compute(json) {
    const all = json.data || [];
    const active = p => !p.status || p.status === 'active';

    const stablePools = all.filter(p =>
      active(p) && p.symbol && STABLE_CHAINS.has(p.chain) &&
      STABLE_TOKENS.has(p.symbol.toUpperCase()) &&
      (p.apy || 0) > 0 && (p.tvlUsd || 0) >= 1e6
    );
    const seen = new Map();
    stablePools.forEach(p => {
      const k = `${p.project}|${p.chain}|${p.symbol.toUpperCase()}`;
      if (!seen.has(k) || p.tvlUsd > seen.get(k).tvlUsd) seen.set(k, p);
    });

    const cryptoPools = all.filter(p =>
      active(p) && p.symbol && CRYPTO_CHAINS.has(p.chain) &&
      CRYPTO_TOKENS.has(p.symbol.toUpperCase()) &&
      (p.apy || 0) > 0 && (p.tvlUsd || 0) >= 1e6
    );

    const rwaPools = all.filter(p => {
      if (!active(p) || !p.symbol) return false;
      if ((p.apy || 0) <= 0 || (p.tvlUsd || 0) < 1e6) return false;
      if (RWA_EXCLUDED.has(p.symbol.toUpperCase())) return false;
      const cat = (p.category || '').trim();
      return RWA_CATEGORIES.has(cat) || RWA_PROJECTS.has(p.project);
    });
    const rwaDedup = new Map();
    rwaPools.forEach(p => {
      const k = `${p.project}|${p.chain}|${p.symbol.toUpperCase()}`;
      if (!rwaDedup.has(k) || p.tvlUsd > rwaDedup.get(k).tvlUsd) rwaDedup.set(k, p);
    });

    return {
      stable: summarise(Array.from(seen.values())),
      crypto: summarise(cryptoPools),
      rwa:    summarise(Array.from(rwaDedup.values())),
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
